// ==============================================================================
// LABEL IQ — REALISTIC SAMPLE PRODUCTS DATASET
// Realistic Packaging Labels with Legal Metrology Declarations
// Category Specific: Food (FSSAI), Medicine (CDSCO/Drugs Act), Cosmetics
// ==============================================================================

export const REALISTIC_DEMO_PRODUCTS = [
  // ----------------------------------------------------------------------------
  // FOOD DEMO 1: Amul Taaza Homogenised Toned Milk
  // ----------------------------------------------------------------------------
  {
    id: "sample-food-amul",
    name: "Amul Taaza Homogenised Toned Milk",
    category: "food",
    categoryLabel: "Dairy & Beverage",
    image: "/demo/food/amul_milk.svg",
    images: {
      front: "/demo/food/amul_milk.svg",
      back: "/demo/food/amul_milk.svg",
      side: "/demo/food/amul_milk.svg"
    },
    // The 10 Canonical Fields
    product: "Amul Taaza Homogenised Toned Milk",
    brand: "Amul",
    manufacturer: "Gujarat Cooperative Milk Marketing Federation Ltd. (GCMMF), Anand - 388001, Gujarat",
    importer: "Domestic (Not Applicable)",
    net_quantity: "1 L",
    mrp: "₹68",
    country_of_origin: "India",
    manufacturing_date: "10/09/2026",
    expiry_date: "17/09/2026",
    consumer_care: "1800-258-3333 / customercare@amul.coop",

    // Category Specific Badges & Regulatory Data
    regulatory: {
      fssai_approved: true,
      fssai_license: "10014021001010",
      fssai_category: "Dairy Product / Pasteurized Milk",
      is_veg: true,
      standard: "FSSAI (Food Safety & Standards Regulations, 2011) & LMPC Rule 6(1)"
    },

    confidence: {
      product: 99.2,
      brand: 99.8,
      manufacturer: 96.4,
      importer: 99.0,
      net_quantity: 98.7,
      mrp: 99.5,
      country_of_origin: 98.2,
      manufacturing_date: 97.4,
      expiry_date: 98.1,
      consumer_care: 95.8
    },

    evidence: {
      product: "Front Header Banner (Taaza Homogenised Toned Milk)",
      brand: "Top Red Brand Arc (Amul)",
      manufacturer: "Back Panel Marketed & Packaged By (GCMMF Anand)",
      importer: "Domestic Packaged Commodity Exemption",
      net_quantity: "Mandatory Panel Right (Net Qty: 1 L)",
      mrp: "Statutory Price Stamp (MRP: ₹ 68.00 incl. taxes)",
      country_of_origin: "Statutory Panel (Product of India)",
      manufacturing_date: "Batch Stamp Line 1 (10/09/2026)",
      expiry_date: "Batch Stamp Line 2 (17/09/2026, 7 Days)",
      consumer_care: "Consumer Support Block (1800-258-3333)"
    },

    bounding_boxes: {
      product: { top: 18, left: 10, width: 80, height: 9 },
      brand: { top: 3, left: 25, width: 50, height: 12 },
      net_quantity: { top: 56, left: 50, width: 42, height: 7 },
      mrp: { top: 61, left: 50, width: 42, height: 7 },
      country_of_origin: { top: 77, left: 9, width: 82, height: 4 },
      manufacturer: { top: 73, left: 9, width: 82, height: 5 },
      importer: { top: 56, left: 9, width: 38, height: 7 },
      manufacturing_date: { top: 65, left: 9, width: 82, height: 4 },
      expiry_date: { top: 69, left: 9, width: 82, height: 4 },
      consumer_care: { top: 80, left: 9, width: 82, height: 6 }
    }
  },

  // ----------------------------------------------------------------------------
  // FOOD DEMO 2: Britannia Good Day Cashew Cookies
  // ----------------------------------------------------------------------------
  {
    id: "sample-food-britannia",
    name: "Britannia Good Day Cashew Cookies",
    category: "food",
    categoryLabel: "Bakery & Biscuits",
    image: "/demo/food/britannia_cookies.svg",
    images: {
      front: "/demo/food/britannia_cookies.svg",
      back: "/demo/food/britannia_cookies.svg",
      side: "/demo/food/britannia_cookies.svg"
    },
    product: "Britannia Good Day Cashew Cookies",
    brand: "Britannia",
    manufacturer: "Britannia Industries Ltd., 5/1A Hungerford Street, Kolkata - 700017, West Bengal",
    importer: "Domestic (Not Applicable)",
    net_quantity: "200 g",
    mrp: "₹45",
    country_of_origin: "India",
    manufacturing_date: "01/09/2026",
    expiry_date: "01/03/2027",
    consumer_care: "1800-425-4449 / feedback@britindia.com",

    regulatory: {
      fssai_approved: true,
      fssai_license: "10015043001129",
      fssai_category: "Bakery / Biscuits & Cookies",
      is_veg: true,
      standard: "FSSAI Food Safety Standards & LMPC Rule 6(1)(d)"
    },

    confidence: {
      product: 98.9,
      brand: 99.6,
      manufacturer: 96.1,
      importer: 99.2,
      net_quantity: 98.4,
      mrp: 99.2,
      country_of_origin: 98.0,
      manufacturing_date: 97.2,
      expiry_date: 97.9,
      consumer_care: 95.1
    },

    evidence: {
      product: "Center Oval Graphic (Good Day Cashew Cookies)",
      brand: "Top Header Navy Bar (Britannia)",
      manufacturer: "Mandatory Declarations Box (Britannia Industries Kolkata)",
      importer: "Domestic Packaged Commodity Exemption",
      net_quantity: "Right Quantity Card (Net Weight: 200 g)",
      mrp: "Right Price Card (MRP: ₹ 45.00, ₹0.225/g)",
      country_of_origin: "Base Address (Made in India)",
      manufacturing_date: "Dates Panel Row 1 (01/09/2026)",
      expiry_date: "Dates Panel Row 2 (01/03/2027, Best Before 6 Months)",
      consumer_care: "Consumer Executive Block (1800-425-4449)"
    },

    bounding_boxes: {
      product: { top: 18, left: 20, width: 60, height: 6 },
      brand: { top: 3, left: 38, width: 24, height: 6 },
      net_quantity: { top: 54, left: 49, width: 43, height: 8 },
      mrp: { top: 59, left: 49, width: 43, height: 8 },
      country_of_origin: { top: 76, left: 8, width: 84, height: 4 },
      manufacturer: { top: 72, left: 8, width: 84, height: 4 },
      importer: { top: 54, left: 8, width: 39, height: 8 },
      manufacturing_date: { top: 63, left: 8, width: 84, height: 4 },
      expiry_date: { top: 67, left: 8, width: 84, height: 4 },
      consumer_care: { top: 79, left: 8, width: 84, height: 6 }
    }
  },

  // ----------------------------------------------------------------------------
  // MEDICINE DEMO 1: Paracetamol Tablets 500 mg
  // ----------------------------------------------------------------------------
  {
    id: "sample-medicine-paracetamol",
    name: "Paracetamol Tablets 500 mg",
    category: "medicine",
    categoryLabel: "Pharmaceutical / Analgesic",
    image: "/demo/medicine/paracetamol.svg",
    images: {
      front: "/demo/medicine/paracetamol.svg",
      back: "/demo/medicine/paracetamol.svg",
      side: "/demo/medicine/paracetamol.svg"
    },
    product: "Paracetamol Tablets IP 500 mg",
    brand: "Paracetamol",
    manufacturer: "Demo Pharma Labs Pvt. Ltd., Plot 104, Industrial Area Phase-II, Chandigarh - 160002",
    importer: "Domestic (Not Applicable)",
    net_quantity: "10 Tablets",
    mrp: "₹20",
    country_of_origin: "India",
    manufacturing_date: "06/2026",
    expiry_date: "05/2028",
    consumer_care: "1800-000-0000 / druginfo@demopharma.in",

    regulatory: {
      fssai_approved: false, // Medicine does NOT have FSSAI
      drug_license: "Mfg. Lic. No. M/748/2016",
      batch_number: "B.No. T-5028",
      schedule_drug: "Schedule H Prescription Drug",
      cdsco_approved: true,
      standard: "Drugs and Cosmetics Act, 1940 & Legal Metrology Rules"
    },

    confidence: {
      product: 99.4,
      brand: 98.9,
      manufacturer: 97.2,
      importer: 99.5,
      net_quantity: 99.1,
      mrp: 99.6,
      country_of_origin: 98.8,
      manufacturing_date: 97.9,
      expiry_date: 98.4,
      consumer_care: 94.2
    },

    evidence: {
      product: "Foil Header (Paracetamol Tablets IP 500 mg)",
      brand: "Generic INN / Form Name (Paracetamol)",
      manufacturer: "Manufacturer Stamp (Demo Pharma Labs Chandigarh)",
      importer: "Domestic Pharmaceutical Exemption",
      net_quantity: "Top Right Stamp (10 Tablets)",
      mrp: "Statutory Panel Right (M.R.P. ₹ 20.00)",
      country_of_origin: "Country Specification (Manufactured in India)",
      manufacturing_date: "Blister Stamp Row 1 (06/2026)",
      expiry_date: "Blister Stamp Row 2 (05/2028)",
      consumer_care: "Drug Helpline Line (1800-000-0000)"
    },

    bounding_boxes: {
      product: { top: 3, left: 18, width: 65, height: 8 },
      brand: { top: 3, left: 18, width: 35, height: 6 },
      net_quantity: { top: 52, left: 52, width: 40, height: 7 },
      mrp: { top: 57, left: 52, width: 40, height: 7 },
      country_of_origin: { top: 76, left: 9, width: 82, height: 4 },
      manufacturer: { top: 72, left: 9, width: 82, height: 4 },
      importer: { top: 52, left: 9, width: 40, height: 8 },
      manufacturing_date: { top: 62, left: 9, width: 82, height: 4 },
      expiry_date: { top: 66, left: 9, width: 82, height: 4 },
      consumer_care: { top: 80, left: 9, width: 82, height: 6 }
    }
  },

  // ----------------------------------------------------------------------------
  // MEDICINE DEMO 2: Cetirizine Hydrochloride Tablets 10 mg
  // ----------------------------------------------------------------------------
  {
    id: "sample-medicine-cetirizine",
    name: "Cetirizine Hydrochloride Tablets 10 mg",
    category: "medicine",
    categoryLabel: "Pharmaceutical / Anti-Allergic",
    image: "/demo/medicine/cetirizine.svg",
    images: {
      front: "/demo/medicine/cetirizine.svg",
      back: "/demo/medicine/cetirizine.svg",
      side: "/demo/medicine/cetirizine.svg"
    },
    product: "Cetirizine Hydrochloride Tablets IP 10 mg",
    brand: "Cetirizine",
    manufacturer: "Demo Healthcare Labs Ltd., Solan Industrial Estate, Solan, Himachal Pradesh - 173212",
    importer: "Domestic (Not Applicable)",
    net_quantity: "10 Tablets",
    mrp: "₹35",
    country_of_origin: "India",
    manufacturing_date: "05/2026",
    expiry_date: "04/2028",
    consumer_care: "1800-000-0000 / care@demohealthcare.com",

    regulatory: {
      fssai_approved: false,
      drug_license: "Mfg. Lic. No. L/20/1908/MN",
      batch_number: "B.No. CT-9912",
      schedule_drug: "Schedule H Prescription Drug",
      cdsco_approved: true,
      standard: "Drugs and Cosmetics Act, 1940 & Legal Metrology Rules"
    },

    confidence: {
      product: 99.1,
      brand: 98.7,
      manufacturer: 96.8,
      importer: 99.4,
      net_quantity: 99.0,
      mrp: 99.4,
      country_of_origin: 98.6,
      manufacturing_date: 97.6,
      expiry_date: 98.2,
      consumer_care: 94.0
    },

    evidence: {
      product: "Top Indigo Banner (Cetirizine Hydrochloride IP 10 mg)",
      brand: "Formulation Identifier (Cetirizine)",
      manufacturer: "Manufacturer Block (Demo Healthcare Labs Solan)",
      importer: "Domestic Pharmaceutical Exemption",
      net_quantity: "Top Right Specification (10 Tablets)",
      mrp: "Right Price Stamp (M.R.P. ₹ 35.00)",
      country_of_origin: "Statutory Panel (Country of Origin: India)",
      manufacturing_date: "Date Block Line 1 (05/2026)",
      expiry_date: "Date Block Line 2 (04/2028)",
      consumer_care: "Drug Helpline Support (1800-000-0000)"
    },

    bounding_boxes: {
      product: { top: 3, left: 18, width: 65, height: 8 },
      brand: { top: 3, left: 18, width: 35, height: 6 },
      net_quantity: { top: 52, left: 52, width: 40, height: 7 },
      mrp: { top: 57, left: 52, width: 40, height: 7 },
      country_of_origin: { top: 76, left: 9, width: 82, height: 4 },
      manufacturer: { top: 72, left: 9, width: 82, height: 4 },
      importer: { top: 52, left: 9, width: 40, height: 8 },
      manufacturing_date: { top: 62, left: 9, width: 82, height: 4 },
      expiry_date: { top: 66, left: 9, width: 82, height: 4 },
      consumer_care: { top: 80, left: 9, width: 82, height: 6 }
    }
  },

  // ----------------------------------------------------------------------------
  // COSMETICS DEMO 1: Deconstruct Salicylic Acid Face Wash
  // ----------------------------------------------------------------------------
  {
    id: "sample-cosmetics-deconstruct",
    name: "Deconstruct Salicylic Acid Face Wash",
    category: "cosmetics",
    categoryLabel: "Personal Care & Skincare",
    image: "/samples/facewash_front.jpg",
    images: {
      front: "/samples/facewash_front.jpg",
      back: "/samples/facewash_front.jpg",
      side: "/samples/facewash_front.jpg"
    },
    product: "Salicylic Acid Oil Control Face Wash",
    brand: "Deconstruct",
    manufacturer: "HCP Wellness Pvt. Ltd., Plot 08, GIDC Industrial Estate, Ambav, Gujarat - 382430",
    importer: "Domestic (Not Applicable)",
    net_quantity: "100 ml",
    mrp: "₹299",
    country_of_origin: "India",
    manufacturing_date: "04/2026",
    expiry_date: "03/2028",
    consumer_care: "1800-889-0123 / support@thedeconstruct.in",

    regulatory: {
      fssai_approved: false,
      cosmetic_license: "Cosmetic Lic. No. M-GC/1042",
      standard: "Bureau of Indian Standards (IS 14636) & LMPC Rule 6(1)"
    },

    confidence: {
      product: 98.8,
      brand: 99.5,
      manufacturer: 96.5,
      importer: 99.2,
      net_quantity: 98.9,
      mrp: 99.4,
      country_of_origin: 98.1,
      manufacturing_date: 97.5,
      expiry_date: 98.0,
      consumer_care: 95.0
    },

    evidence: {
      product: "Front Label Center (Salicylic Acid Oil Control)",
      brand: "Top Center Brand Header (Deconstruct)",
      manufacturer: "Back Panel Base (HCP Wellness Gujarat)",
      importer: "Domestic Cosmetic Exemption",
      net_quantity: "Front Panel Lower Center (100 ml)",
      mrp: "Back Label Price Stamp (₹299)",
      country_of_origin: "Back Label Country Notation (India)",
      manufacturing_date: "Crimp Seal Stamp (04/2026)",
      expiry_date: "Crimp Seal Stamp (03/2028)",
      consumer_care: "Back Panel Contact (1800-889-0123)"
    },

    bounding_boxes: {
      product: { top: 22, left: 20, width: 60, height: 10 },
      brand: { top: 10, left: 30, width: 40, height: 8 },
      net_quantity: { top: 68, left: 35, width: 30, height: 7 },
      mrp: { top: 78, left: 62, width: 28, height: 8 },
      country_of_origin: { top: 65, left: 10, width: 45, height: 6 },
      manufacturer: { top: 75, left: 10, width: 48, height: 12 },
      importer: { top: 40, left: 10, width: 40, height: 8 },
      manufacturing_date: { top: 48, left: 55, width: 38, height: 6 },
      expiry_date: { top: 56, left: 55, width: 38, height: 6 },
      consumer_care: { top: 88, left: 10, width: 50, height: 6 }
    }
  },

  // ----------------------------------------------------------------------------
  // COSMETICS DEMO 2: Parachute Advansed Body Lotion
  // ----------------------------------------------------------------------------
  {
    id: "sample-cosmetics-parachute",
    name: "Parachute Advansed Deep Nourish Body Lotion",
    category: "cosmetics",
    categoryLabel: "Personal Care & Skincare",
    image: "/samples/lotion_front.jpg",
    images: {
      front: "/samples/lotion_front.jpg",
      back: "/samples/lotion_front.jpg",
      side: "/samples/lotion_front.jpg"
    },
    product: "Advansed Deep Nourish Body Lotion",
    brand: "Parachute",
    manufacturer: "Marico Limited, 7th Floor, Grande Palladium, 175 CST Road, Kalina, Mumbai - 400098",
    importer: "Domestic (Not Applicable)",
    net_quantity: "400 ml",
    mrp: "₹340",
    country_of_origin: "India",
    manufacturing_date: "03/2026",
    expiry_date: "02/2028",
    consumer_care: "1800-222-248 / csc@marico.com",

    regulatory: {
      fssai_approved: false,
      cosmetic_license: "Cosmetic Lic. No. C-844",
      standard: "Bureau of Indian Standards & LMPC Rule 6(1)"
    },

    confidence: {
      product: 98.6,
      brand: 99.4,
      manufacturer: 96.0,
      importer: 99.1,
      net_quantity: 98.7,
      mrp: 99.3,
      country_of_origin: 98.0,
      manufacturing_date: 97.3,
      expiry_date: 97.8,
      consumer_care: 94.8
    },

    evidence: {
      product: "Front Curved Ribbon (Deep Nourish Body Lotion)",
      brand: "Top Arch Logo (Parachute Advansed)",
      manufacturer: "Back Bottle Base (Marico Limited Mumbai)",
      importer: "Domestic Cosmetic Exemption",
      net_quantity: "Bottle Lower Front (400 ml)",
      mrp: "Base Laser Stamp (₹340)",
      country_of_origin: "Manufacturer Line (Made in India)",
      manufacturing_date: "Bottle Shoulder Laser Stamp (03/2026)",
      expiry_date: "Bottle Shoulder Laser Stamp (02/2028)",
      consumer_care: "Customer Support Block (1800-222-248)"
    },

    bounding_boxes: {
      product: { top: 25, left: 20, width: 60, height: 10 },
      brand: { top: 12, left: 30, width: 40, height: 8 },
      net_quantity: { top: 70, left: 35, width: 30, height: 7 },
      mrp: { top: 80, left: 62, width: 28, height: 8 },
      country_of_origin: { top: 66, left: 10, width: 45, height: 6 },
      manufacturer: { top: 74, left: 10, width: 48, height: 12 },
      importer: { top: 40, left: 10, width: 40, height: 8 },
      manufacturing_date: { top: 48, left: 55, width: 38, height: 6 },
      expiry_date: { top: 56, left: 55, width: 38, height: 6 },
      consumer_care: { top: 86, left: 10, width: 50, height: 6 }
    }
  }
];
