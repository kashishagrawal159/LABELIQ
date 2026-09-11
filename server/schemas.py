"""
Pydantic schemas — define the JSON shape flowing between
frontend <-> backend <-> perception (CV/OCR) module.
"""
from pydantic import BaseModel
from typing import Optional, List


class ExtractedData(BaseModel):
    """This is the CONTRACT with the CV/OCR teammates.
    Whatever their pipeline produces must be mappable to this shape.
    Right now perception.py fakes this with a stub — swap it later
    with their real output, structure stays the same."""
    product_name: Optional[str] = None
    product: Optional[str] = None
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    importer: Optional[str] = None
    product_category: Optional[str] = None  # "food" | "medicine" | "cosmetic" | "general"
    mrp: Optional[float] = None
    net_quantity: Optional[float] = None
    net_quantity_unit: Optional[str] = None
    declared_usp: Optional[float] = None
    expiry_date: Optional[str] = None      # format: YYYY-MM-DD
    mfg_date: Optional[str] = None         # format: YYYY-MM-DD
    manufacturing_date: Optional[str] = None
    consumer_care: Optional[str] = None
    fssai_license: Optional[str] = None    # 14-digit string
    font_height_mm: Optional[float] = None
    pdp_area_cm2: Optional[float] = None
    country_of_origin: Optional[str] = None  # raw text as read off the label, e.g. "India", "China" — null if not stated


class CheckItem(BaseModel):
    name: str
    status: str  # "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE"
    detail: str
    rule_citation: Optional[str] = None  # e.g. "Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 7"
    source: Optional[str] = None  # e.g. "Department of Consumer Affairs, Government of India" — shown next to rule_citation on the dashboard
    correction: Optional[str] = None  # set only when status == "FAIL" — what to fix, e.g. "Increase font height to at least 3.0mm"


class ScanSummary(BaseModel):
    """Lightweight shape used for product history — NOT the full scan
    detail (no need to ship every check/extracted field again for a list
    of past scans of the same product)."""
    id: int
    created_at: Optional[str] = None
    product_name: Optional[str] = None
    verdict_label: str = "INSUFFICIENT DATA"
    compliance_score: Optional[float] = None
    risk_priority: Optional[str] = None

    class Config:
        from_attributes = True


class ScanResult(BaseModel):
    id: int
    extracted: ExtractedData
    is_expired: Optional[bool]
    usp_math_ok: Optional[bool]
    font_height_ok: Optional[bool]
    fssai_valid: Optional[bool]
    is_imported: Optional[bool] = None                # True=imported, False=domestic (India), None=couldn't tell from photo
    overall_compliant: Optional[bool]
    compliance_score: Optional[float] = None      # 0-100, % of applicable checks that passed
    risk_priority: Optional[str] = None            # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | None (compliant/insufficient data)
    violations: List[str] = []
    verdict_label: str = "INSUFFICIENT DATA"   # "COMPLIANT" | "NON-COMPLIANT" | "INSUFFICIENT DATA"
    headline: str = ""                          # human-readable one-liner for the dashboard
    checks: List[CheckItem] = []                # per-check breakdown, PASS/FAIL/UNKNOWN
    photo_quality_warning: Optional[str] = None  # set when too many key fields couldn't be read
    previous_scans: List[ScanSummary] = []       # past scans of the SAME product (matched by product_name), newest first
    product_id: Optional[int] = None             # stable ID for this product's identity — see /api/products/{product_id} for full history

    # 10 Canonical Fields & Structure
    product: Optional[str] = None
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    importer: Optional[str] = None
    net_quantity: Optional[str] = None
    mrp: Optional[str] = None
    country_of_origin: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    consumer_care: Optional[str] = None
    confidence: dict = {}
    evidence: dict = {}
    detections: list = []
    warnings: list = []
    rule_results: list = []
    risk_level: Optional[str] = None
    date_validation: dict = {}

    class Config:
        from_attributes = True


class ProductSummary(BaseModel):
    """One row per distinct PRODUCT (not scan) — used for the /api/products
    list. The id here is permanent: re-scanning the same item again never
    creates a new product_id, it just adds to this product's history."""
    id: int
    product_name: str
    product_category: Optional[str] = None
    first_scanned_at: Optional[str] = None
    last_scanned_at: Optional[str] = None
    scan_count: int
    latest_verdict_label: Optional[str] = None
    latest_compliance_score: Optional[float] = None
    latest_risk_priority: Optional[str] = None

    class Config:
        from_attributes = True


class ProductHistory(BaseModel):
    """Full scan history for ONE product ID — GET /api/products/{product_id}.
    'scans' is every past scan of this exact product, newest first."""
    id: int
    product_name: str
    product_category: Optional[str] = None
    first_scanned_at: Optional[str] = None
    last_scanned_at: Optional[str] = None
    scan_count: int
    scans: List[ScanSummary] = []


class StatsResponse(BaseModel):
    """Dashboard summary stats — computed from existing scan data, no new storage needed."""
    total_scans: int
    compliant_count: int
    non_compliant_count: int
    insufficient_data_count: int
    total_violations_found: int                 # sum of len(violations) across all scans
    risk_breakdown: dict                          # {"CRITICAL": n, "HIGH": n, "MEDIUM": n, "LOW": n}
    average_compliance_score: Optional[float] = None  # across scans that had a non-null score
