import React from 'react';
import { AlertOctagon, Scale, ArrowRight } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { Link } from 'react-router-dom';

export default function InspectorViolations() {
  const allViolations = SAMPLE_PRODUCTS.flatMap(p => 
    (p.violations || []).map(v => ({ ...v, productName: p.name, productId: p.id }))
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          Detected Statutory Violations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Active non-compliances flagged under Legal Metrology Act and Packaged Commodities Rules.
        </p>
      </div>

      <div className="space-y-4">
        {allViolations.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {v.severity} Severity
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Product: {v.productName}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {v.title}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Detected:</strong> {v.detectedText}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                <span>Rule: <strong className="text-slate-800">{v.ruleProvision}</strong></span>
                <span>•</span>
                <span>Ref: <strong className="font-mono text-slate-800">{v.evidenceRef}</strong></span>
              </div>
            </div>

            <Link
              to="/inspector/cases/CASE-2026-881"
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition flex items-center gap-1.5 shrink-0 self-start md:self-center"
            >
              <span>Review Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
