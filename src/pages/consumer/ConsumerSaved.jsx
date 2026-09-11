import React from 'react';
import { BookmarkCheck, ArrowRight } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { Link } from 'react-router-dom';

export default function ConsumerSaved() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Saved Products & Passports</h1>
        <p className="text-xs text-slate-500 mt-1">Bookmarked packaged commodities for quick price and expiry lookup.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE_PRODUCTS.slice(0, 2).map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.digitalTwin?.mrp} • {item.digitalTwin?.netQuantity}</p>
            </div>
            <Link to={`/consumer/check?id=${item.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Check <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
