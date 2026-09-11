// ==============================================================================
// LABEL IQ — DEMO RULEBOOK DATASET (REGULATORY INTELLIGENCE)
// ⚠️ CLASSIFICATION: DEMO / SAMPLE DATA ONLY
// NOTE: This is demonstration rule data for platform evaluation and mock auditing.
// Do not present demo rules as verified official legal requirements.
// ==============================================================================

export const DEMO_RULEBOOK_DATA = [
  {
    rule_id: "DEMO-RULE-001",
    field: "product",
    field_label: "Product Name",
    requirement: "Must be present on Principal Display Panel (PDP)",
    validation: "Non-empty generic or common product name",
    severity: "CRITICAL",
    source: "LMPC Rule 6(1)(a) [Demo Mock]",
    status: "Active (Demo)",
    description: "Every packaged commodity must declare the generic name or commodity designation prominently on the principal display panel."
  },
  {
    rule_id: "DEMO-RULE-002",
    field: "brand",
    field_label: "Brand Name",
    requirement: "Must be present on the packaging",
    validation: "Registered brand name or trade name must be legible",
    severity: "HIGH",
    source: "LMPC Rule 6(1) [Demo Mock]",
    status: "Active (Demo)",
    description: "The brand name or trade mark of the manufacturer/marketer must be clearly legible on the packaging."
  },
  {
    rule_id: "DEMO-RULE-003",
    field: "manufacturer",
    field_label: "Manufacturer Details",
    requirement: "Must be present with full legal address and postal pincode",
    validation: "Entity name, street, city, state, and 6-digit PIN code",
    severity: "CRITICAL",
    source: "LMPC Rule 6(1)(a) [Demo Mock]",
    status: "Active (Demo)",
    description: "Complete physical address and legal entity name of the manufacturer or packer must be stated."
  },
  {
    rule_id: "DEMO-RULE-004",
    field: "importer",
    field_label: "Importer Declaration",
    requirement: "Must be present where applicable (mandatory for imported goods)",
    validation: "Name and address of importer on oversticker / package if commodity is imported",
    severity: "HIGH",
    source: "LMPC Rule 6(8) [Demo Mock]",
    status: "Conditional (Demo)",
    description: "For imported goods, the name, address, and registration of the Indian importer must be declared."
  },
  {
    rule_id: "DEMO-RULE-005",
    field: "net_quantity",
    field_label: "Net Quantity",
    requirement: "Must be detected and contain a valid SI quantity and metric unit",
    validation: "Positive numeric value with standard SI metric unit (g, kg, ml, l, m, or count)",
    severity: "CRITICAL",
    source: "LMPC Rule 6(1)(d) & Rule 7 [Demo Mock]",
    status: "Active (Demo)",
    description: "Net quantity in standard metric units without non-standard qualifiers like 'gross weight'."
  },
  {
    rule_id: "DEMO-RULE-006",
    field: "mrp",
    field_label: "Maximum Retail Price (MRP)",
    requirement: "Must be detected and contain a valid price format inclusive of all taxes",
    validation: "Valid currency symbol (₹ / Rs.), numeric amount, and 'incl. of all taxes' clause",
    severity: "CRITICAL",
    source: "LMPC Rule 6(1)(e) & Rule 18 [Demo Mock]",
    status: "Active (Demo)",
    description: "The Maximum Retail Price (MRP) must be clearly printed inclusive of all statutory taxes."
  },
  {
    rule_id: "DEMO-RULE-007",
    field: "country_of_origin",
    field_label: "Country of Origin",
    requirement: "Must be detected where applicable (mandatory for imported commodities and e-commerce)",
    validation: "Recognized country name (e.g., India, USA, Germany, China)",
    severity: "HIGH",
    source: "LMPC Rule 6(8) [Demo Mock]",
    status: "Active (Demo)",
    description: "Declaration of country of manufacture or assembly is required on imported goods and e-commerce listings."
  },
  {
    rule_id: "DEMO-RULE-008",
    field: "manufacturing_date",
    field_label: "Manufacturing Date",
    requirement: "Must be detected when applicable (Month/Year or Day/Month/Year)",
    validation: "Valid calendar date; must not be in the future; must precede expiry date",
    severity: "HIGH",
    source: "LMPC Rule 6(1)(d) [Demo Mock]",
    status: "Active (Demo)",
    description: "The month and year of manufacture or packing must be explicitly declared on the package."
  },
  {
    rule_id: "DEMO-RULE-009",
    field: "expiry_date",
    field_label: "Expiry Date / Best Before",
    requirement: "Must be detected when applicable (perishables, cosmetics, medicine, FMCG)",
    validation: "Valid calendar date or derived shelf life; current date must be before expiry date",
    severity: "CRITICAL",
    source: "LMPC Rule 6(1) & Food Safety / Cosmetics Rules [Demo Mock]",
    status: "Active (Demo)",
    description: "Best before / expiry date indicating the shelf life. Products sold after this date are non-compliant."
  },
  {
    rule_id: "DEMO-RULE-010",
    field: "consumer_care",
    field_label: "Consumer Care Details",
    requirement: "Must be detected where applicable with reachable contact channels",
    validation: "Valid grievance email, toll-free telephone helpline, or physical address",
    severity: "MEDIUM",
    source: "LMPC Rule 6(1)(b) [Demo Mock]",
    status: "Active (Demo)",
    description: "Name, address, phone number and email of the consumer grievance redressal officer."
  }
];
