import React from 'react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { Image, Scan, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InspectorEvidence() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          Packaging Evidence Repository
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-resolution packaging label scans, OCR bounding boxes, and cross-source digital proofs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_PRODUCTS.filter(p => p.digitalTwin).map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
            <div>
              <div className="h-48 bg-slate-100 p-2 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                <img
                  src={prod.images?.front}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">{prod.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    prod.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {prod.status === 'verified' ? '✓ Compliant' : '✕ Violation'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{prod.name}</h3>
                <div className="text-xs text-slate-500">
                  Evidence Items: <strong>{prod.fieldsAudit?.length || 6}</strong> bounded OCR fields
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                to={`/inspector/cases/CASE-2026-881`}
                className="w-full py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <span>Inspect in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
