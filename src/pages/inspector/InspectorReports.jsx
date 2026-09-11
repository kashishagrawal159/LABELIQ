import React from 'react';
import { FileCheck2, Download, Printer } from 'lucide-react';

export default function InspectorReports() {
  const reports = [
    { title: "Monthly Metrology Enforcement Summary (March 2026)", ref: "REP-2026-03-A", date: "2026-03-09", size: "1.2 MB", casesCount: 14 },
    { title: "Statutory Notice Registry under Section 36 (Feb 2026)", ref: "REP-2026-02-B", date: "2026-02-28", size: "2.4 MB", casesCount: 22 },
    { title: "E-Commerce MRP & USP Triangulation Audit", ref: "REP-2026-02-EC", date: "2026-02-18", size: "980 KB", casesCount: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Enforcement & Legal Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Generated statutory reports, court filings, and surveillance digests.</p>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <span className="text-[11px] text-slate-400 font-mono">{r.ref} • {r.date} • {r.size} • {r.casesCount} Cases Included</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(`Downloading signed report ${r.ref}...`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
