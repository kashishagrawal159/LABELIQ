import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Boxes, 
  Camera, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { MANUFACTURER_PRODUCTS, REGULATORY_ALERTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function ManufacturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Manufacturer Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user?.company || 'Baypure Lifestyle Pvt Ltd'} • Pre-Market Compliance Portal
          </p>
        </div>

        <Link
          to="/manufacturer/pre-publish"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
        >
          <Camera className="w-4 h-4" />
          <span>Run Pre-Publish Check</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Products</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">18</div>
          <div className="text-[11px] text-slate-400 mt-1">Registered SKUs in catalog</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fully Compliant</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">16</div>
          <div className="text-[11px] text-slate-400 mt-1">Valid Compliance Passports</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Issues Flagged</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <AlertOctagon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">2</div>
          <div className="text-[11px] text-slate-400 mt-1">Need artwork revision before print</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gazette Amendments</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
              <BellRing className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">2 Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Department of Consumer Affairs</div>
        </div>

      </div>

      {/* Flagged Issues & Fix-and-Recheck Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Preventive Compliance
            </span>
            <span className="text-xs font-bold text-rose-700">1 Product Needs Immediate Fix</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Nimbudi Lemon Drink: Missing Unit Sale Price & Online Pricing Gap
          </h3>
          <p className="text-xs text-slate-600">
            Current score: 68/100. Upload revised packaging artwork with mandatory USP to re-validate.
          </p>
        </div>

        <Link
          to="/manufacturer/fix-recheck"
          className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Launch Fix & Recheck</span>
        </Link>
      </div>

      {/* Catalog Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900">
            Monitored Product Catalog
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Active SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">SKU / ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Compliance Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MANUFACTURER_PRODUCTS.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{prod.sku}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{prod.name}</td>
                  <td className="py-3 px-4 text-slate-600">{prod.category}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block font-bold px-2 py-0.5 rounded text-[11px] ${
                      prod.score > 80 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                    }`}>
                      {prod.score} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      prod.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {prod.status === 'Compliant' ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{prod.version}</td>
                  <td className="py-3 px-4 text-right">
                    {prod.issuesCount > 0 ? (
                      <Link
                        to="/manufacturer/fix-recheck"
                        className="text-purple-600 font-bold hover:text-purple-700 flex items-center justify-end gap-1"
                      >
                        Fix Artwork
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link
                        to="/consumer/passport"
                        className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center justify-end gap-1"
                      >
                        Passport
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
