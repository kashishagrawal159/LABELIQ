import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManufacturerVersions() {
  const versions = [
    { version: "v2.1 (Current Cleared)", sku: "DEC-FW-100", date: "2026-03-08", score: 98, status: "Cleared for Print", changes: "Font height matched to 145cm² PDP bracket" },
    { version: "v2.0", sku: "DEC-FW-100", date: "2026-01-14", score: 92, status: "Superseded", changes: "Added FSSAI / Cosmetic License batch details" },
    { version: "v1.0 (Flagged)", sku: "NIM-BVR-250", date: "2026-03-09", score: 68, status: "Needs Revision", changes: "Initial pre-publish test; USP missing" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Artwork Version History</h1>
        <p className="text-xs text-slate-500 mt-1">Audit log of packaging proofs, changes, and regulatory scores across revisions.</p>
      </div>

      <div className="space-y-3">
        {versions.map((v, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{v.version}</span>
                <span className="text-xs text-slate-400 font-mono">[{v.sku}]</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${v.score > 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  Score {v.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{v.changes}</p>
              <div className="text-[11px] text-slate-400 mt-1">{v.date} • Status: <strong>{v.status}</strong></div>
            </div>

            <Link
              to="/manufacturer/pre-publish"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Inspect Version</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
