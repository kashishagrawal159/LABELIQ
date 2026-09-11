"""
MetrologyAI Backend — FastAPI app.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload

Then open http://127.0.0.1:8000/docs for interactive API testing (Swagger UI) —
your frontend teammate can use this to see exactly what to call.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional, Optional
import datetime

from pydantic import BaseModel

from database import init_db, get_db, ScanRecord, Product
from schemas import ScanResult, ExtractedData, ScanSummary, StatsResponse, ProductSummary, ProductHistory
from perception import extract_package_data, fetch_image_from_product_url
from rule_engine import run_all_checks
from notice_generator import generate_notice_pdf


class ProductUrlRequest(BaseModel):
    url: str

app = FastAPI(title="MetrologyAI Backend", version="0.1.0")

# Allow the React/Streamlit frontend (running on a different port) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your actual frontend URL before final demo
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"status": "MetrologyAI backend is running"}


@app.post("/api/scan", response_model=ScanResult)
async def scan_product(
    file1: UploadFile = File(..., description="Photo 1 (e.g. front panel) — required"),
    file2: Optional[UploadFile] = File(None, description="Photo 2 (e.g. back panel) — optional"),
    file3: Optional[UploadFile] = File(None, description="Photo 3 (e.g. close-up) — optional"),
    db: Session = Depends(get_db),
):
    """
    Main endpoint: upload 1-3 photos of the SAME product (e.g. front panel,
    back panel, close-up of small print) -> get one combined compliance
    verdict. Multiple photos let the model find fields that aren't visible
    in a single shot (e.g. MRP on front, FSSAI number on back).
    """
    files = [f for f in (file1, file2, file3) if f is not None]

    images_bytes = []
    for f in files:
        content = await f.read()
        if content:
            images_bytes.append(content)

    if not images_bytes:
        raise HTTPException(status_code=400, detail="No valid image files uploaded.")

    return _process_scan(images_bytes, db)


@app.post("/api/scan-url", response_model=ScanResult)
async def scan_product_from_url(payload: ProductUrlRequest, db: Session = Depends(get_db)):
    """
    E-commerce URL support: pass a product page URL (Amazon/Flipkart/Meesho/etc.),
    we pull the product image from the page's og:image tag and run it through
    the SAME pipeline as a normal photo scan.

    Scope note: this uses a lightweight HTML fetch (no JS rendering), so it
    works on most product pages but isn't a guaranteed universal scraper —
    some sites with heavy bot-protection may not return an image. If that
    happens, ask the user to upload a screenshot via /api/scan instead.
    """
    image_bytes = fetch_image_from_product_url(payload.url)
    if not image_bytes:
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not extract a product image from this URL. The site may "
                "block automated requests, or has no og:image tag. Try uploading "
                "a screenshot of the product page via /api/scan instead."
            ),
        )
    return _process_scan([image_bytes], db)


@app.post("/api/scan-pdf", response_model=ScanResult)
async def scan_product_pdf(file: UploadFile = File(..., description="Packaging artwork or specification PDF"), db: Session = Depends(get_db)):
    """
    PDF support: upload packaging artwork or technical specification PDF.
    Extracts text and runs through the same Legal Metrology verification pipeline.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty PDF file uploaded.")
    from perception import extract_pdf_data
    extracted = extract_pdf_data(content)
    return _process_extracted_data(extracted, db)


def _process_scan(images_bytes: list, db: Session) -> dict:
    """Shared pipeline for file-upload and URL-based scans."""
    extracted = extract_package_data(images_bytes)
    return _process_extracted_data(extracted, db)


def _process_extracted_data(extracted: dict, db: Session) -> dict:
    verdict = run_all_checks(extracted)
    product = _find_or_create_product(db, extracted)

    record = ScanRecord(
        product_id=product.id if product else None,
        product_name=extracted.get("product_name"),
        product=extracted.get("product") or extracted.get("product_name"),
        brand=extracted.get("brand"),
        manufacturer=extracted.get("manufacturer"),
        importer=extracted.get("importer"),
        product_category=extracted.get("product_category"),
        mrp=extracted.get("mrp"),
        net_quantity=extracted.get("net_quantity"),
        net_quantity_unit=extracted.get("net_quantity_unit"),
        declared_usp=extracted.get("declared_usp"),
        expiry_date=extracted.get("expiry_date"),
        mfg_date=extracted.get("mfg_date"),
        manufacturing_date=extracted.get("manufacturing_date") or extracted.get("mfg_date"),
        consumer_care=extracted.get("consumer_care"),
        fssai_license=extracted.get("fssai_license"),
        font_height_mm=extracted.get("font_height_mm"),
        pdp_area_cm2=extracted.get("pdp_area_cm2"),
        country_of_origin=extracted.get("country_of_origin"),
        confidence=extracted.get("confidence") or {},
        evidence=extracted.get("evidence") or {},
        date_validation=verdict.get("date_validation") or {},
        is_expired=verdict["is_expired"],
        usp_math_ok=verdict["usp_math_ok"],
        font_height_ok=verdict["font_height_ok"],
        fssai_valid=verdict["fssai_valid"],
        is_imported=verdict.get("is_imported"),
        overall_compliant=verdict["overall_compliant"],
        compliance_score=verdict.get("compliance_score"),
        risk_priority=verdict.get("risk_priority"),
        violations=verdict["violations"],
        verdict_label=verdict["verdict_label"],
        headline=verdict["headline"],
        checks=verdict["checks"],
        photo_quality_warning=verdict.get("photo_quality_warning"),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    previous_scans = _get_previous_scans(db, record)

    return _record_to_result(record, previous_scans=previous_scans)


def _find_or_create_product(db: Session, extracted: dict) -> Optional[Product]:
    """This is the 'history by ID' feature: groups every scan of the SAME
    product under one stable Product row, so re-scanning an item never
    creates a disconnected new identity — it just adds another entry to
    that product's history (see /api/products/{id}).

    Matched by exact product_name (case-insensitive). If no usable name was
    extracted (null, or an EXTRACTION_ERROR marker), the scan is left
    unlinked (product_id stays null on the ScanRecord) — grouping unreliable
    data under a product identity would be worse than not grouping it."""
    name = extracted.get("product_name")
    if not name or name.startswith("EXTRACTION_ERROR"):
        return None

    product = db.query(Product).filter(Product.product_name.ilike(name)).first()
    now = datetime.datetime.utcnow()

    if product:
        product.last_scanned_at = now
        product.scan_count = (product.scan_count or 0) + 1
        # Category can be filled in / corrected by a clearer later photo.
        if extracted.get("product_category"):
            product.product_category = extracted.get("product_category")
    else:
        product = Product(
            product_name=name,
            product_category=extracted.get("product_category"),
            first_scanned_at=now,
            last_scanned_at=now,
            scan_count=1,
        )
        db.add(product)

    db.flush()  # assigns product.id without committing the whole transaction yet
    return product


def _get_previous_scans(db: Session, record: ScanRecord, limit: int = 5) -> list:
    """Product history: every earlier scan of the SAME product (grouped by
    the stable product_id, not a name re-match), newest first, so the
    officer/user sees the trend right on the fresh scan response."""
    if not record.product_id:
        return []
    matches = (
        db.query(ScanRecord)
        .filter(ScanRecord.product_id == record.product_id)
        .filter(ScanRecord.id != record.id)
        .order_by(ScanRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return matches


@app.get("/api/scans", response_model=List[ScanResult])
def list_scans(db: Session = Depends(get_db)):
    """For the dashboard — list all past scans, newest first."""
    records = db.query(ScanRecord).order_by(ScanRecord.id.desc()).all()
    return [_record_to_result(r) for r in records]


@app.get("/api/scans/search", response_model=List[ScanSummary])
def search_scans_by_product(product_name: str, db: Session = Depends(get_db)):
    """Product history/search — look up past scans by product name (partial,
    case-insensitive match) without needing to re-scan. Useful for an officer
    checking 'has this product been scanned before, and what did it show?'"""
    records = (
        db.query(ScanRecord)
        .filter(ScanRecord.product_name.ilike(f"%{product_name}%"))
        .order_by(ScanRecord.created_at.desc())
        .all()
    )
    return [_to_scan_summary(r) for r in records]


@app.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Simple dashboard stats — computed on the fly from existing scan data,
    no new storage needed. total scans, compliant/non-compliant/insufficient-
    data counts, total violations found, risk breakdown, average score."""
    records = db.query(ScanRecord).all()

    total_scans = len(records)
    compliant_count = sum(1 for r in records if r.verdict_label == "COMPLIANT")
    non_compliant_count = sum(1 for r in records if r.verdict_label == "NON-COMPLIANT")
    insufficient_data_count = sum(1 for r in records if r.verdict_label == "INSUFFICIENT DATA")
    total_violations_found = sum(len(r.violations or []) for r in records)

    risk_breakdown = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for r in records:
        if r.risk_priority in risk_breakdown:
            risk_breakdown[r.risk_priority] += 1

    scored = [r.compliance_score for r in records if r.compliance_score is not None]
    average_compliance_score = round(sum(scored) / len(scored), 1) if scored else None

    return {
        "total_scans": total_scans,
        "compliant_count": compliant_count,
        "non_compliant_count": non_compliant_count,
        "insufficient_data_count": insufficient_data_count,
        "total_violations_found": total_violations_found,
        "risk_breakdown": risk_breakdown,
        "average_compliance_score": average_compliance_score,
    }


@app.get("/api/products", response_model=List[ProductSummary])
def list_products(db: Session = Depends(get_db)):
    """Every distinct product scanned so far, most-recently-active first.
    Each has a stable id — re-scanning the same item never creates a new
    one, it just adds to that product's scan_count/history. Use
    GET /api/products/{id} to pull the full scan history for one of these."""
    products = db.query(Product).order_by(Product.last_scanned_at.desc()).all()
    result = []
    for p in products:
        latest_scan = (
            db.query(ScanRecord)
            .filter(ScanRecord.product_id == p.id)
            .order_by(ScanRecord.created_at.desc())
            .first()
        )
        result.append({
            "id": p.id,
            "product_name": p.product_name,
            "product_category": p.product_category,
            "first_scanned_at": p.first_scanned_at.isoformat() if p.first_scanned_at else None,
            "last_scanned_at": p.last_scanned_at.isoformat() if p.last_scanned_at else None,
            "scan_count": p.scan_count or 0,
            "latest_verdict_label": latest_scan.verdict_label if latest_scan else None,
            "latest_compliance_score": latest_scan.compliance_score if latest_scan else None,
            "latest_risk_priority": latest_scan.risk_priority if latest_scan else None,
        })
    return result


@app.get("/api/products/{product_id}", response_model=ProductHistory)
def get_product_history(product_id: int, db: Session = Depends(get_db)):
    """The 'history per item' view the dashboard needs: every scan ever
    done of THIS product, newest first, under its one stable id. Use
    GET /api/scans/{scan_id} on any entry here to pull that scan's full
    detail (all checks, corrections, etc.)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    scans = (
        db.query(ScanRecord)
        .filter(ScanRecord.product_id == product_id)
        .order_by(ScanRecord.created_at.desc())
        .all()
    )
    return {
        "id": product.id,
        "product_name": product.product_name,
        "product_category": product.product_category,
        "first_scanned_at": product.first_scanned_at.isoformat() if product.first_scanned_at else None,
        "last_scanned_at": product.last_scanned_at.isoformat() if product.last_scanned_at else None,
        "scan_count": product.scan_count or 0,
        "scans": [_to_scan_summary(r) for r in scans],
    }


@app.get("/api/scans/{scan_id}", response_model=ScanResult)
def get_scan(scan_id: int, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return _record_to_result(record)


@app.get("/api/notice/{scan_id}")
def download_notice(scan_id: int, db: Session = Depends(get_db)):
    """1-click Section 25 legal notice PDF download."""
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found.")

    scan_dict = {
        "id": record.id,
        "product_name": record.product_name,
        "violations": record.violations or [],
    }
    pdf_bytes = generate_notice_pdf(scan_dict)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=notice_scan_{scan_id}.pdf"},
    )


def _record_to_result(record: ScanRecord, previous_scans: Optional[list] = None) -> dict:
    """Maps a DB row to the ScanResult response shape.
    previous_scans: optional list of ScanRecord rows (same product, earlier
    scans) — only populated right after a fresh /api/scan or /api/scan-url
    call; /api/scans and /api/scans/{id} leave it empty to avoid an extra
    query per row when listing."""
    return {
        "id": record.id,
        "extracted": ExtractedData(
            product_name=record.product_name,
            product_category=record.product_category,
            mrp=record.mrp,
            net_quantity=record.net_quantity,
            net_quantity_unit=record.net_quantity_unit,
            declared_usp=record.declared_usp,
            expiry_date=record.expiry_date,
            mfg_date=record.mfg_date,
            fssai_license=record.fssai_license,
            font_height_mm=record.font_height_mm,
            pdp_area_cm2=record.pdp_area_cm2,
            country_of_origin=record.country_of_origin,
        ),
        "is_expired": record.is_expired,
        "usp_math_ok": record.usp_math_ok,
        "font_height_ok": record.font_height_ok,
        "fssai_valid": record.fssai_valid,
        "is_imported": record.is_imported,
        "overall_compliant": record.overall_compliant,
        "compliance_score": record.compliance_score,
        "risk_priority": record.risk_priority,
        "violations": record.violations or [],
        "verdict_label": record.verdict_label or "INSUFFICIENT DATA",
        "headline": record.headline or "",
        "photo_quality_warning": record.photo_quality_warning,
        "checks": record.checks or [],
        "previous_scans": [_to_scan_summary(r) for r in (previous_scans or [])],
        "product_id": record.product_id,
        # 10 Canonical Fields & Structure
        "product": record.product or record.product_name,
        "brand": record.brand or "Demo Brand",
        "manufacturer": record.manufacturer or "Not detected",
        "importer": record.importer or ("Domestic (Not Applicable)" if not record.is_imported else "Not detected"),
        "net_quantity": f"{record.net_quantity} {record.net_quantity_unit}" if record.net_quantity else "Not detected",
        "mrp": f"₹{record.mrp}" if record.mrp else "Not detected",
        "country_of_origin": record.country_of_origin or "India",
        "manufacturing_date": record.manufacturing_date or record.mfg_date or "Not detected",
        "expiry_date": record.expiry_date or "Not detected",
        "consumer_care": record.consumer_care or "Not detected",
        "confidence": record.confidence or {},
        "evidence": record.evidence or {},
        "date_validation": record.date_validation or {},
        "risk_level": record.risk_priority or "LOW",
    }


def _to_scan_summary(record: ScanRecord) -> dict:
    """Maps a DB row to the lightweight ScanSummary shape used in
    previous_scans and /api/scans/search."""
    return {
        "id": record.id,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "product_name": record.product_name,
        "verdict_label": record.verdict_label or "INSUFFICIENT DATA",
        "compliance_score": record.compliance_score,
        "risk_priority": record.risk_priority,
    }
