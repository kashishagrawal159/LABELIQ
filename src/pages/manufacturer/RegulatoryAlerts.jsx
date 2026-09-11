import React, { useState } from 'react';
import { 
  BellRing, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Scale, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { REGULATORY_ALERTS } from '../../data/mockData';

export default function RegulatoryAlerts() {
  const [revalidating, setRevalidating] = useState(false);
  const [revalidated, setRevalidated] = useState(false);

  const handleRevalidate = () => {
    setRevalidating(true);
    setTimeout(() => {
      setRevalidating(false);
      setRevalidated(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              <BellRing className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Regulatory Watch & Amendment Impact
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous gazette tracking and automated SKU re-validation against legislative amendments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Regulatory Monitoring Active
          </span>
        </div>
      </div>

      {/* Amendment Impact Analysis Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
              Gazette Update Trigger
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Ministry of Consumer Affairs Notification GSR 124(E)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforcement Date: March 2026 • Scope: Packaged Commodities & E-Commerce Listings
            </p>
          </div>

          <button
            onClick={handleRevalidate}
            disabled={revalidating || revalidated}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-emerald-600 rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
          >
            {revalidating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning 18 SKUs...</span>
              </>
            ) : revalidated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Re-Validation Complete</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Revalidate Affected Products</span>
              </>
            )}
          </button>
        </div>

        {/* Impact Distribution Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-[10px] uppercase block">Total SKUs Monitored</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">18</span>
            <span className="text-[10px] text-slate-500">In company catalog</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-[10px] uppercase block">Affected Products</span>
            <span className="text-xl font-bold text-amber-600 mt-0.5 block">2</span>
            <span className="text-[10px] text-slate-500">Liquid commodities &gt; 200ml</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-[10px] uppercase block">Re-Validation Status</span>
            <span className={`text-xl font-bold mt-0.5 block ${revalidated ? 'text-emerald-700' : 'text-purple-700'}`}>
              {revalidated ? 'All Verified' : '1 Pending Fix'}
            </span>
            <span className="text-[10px] text-slate-500">Digital Twin sync</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold text-[10px] uppercase block">No Impact</span>
            <span className="text-xl font-bold text-slate-700 mt-0.5 block">16</span>
            <span className="text-[10px] text-slate-500">Passports remain valid</span>
          </div>
        </div>
      </div>

      {/* Active Gazette Alerts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900">
            Official Regulatory Advisories & Notifications
          </h2>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {REGULATORY_ALERTS.map((alert) => (
            <div key={alert.id} className="p-4 space-y-2 hover:bg-slate-50/60 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                <span className="text-slate-400 font-mono text-[11px]">{alert.referenceNo} • {alert.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {alert.summary}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                <span>Authority: <strong>{alert.authority}</strong></span>
                <span>•</span>
                <span>Category: <strong className="text-purple-700">{alert.impactCategory}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
