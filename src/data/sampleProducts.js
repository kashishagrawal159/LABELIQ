// Realistic packaged product datasets with multi-angle packaging evidence & compliance audits
export const SAMPLE_PRODUCTS = [
  {
    id: "prod-001",
    name: "Deconstruct Hydrating Face Wash",
    brand: "Deconstruct Skincare",
    category: "Cosmetics",
    subCategory: "Facial Cleanser",
    isImported: false,
    images: {
      front: "/samples/facewash_front.jpg",
      back: "/samples/facewash_front.jpg",
      side: "/samples/facewash_front.jpg"
    },
    quality: {
      status: "good",
      score: 96,
      pdpAreaCm2: 145,
      estimatedFontHeightMm: 2.4
    },
    digitalTwin: {
      productName: "Deconstruct Hydrating Face Wash",
      brand: "Deconstruct",
      category: "Cosmetics",
      subCategory: "Facial Cleanser",
      manufacturer: "Baypure Lifestyle Pvt Ltd, Plot 142, Peenya Industrial Area, Bengaluru - 560058, Karnataka",
      packer: "Baypure Lifestyle Pvt Ltd",
      importer: null,
      countryOfOrigin: "India",
      netQuantity: "100 ml",
      netQuantityNumeric: 100,
      netQuantityUnit: "ml",
      mrp: "₹285.00",
      mrpNumeric: 285.0,
      usp: "₹2.85 per ml",
      uspNumeric: 2.85,
      dateOfManufacture: "01/2026",
      expiryDate: "12/2027",
      batchNumber: "DEC-2601-A",
      consumerCare: "care@thedeconstruct.in / +91-80-45678900",
      ingredientsListDeclared: true,
      fssaiLicense: null,
      cosmeticsMfgLicNo: "KA-COS-2021-0842"
    },
    complianceScore: 98,
    status: "verified", // verified | review | issue
    breakdown: {
      mandatoryDeclarations: "10 / 10",
      ruleValidation: "20 / 20",
      crossSourceConsistency: "9.8 / 10",
      evidenceConfidence: "98.2%"
    },
    fieldsAudit: [
      {
        field: "MRP Declaration",
        detectedValue: "₹285.00 (Incl. of all taxes)",
        requirement: "Mandatory on PDP with tax inclusivity",
        status: "PASS",
        boxId: "BOX-01",
        confidence: 99.1,
        ruleRef: "LMPC-R6-1-MRP",
        evidenceSource: "Front Label Bottom Right",
        boundingBox: { top: 78, left: 62, width: 28, height: 8 }
      },
      {
        field: "Net Quantity",
        detectedValue: "100 ml",
        requirement: "SI metric units (ml), min 2mm font height",
        status: "PASS",
        boxId: "BOX-02",
        confidence: 98.6,
        ruleRef: "LMPC-R6-1-NET",
        evidenceSource: "Front Label Lower Center",
        boundingBox: { top: 68, left: 35, width: 30, height: 7 }
      },
      {
        field: "Unit Sale Price",
        detectedValue: "₹2.85 / ml",
        requirement: "Accurate MRP/Quantity ratio calculation",
        status: "PASS",
        boxId: "BOX-03",
        confidence: 97.4,
        ruleRef: "LMPC-R6-1-USP",
        evidenceSource: "Front Label Price Block",
        boundingBox: { top: 85, left: 60, width: 32, height: 6 }
      },
      {
        field: "Country of Origin",
        detectedValue: "Country of Origin: India",
        requirement: "Mandatory origin declaration",
        status: "PASS",
        boxId: "BOX-04",
        confidence: 99.0,
        ruleRef: "LMPC-R6-8-ORIGIN",
        evidenceSource: "Back Panel Base",
        boundingBox: { top: 58, left: 15, width: 45, height: 7 }
      },
      {
        field: "Manufacturer Details",
        detectedValue: "Baypure Lifestyle Pvt Ltd, Bengaluru 560058",
        requirement: "Full legal entity name, postal address & pincode",
        status: "PASS",
        boxId: "BOX-05",
        confidence: 96.8,
        ruleRef: "LMPC-R6-1-MFG",
        evidenceSource: "Back Panel Center",
        boundingBox: { top: 38, left: 12, width: 75, height: 14 }
      },
      {
        field: "Consumer Grievance Care",
        detectedValue: "care@thedeconstruct.in | +91-80-45678900",
        requirement: "Active consumer contact helpline/email",
        status: "PASS",
        boxId: "BOX-06",
        confidence: 97.5,
        ruleRef: "LMPC-R6-1-CARE",
        evidenceSource: "Back Panel Lower Section",
        boundingBox: { top: 48, left: 15, width: 68, height: 8 }
      },
      {
        field: "Cosmetics License & Batch",
        detectedValue: "Batch: DEC-2601-A | Lic: KA-COS-2021-0842",
        requirement: "Rule 34 Cosmetics Rules 2020",
        status: "PASS",
        boxId: "BOX-07",
        confidence: 98.0,
        ruleRef: "DCA-COSMETIC-2020",
        evidenceSource: "Back Panel Bottom Margin",
        boundingBox: { top: 88, left: 12, width: 55, height: 6 }
      }
    ],
    crossSource: {
      overallConsistency: 98,
      inconsistenciesCount: 0,
      sources: {
        package: { mrp: "₹285.00", netQty: "100 ml", origin: "India", mfg: "Baypure Lifestyle Pvt Ltd" },
        pdfSpec: { mrp: "₹285.00", netQty: "100 ml", origin: "India", mfg: "Baypure Lifestyle Pvt Ltd" },
        ecommerce: { mrp: "₹285.00", netQty: "100 ml", origin: "India", mfg: "Baypure Lifestyle Pvt Ltd" }
      }
    },
    violations: [],
    riskAssessment: {
      level: "Low",
      score: 12,
      factors: [
        { label: "Violation Severity", score: 0, max: 100 },
        { label: "Evidence Confidence", score: 98, max: 100 },
        { label: "Regulatory Compliance", score: 99, max: 100 }
      ]
    },
    passport: {
      id: "LM-PASSPORT-2026-001",
      verificationDate: "2026-03-08",
      qrCodeData: "https://labeliq.gov.in/passport/LM-PASSPORT-2026-001",
      rulesetVersion: "LMPC 2024 Gazette Amendment (Current)",
      officerSignoff: "Verified via Automated Audit Engine",
      evidenceItemsCount: 14
    }
  },
  {
    id: "prod-002",
    name: "Parachute Advansed Deep Nourish Body Lotion",
    brand: "Marico",
    category: "Cosmetics",
    subCategory: "Body Care",
    isImported: false,
    images: {
      front: "/samples/lotion_front.jpg",
      back: "/samples/lotion_front.jpg",
      side: "/samples/lotion_front.jpg"
    },
    quality: {
      status: "good",
      score: 94,
      pdpAreaCm2: 210,
      estimatedFontHeightMm: 2.1
    },
    digitalTwin: {
      productName: "Parachute Advansed Deep Nourish Body Lotion",
      brand: "Marico",
      category: "Cosmetics",
      subCategory: "Body Moisturizer",
      manufacturer: "Marico Limited, 7th Floor, Grande Palladium, 175 CST Road, Kalina, Mumbai - 400098",
      packer: "Marico Limited, Baddi Industrial Area, HP",
      importer: null,
      countryOfOrigin: "India",
      netQuantity: "400 ml",
      netQuantityNumeric: 400,
      netQuantityUnit: "ml",
      mrp: "₹340.00",
      mrpNumeric: 340.0,
      usp: "₹0.85 per ml",
      uspNumeric: 0.85,
      dateOfManufacture: "11/2025",
      expiryDate: "10/2027",
      batchNumber: "MAR-BL-402",
      consumerCare: "csc@marico.com / 1800-222-248",
      ingredientsListDeclared: true,
      fssaiLicense: null,
      cosmeticsMfgLicNo: "MH-COS-00412"
    },
    complianceScore: 95,
    status: "verified",
    breakdown: {
      mandatoryDeclarations: "10 / 10",
      ruleValidation: "19 / 20",
      crossSourceConsistency: "9.5 / 10",
      evidenceConfidence: "96.4%"
    },
    fieldsAudit: [
      {
        field: "MRP Declaration",
        detectedValue: "₹340.00 (Incl. of all taxes)",
        requirement: "Mandatory declaration on PDP",
        status: "PASS",
        boxId: "BOX-11",
        confidence: 98.4,
        ruleRef: "LMPC-R6-1-MRP",
        evidenceSource: "Front Label Price Section",
        boundingBox: { top: 72, left: 25, width: 35, height: 7 }
      },
      {
        field: "Net Quantity",
        detectedValue: "400 ml",
        requirement: "SI metric units (ml)",
        status: "PASS",
        boxId: "BOX-12",
        confidence: 97.9,
        ruleRef: "LMPC-R6-1-NET",
        evidenceSource: "Front Label Bottom Center",
        boundingBox: { top: 82, left: 30, width: 40, height: 8 }
      },
      {
        field: "Unit Sale Price",
        detectedValue: "₹0.85 / ml",
        requirement: "Mandatory USP calculation",
        status: "PASS",
        boxId: "BOX-13",
        confidence: 96.2,
        ruleRef: "LMPC-R6-1-USP",
        evidenceSource: "Front Label Adjacent to MRP",
        boundingBox: { top: 74, left: 62, width: 28, height: 6 }
      },
      {
        field: "Manufacturer Address",
        detectedValue: "Marico Limited, Mumbai 400098",
        requirement: "Registered postal address",
        status: "PASS",
        boxId: "BOX-14",
        confidence: 95.8,
        ruleRef: "LMPC-R6-1-MFG",
        evidenceSource: "Rear Panel Lower Section",
        boundingBox: { top: 40, left: 15, width: 70, height: 12 }
      },
      {
        field: "Consumer Helpline",
        detectedValue: "1800-222-248 / csc@marico.com",
        requirement: "Toll-free helpline and valid email",
        status: "PASS",
        boxId: "BOX-15",
        confidence: 98.1,
        ruleRef: "LMPC-R6-1-CARE",
        evidenceSource: "Rear Panel Contact Block",
        boundingBox: { top: 56, left: 15, width: 65, height: 8 }
      }
    ],
    crossSource: {
      overallConsistency: 96,
      inconsistenciesCount: 0,
      sources: {
        package: { mrp: "₹340.00", netQty: "400 ml", origin: "India", mfg: "Marico Limited" },
        pdfSpec: { mrp: "₹340.00", netQty: "400 ml", origin: "India", mfg: "Marico Limited" },
        ecommerce: { mrp: "₹340.00", netQty: "400 ml", origin: "India", mfg: "Marico Limited" }
      }
    },
    violations: [],
    riskAssessment: {
      level: "Low",
      score: 14,
      factors: [
        { label: "Violation Severity", score: 0, max: 100 },
        { label: "Evidence Confidence", score: 96, max: 100 },
        { label: "Regulatory Compliance", score: 97, max: 100 }
      ]
    },
    passport: {
      id: "LM-PASSPORT-2026-002",
      verificationDate: "2026-03-07",
      qrCodeData: "https://labeliq.gov.in/passport/LM-PASSPORT-2026-002",
      rulesetVersion: "LMPC 2024 Gazette Amendment (Current)",
      officerSignoff: "Verified via Automated Audit Engine",
      evidenceItemsCount: 16
    }
  },
  {
    id: "prod-003",
    name: "Choki Choki Chocolate & Milk Paste",
    brand: "Choki Choki",
    category: "Food",
    subCategory: "Confectionery",
    isImported: false,
    images: {
      front: "/samples/choki_front.jpg",
      back: "/samples/choki_back.jpg",
      side: "/samples/choki_front.jpg"
    },
    quality: {
      status: "good",
      score: 92,
      pdpAreaCm2: 85,
      estimatedFontHeightMm: 1.6
    },
    digitalTwin: {
      productName: "Choki Choki Chocolate & Milk Paste",
      brand: "Choki Choki",
      category: "Food",
      subCategory: "Confectionery Paste",
      manufacturer: "PT Mayora Indah / INBISCO India Pvt Ltd, Ahmedabad - 380015, Gujarat",
      packer: "INBISCO India Pvt Ltd",
      importer: null,
      countryOfOrigin: "India",
      netQuantity: "44 g (4 x 11g)",
      netQuantityNumeric: 44,
      netQuantityUnit: "g",
      mrp: "₹20.00",
      mrpNumeric: 20.0,
      usp: "₹0.45 per g",
      uspNumeric: 0.45,
      dateOfManufacture: "12/2025",
      expiryDate: "11/2026",
      batchNumber: "CHK-2512-B",
      consumerCare: "consumer@inbisco.com / 1800-103-8888",
      ingredientsListDeclared: true,
      fssaiLicense: "10014021001234",
      cosmeticsMfgLicNo: null
    },
    complianceScore: 92,
    status: "verified",
    breakdown: {
      mandatoryDeclarations: "10 / 10",
      ruleValidation: "18 / 20",
      crossSourceConsistency: "9.2 / 10",
      evidenceConfidence: "95.1%"
    },
    fieldsAudit: [
      {
        field: "MRP Declaration",
        detectedValue: "₹20.00 (Incl. of all taxes)",
        requirement: "Mandatory declaration on PDP",
        status: "PASS",
        boxId: "BOX-21",
        confidence: 97.8,
        ruleRef: "LMPC-R6-1-MRP",
        evidenceSource: "Front Pack Header Right",
        boundingBox: { top: 15, left: 65, width: 30, height: 10 }
      },
      {
        field: "Net Quantity",
        detectedValue: "44 g (4 x 11g)",
        requirement: "SI metric units (g) with multi-pack breakdown",
        status: "PASS",
        boxId: "BOX-22",
        confidence: 96.5,
        ruleRef: "LMPC-R6-1-NET",
        evidenceSource: "Front Pack Bottom Center",
        boundingBox: { top: 75, left: 30, width: 38, height: 9 }
      },
      {
        field: "FSSAI License Declaration",
        detectedValue: "Lic No. 10014021001234",
        requirement: "14-digit numeric license with logo (Food category)",
        status: "PASS",
        boxId: "BOX-23",
        confidence: 98.2,
        ruleRef: "FSSA-2006-LIC",
        evidenceSource: "Back Panel Seal Area",
        boundingBox: { top: 45, left: 18, width: 45, height: 8 }
      },
      {
        field: "Country of Origin",
        detectedValue: "Manufactured in India",
        requirement: "Mandatory country declaration",
        status: "PASS",
        boxId: "BOX-24",
        confidence: 95.0,
        ruleRef: "LMPC-R6-8-ORIGIN",
        evidenceSource: "Back Panel Center Left",
        boundingBox: { top: 58, left: 15, width: 50, height: 8 }
      }
    ],
    crossSource: {
      overallConsistency: 94,
      inconsistenciesCount: 0,
      sources: {
        package: { mrp: "₹20.00", netQty: "44 g", origin: "India", mfg: "INBISCO India Pvt Ltd" },
        pdfSpec: { mrp: "₹20.00", netQty: "44 g", origin: "India", mfg: "INBISCO India Pvt Ltd" },
        ecommerce: { mrp: "₹20.00", netQty: "44 g", origin: "India", mfg: "INBISCO India Pvt Ltd" }
      }
    },
    violations: [],
    riskAssessment: {
      level: "Low",
      score: 16,
      factors: [
        { label: "Violation Severity", score: 0, max: 100 },
        { label: "Evidence Confidence", score: 95, max: 100 },
        { label: "Regulatory Compliance", score: 96, max: 100 }
      ]
    },
    passport: {
      id: "LM-PASSPORT-2026-003",
      verificationDate: "2026-03-05",
      qrCodeData: "https://labeliq.gov.in/passport/LM-PASSPORT-2026-003",
      rulesetVersion: "LMPC 2024 Gazette Amendment (Current)",
      officerSignoff: "Verified via Automated Audit Engine",
      evidenceItemsCount: 12
    }
  },
  {
    id: "prod-004",
    name: "Nimbudi Refreshing Lemon Drink",
    brand: "Nimbudi Beverages",
    category: "Food",
    subCategory: "Beverage",
    isImported: false,
    images: {
      front: "/samples/nimbudi_front.jpg",
      back: "/samples/nimbudi_front.jpg",
      side: "/samples/nimbudi_front.jpg"
    },
    quality: {
      status: "good",
      score: 89,
      pdpAreaCm2: 120,
      estimatedFontHeightMm: 1.8
    },
    digitalTwin: {
      productName: "Nimbudi Refreshing Lemon Drink",
      brand: "Nimbudi",
      category: "Food",
      subCategory: "Fruit Drink",
      manufacturer: "Nimbudi Beverage Corp, GIDC Estate, Rajkot - 360002, Gujarat",
      packer: "Nimbudi Beverage Corp",
      importer: null,
      countryOfOrigin: "India",
      netQuantity: "250 ml",
      netQuantityNumeric: 250,
      netQuantityUnit: "ml",
      mrp: "₹25.00",
      mrpNumeric: 25.0,
      usp: "₹0.10 per ml",
      uspNumeric: 0.10,
      dateOfManufacture: "01/2026",
      expiryDate: "07/2026",
      batchNumber: "NIM-2601",
      consumerCare: "help@nimbudi.com / +91-281-224466",
      ingredientsListDeclared: true,
      fssaiLicense: "10718014000321",
      cosmeticsMfgLicNo: null
    },
    complianceScore: 68,
    status: "issue", // Has MRP discrepancy & e-commerce mismatch
    breakdown: {
      mandatoryDeclarations: "9 / 10",
      ruleValidation: "13 / 20",
      crossSourceConsistency: "5.8 / 10",
      evidenceConfidence: "93.4%"
    },
    fieldsAudit: [
      {
        field: "MRP Declaration",
        detectedValue: "₹25.00",
        requirement: "Physical packaging declares ₹25.00",
        status: "PASS",
        boxId: "BOX-31",
        confidence: 96.1,
        ruleRef: "LMPC-R6-1-MRP",
        evidenceSource: "Front Label Price Badge",
        boundingBox: { top: 65, left: 60, width: 32, height: 10 }
      },
      {
        field: "Cross-Source Pricing (E-Commerce)",
        detectedValue: "Listed at ₹35.00 online vs ₹25.00 on package",
        requirement: "Rule 18(2) prohibits selling above declared MRP",
        status: "FAIL",
        boxId: "BOX-32",
        confidence: 99.0,
        ruleRef: "ECOM-LMPC-AMEND-2017",
        evidenceSource: "E-Commerce Scraping Feed",
        boundingBox: { top: 20, left: 20, width: 60, height: 15 }
      },
      {
        field: "Net Quantity",
        detectedValue: "250 ml",
        requirement: "SI metric units (ml)",
        status: "PASS",
        boxId: "BOX-33",
        confidence: 97.0,
        ruleRef: "LMPC-R6-1-NET",
        evidenceSource: "Front Label Bottom Left",
        boundingBox: { top: 78, left: 22, width: 30, height: 8 }
      },
      {
        field: "Unit Sale Price",
        detectedValue: "Missing on retail package",
        requirement: "Mandatory USP declaration for liquid beverages > 200ml",
        status: "FAIL",
        boxId: "BOX-34",
        confidence: 94.2,
        ruleRef: "LMPC-R6-1-USP",
        evidenceSource: "Package Principal Display Panel",
        boundingBox: { top: 86, left: 55, width: 35, height: 8 }
      }
    ],
    crossSource: {
      overallConsistency: 58,
      inconsistenciesCount: 2,
      sources: {
        package: { mrp: "₹25.00", netQty: "250 ml", origin: "India", mfg: "Nimbudi Beverage Corp" },
        pdfSpec: { mrp: "₹25.00", netQty: "250 ml", origin: "India", mfg: "Nimbudi Beverage Corp" },
        ecommerce: { mrp: "₹35.00", netQty: "250 ml", origin: "India", mfg: "Nimbudi Beverage Corp" }
      }
    },
    violations: [
      {
        id: "VIO-001",
        ruleId: "ECOM-LMPC-AMEND-2017",
        ruleProvision: "Rule 18(2) & Rule 6(10)",
        title: "Dual Pricing / E-Commerce Overcharging",
        severity: "Critical",
        detectedText: "Online price ₹35.00 exceeds declared physical package MRP of ₹25.00",
        whyItApplies: "E-Commerce entities are legally prohibited from displaying or selling commodities at a rate higher than the Maximum Retail Price stamped on the physical commodity.",
        evidenceRef: "BOX-31 & E-Com API feed",
        correction: "Update online platform listing price to match official stamped packaging MRP ₹25.00 inclusive of all taxes."
      },
      {
        id: "VIO-002",
        ruleId: "LMPC-R6-1-USP",
        ruleProvision: "Rule 6(1)(f)",
        title: "Missing Unit Sale Price (USP)",
        severity: "High",
        detectedText: "No unit sale price declared alongside MRP",
        whyItApplies: "Effective February 2023, packages containing liquid items exceeding 200 ml must declare the Unit Sale Price in ₹ per ml or ₹ per 100 ml.",
        evidenceRef: "BOX-34",
        correction: "Add mandatory Unit Sale Price declaration: 'Unit Sale Price: ₹0.10 / ml' adjacent to MRP."
      }
    ],
    riskAssessment: {
      level: "High",
      score: 79,
      factors: [
        { label: "Violation Severity (Overcharging)", score: 92, max: 100 },
        { label: "Evidence Confidence", score: 96, max: 100 },
        { label: "Market Consumer Impact", score: 85, max: 100 }
      ]
    },
    passport: null
  },
  {
    id: "prod-005",
    name: "Seoul Glow Sun Cream SPF 50+ (Imported)",
    brand: "Seoul Glow Cosmetics",
    category: "Cosmetics",
    subCategory: "Sun Care",
    isImported: true,
    images: {
      front: "/samples/facewash_front.jpg", // realistic substitute
      back: "/samples/facewash_front.jpg",
      side: "/samples/facewash_front.jpg"
    },
    quality: {
      status: "good",
      score: 91,
      pdpAreaCm2: 130,
      estimatedFontHeightMm: 2.0
    },
    digitalTwin: {
      productName: "Seoul Glow Sun Cream SPF 50+",
      brand: "Seoul Glow",
      category: "Cosmetics",
      subCategory: "Sunscreen",
      manufacturer: "K-Beauty Labs Co Ltd, Gangnam-gu, Seoul, Republic of Korea",
      packer: null,
      importer: "Indo-Pacific Retail Logistics Pvt Ltd, Andheri East, Mumbai - 400069",
      countryOfOrigin: null, // MISSING VIOLATION
      netQuantity: "50 ml",
      netQuantityNumeric: 50,
      netQuantityUnit: "ml",
      mrp: "₹1,299.00",
      mrpNumeric: 1299.0,
      usp: "₹25.98 per ml",
      uspNumeric: 25.98,
      dateOfManufacture: "10/2025",
      expiryDate: "09/2028",
      batchNumber: "KR-SUN-99",
      consumerCare: "support@kbeautyindia.in / 022-68901234",
      ingredientsListDeclared: true,
      fssaiLicense: null,
      cosmeticsMfgLicNo: "COS-IMP-2023-991"
    },
    complianceScore: 54,
    status: "issue",
    breakdown: {
      mandatoryDeclarations: "8 / 10",
      ruleValidation: "11 / 20",
      crossSourceConsistency: "7.0 / 10",
      evidenceConfidence: "94.8%"
    },
    fieldsAudit: [
      {
        field: "Country of Origin",
        detectedValue: "NOT FOUND ON OVERSTICKER LABEL",
        requirement: "Mandatory for all imported goods under Rule 6(8)",
        status: "FAIL",
        boxId: "BOX-51",
        confidence: 98.5,
        ruleRef: "LMPC-R6-8-ORIGIN",
        evidenceSource: "Importer Oversticker Panel",
        boundingBox: { top: 40, left: 20, width: 60, height: 12 }
      },
      {
        field: "Importer Declaration",
        detectedValue: "Indo-Pacific Retail Logistics Pvt Ltd, Mumbai",
        requirement: "Full registered address with pincode",
        status: "PASS",
        boxId: "BOX-52",
        confidence: 96.2,
        ruleRef: "LMPC-R6-1-MFG",
        evidenceSource: "Importer Oversticker Panel",
        boundingBox: { top: 55, left: 18, width: 65, height: 10 }
      },
      {
        field: "MRP Declaration",
        detectedValue: "₹1,299.00",
        requirement: "Inclusive of all taxes",
        status: "PASS",
        boxId: "BOX-53",
        confidence: 97.1,
        ruleRef: "LMPC-R6-1-MRP",
        evidenceSource: "Oversticker Header",
        boundingBox: { top: 22, left: 55, width: 35, height: 8 }
      }
    ],
    crossSource: {
      overallConsistency: 70,
      inconsistenciesCount: 1,
      sources: {
        package: { mrp: "₹1,299.00", netQty: "50 ml", origin: "Missing", mfg: "K-Beauty Labs" },
        pdfSpec: { mrp: "₹1,299.00", netQty: "50 ml", origin: "Republic of Korea", mfg: "K-Beauty Labs" },
        ecommerce: { mrp: "₹1,299.00", netQty: "50 ml", origin: "South Korea", mfg: "K-Beauty Labs" }
      }
    },
    violations: [
      {
        id: "VIO-003",
        ruleId: "LMPC-R6-8-ORIGIN",
        ruleProvision: "Rule 6(8)",
        title: "Missing Country of Origin on Imported Commodity",
        severity: "Critical",
        detectedText: "Country of Origin not detected on physical import label / oversticker",
        whyItApplies: "Under Legal Metrology Rule 6(8), every package containing an imported commodity must explicitly declare the country of origin, manufacture or assembly.",
        evidenceRef: "BOX-51 (Oversticker inspection)",
        correction: "Affix supplementary oversticker containing prominent statement: 'Country of Origin: Republic of Korea'."
      }
    ],
    riskAssessment: {
      level: "Critical",
      score: 86,
      factors: [
        { label: "Import Regulatory Violation", score: 95, max: 100 },
        { label: "Evidence Confidence", score: 98, max: 100 },
        { label: "Customs Clearance Impact", score: 88, max: 100 }
      ]
    },
    passport: null
  },
  {
    id: "prod-006",
    name: "Defective / Low Quality Sample Scan",
    brand: "Unspecified Brand",
    category: "General",
    subCategory: "Unknown",
    isImported: false,
    images: {
      front: "/samples/choki_front.jpg",
      back: null,
      side: null
    },
    quality: {
      status: "poor",
      score: 32,
      reason: "Motion blur and extreme glare prevent OCR text extraction from principal display panel."
    },
    digitalTwin: null,
    complianceScore: null,
    status: "retake_required"
  }
];
