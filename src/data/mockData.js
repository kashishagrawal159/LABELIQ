// Mock inspection cases, audit trails, and regulatory alert notifications
export const INSPECTOR_CASES = [
  {
    id: "CASE-2026-881",
    caseNumber: "LM-SZ-2026-0881",
    productId: "prod-004",
    productName: "Nimbudi Refreshing Lemon Drink",
    manufacturer: "Nimbudi Beverage Corp",
    category: "Food",
    violationType: "Dual Pricing & Missing Unit Sale Price",
    severity: "Critical",
    riskScore: 79,
    status: "Under Review",
    assignedOfficer: "R. K. Sharma (Inspector ID: GOV-LM-042)",
    filingDate: "2026-03-09",
    evidenceConfidence: "96.4%",
    evidenceCount: 4,
    notes: "Physical packaging collected from retail shelf in Rajkot market declares MRP ₹25. E-commerce platforms show price of ₹35.",
    history: [
      { step: "Automated Compliance Audit", timestamp: "2026-03-09 10:14 AM", actor: "System AI Engine" },
      { step: "Case Logged & Prioritized", timestamp: "2026-03-09 10:15 AM", actor: "Priority Engine (Score 79/100)" },
      { step: "Officer Review Initiated", timestamp: "2026-03-09 11:30 AM", actor: "Inspector R. K. Sharma" }
    ]
  },
  {
    id: "CASE-2026-882",
    caseNumber: "LM-WZ-2026-0882",
    productId: "prod-005",
    productName: "Seoul Glow Sun Cream SPF 50+ (Imported)",
    manufacturer: "Indo-Pacific Retail Logistics Pvt Ltd (Importer)",
    category: "Cosmetics",
    violationType: "Missing Mandatory Country of Origin",
    severity: "Critical",
    riskScore: 86,
    status: "Notice Issued",
    assignedOfficer: "P. Deshmukh (Inspector ID: GOV-LM-019)",
    filingDate: "2026-03-08",
    evidenceConfidence: "98.5%",
    evidenceCount: 3,
    notes: "Consignment landed at Mumbai Port CFS. Oversticker fails to specify Country of Origin as required by Rule 6(8).",
    history: [
      { step: "Port Inspection Scan", timestamp: "2026-03-08 02:20 PM", actor: "Customs Metrology Liaison" },
      { step: "Violation Verified", timestamp: "2026-03-08 03:00 PM", actor: "Inspector P. Deshmukh" },
      { step: "Statutory Notice Drafted under Section 36", timestamp: "2026-03-08 04:15 PM", actor: "Legal Metrology Portal" }
    ]
  },
  {
    id: "CASE-2026-883",
    caseNumber: "LM-NZ-2026-0883",
    productId: "prod-002",
    productName: "Parachute Advansed Deep Nourish Body Lotion",
    manufacturer: "Marico Limited",
    category: "Cosmetics",
    violationType: "Routine Surveillance Audit",
    severity: "Low",
    riskScore: 14,
    status: "Verified & Closed",
    assignedOfficer: "A. Verma (Inspector ID: GOV-LM-077)",
    filingDate: "2026-03-06",
    evidenceConfidence: "96.4%",
    evidenceCount: 5,
    notes: "Random market surveillance. All mandatory declarations verified and compliant.",
    history: [
      { step: "Surveillance Scan", timestamp: "2026-03-06 09:00 AM", actor: "Field Officer" },
      { step: "Automated Verification", timestamp: "2026-03-06 09:02 AM", actor: "Rule Engine" },
      { step: "Officer Sign-Off Completed", timestamp: "2026-03-06 10:00 AM", actor: "Inspector A. Verma" }
    ]
  }
];

export const REGULATORY_ALERTS = [
  {
    id: "ALERT-2026-01",
    date: "2026-03-01",
    title: "Enforcement Advisory: Mandatory Font Height on PDP",
    authority: "Department of Consumer Affairs, Legal Metrology Division",
    referenceNo: "WM-10(5)/2026-LMPC",
    summary: "Mandatory compliance check across all packaged commodities exceeding 500 cm² PDP area. Numerals must adhere to minimum 4mm height standard.",
    impactCategory: "Packaged Commodity",
    affectedProductsCount: 3,
    status: "Active"
  },
  {
    id: "ALERT-2026-02",
    date: "2026-02-15",
    title: "Standardization of Unit Sale Price (USP) on E-Commerce Platforms",
    authority: "Central Consumer Protection Authority (CCPA)",
    referenceNo: "CCPA/EC/2026/08",
    summary: "E-commerce entities must ensure digital product cards display Unit Sale Price in close proximity to MRP in identical font size.",
    impactCategory: "E-commerce",
    affectedProductsCount: 1,
    status: "Active"
  }
];

export const MANUFACTURER_PRODUCTS = [
  {
    id: "prod-001",
    sku: "DEC-FW-100",
    name: "Deconstruct Hydrating Face Wash",
    category: "Cosmetics",
    lastCheckDate: "2026-03-08",
    status: "Compliant",
    score: 98,
    version: "v2.1",
    issuesCount: 0
  },
  {
    id: "prod-004",
    sku: "NIM-BVR-250",
    name: "Nimbudi Refreshing Lemon Drink",
    category: "Food",
    lastCheckDate: "2026-03-09",
    status: "Action Required",
    score: 68,
    version: "v1.0",
    issuesCount: 2
  }
];
