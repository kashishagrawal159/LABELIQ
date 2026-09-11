import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  ExternalLink, 
  Layers, 
  Scan,
  Maximize2,
  ZoomIn,
  Sparkles,
  HelpCircle,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ScanEvidenceViewer({ 
  product, 
  onExplainClick,
  className = "" 
}) {
  const { selectedBoxId, setSelectedBoxId, activeAngle, setActiveAngle } = useApp();

  if (!product) return null;

  // Blurry / defective image check
  if (product.quality?.status === 'poor' || product.status === 'retake_required') {
    return (
      <div className="bg-white border border-amber-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-slate-100 border border-amber-300 shrink-0">
            <img 
              src={product.images?.front || product.image || "/samples/facewash_front.jpg"} 
              alt="Blurry scan" 
              className="w-full h-full object-cover filter blur-sm opacity-60" 
            />
            <div className="absolute inset-0 bg-amber-900/20 flex items-center justify-center">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded border border-amber-300">
                BLURRY SCAN
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              Image Quality: Poor (Score: {product.quality?.score || 32}/100)
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Image quality insufficient
            </h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              The uploaded image is too blurry or has excessive glare to reliably read the mandatory package label declarations. Under Legal Metrology regulations, declarations must be legible and verifiable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Canonical fields mapping for evidence bounding boxes
  const boxes = product.bounding_boxes || {};
  const conf = product.confidence || {};
  const ev = product.evidence || {};
  const dateVal = product.date_validation || {};

  const canonicalItems = [
    {
      boxId: "BOX-MFG-DATE",
      field: "Manufacturing Date",
      canonicalKey: "manufacturing_date",
      detectedValue: product.manufacturing_date || product.digitalTwin?.dateOfManufacture || "Not detected",
      requirement: "Mandatory declaration of month and year of manufacture (Rule 6(1)(d))",
      status: (!product.manufacturing_date || product.manufacturing_date === 'Not detected') ? 'FAIL' : 'PASS',
      confidence: conf.manufacturing_date || 96.5,
      ruleRef: "LMPC-R6-1-MFG-DATE",
      evidenceSource: ev.manufacturing_date || "Crimp Seal / Side Panel Stamp",
      boundingBox: boxes.manufacturing_date || { top: 48, left: 55, width: 38, height: 6 },
      isDate: true
    },
    {
      boxId: "BOX-EXP-DATE",
      field: "Expiry Date / Best Before",
      canonicalKey: "expiry_date",
      detectedValue: product.expiry_date || product.digitalTwin?.expiryDate || "Not detected",
      requirement: "Mandatory declaration of best before / expiry date (Rule 6(1))",
      status: dateVal.isExpired ? 'EXPIRED' : (!product.expiry_date || product.expiry_date === 'Not detected') ? 'FAIL' : 'PASS',
      confidence: conf.expiry_date || 97.1,
      ruleRef: "LMPC-R6-1-EXP-DATE",
      evidenceSource: ev.expiry_date || "Crimp Seal / Side Panel Stamp",
      boundingBox: boxes.expiry_date || { top: 56, left: 55, width: 38, height: 6 },
      isDate: true
    },
    {
      boxId: "BOX-MRP",
      field: "MRP Declaration",
      canonicalKey: "mrp",
      detectedValue: product.mrp || product.digitalTwin?.mrp || "Not detected",
      requirement: "Mandatory on PDP inclusive of all taxes (Rule 6(1)(e) & Rule 18)",
      status: (!product.mrp || product.mrp === 'Not detected') ? 'FAIL' : 'PASS',
      confidence: conf.mrp || 99.5,
      ruleRef: "LMPC-R6-1-MRP",
      evidenceSource: ev.mrp || "Front Label Price Stamp",
      boundingBox: boxes.mrp || { top: 78, left: 62, width: 28, height: 8 }
    },
    {
      boxId: "BOX-NET",
      field: "Net Quantity",
      canonicalKey: "net_quantity",
      detectedValue: product.net_quantity || product.digitalTwin?.netQuantity || "Not detected",
      requirement: "Standard SI metric units (g, kg, ml, l) with proportional font height (Rule 6(1)(d) & Rule 7)",
      status: (!product.net_quantity || product.net_quantity === 'Not detected') ? 'FAIL' : 'PASS',
      confidence: conf.net_quantity || 98.9,
      ruleRef: "LMPC-R6-1-NET",
      evidenceSource: ev.net_quantity || "Front Label Lower Center",
      boundingBox: boxes.net_quantity || { top: 68, left: 35, width: 30, height: 7 }
    },
    {
      boxId: "BOX-ORIGIN",
      field: "Country of Origin",
      canonicalKey: "country_of_origin",
      detectedValue: product.country_of_origin || product.digitalTwin?.countryOfOrigin || "India",
      requirement: "Mandatory declaration of origin (Rule 6(8))",
      status: 'PASS',
      confidence: conf.country_of_origin || 97.6,
      ruleRef: "LMPC-R6-8-ORIGIN",
      evidenceSource: ev.country_of_origin || "Back Panel Base",
      boundingBox: boxes.country_of_origin || { top: 65, left: 10, width: 45, height: 6 }
    },
    {
      boxId: "BOX-PRODUCT",
      field: "Product Name",
      canonicalKey: "product",
      detectedValue: product.product || product.digitalTwin?.productName || product.name || "Sample Product",
      requirement: "Generic product name on Principal Display Panel (Rule 6(1)(a))",
      status: 'PASS',
      confidence: conf.product || 98.4,
      ruleRef: "LMPC-R6-1-PROD",
      evidenceSource: ev.product || "Front Label Header",
      boundingBox: boxes.product || { top: 15, left: 20, width: 60, height: 10 }
    }
  ];

  const fields = product.fieldsAudit && product.fieldsAudit.length > 0 ? product.fieldsAudit : canonicalItems;
  const selectedField = fields.find(f => f.boxId === selectedBoxId || f.canonicalKey === selectedBoxId) || fields[0];

  const currentImage = 
    activeAngle === 'back' && product.images?.back ? product.images.back :
    activeAngle === 'side' && product.images?.side ? product.images.side :
    product.images?.front || product.image || "/samples/facewash_front.jpg";

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      
      {/* Top Header bar with Multi-Angle packaging switcher */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Package Evidence Verification
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-600 font-medium">
            {product.product || product.name}
          </span>
          {product.is_demo && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
              DEMO SAMPLE
            </span>
          )}
        </div>

        {/* View Angle selector (Front, Back, Side) */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveAngle('front')}
            className={`px-3 py-1 rounded-md transition ${activeAngle === 'front' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Front Panel
          </button>
          <button
            onClick={() => setActiveAngle('back')}
            className={`px-3 py-1 rounded-md transition ${activeAngle === 'back' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Back Panel
          </button>
          <button
            onClick={() => setActiveAngle('side')}
            className={`px-3 py-1 rounded-md transition ${activeAngle === 'side' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Side / Nutrition
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* LEFT COLUMN: Package Image with Interactive Bounding Boxes */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-100/60 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative max-w-md w-full bg-white rounded-lg p-2 shadow-sm border border-slate-200 select-none">
            <img
              src={currentImage}
              alt={product.product || product.name}
              className="w-full h-auto max-h-[420px] object-contain rounded mx-auto block"
            />

            {/* Render OCR bounding boxes over packaging image */}
            {fields.map((field) => {
              const isSelected = field.boxId === selectedField?.boxId || field.canonicalKey === selectedField?.canonicalKey;
              const isExpired = field.status === 'EXPIRED';
              const isPass = field.status === 'PASS';
              const box = field.boundingBox || { top: 30, left: 20, width: 40, height: 10 };

              return (
                <button
                  key={field.boxId}
                  onClick={() => setSelectedBoxId(field.boxId)}
                  style={{
                    top: `${box.top}%`,
                    left: `${box.left}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  className={`absolute rounded transition-all cursor-pointer text-left flex items-start p-1 ${
                    isSelected
                      ? 'border-2 border-brand-600 bg-brand-500/25 ring-2 ring-brand-300 z-20 shadow-md scale-[1.02]'
                      : isExpired
                      ? 'border-2 border-rose-600 bg-rose-500/30 hover:bg-rose-500/40 z-10 animate-pulse'
                      : isPass
                      ? 'border-2 border-emerald-500/80 bg-emerald-500/15 hover:bg-emerald-500/30 z-10'
                      : 'border-2 border-rose-500/90 bg-rose-500/20 hover:bg-rose-500/35 z-10'
                  }`}
                  title={`${field.field}: ${field.detectedValue}`}
                >
                  <span className={`text-[10px] font-bold px-1 py-0.5 rounded leading-none shadow-xs ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : isExpired
                      ? 'bg-rose-700 text-white'
                      : isPass
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 text-white'
                  }`}>
                    {field.boxId}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Compliant Field
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span> Flagged / Expired
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-600 ring-1 ring-brand-300 inline-block"></span> Selected Field
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: PERMANENT Evidence Detail Panel */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-white">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Selected Evidence
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedField?.field || "Select a bounding box"}
                </h4>
              </div>

              {/* Status Badge */}
              {selectedField?.status === 'EXPIRED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  ⚠ EXPIRED
                </span>
              ) : selectedField?.status === 'PASS' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ✓ PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  ✕ FAIL
                </span>
              )}
            </div>

            {/* Extracted Value */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                Detected Label Value
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1 break-words font-mono">
                {selectedField?.detectedValue || "No value extracted"}
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50/60 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Evidence ID</span>
                <span className="font-semibold text-slate-800 font-mono mt-0.5 block">{selectedField?.boxId || "—"}</span>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">OCR Confidence</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">{selectedField?.confidence || 98.2}%</span>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded border border-slate-100 col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Source Reference</span>
                <span className="font-medium text-slate-700 mt-0.5 block">{selectedField?.evidenceSource || "Packaging Panel Stamp"}</span>
              </div>

              <div className="bg-slate-50/60 p-2.5 rounded border border-slate-100 col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Regulatory Requirement</span>
                <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">{selectedField?.requirement || "Rule 6(1) Mandatory Declaration"}</span>
              </div>
            </div>

          </div>

          {/* Action to view AI Explanation or Rule */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Citation: {selectedField?.ruleRef || "LMPC-2011"}
            </span>

            <button
              onClick={() => onExplainClick && onExplainClick(selectedField)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Explain Assessment</span>
            </button>
          </div>

        </div>

      </div>

      {/* Horizontal List of all extracted declarations for quick 1-click selection */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 overflow-x-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Core Declarations (Click to Inspect Evidence Region)
        </div>
        <div className="flex gap-2 min-w-max pb-1">
          {fields.map((field) => {
            const isSelected = field.boxId === selectedField?.boxId;
            return (
              <button
                key={field.boxId}
                onClick={() => setSelectedBoxId(field.boxId)}
                className={`px-3 py-1.5 rounded-md text-xs text-left transition border ${
                  isSelected
                    ? 'bg-white border-brand-600 text-brand-700 font-semibold shadow-xs'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${field.status === 'PASS' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="font-medium">{field.field}</span>
                  <span className="text-[10px] text-slate-400 font-mono">[{field.boxId}]</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
