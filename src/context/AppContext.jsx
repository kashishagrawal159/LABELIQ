import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { REGULATORY_RULES } from '../data/regulatoryRules';
import { DEMO_RULEBOOK_DATA } from '../data/demoRulebook';
import { REALISTIC_DEMO_PRODUCTS } from '../data/realisticDemoProducts';
import { normalizeProductResponse, runDemoScan, scanPackageImages, scanPackagePdf, scanProductUrl, checkBackendHealth } from '../services/api';
import { saveScanToHistory } from '../services/historyService';
import ScannerProgressModal from '../components/ScannerProgressModal';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Global Mode: 'demo' | 'live'
  const [mode, setMode] = useState('live');
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Initialize with normalized realistic reference product (Amul Milk)
  const [currentProduct, setCurrentProduct] = useState(() => {
    const base = REALISTIC_DEMO_PRODUCTS[0];
    return normalizeProductResponse(base, true, base.image);
  });

  const [products, setProducts] = useState(() => {
    const normSamples = REALISTIC_DEMO_PRODUCTS.map(p => normalizeProductResponse(p, true, p.image));
    return [...normSamples, ...SAMPLE_PRODUCTS];
  });

  const [selectedProductId, setSelectedProductId] = useState(REALISTIC_DEMO_PRODUCTS[0].id);
  const [selectedBoxId, setSelectedBoxId] = useState("manufacturing_date");
  const [activeAngle, setActiveAngle] = useState("front"); // front | back | side
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [activeViolationForExplain, setActiveViolationForExplain] = useState(null);

  // Scanner Progress HUD state
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scannerImagePreview, setScannerImagePreview] = useState(null);
  const [pendingScannedProduct, setPendingScannedProduct] = useState(null);

  // Probe backend on mount
  useEffect(() => {
    checkBackendHealth().then(isUp => {
      setBackendAvailable(isUp);
      if (isUp) setMode('live');
    });
  }, []);

  // Directly select and inspect a product
  const handleSelectProductId = (id) => {
    setSelectedProductId(id);
    const match = products.find(p => p.id === id);
    if (match) {
      const norm = match.product ? match : normalizeProductResponse({
        product: match.digitalTwin?.productName || match.name,
        brand: match.digitalTwin?.brand || match.brand,
        manufacturer: match.digitalTwin?.manufacturer,
        importer: match.digitalTwin?.importer,
        net_quantity: match.digitalTwin?.netQuantity,
        mrp: match.digitalTwin?.mrp,
        country_of_origin: match.digitalTwin?.countryOfOrigin || "India",
        manufacturing_date: match.digitalTwin?.dateOfManufacture || "01/2026",
        expiry_date: match.digitalTwin?.expiryDate || "12/2027",
        consumer_care: match.digitalTwin?.consumerCare
      }, true, match.images?.front || match.image);
      setCurrentProduct(norm);
    }
  };

  /**
   * Triggers the full 8-stage verification pipeline for a specific reference sample
   */
  const triggerSampleScan = (sampleProduct) => {
    setBackendError(null);
    const target = sampleProduct || REALISTIC_DEMO_PRODUCTS[0];
    setScannerImagePreview(target.image);

    const normalized = normalizeProductResponse(target, true, target.image);
    // Keep category and regulatory metadata intact
    normalized.category = target.category || 'general';
    normalized.regulatory = target.regulatory || null;

    setPendingScannedProduct(normalized);
    setScannerModalOpen(true);
  };

  /**
   * Compatibility wrapper for demo scans
   */
  const triggerDemoScan = (sampleType = 'standard') => {
    const sample = sampleType === 'expired' 
      ? {
          ...REALISTIC_DEMO_PRODUCTS[0],
          id: "sample-expired-dairy",
          product: "Pasteurized Full Cream Dairy Milk",
          manufacturing_date: "10/01/2025",
          expiry_date: "17/01/2025" // Passed expiry date
        }
      : REALISTIC_DEMO_PRODUCTS[0];
    triggerSampleScan(sample);
  };

  /**
   * Triggers the real backend Live Scan
   */
  const triggerLiveScan = async (type, payload) => {
    setBackendError(null);
    setScannerImagePreview(payload.previewUrl || null);
    setScannerModalOpen(true);

    try {
      let rawResult;
      if (type === 'camera' || type === 'images') {
        rawResult = await scanPackageImages(payload.files);
      } else if (type === 'pdf') {
        rawResult = await scanPackagePdf(payload.file);
      } else if (type === 'url') {
        rawResult = await scanProductUrl(payload.url);
      } else {
        throw new Error(`Unsupported scan type: ${type}`);
      }

      setMode('live');
      // Use previewUrl if provided
      if (payload.previewUrl && !rawResult.image) {
        rawResult.image = payload.previewUrl;
      }
      setPendingScannedProduct(rawResult);
    } catch (err) {
      console.error("Live Scan Failed:", err);
      setScannerModalOpen(false);
      setBackendError(err.message || "Unable to connect to LABEL IQ analysis server. Please ensure FastAPI backend is running on port 8000.");
    }
  };

  /**
   * Called when Scanner HUD completes all 8 stages
   */
  const handleScannerComplete = () => {
    if (pendingScannedProduct) {
      setCurrentProduct(pendingScannedProduct);
      setSelectedProductId(pendingScannedProduct.id);
      setProducts(prev => [pendingScannedProduct, ...prev.filter(p => p.id !== pendingScannedProduct.id)]);
      
      // Automatically persist every completed scan to localStorage history
      saveScanToHistory(pendingScannedProduct);

      setPendingScannedProduct(null);
    }
    setScannerModalOpen(false);
  };

  /**
   * Load any past scan or external item directly into the active viewer
   */
  const loadProductIntoViewer = (prod) => {
    if (!prod) return;
    const norm = prod.product ? prod : normalizeProductResponse(prod, false, prod.image);
    setCurrentProduct(norm);
    setSelectedProductId(norm.id);
  };

  return (
    <AppContext.Provider value={{
      mode,
      setMode,
      backendAvailable,
      backendError,
      setBackendError,
      products,
      sampleProducts: REALISTIC_DEMO_PRODUCTS,
      selectedProductId,
      setSelectedProductId: handleSelectProductId,
      currentProduct,
      setCurrentProduct,
      loadProductIntoViewer,
      selectedBoxId,
      setSelectedBoxId,
      activeAngle,
      setActiveAngle,
      explainModalOpen,
      setExplainModalOpen,
      activeViolationForExplain,
      setActiveViolationForExplain,
      triggerDemoScan,
      triggerSampleScan,
      triggerLiveScan,
      rules: REGULATORY_RULES,
      demoRules: DEMO_RULEBOOK_DATA
    }}>
      {children}

      {/* Global 8-Stage Scanner Progress Modal */}
      <ScannerProgressModal
        isOpen={scannerModalOpen}
        isDemo={mode === 'demo'}
        imagePreview={scannerImagePreview}
        onComplete={handleScannerComplete}
      />
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
