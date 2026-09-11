import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  FileCheck, 
  ArrowRight, 
  Filter, 
  Search, 
  AlertTriangle,
  Scale
} from 'lucide-react';
import { INSPECTOR_CASES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function InspectorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const highRiskCount = INSPECTOR_CASES.filter(c => c.severity === 'Critical').length;
  const openCasesCount = INSPECTOR_CASES.filter(c => c.status !== 'Verified & Closed').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Officer {user?.name || 'R. K. Sharma'} ({user?.govtId || 'GOV-LM-042'}) • Legal Metrology Surveillance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspector/cases/CASE-2026-881"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <span>Review Priority Case</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Important Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">High-Risk Cases</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <AlertOctagon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{highRiskCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring immediate officer review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open Cases</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{openCasesCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active investigations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inspections This Month</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">128</div>
          <div className="text-[11px] text-slate-400 mt-1">Surveillance & customs scans</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resolved Cases</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">46</div>
          <div className="text-[11px] text-slate-400 mt-1">Notice issued or rectified</div>
        </div>

      </div>

      {/* Cross-Source Triangulation Investigation Banner (Inspector-Only Feature) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200">
              Inspector Investigation Feature
            </span>
            <span className="text-xs font-semibold text-rose-700">2 Active Marketplace Discrepancies Flagged</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Cross-Source Triangulation: Physical Package vs Official Spec vs E-Commerce
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Verify retail prices, net quantities, and country of origin across physical packaging OCR, official brand gazette filings, and live digital listings.
          </p>
        </div>

        <Link
          to="/inspector/triangulation"
          className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition flex items-center gap-2 shrink-0"
        >
          <span>Open Triangulation Suite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Priority Enforcement Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Priority Enforcement Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated risk assessment ranking flagged packaged commodities.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500">
            {INSPECTOR_CASES.length} Active Queue Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Manufacturer / Importer</th>
                <th className="py-3 px-4">Flagged Violation</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INSPECTOR_CASES.map((item) => {
                const isCritical = item.severity === 'Critical';
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => navigate(`/inspector/cases/${item.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.caseNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.productName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.manufacturer}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {item.violationType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] ${
                        item.riskScore > 70 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.evidenceConfidence}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-brand-600 font-bold hover:text-brand-700 flex items-center justify-end gap-1">
                        Inspect
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
