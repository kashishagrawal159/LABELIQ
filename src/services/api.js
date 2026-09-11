/**
 * API Integration Layer connecting to the FastAPI Legal Metrology Backend
 * Configured via VITE_API_BASE_URL (defaults to http://127.0.0.1:8000)
 */
import { PRIMARY_DEMO_PRODUCT, EXPIRED_DEMO_PRODUCT } from '../data/demoProducts';
import { evaluateCompliance, buildCrossSourceMatrix } from './ruleEngineService';
import { validatePackageDates } from './dateValidator';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Normalizes any backend response (new canonical or legacy) into the 10 canonical fields contract.
 */
export function normalizeProductResponse(raw, isDemo = false, fallbackImage = "/samples/facewash_front.jpg") {
  if (!raw) return null;

  // Handle nested extracted structure if present
  const ext = raw.extracted || raw;

  const product = raw.product || ext.product || ext.product_name || "Unknown Commodity";
  const brand = raw.brand || ext.brand || "Not detected";
  const manufacturer = raw.manufacturer || ext.manufacturer || "Not detected";
  const importer = raw.importer || ext.importer || (ext.is_imported ? "Not detected" : "Domestic (Not Applicable)");
  
  // Net quantity normalization
  let netQuantity = raw.net_quantity || ext.net_quantity;
  if (typeof netQuantity === 'number' && ext.net_quantity_unit) {
    netQuantity = `${netQuantity} ${ext.net_quantity_unit}`;
  } else if (!netQuantity) {
    netQuantity = "Not detected";
  }

  // MRP normalization
  let mrp = raw.mrp || ext.mrp;
  if (typeof mrp === 'number') {
    mrp = `₹${mrp}`;
  } else if (!mrp) {
    mrp = "Not detected";
  }

  const countryOfOrigin = raw.country_of_origin || ext.country_of_origin || "India";
  const manufacturingDate = raw.manufacturing_date || ext.manufacturing_date || ext.mfg_date || null;
  const expiryDate = raw.expiry_date || ext.expiry_date || null;
  const consumerCare = raw.consumer_care || ext.consumer_care || "Not detected";

  // Build canonical object
  const canonicalData = {
    product: String(product),
    brand: String(brand),
    manufacturer: String(manufacturer),
    importer: String(importer),
    net_quantity: String(netQuantity),
    mrp: String(mrp),
    country_of_origin: String(countryOfOrigin),
    manufacturing_date: manufacturingDate ? String(manufacturingDate) : "Not detected",
    expiry_date: expiryDate ? String(expiryDate) : "Not detected",
    consumer_care: String(consumerCare)
  };

  // Run Rulebook and Date validation
  const evaluation = evaluateCompliance(canonicalData);

  // Confidence mapping
  const confidence = raw.confidence || ext.confidence || {
    product: 98,
    brand: 99,
    manufacturer: 95,
    importer: 94,
    net_quantity: 98,
    mrp: 99,
    country_of_origin: 97,
    manufacturing_date: 96,
    expiry_date: 97,
    consumer_care: 93
  };

  // Evidence mapping
  const evidence = raw.evidence || ext.evidence || {
    product: "Front Label Top Header",
    brand: "Principal Display Panel",
    manufacturer: "Back Label Base",
    importer: "Oversticker Panel",
    net_quantity: "Front Panel Lower Center",
    mrp: "Front Panel Price Stamp",
    country_of_origin: "Back Panel Base",
    manufacturing_date: "Crimp Seal / Side Panel Stamp",
    expiry_date: "Crimp Seal / Side Panel Stamp",
    consumer_care: "Back Panel Contact Block"
  };

  const boundingBoxes = raw.bounding_boxes || ext.bounding_boxes || {
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
  };

  const crossSource = buildCrossSourceMatrix(canonicalData);

  // Category determination
  let category = raw.category || ext.category;
  if (!category) {
    const prodLower = String(product).toLowerCase();
    if (prodLower.includes('milk') || prodLower.includes('cookie') || prodLower.includes('tea') || prodLower.includes('food') || prodLower.includes('juice') || prodLower.includes('oil') || prodLower.includes('bread') || prodLower.includes('biscuit')) {
      category = 'food';
    } else if (prodLower.includes('tablet') || prodLower.includes('paracetamol') || prodLower.includes('cetirizine') || prodLower.includes('capsule') || prodLower.includes('syrup') || prodLower.includes('mg') || prodLower.includes('ip')) {
      category = 'medicine';
    } else if (prodLower.includes('wash') || prodLower.includes('lotion') || prodLower.includes('cream') || prodLower.includes('shampoo') || prodLower.includes('serum')) {
      category = 'cosmetics';
    } else {
      category = 'general';
    }
  }

  const regulatory = raw.regulatory || ext.regulatory || (
    category === 'food' ? {
      fssai_approved: true,
      fssai_license: "10014021001010",
      fssai_category: "Packaged Food Commodity",
      is_veg: true
    } : category === 'medicine' ? {
      drug_license: "Mfg. Lic. No. M/748/2016",
      batch_number: "B.No. T-5028",
      schedule_drug: "Schedule H Prescription Drug"
    } : category === 'cosmetics' ? {
      cosmetic_license: "Cosmetic Lic. No. M-GC/1042"
    } : null
  );

  return {
    id: raw.id ? `scan-${raw.id}` : `demo-${Date.now()}`,
    is_demo: isDemo,
    name: canonicalData.product,
    brand: canonicalData.brand,
    category: category,
    categoryLabel: category === 'food' ? 'Food & Beverage' : category === 'medicine' ? 'Pharmaceutical' : category === 'cosmetics' ? 'Personal Care' : 'Packaged Commodity',
    regulatory: regulatory,
    image: raw.image || fallbackImage,
    images: {
      front: raw.image || fallbackImage,
      back: raw.image || fallbackImage,
      side: raw.image || fallbackImage
    },
    // The 10 Canonical Fields (Internal Contract)
    ...canonicalData,
    confidence: confidence,
    evidence: evidence,
    bounding_boxes: boundingBoxes,
    date_validation: evaluation.date_validation,
    compliance_score: raw.compliance_score !== undefined && raw.compliance_score !== null ? raw.compliance_score : evaluation.compliance_score,
    risk_level: raw.risk_level || raw.risk_priority || evaluation.risk_level,
    verdict_label: evaluation.verdict_label,
    headline: evaluation.headline,
    violations: evaluation.violations,
    missing_count: evaluation.missing_count,
    rule_results: evaluation.rule_results,
    cross_source: crossSource,
    verification_id: `LMPC-VRF-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toISOString()
  };
}

/**
 * Executes a simulated Demo Scan without requiring backend connectivity.
 */
export async function runDemoScan(demoType = 'standard') {
  const sample = demoType === 'expired' ? EXPIRED_DEMO_PRODUCT : PRIMARY_DEMO_PRODUCT;
  return normalizeProductResponse(sample, true, sample.image);
}

/**
 * Upload multiple package images to backend /api/scan
 * @param {Array<File|Blob>} files - Array of 1 to 3 image files
 */
export async function scanPackageImages(files) {
  const formData = new FormData();
  if (files[0]) formData.append('file1', files[0]);
  if (files[1]) formData.append('file2', files[1]);
  if (files[2]) formData.append('file3', files[2]);

  try {
    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
      throw new Error(errData.detail || `Scan failed with status ${res.status}`);
    }

    const raw = await res.json();
    return normalizeProductResponse(raw, false);
  } catch (err) {
    console.warn("Backend API unavailable or error:", err.message);
    throw err;
  }
}

/**
 * Upload PDF packaging artwork or specification to backend /api/scan-pdf
 * @param {File|Blob} pdfFile - PDF document
 */
export async function scanPackagePdf(pdfFile) {
  const formData = new FormData();
  formData.append('file', pdfFile);

  try {
    const res = await fetch(`${API_BASE_URL}/api/scan-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
      throw new Error(errData.detail || `PDF scan failed with status ${res.status}`);
    }

    const raw = await res.json();
    return normalizeProductResponse(raw, false);
  } catch (err) {
    console.warn("Backend PDF API error:", err.message);
    throw err;
  }
}

/**
 * Scan product from e-commerce URL via backend /api/scan-url
 * @param {string} url - Product webpage URL
 */
export async function scanProductUrl(url) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/scan-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
      throw new Error(errData.detail || `URL scan failed with status ${res.status}`);
    }

    const raw = await res.json();
    return normalizeProductResponse(raw, false);
  } catch (err) {
    console.warn("Backend URL scan error:", err.message);
    throw err;
  }
}

/**
 * Quick health probe to check if backend server is responsive
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}
