import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  FileText, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Sparkles,
  HelpCircle,
  Scale,
  RefreshCw,
  Eye,
  Play,
  AlertOctagon,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Pill,
  Sparkle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ScanEvidenceViewer from '../../components/ScanEvidenceViewer';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import CameraCaptureModal from '../../components/CameraCaptureModal';

export default function ConsumerCheck() {
  const [searchParams] = useSearchParams();
  const { 
    currentProduct, 
    triggerSampleScan, 
    triggerLiveScan, 
    backendError, 
    setBackendError, 
    mode, 
    selectedProductId, 
    setSelectedProductId,
    sampleProducts = []
  } = useApp();

  const [inputMode, setInputMode] = useState('upload'); // upload | camera | url | sample
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [explainItem, setExplainItem] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // Hidden file inputs
  const imageInputRef = useRef(null);

  const activeProduct = currentProduct;

  // Handle image file selection (shows preview first before analyzing)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
    setInputMode('upload');
  };

  // Clear selected upload file
  const handleClearSelectedFile = () => {
    setSelectedImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Trigger scan of uploaded image to backend POST /api/scan
  const handleAnalyzeUploadedImage = () => {
    if (!selectedImageFile) return;
    triggerLiveScan('images', { 
      files: [selectedImageFile], 
      previewUrl: imagePreviewUrl 
    });
  };

  // Trigger scan of product URL to backend POST /api/scan-url
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    triggerLiveScan('url', { url: urlInput.trim() });
  };

  // Handle capture from camera modal
  const handleCameraComplete = (capturedArray) => {
    if (!capturedArray || capturedArray.length === 0) return;
    const item = capturedArray[0];

    let filesToSend = [];
    if (item.file) {
      filesToSend = [item.file];
    } else if (item.url && item.url.startsWith('data:')) {
      const arr = item.url.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], `camera_scan_${Date.now()}.jpg`, { type: mime });
      filesToSend = [file];
    }

    triggerLiveScan('camera', { 
      files: filesToSend, 
      previewUrl: item.url 
    });
  };

  const getResultBadge = () => {
    const isExpired = activeProduct?.date_validation?.isExpired;
    const score = activeProduct?.compliance_score ?? 98;
    const hasViolations = activeProduct?.violations && activeProduct.violations.length > 0;

    if (isExpired) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border-2 border-rose-300 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">CRITICAL STATUTORY ALERT</div>
            <div className="text-base font-bold leading-tight">✕ EXPIRED COMMODITY</div>
          </div>
        </div>
      );
    }

    if (!hasViolations && score >= 85) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Status Result</div>
            <div className="text-base font-bold leading-tight">✓ VERIFIED COMPLIANT</div>
          </div>
        </div>
      );
    }

    if (hasViolations) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-5 h-5 text-rose-600" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600">Status Result</div>
            <div className="text-base font-bold leading-tight">✕ ISSUE DETECTED ({activeProduct.violations.length})</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Status Result</div>
          <div className="text-base font-bold leading-tight">⚠ REVIEW REQUIRED</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Picker */}
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageFileChange} 
        accept=".jpg,.jpeg,.png,.webp" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Check a Product Label
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              LEGAL METROLOGY (PACKAGED COMMODITIES)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture with camera, upload a packaging photograph, or scan a product URL to verify 10 mandatory declarations.
          </p>
        </div>

        {getResultBadge()}
      </div>

      {/* Backend Connection Error Banner */}
      {backendError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Analysis Server Notice</span>
              <span className="text-amber-700">{backendError}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setBackendError(null);
                if (sampleProducts.length > 0) {
                  triggerSampleScan(sampleProducts[0]);
                }
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition shadow-xs"
            >
              Test with Reference Label
            </button>
            <button
              onClick={() => {
                setBackendError(null);
                if (selectedImageFile) handleAnalyzeUploadedImage();
                else imageInputRef.current?.click();
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition shadow-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Request
            </button>
          </div>
        </div>
      )}

      {/* THREE PRIMARY SCANNING METHODS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Select Scanning Method</span>
          </span>

          {/* 3 Clear Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setInputMode('upload')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                inputMode === 'upload' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-purple-600" />
              Upload Image
            </button>

            <button
              onClick={() => {
                setInputMode('camera');
                setCameraModalOpen(true);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                inputMode === 'camera' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              Scan With Camera
            </button>

            <button
              onClick={() => setInputMode('url')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                inputMode === 'url' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Scan Product URL
            </button>
          </div>
        </div>

        {/* Tab 1: Upload Product Label */}
        {inputMode === 'upload' && (
          <div className="space-y-4">
            {selectedImageFile && imagePreviewUrl ? (
              /* Selected Image Preview with filename and Scan button */
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedImageFile.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {(selectedImageFile.size / 1024).toFixed(1)} KB • {selectedImageFile.type || "image"}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                      Ready for analysis
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelectedFile}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove selected file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyzeUploadedImage}
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze / Scan Label</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone to select file */
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 rounded-xl p-6 text-center transition cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Click to select or drop a product label image
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports .jpg, .jpeg, .png, and .webp formats
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Scan with Camera */}
        {inputMode === 'camera' && (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Live Packaging Camera Scanner
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Scan product packages directly with your device's camera. Snapshot preview and retake options are available.
            </p>
            <button
              type="button"
              onClick={() => setCameraModalOpen(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Live Camera</span>
            </button>
          </div>
        )}

        {/* Tab 3: Scan Product URL */}
        {inputMode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/product"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition shrink-0"
              >
                Scan URL
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste product page URL from Amazon, Flipkart, Blinkit, or direct e-commerce websites.
            </p>
          </form>
        )}

      </div>

      {/* SAMPLE PRODUCT LABELS SHOWCASE (NO standalone "Demo" text) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Test: Verified Reference Packaging Labels</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click any verified package below to simulate immediate 10-field Legal Metrology inspection.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {sampleProducts.length} Reference Commodities
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sampleProducts.map((p) => {
            const isSelected = activeProduct?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => triggerSampleScan(p)}
                className={`group relative p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden border border-slate-100 mb-2 flex items-center justify-center p-1">
                    <img 
                      src={p.image || p.images?.front} 
                      alt={p.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-200" 
                    />
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {p.category === 'food' && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        FSSAI
                      </span>
                    )}
                    {p.category === 'medicine' && (
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        ℞ Drug
                      </span>
                    )}
                    {p.category === 'cosmetics' && (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                        Cosmetic
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-slate-400">
                      {p.net_quantity}
                    </span>
                  </div>

                  <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                    {p.name}
                  </h5>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-900">{p.mrp}</span>
                  <span className="font-semibold text-brand-600 group-hover:underline">
                    Inspect →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Evidence Viewer (Side-by-side permanent layout) */}
      <ScanEvidenceViewer 
        product={activeProduct} 
        onExplainClick={(field) => setExplainItem(field)} 
      />

      {/* Plain Language Summary & Explanation for Consumers */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Consumer Key Checks Summary
              </h3>
              {activeProduct?.regulatory?.fssai_approved && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  FSSAI Approved
                </span>
              )}
              {activeProduct?.regulatory?.drug_license && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                  <Pill className="w-3 h-3" />
                  CDSCO Drug Lic
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Plain-language breakdown of critical purchase factors under Legal Metrology Rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExplainItem({
                field: "MRP & Unit Pricing",
                detectedValue: activeProduct.mrp,
                requirement: "Mandatory MRP & USP under Rule 6(1)(e) & Rule 18",
                ruleRef: "LMPC-R6-1-MRP"
              })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Why?</span>
            </button>
          </div>
        </div>

        {/* 4 Consumer Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-semibold block">Maximum Retail Price</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">
              {activeProduct.mrp || "Not detected"}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Incl. of all taxes</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-semibold block">Net Quantity</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">
              {activeProduct.net_quantity || "Not detected"}
            </span>
            <span className="text-[11px] text-slate-500">Standard SI units</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-semibold block">Dates (Mfg / Expiry)</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
              {activeProduct.manufacturing_date || "—"} / {activeProduct.expiry_date || "—"}
            </span>
            <span className={`text-[11px] font-medium ${activeProduct.date_validation?.isExpired ? 'text-rose-600 font-bold' : 'text-emerald-700'}`}>
              {activeProduct.date_validation?.expStatus || "Date Checked"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-semibold block">Origin &amp; Manufacturer</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
              {activeProduct.country_of_origin || "India"}
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              {activeProduct.brand || activeProduct.manufacturer || "Verified Brand"}
            </span>
          </div>

        </div>

        {/* Consumer Action if issue detected */}
        {activeProduct.violations?.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Attention Required Before Buying ({activeProduct.violations.length} violations detected):
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {activeProduct.violations.map((v, i) => (
                <li key={i}>
                  <strong>{v.field_label || v.field}:</strong> {v.detail} {v.correction && `(${v.correction})`}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Live Camera Stream Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCaptureComplete={handleCameraComplete}
      />

      {/* Horizontal Explainability Modal */}
      <ExplainabilityModal
        isOpen={Boolean(explainItem)}
        onClose={() => setExplainItem(null)}
        fieldOrViolation={explainItem}
        product={activeProduct}
      />

    </div>
  );
}
