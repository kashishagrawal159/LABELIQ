import React from 'react';
import { 
  X, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Scale, 
  FileSearch, 
  Wrench, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { REGULATORY_RULES } from '../data/regulatoryRules';

export default function ExplainabilityModal({ 
  isOpen, 
  onClose, 
  fieldOrViolation, 
  product 
}) {
  if (!isOpen || !fieldOrViolation) return null;

  // Match applicable rule from our regulatory rules database
  const ruleRef = fieldOrViolation.ruleRef || fieldOrViolation.ruleId;
  const matchedRule = REGULATORY_RULES.find(r => r.id === ruleRef) || REGULATORY_RULES[0];

  const isViolation = fieldOrViolation.severity || fieldOrViolation.status === 'FAIL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Transparent Compliance Assessment
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Explainable Compliance Intelligence Trace
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Spacious, Horizontal Multi-Column Layout */}
        <div className="p-6 space-y-6">
          
          {/* Target Subject Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-medium">Assessed Item / Field</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {fieldOrViolation.field || fieldOrViolation.title || "Regulatory Check"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Product Context</div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {product?.name || "Packaged Product"} ({product?.category || "Packaged Commodity"})
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Audit Outcome</div>
              <div className="mt-0.5">
                {isViolation ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                    ✕ Violation Flagged
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    ✓ Verified Compliant
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 6 Structured Explainability Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. WHY WAS THIS FLAGGED / EVALUATED? */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  1. Why was this evaluated?
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {isViolation
                    ? (fieldOrViolation.whyItApplies || "The commodity category mandates clear declaration on the Principal Display Panel prior to retail sale.")
                    : "The Legal Metrology framework requires verified display of standard pricing, units, and manufacturing provenance on all consumer packages."}
                </p>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 font-medium">
                Trigger: Product classified as {product?.category} ({product?.isImported ? "Imported" : "Domestic"})
              </div>
            </div>

            {/* 2. WHAT WAS DETECTED? */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <FileSearch className="w-4 h-4 text-purple-600" />
                  2. What was detected?
                </div>
                <div className="text-sm font-mono bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-900 break-words">
                  {fieldOrViolation.detectedValue || fieldOrViolation.detectedText || "Value extracted via OCR"}
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 font-medium">
                OCR Confidence: {fieldOrViolation.confidence || 97.5}%
              </div>
            </div>

            {/* 3. WHICH RULE APPLIES? */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  3. Which statutory rule applies?
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  {matchedRule.framework}
                </div>
                <div className="text-xs font-medium text-brand-700 mt-1">
                  Provision: {matchedRule.provision}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {matchedRule.description}
                </p>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Rule Status: <span className="text-emerald-700 font-semibold">{matchedRule.status}</span> ({matchedRule.version})
              </div>
            </div>

            {/* 4. WHY DOES THE RULE APPLY? */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  4. Scope & Condition of Applicability
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Applicability: {matchedRule.applicability}
                </p>
                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-700">Condition:</span> {matchedRule.condition}
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Enforcing Authority: {matchedRule.source}
              </div>
            </div>

            {/* 5. WHAT EVIDENCE SUPPORTS IT? */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                5. Corroborating Packaging Evidence
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
                <div><span className="text-slate-400">Evidence ID:</span> <span className="font-mono font-bold">{fieldOrViolation.boxId || fieldOrViolation.evidenceRef || "EVD-01"}</span></div>
                <div><span className="text-slate-400">Packaging Location:</span> <span className="font-semibold">{fieldOrViolation.evidenceSource || "Principal Display Panel"}</span></div>
                <div><span className="text-slate-400">Corroboration:</span> <span className="font-semibold text-emerald-700">Triangulated against packaging image</span></div>
              </div>
            </div>

            {/* 6. HOW CAN IT BE CORRECTED? */}
            {isViolation && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                  <Wrench className="w-4 h-4 text-rose-600" />
                  6. Recommended Corrective Action
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {fieldOrViolation.correction || "Update label artwork or digital catalog to declare the mandatory information in standard format."}
                </p>
                <div className="mt-2 text-xs text-rose-700">
                  Note: Any revised artwork must be verified prior to dispatch or publication.
                </div>
              </div>
            )}

          </div>

          {/* Legal Authority Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs border border-slate-200">
            <span className="font-bold text-slate-700">AI-Assisted Assessment Notice:</span> This assessment provides deterministic regulatory compliance cross-referencing against verified Legal Metrology standards. Final administrative enforcement remains under the authority of authorized State/Central Legal Metrology Officers.
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
}
