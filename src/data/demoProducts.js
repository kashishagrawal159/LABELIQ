// ==============================================================================
// LABEL IQ — DEMO PRODUCTS DATASET
// ⚠️ CLASSIFICATION: DEMO MODE — SAMPLE PRODUCT
// NOTE: These values are ONLY sample/demo values for demonstration and testing.
// The demo data is fully replaceable by real backend results in Live Mode.
// ==============================================================================

export const PRIMARY_DEMO_PRODUCT = {
  id: "demo-sample-001",
  is_demo: true,
  demo_label: "DEMO MODE — SAMPLE PRODUCT",
  image: "/samples/facewash_front.jpg",
  // 10 Canonical Fields
  product: "Sample Packaged Food",
  brand: "Demo Brand",
  manufacturer: "Demo Foods Pvt. Ltd., Plot 42, Sector 18, Gurugram, Haryana - 122015",
  importer: "Demo Imports Pvt. Ltd., Nariman Point, Mumbai - 400021",
  net_quantity: "500 g",
  mrp: "₹120",
  country_of_origin: "India",
  manufacturing_date: "10/08/2026",
  expiry_date: "10/08/2027",
  consumer_care: "1800-000-0000 / feedback@demofoods.in",

  // Field Confidence (0-100%)
  confidence: {
    product: 98.4,
    brand: 99.2,
    manufacturer: 95.8,
    importer: 94.2,
    net_quantity: 98.9,
    mrp: 99.5,
    country_of_origin: 97.6,
    manufacturing_date: 96.5,
    expiry_date: 97.1,
    consumer_care: 93.4
  },

  // Evidence Locations
  evidence: {
    product: "Front Label Top Header",
    brand: "Principal Display Panel Center",
    manufacturer: "Back Panel Lower Left",
    importer: "Back Panel Importer Oversticker",
    net_quantity: "Front Panel Lower Center",
    mrp: "Front Label Price Stamp",
    country_of_origin: "Back Panel Base",
    manufacturing_date: "Crimp Seal / Side Panel Stamp",
    expiry_date: "Crimp Seal / Side Panel Stamp",
    consumer_care: "Back Panel Contact Block"
  },

  // Bounding boxes [top, left, width, height] in percentage coordinates
  bounding_boxes: {
    product: { top: 15, left: 20, width: 60, height: 10 },
    brand: { top: 28, left: 30, width: 40, height: 8 },
    net_quantity: { top: 68, left: 35, width: 30, height: 7 },
    mrp: { top: 78, left: 62, width: 28, height: 8 },
    manufacturing_date: { top: 48, left: 55, width: 38, height: 6 },
    expiry_date: { top: 56, left: 55, width: 38, height: 6 },
    country_of_origin: { top: 65, left: 10, width: 45, height: 6 },
    manufacturer: { top: 75, left: 10, width: 48, height: 12 },
    importer: { top: 40, left: 10, width: 40, height: 8 },
    consumer_care: { top: 88, left: 10, width: 50, height: 6 }
  }
};

export const EXPIRED_DEMO_PRODUCT = {
  id: "demo-sample-002",
  is_demo: true,
  demo_label: "DEMO MODE — SAMPLE PRODUCT (EXPIRED BATCH)",
  image: "/samples/facewash_front.jpg",
  product: "Herbal Green Tea Blend",
  brand: "Nature Leaf Organics",
  manufacturer: "Nature Organics Pvt. Ltd., Okhla Phase III, New Delhi - 110020",
  importer: "Not Applicable (Domestic)",
  net_quantity: "250 g",
  mrp: "₹240",
  country_of_origin: "India",
  manufacturing_date: "10/01/2025",
  expiry_date: "10/05/2025", // Prior to calendar today -> triggers EXPIRED alert
  consumer_care: "1800-111-2222 / care@natureleaf.in",
  confidence: {
    product: 97.2,
    brand: 98.5,
    manufacturer: 96.1,
    importer: 99.0,
    net_quantity: 98.4,
    mrp: 99.1,
    country_of_origin: 98.0,
    manufacturing_date: 97.8,
    expiry_date: 98.2,
    consumer_care: 94.6
  },
  evidence: {
    product: "Front Label Header",
    brand: "Front Logo Block",
    manufacturer: "Back Panel Left",
    importer: "Standard Exemption",
    net_quantity: "Front Lower Right",
    mrp: "Bottom Price Stamp",
    country_of_origin: "Back Bottom",
    manufacturing_date: "Side Flap Stamp",
    expiry_date: "Side Flap Stamp",
    consumer_care: "Back Footer"
  },
  bounding_boxes: {
    product: { top: 14, left: 18, width: 64, height: 12 },
    brand: { top: 27, left: 25, width: 50, height: 10 },
    net_quantity: { top: 65, left: 30, width: 35, height: 8 },
    mrp: { top: 76, left: 58, width: 32, height: 9 },
    manufacturing_date: { top: 46, left: 52, width: 42, height: 7 },
    expiry_date: { top: 55, left: 52, width: 42, height: 7 },
    country_of_origin: { top: 68, left: 8, width: 42, height: 7 },
    manufacturer: { top: 76, left: 8, width: 46, height: 12 },
    importer: { top: 38, left: 8, width: 40, height: 7 },
    consumer_care: { top: 89, left: 8, width: 52, height: 6 }
  }
};

export const DEMO_PRODUCTS_LIST = [
  PRIMARY_DEMO_PRODUCT,
  EXPIRED_DEMO_PRODUCT
];
