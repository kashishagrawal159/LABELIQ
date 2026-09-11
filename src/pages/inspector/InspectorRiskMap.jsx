import React from 'react';
import { MapPin, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { INSPECTOR_CASES } from '../../data/mockData';
import { Link } from 'react-router-dom';

export default function InspectorRiskMap() {
  const regions = [
    { zone: "West Zone (Mumbai / Gujarat Port CFS)", highRisk: 3, surveillanceTotal: 42, activeAlert: "Imported Overstickers" },
    { zone: "South Zone (Bengaluru / Chennai Retail)", highRisk: 1, surveillanceTotal: 38, activeAlert: "E-Commerce Dual Pricing" },
    { zone: "North Zone (Delhi NCR / Haryana Mandi)", highRisk: 2, surveillanceTotal: 34, activeAlert: "Font Size Brackets" },
    { zone: "East Zone (Kolkata Wholesale Market)", highRisk: 1, surveillanceTotal: 26, activeAlert: "Net Qty SI Units" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          Surveillance Risk Matrix & Map
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Geographic enforcement heat and category risk models for Legal Metrology inspections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regions.map((reg, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">{reg.zone}</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {reg.highRisk} High Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Surveillance</span>
                <span className="font-bold text-slate-800 text-base mt-0.5 block">{reg.surveillanceTotal} Scans</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Surveillance Focus</span>
                <span className="font-bold text-purple-700 text-xs mt-1 block truncate">{reg.activeAlert}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/inspector/dashboard"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Filter Queue for Zone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
