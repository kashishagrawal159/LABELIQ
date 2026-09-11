import React from 'react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { Boxes, Plus, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManufacturerProducts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Product Packaging Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage brand packaging digital twins, declarations, and compliance clearance.</p>
        </div>

        <Link
          to="/manufacturer/pre-publish"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Artwork</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_PRODUCTS.filter(p => p.digitalTwin).map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {prod.category}
                </span>
                <span className={`text-xs font-bold ${prod.complianceScore > 80 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {prod.complianceScore} / 100
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2">{prod.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{prod.digitalTwin.netQuantity} • {prod.digitalTwin.mrp}</p>

              <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                <div>USP: <strong>{prod.digitalTwin.usp || "Missing"}</strong></div>
                <div>Origin: <strong>{prod.digitalTwin.countryOfOrigin || "Not Stated"}</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <Link to="/consumer/passport" className="text-slate-600 hover:text-slate-900">
                Passport
              </Link>
              <Link to="/manufacturer/pre-publish" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Audit Label <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
