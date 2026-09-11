/**
 * History Service for LABEL IQ
 * Stores and manages scanned commodities in localStorage
 * Persists across page refresh and navigation.
 */

const STORAGE_KEY = 'labeliq_scan_history';

/**
 * Retrieve all scans from localStorage
 * @returns {Array} Array of scan records sorted by newest first
 */
export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load scan history from localStorage:", err);
    return [];
  }
}

/**
 * Save a completed scan to history
 * @param {Object} product - Normalized product object
 * @returns {Object} The saved history entry
 */
export function saveScanToHistory(product) {
  if (!product) return null;

  try {
    const history = getScanHistory();

    // Determine category if not explicitly given
    let category = product.category || 'general';
    if (!product.category) {
      if (product.regulatory?.fssai_approved || product.evidence?.product?.toLowerCase().includes('milk') || product.evidence?.product?.toLowerCase().includes('cookie') || product.product?.toLowerCase().includes('milk') || product.product?.toLowerCase().includes('cookie') || product.product?.toLowerCase().includes('tea') || product.product?.toLowerCase().includes('food')) {
        category = 'food';
      } else if (product.regulatory?.drug_license || product.product?.toLowerCase().includes('tablet') || product.product?.toLowerCase().includes('paracetamol') || product.product?.toLowerCase().includes('cetirizine')) {
        category = 'medicine';
      } else if (product.regulatory?.cosmetic_license || product.product?.toLowerCase().includes('wash') || product.product?.toLowerCase().includes('lotion')) {
        category = 'cosmetics';
      }
    }

    const isExpired = Boolean(product.date_validation?.isExpired);
    const hasViolations = Boolean(product.violations && product.violations.length > 0);
    const score = product.compliance_score !== undefined ? product.compliance_score : 95;

    const entry = {
      id: product.id || `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      verification_id: product.verification_id || `LMPC-VRF-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: product.timestamp || new Date().toISOString(),
      name: product.product || product.name || "Packaged Commodity",
      brand: product.brand || "Not detected",
      category: category,
      categoryLabel: category === 'food' ? 'Food & Beverage' : category === 'medicine' ? 'Pharmaceutical' : category === 'cosmetics' ? 'Personal Care' : 'Packaged Goods',
      image: product.image || "/samples/facewash_front.jpg",
      
      // The 10 Mandatory Declarations
      product: product.product || product.name || "Not detected",
      manufacturer: product.manufacturer || "Not detected",
      importer: product.importer || "Domestic (Not Applicable)",
      net_quantity: product.net_quantity || "Not detected",
      mrp: product.mrp || "Not detected",
      country_of_origin: product.country_of_origin || "India",
      manufacturing_date: product.manufacturing_date || "Not detected",
      expiry_date: product.expiry_date || "Not detected",
      consumer_care: product.consumer_care || "Not detected",

      // Compliance Verdict
      compliance_score: score,
      risk_level: product.risk_level || (isExpired ? 'CRITICAL' : (hasViolations ? 'MEDIUM' : 'LOW')),
      status: isExpired ? 'EXPIRED' : (hasViolations ? 'ISSUE DETECTED' : 'VERIFIED COMPLIANT'),
      isExpired: isExpired,
      violations_count: product.violations?.length || 0,
      violations: product.violations || [],
      regulatory: product.regulatory || null,
      fullProduct: product
    };

    // Filter out duplicate if saved in the same second
    const updated = [entry, ...history.filter(h => h.id !== entry.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch event for reactive listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('labeliq:history-updated', { detail: entry }));
    }

    return entry;
  } catch (err) {
    console.error("Failed to save scan to localStorage history:", err);
    return null;
  }
}

/**
 * Remove an item from history
 * @param {string} id 
 */
export function deleteHistoryItem(id) {
  try {
    const history = getScanHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('labeliq:history-updated', { detail: { deletedId: id } }));
    }
  } catch (err) {
    console.error("Failed to delete history item:", err);
  }
}

/**
 * Clear all history
 */
export function clearScanHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('labeliq:history-updated', { detail: { cleared: true } }));
    }
  } catch (err) {
    console.error("Failed to clear scan history:", err);
  }
}

/**
 * Retrieve a specific product from history
 * @param {string} id 
 */
export function getHistoryItemById(id) {
  const history = getScanHistory();
  return history.find(item => item.id === id) || null;
}
