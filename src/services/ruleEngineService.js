/**
 * Dynamic Legal Metrology Rule Engine & Compliance Analyzer
 * Evaluates the 10 canonical fields against the Demo Rulebook & Date rules.
 */
import { DEMO_RULEBOOK_DATA } from '../data/demoRulebook';
import { validatePackageDates } from './dateValidator';

/**
 * Runs full compliance audit on the 10 canonical product fields.
 * @param {Object} fields - Product declarations with canonical keys
 * @returns {Object} Full compliance verdict, score, violations, and risk priority
 */
export function evaluateCompliance(fields) {
  const data = fields || {};

  // 1. Run Date Validation
  const dateValidation = validatePackageDates(
    data.manufacturing_date,
    data.expiry_date
  );

  const ruleResults = [];
  const violations = [];
  let applicableCount = 0;
  let passedCount = 0;
  let missingCount = 0;

  // Evaluate each demo rule
  DEMO_RULEBOOK_DATA.forEach(rule => {
    const rawVal = data[rule.field];
    const val = (rawVal !== undefined && rawVal !== null) ? String(rawVal).trim() : '';

    let status = 'PASS';
    let detail = '';
    let correction = null;

    switch (rule.field) {
      case 'product':
        if (!val || val === 'null') {
          status = 'FAIL';
          detail = 'Product name not detected on principal display panel.';
          correction = 'Print standard generic name on front label.';
        } else {
          detail = `Detected: "${val}"`;
        }
        break;

      case 'brand':
        if (!val || val === 'null') {
          status = 'FAIL';
          detail = 'Brand name missing or illegible.';
          correction = 'Ensure brand name/trademark is prominently declared.';
        } else {
          detail = `Detected: "${val}"`;
        }
        break;

      case 'manufacturer':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'FAIL';
          detail = 'Manufacturer / packer legal name & complete address missing.';
          correction = 'Provide full manufacturing entity name, address, and 6-digit PIN code.';
        } else {
          detail = `Detected: "${val}"`;
        }
        break;

      case 'importer':
        // Importer is mandatory if product is imported, or if country of origin is non-India
        const isImported = data.country_of_origin && 
          !['india', 'bharat'].includes(data.country_of_origin.toLowerCase().trim());
        
        if (isImported) {
          if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
            status = 'FAIL';
            detail = 'Mandatory Indian Importer declaration missing for imported commodity.';
            correction = 'Affix oversticker declaring importer name, address, and registration.';
          } else {
            detail = `Imported Commodity — Declared Importer: "${val}"`;
          }
        } else {
          status = 'NOT_APPLICABLE';
          detail = 'Domestic commodity — Importer declaration not required.';
        }
        break;

      case 'net_quantity':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'FAIL';
          detail = 'Net quantity missing or illegible on package.';
          correction = 'Declare net quantity with standard SI metric units (e.g., g, kg, ml, l).';
        } else {
          // Check for valid metric unit
          const hasMetric = /(?:g|kg|ml|l|ltr|litre|gram|piece|pc|count|units?|m|cm)/i.test(val);
          if (!hasMetric) {
            status = 'FAIL';
            detail = `Net quantity "${val}" uses non-standard measurement units.`;
            correction = 'Use standard SI metric symbols without non-standard qualifiers.';
          } else {
            detail = `Declared: "${val}" (Standard Metric)`;
          }
        }
        break;

      case 'mrp':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'FAIL';
          detail = 'Maximum Retail Price (MRP) missing on Principal Display Panel.';
          correction = 'Print Maximum Retail Price inclusive of all taxes.';
        } else {
          const hasCurrency = /(?:₹|rs\.?|inr)/i.test(val);
          const hasNumeric = /\d+/.test(val);
          if (!hasNumeric) {
            status = 'FAIL';
            detail = `MRP value "${val}" does not contain a valid price figure.`;
            correction = 'Ensure numeric price value is stamped clearly.';
          } else {
            detail = `Declared: "${val}" (Inclusive of all taxes)`;
          }
        }
        break;

      case 'country_of_origin':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected') || val.toLowerCase().includes('not stated')) {
          // Check if imported
          const mightBeImport = data.importer && !data.importer.toLowerCase().includes('domestic');
          if (mightBeImport) {
            status = 'FAIL';
            detail = 'Country of origin missing on imported commodity label.';
            correction = 'Declare explicit Country of Origin (Rule 6(8)).';
          } else {
            status = 'WARNING';
            detail = 'Country of origin not explicitly printed on physical label.';
            correction = 'Add Country of Origin declaration for regulatory completeness.';
          }
        } else {
          detail = `Declared: "${val}"`;
        }
        break;

      case 'manufacturing_date':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'FAIL';
          detail = 'Manufacturing / Packing date not detected.';
          correction = 'Print month and year of manufacture or packing clearly.';
        } else if (dateValidation.status === 'future_mfg') {
          status = 'FAIL';
          detail = 'Manufacturing date is in the future relative to calendar today.';
          correction = 'Ensure correct calendar date is printed on batch stamp.';
        } else if (dateValidation.status === 'invalid_sequence') {
          status = 'FAIL';
          detail = 'Manufacturing date is later than expiry date (sequence violation).';
          correction = 'Correct inverted date labels or stamp order.';
        } else {
          detail = `Declared: "${val}" (Verified Sequence)`;
        }
        break;

      case 'expiry_date':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'FAIL';
          detail = 'Expiry Date / Best Before not detected.';
          correction = 'Print Best Before / Expiry date for consumer safety.';
        } else if (dateValidation.isExpired) {
          status = 'FAIL';
          detail = dateValidation.message;
          correction = 'Withdraw batch from sale immediately — product has expired.';
        } else if (dateValidation.status === 'invalid_sequence') {
          status = 'FAIL';
          detail = 'Expiry date precedes manufacturing date.';
          correction = 'Fix batch date stamping sequence.';
        } else {
          detail = `Declared: "${val}" (${dateValidation.expStatus})`;
        }
        break;

      case 'consumer_care':
        if (!val || val === 'null' || val.toLowerCase().includes('not detected')) {
          status = 'WARNING';
          detail = 'Consumer grievance redressal contact not detected.';
          correction = 'Print grievance email, toll-free number, and nodal address.';
        } else {
          detail = `Declared: "${val}"`;
        }
        break;

      default:
        detail = val || 'Not detected';
    }

    if (status !== 'NOT_APPLICABLE') {
      applicableCount++;
      if (status === 'PASS') {
        passedCount++;
      } else {
        if (!val || val.toLowerCase().includes('not detected')) {
          missingCount++;
        }
        violations.push({
          rule_id: rule.rule_id,
          field: rule.field,
          field_label: rule.field_label,
          severity: rule.severity,
          requirement: rule.requirement,
          detail: detail,
          correction: correction || rule.description,
          source: rule.source
        });
      }
    }

    ruleResults.push({
      rule_id: rule.rule_id,
      field: rule.field,
      field_label: rule.field_label,
      requirement: rule.requirement,
      value: val || 'Not detected',
      status: status,
      severity: rule.severity,
      source: rule.source,
      detail: detail,
      correction: correction
    });
  });

  // Calculate Compliance Score (0-100%)
  const complianceScore = applicableCount > 0 
    ? Math.round((passedCount / applicableCount) * 100)
    : 0;

  // Determine Risk Level (CRITICAL, HIGH, MEDIUM, LOW)
  let riskLevel = 'LOW';
  const hasCritical = violations.some(v => v.severity === 'CRITICAL');
  const hasHigh = violations.some(v => v.severity === 'HIGH');
  const hasMedium = violations.some(v => v.severity === 'MEDIUM');

  if (dateValidation.isExpired || hasCritical) {
    riskLevel = 'CRITICAL';
  } else if (hasHigh || dateValidation.status === 'invalid_sequence') {
    riskLevel = 'HIGH';
  } else if (hasMedium || violations.length > 0) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // Generate headline verdict
  let verdictLabel = 'COMPLIANT';
  let headline = '✓ COMPLIANT — All mandatory Legal Metrology declarations verified.';

  if (dateValidation.isExpired) {
    verdictLabel = 'NON-COMPLIANT';
    headline = '❌ CRITICAL VIOLATION — Expired product detected on shelf.';
  } else if (violations.length > 0) {
    verdictLabel = 'NON-COMPLIANT';
    headline = `❌ NON-COMPLIANT — ${violations.length} regulatory violation(s) detected.`;
  }

  return {
    compliance_score: complianceScore,
    risk_level: riskLevel,
    verdict_label: verdictLabel,
    headline: headline,
    violations: violations,
    missing_count: missingCount,
    rule_results: ruleResults,
    date_validation: dateValidation
  };
}

/**
 * Builds 3-way Cross-Source Triangulation Matrix
 */
export function buildCrossSourceMatrix(physicalTwin, specData = {}, ecommData = {}) {
  const canonicalFields = [
    { key: 'product', label: 'Product Name' },
    { key: 'brand', label: 'Brand Name' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'importer', label: 'Importer' },
    { key: 'net_quantity', label: 'Net Quantity' },
    { key: 'mrp', label: 'Maximum Retail Price' },
    { key: 'country_of_origin', label: 'Country of Origin' },
    { key: 'manufacturing_date', label: 'Manufacturing Date' },
    { key: 'expiry_date', label: 'Expiry Date / Best Before' },
    { key: 'consumer_care', label: 'Consumer Care' }
  ];

  return canonicalFields.map(item => {
    const phys = physicalTwin[item.key] || 'Not detected';
    const spec = specData[item.key] || phys;
    const ecomm = ecommData[item.key] || (item.key === 'mrp' ? phys : 'Listed on Marketplace');

    const isMatch = (phys !== 'Not detected') && (phys.toLowerCase() === spec.toLowerCase());
    const isEcommMatch = (phys !== 'Not detected') && (ecomm !== 'Not detected');

    let status = 'Consistent';
    if (phys === 'Not detected') {
      status = 'Missing on Package';
    } else if (item.key === 'mrp' && ecommData.mrp && phys !== ecommData.mrp) {
      status = 'Price Conflict (Overcharge)';
    } else if (!isMatch) {
      status = 'Spec Discrepancy';
    }

    return {
      field: item.label,
      canonicalKey: item.key,
      physical: phys,
      specification: spec,
      ecommerce: ecomm,
      status: status,
      isConsistent: status === 'Consistent'
    };
  });
}
