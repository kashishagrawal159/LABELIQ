import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Play,
  Clock,
  AlertOctagon,
  Trash2,
  ShieldCheck,
  Pill,
  Sparkle
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import LabelVerificationResults from '../components/LabelVerificationResults';
import CameraCaptureModal from '../components/CameraCaptureModal';
import ExplainabilityModal from '../components/ExplainabilityModal';

export default function LabelVerificationPage() {
  const { t } = useTranslation();
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

  const [activeTab, setActiveTab] = useState('upload'); // upload | camera | url | pdf
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [explainItem, setExplainItem] = useState(null);

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const product = currentProduct;

  // Handle uploaded image selection (preview first)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
    setActiveTab('upload');
  };

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

  const handleAnalyzeUploadedImage = () => {
    if (!selectedImageFile) return;
    triggerLiveScan('images', { 
      files: [selectedImageFile], 
      previewUrl: imagePreviewUrl 
    });
  };

  // Handle camera capture complete
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

  // Handle PDF upload
  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    triggerLiveScan('pdf', { file });
    e.target.value = '';
  };

  // Handle URL scanning
  const handleUrlScan = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    triggerLiveScan('url', { url: urlInput.trim() });
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Pickers */}
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageFileChange} 
        accept=".jpg,.jpeg,.png,.webp" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={pdfInputRef} 
        onChange={handlePdfFileChange} 
        accept=".pdf" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Comprehensive Label Verification
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              INTELLIGENCE ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal OCR and Legal Metrology Rule validation across all 10 mandatory packaging declarations.
          </p>
        </div>

        {/* Quick Sample Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Reference:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {sampleProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Backend Error Banner */}
      {backendError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Backend Analysis Server Notice</span>
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
              Test Reference Label
            </button>
          </div>
        </div>
      )}

      {/* THREE PRIMARY SCANNING METHODS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'upload' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => { setActiveTab('camera'); setCameraModalOpen(true); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'camera' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Scan with Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'url' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Scan Product URL</span>
          </button>

          <button
            onClick={() => { setActiveTab('pdf'); pdfInputRef.current?.click(); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
              activeTab === 'pdf' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Upload Artwork PDF</span>
          </button>
        </div>

        {/* Tab 1 Content: Upload Image */}
        {activeTab === 'upload' && (
          <div>
            {selectedImageFile && imagePreviewUrl ? (
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
                      Ready to analyze
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
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyzeUploadedImage}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze / Scan Label</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/20 transition cursor-pointer"
              >
                <Upload className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <span className="text-sm font-bold text-slate-800 block">
                  Click to browse or Drag &amp; Drop package label image
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Supports JPG, JPEG, PNG, and WEBP formats
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Scan with Camera */}
        {activeTab === 'camera' && (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
            <Camera className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              Live Camera Packaging Scanner
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Open live video stream with rear-camera preference on mobile devices. Capture, review preview, retake or confirm.
            </p>
            <button
              onClick={() => setCameraModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Open Live Camera Stream</span>
            </button>
          </div>
        )}

        {/* Tab 3 Content: Scan Product URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlScan} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/product"
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs shrink-0"
            >
              Scan URL
            </button>
          </form>
        )}

        {/* Tab 4 Content: Artwork PDF */}
        {activeTab === 'pdf' && (
          <div 
            onClick={() => pdfInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-amber-300 hover:bg-amber-50/20 transition cursor-pointer"
          >
            <FileText className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <span className="text-sm font-bold text-slate-800 block">
              Click to select Packaging Artwork PDF
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Pre-press print artwork or technical specification sheets (.pdf)
            </span>
          </div>
        )}

      </div>

      {/* REALISTIC SAMPLE PRODUCTS CAROUSEL / GRID (NO STANDALONE DEMO TEXT) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Verified Reference Packaging Dataset</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select any reference commodity across Food (FSSAI), Pharmaceuticals (CDSCO), and Personal Care (BIS).
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {sampleProducts.length} Reference Labels
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sampleProducts.map((p) => {
            const isSelected = product?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => triggerSampleScan(p)}
                className={`group p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden border border-slate-100 mb-2 flex items-center justify-center p-1">
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
                        Cosmetics
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
                    Analyze →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured 10-Field Results */}
      <LabelVerificationResults
        product={product}
        onExplainField={(field) => setExplainItem(field)}
      />

      {/* Camera Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCaptureComplete={handleCameraComplete}
      />

      {/* Explainability Modal */}
      <ExplainabilityModal
        isOpen={Boolean(explainItem)}
        onClose={() => setExplainItem(null)}
        fieldOrViolation={explainItem}
        product={product}
      />

    </div>
  );
}
