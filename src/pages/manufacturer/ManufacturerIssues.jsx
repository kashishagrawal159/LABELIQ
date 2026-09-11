import React from 'react';
import { AlertOctagon, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManufacturerIssues() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Artwork Compliance Issues</h1>
        <p className="text-xs text-slate-500 mt-1">Identified non-compliances preventing artwork publishing or production clearance.</p>
      </div>

      <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Action Required</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Nimbudi Refreshing Lemon Drink (250 ml)</h3>
          </div>
          <Link
            to="/manufacturer/fix-recheck"
            className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Open Fix & Recheck</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-rose-800 block">Missing Unit Sale Price</span>
            <p className="text-slate-600 mt-0.5">Under LMPC Rule 6(1)(f), packages &gt; 200 ml must declare Unit Sale Price.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-rose-800 block">E-Commerce Pricing Inconsistency</span>
            <p className="text-slate-600 mt-0.5">Online price of ₹35.00 exceeds declared physical package MRP of ₹25.00.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
