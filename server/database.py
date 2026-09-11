"""
Database layer — SQLite via SQLAlchemy.
Switch to Postgres later by just changing DATABASE_URL, nothing else changes.
"""
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean, DateTime, JSON,
    ForeignKey, text,
)
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

DATABASE_URL = "sqlite:///./metrologyai.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Product(Base):
    """One row = one distinct PRODUCT (not one scan). This is the 'history
    by ID' the team asked for: every time the same item gets scanned again,
    it's linked to this same Product row instead of creating an unrelated
    floating record — so 'show me this product's history' means 'every
    ScanRecord with this product_id', and the ID never changes across
    re-scans of the same item."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, nullable=False, index=True)
    product_category = Column(String, nullable=True)
    first_scanned_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_scanned_at = Column(DateTime, default=datetime.datetime.utcnow)
    scan_count = Column(Integer, default=0)


class ScanRecord(Base):
    """One row = one product scan, with extracted data + compliance verdict."""
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Links this scan to its Product identity (see Product above). Nullable
    # because a scan with no readable product_name (extraction failure)
    # has nothing reliable to group by, and is left unlinked.
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)

    # Raw extracted fields (from CV/OCR module — see perception.py)
    product_name = Column(String, nullable=True)
    product = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    importer = Column(String, nullable=True)
    product_category = Column(String, nullable=True)  # food | medicine | cosmetic | general
    mrp = Column(Float, nullable=True)
    net_quantity = Column(Float, nullable=True)
    net_quantity_unit = Column(String, nullable=True)
    declared_usp = Column(Float, nullable=True)
    expiry_date = Column(String, nullable=True)
    mfg_date = Column(String, nullable=True)
    manufacturing_date = Column(String, nullable=True)
    consumer_care = Column(String, nullable=True)
    fssai_license = Column(String, nullable=True)
    font_height_mm = Column(Float, nullable=True)
    pdp_area_cm2 = Column(Float, nullable=True)
    country_of_origin = Column(String, nullable=True)  # e.g. "India", "China" — raw text as read off the label
    confidence = Column(JSON, nullable=True)
    evidence = Column(JSON, nullable=True)
    date_validation = Column(JSON, nullable=True)

    # Verdicts (from rule_engine.py)
    is_expired = Column(Boolean, nullable=True)
    usp_math_ok = Column(Boolean, nullable=True)
    font_height_ok = Column(Boolean, nullable=True)
    fssai_valid = Column(Boolean, nullable=True)
    is_imported = Column(Boolean, nullable=True)  # True=imported, False=domestic (India), None=couldn't tell
    overall_compliant = Column(Boolean, nullable=True)
    compliance_score = Column(Float, nullable=True)
    risk_priority = Column(String, nullable=True)
    violations = Column(JSON, nullable=True)  # list of violation strings
    verdict_label = Column(String, nullable=True)
    headline = Column(String, nullable=True)
    checks = Column(JSON, nullable=True)  # list of {name, status, detail}
    photo_quality_warning = Column(String, nullable=True)


# ---- Lightweight migration for pre-existing SQLite files ----
_NEW_SCAN_COLUMNS = {
    "product_id": "INTEGER",
    "country_of_origin": "TEXT",
    "is_imported": "BOOLEAN",
    "product": "TEXT",
    "brand": "TEXT",
    "manufacturer": "TEXT",
    "importer": "TEXT",
    "manufacturing_date": "TEXT",
    "consumer_care": "TEXT",
    "confidence": "JSON",
    "evidence": "JSON",
    "date_validation": "JSON",
}


def _migrate_existing_db():
    with engine.connect() as conn:
        existing_cols = {row[1] for row in conn.execute(text("PRAGMA table_info(scans)"))}
        for col_name, col_type in _NEW_SCAN_COLUMNS.items():
            if col_name not in existing_cols:
                conn.execute(text(f"ALTER TABLE scans ADD COLUMN {col_name} {col_type}"))
        conn.commit()


def init_db():
    Base.metadata.create_all(bind=engine)
    _migrate_existing_db()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
