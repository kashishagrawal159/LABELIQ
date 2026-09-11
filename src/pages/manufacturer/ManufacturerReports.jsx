import React from 'react';
import { FileCheck2, Download } from 'lucide-react';

export default function ManufacturerReports() {
  const reports = [
    { title: "Pre-Publish Packaging Compliance Certificate (Deconstruct Face Wash)", date: "2026-03-08", id: "CERT-2026-DEC" },
    { title: "SKU Triangulation & Cross-Source Pricing Audit", date: "2026-03-01", id: "AUDIT-2026-ECOM" },
    { title: "Annual Legal Metrology Compliance Summary 2025-26", date: "2026-02-15", id: "ANNUAL-LM-26" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Manufacturer Compliance Certificates</h1>
        <p className="text-xs text-slate-500 mt-1">Exportable certificates of conformity and pre-market validation reports.</p>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">{r.id} • {r.date}</div>
            </div>
            <button
              onClick={() => alert(`Downloading certificate ${r.id}...`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
