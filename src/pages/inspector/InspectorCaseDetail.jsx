import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  FileText, 
  UserCheck, 
  Send, 
  Eye, 
  Clock,
  Sparkles
} from 'lucide-react';
import { INSPECTOR_CASES } from '../../data/mockData';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { REGULATORY_RULES } from '../../data/regulatoryRules';
import ExplainabilityModal from '../../components/ExplainabilityModal';

export default function InspectorCaseDetail() {
  const { id } = useParams();
  const activeCase = INSPECTOR_CASES.find(c => c.id === id) || INSPECTOR_CASES[0];
  const product = SAMPLE_PRODUCTS.find(p => p.id === activeCase.productId) || SAMPLE_PRODUCTS[3];

  const [selectedBoxId, setSelectedBoxId] = useState(product.fieldsAudit?.[0]?.boxId || "BOX-01");
  const [reviewDecision, setReviewDecision] = useState(null); // 'confirm' | 'override' | 'request_evidence'
  const [officerNote, setOfficerNote] = useState('');
  const [showExplainModal, setShowExplainModal] = useState(false);

  const selectedField = product.fieldsAudit?.find(f => f.boxId === selectedBoxId) || product.fieldsAudit?.[0];
  const violation = product.violations?.[0];

  const handleDecision = (type) => {
    setReviewDecision(type);
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/inspector/dashboard"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600"
            title="Back to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Case Workspace: {activeCase.caseNumber}
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                activeCase.severity === 'Critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                Risk: {activeCase.riskScore}/100 ({activeCase.severity})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Product: {activeCase.productName} • Assigned to {activeCase.assignedOfficer}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Status: {reviewDecision ? (reviewDecision === 'confirm' ? 'Officer Confirmed' : reviewDecision === 'override' ? 'Officer Overridden' : 'More Evidence Requested') : activeCase.status}
          </span>
        </div>
      </div>

      {/* 3 STABLE COLUMNS: CASE INFORMATION | EVIDENCE | LEGAL ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: CASE INFORMATION (4 cols on lg) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Case Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Case Number</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">{activeCase.caseNumber}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Target Product</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{activeCase.productName}</span>
                <span className="text-slate-500 text-[11px]">{product.category} • {product.subCategory}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Manufacturer / Importer</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{activeCase.manufacturer}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Filing Date</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{activeCase.filingDate}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">AI Recommendation</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                  HIGH RISK (Score {activeCase.riskScore})
                </span>
              </div>
            </div>

            {/* Case History Timeline */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Audit Trail Log
              </span>
              <div className="space-y-2 text-[11px]">
                {activeCase.history?.map((step, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <div>
                      <div className="font-semibold text-slate-800">{step.step}</div>
                      <div className="text-slate-400 text-[10px]">{step.timestamp} • {step.actor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: EVIDENCE (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Packaging Evidence
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Click box to inspect
              </span>
            </div>

            {/* Package image with clickable bounding boxes */}
            <div className="relative bg-slate-100 rounded-lg p-2 border border-slate-200 flex items-center justify-center min-h-[300px]">
              <img
                src={product.images?.front}
                alt={product.name}
                className="max-h-[300px] w-auto object-contain rounded"
              />

              {product.fieldsAudit?.map((field) => {
                const isSelected = field.boxId === selectedBoxId;
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
                    className={`absolute rounded transition-all cursor-pointer p-0.5 text-left ${
                      isSelected
                        ? 'border-2 border-brand-600 bg-brand-500/30 ring-2 ring-brand-300 z-20'
                        : isPass
                        ? 'border-2 border-emerald-500/70 bg-emerald-500/10 hover:bg-emerald-500/25 z-10'
                        : 'border-2 border-rose-500/80 bg-rose-500/20 hover:bg-rose-500/35 z-10'
                    }`}
                  >
                    <span className={`text-[9px] font-bold px-1 rounded ${
                      isSelected ? 'bg-brand-600 text-white' : isPass ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
                    }`}>
                      {field.boxId}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Evidence Inspector Mini-Bar */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{selectedField?.field}</span>
                <span className="font-mono text-slate-500 text-[11px]">{selectedField?.boxId}</span>
              </div>
              <div className="text-slate-600 font-mono text-[11px] break-words bg-white p-2 rounded border border-slate-200">
                {selectedField?.detectedValue || "No value"}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>OCR Confidence: <strong>{selectedField?.confidence}%</strong></span>
                <span>Source: {selectedField?.evidenceSource}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: LEGAL ANALYSIS (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Legal Analysis & Rule Mapping
              </h2>
              <button
                onClick={() => setShowExplainModal(true)}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Full Trace
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Flagged Violation</span>
                <span className="font-bold text-rose-700 mt-0.5 block">
                  {violation ? violation.title : "No critical violations flagged"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Statutory Provision</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {violation ? violation.ruleProvision : "Legal Metrology Rules 2011"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Reason & Legal Grounds</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {violation ? violation.whyItApplies : "All mandatory declarations verified against official gazette rules."}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Recommended Rectification</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  {violation ? violation.correction : "Maintain compliance passport records."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM HUMAN VERIFICATION CONTROLS (CRITICAL) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              Officer Human Verification Sign-Off
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            AI recommendations are advisory. Official statutory action requires verified officer decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleDecision('confirm')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              reviewDecision === 'confirm'
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm Assessment</span>
          </button>

          <button
            onClick={() => handleDecision('override')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
              reviewDecision === 'override'
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <span>Override Assessment</span>
          </button>

          <button
            onClick={() => handleDecision('request_evidence')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
              reviewDecision === 'request_evidence'
                ? 'bg-blue-100 text-blue-900 border-blue-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <span>Request More Evidence</span>
          </button>

          <button
            onClick={() => alert("Drafting official Statutory Notice under Legal Metrology Act Section 36...")}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Issue Notice</span>
          </button>
        </div>
      </div>

      {/* Explainability Modal */}
      <ExplainabilityModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
        fieldOrViolation={violation || selectedField}
        product={product}
      />

    </div>
  );
}
