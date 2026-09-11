import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  Layers,
  Scale
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import ScanEvidenceViewer from '../../components/ScanEvidenceViewer';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import { useNavigate } from 'react-router-dom';

export default function PrePublishChecker() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // 1: Upload, 2: Analyzing, 3: Validation Results
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PRODUCTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [explainField, setExplainField] = useState(null);

  const handleStartAnalysis = (prod) => {
    setSelectedProduct(prod);
    setIsProcessing(true);
    setActiveStep(2);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveStep(3);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Pre-Publish Compliance Checker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit packaging artwork proofs and e-commerce listings before manufacturing print runs.
          </p>
        </div>

        {activeStep === 3 && (
          <button
            onClick={() => setActiveStep(1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Pre-Publish Test</span>
          </button>
        )}
      </div>

      {/* 3 Step Visual Progress Indicator */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className={`flex items-center gap-2 text-xs font-semibold ${activeStep >= 1 ? 'text-purple-700' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep >= 1 ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
            1
          </span>
          <span>Upload Label Artwork</span>
        </div>
        <span className="text-slate-300">→</span>
        <div className={`flex items-center gap-2 text-xs font-semibold ${activeStep >= 2 ? 'text-purple-700' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep >= 2 ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
            2
          </span>
          <span>Regulatory Engine Audit</span>
        </div>
        <span className="text-slate-300">→</span>
        <div className={`flex items-center gap-2 text-xs font-semibold ${activeStep >= 3 ? 'text-purple-700' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep >= 3 ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
            3
          </span>
          <span>Validation & Clearance</span>
        </div>
      </div>

      {/* STEP 1: UPLOAD LABEL ARTWORK */}
      {activeStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Upload Packaging Artwork Proofs
            </h2>
            <p className="text-xs text-slate-500">
              Provide multi-angle packaging artwork (Front, Back, and Side panels) to run complete legal declaration triangulation.
            </p>
          </div>

          {/* 3 Upload Panels: Front, Back, Side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-purple-300 hover:bg-purple-50/20 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px]">
              <Upload className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-xs font-bold text-slate-800">Front Label (PDP)</span>
              <span className="text-[11px] text-slate-400 mt-0.5">MRP, Net Qty, Brand</span>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-purple-300 hover:bg-purple-50/20 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px]">
              <Upload className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-xs font-bold text-slate-800">Back Label (Information)</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Mfg, Ingredients, Contact</span>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-purple-300 hover:bg-purple-50/20 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px]">
              <Upload className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-xs font-bold text-slate-800">Side Panel / Nutrition</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Batch Code, USP, Expiry</span>
            </div>
          </div>

          {/* Instant Sample Selectors for Demo */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-3 text-center">
              Or run instant demo test on prepared pre-market artwork:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => handleStartAnalysis(SAMPLE_PRODUCTS[0])}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/60 hover:bg-emerald-50/30 text-left transition flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Deconstruct Hydrating Face Wash</div>
                  <div className="text-[11px] text-slate-500">Fully Compliant Artwork (Score 98)</div>
                </div>
              </button>

              <button
                onClick={() => handleStartAnalysis(SAMPLE_PRODUCTS[3])}
                className="p-4 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50/60 hover:bg-rose-50/30 text-left transition flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Nimbudi Refreshing Lemon Drink</div>
                  <div className="text-[11px] text-rose-600 font-semibold">Flagged Artwork (Score 68)</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING STATE */}
      {activeStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto"></div>
          <h2 className="text-base font-bold text-slate-900">
            Analyzing Packaging Declarations...
          </h2>
          <div className="text-xs text-slate-500 space-y-1">
            <p>✓ Multimodal OCR completed</p>
            <p>✓ Principal Display Panel measured (145 cm²)</p>
            <p>✓ Cross-referencing Legal Metrology (Packaged Commodities) Rules...</p>
          </div>
        </div>
      )}

      {/* STEP 3: AUDIT RESULT */}
      {activeStep === 3 && (
        <div className="space-y-6">
          
          {/* Top Score & Decision Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pre-Publish Validation Outcome
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-slate-600">
                {selectedProduct.violations?.length === 0
                  ? "All mandatory statutory declarations passed. Artwork cleared for print run."
                  : `${selectedProduct.violations.length} critical compliance issues require rectification before publishing.`}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Compliance Score
                </span>
                <span className={`text-3xl font-black ${selectedProduct.complianceScore > 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedProduct.complianceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>

              {selectedProduct.violations?.length > 0 && (
                <button
                  onClick={() => navigate('/manufacturer/fix-recheck')}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Fix & Recheck</span>
                </button>
              )}
            </div>
          </div>

          {/* Evidence View with Horizontal Layout */}
          <ScanEvidenceViewer
            product={selectedProduct}
            onExplainClick={(field) => setExplainField(field)}
          />

          {/* Explainability Modal */}
          <ExplainabilityModal
            isOpen={Boolean(explainField)}
            onClose={() => setExplainField(null)}
            fieldOrViolation={explainField}
            product={selectedProduct}
          />

        </div>
      )}

    </div>
  );
}
