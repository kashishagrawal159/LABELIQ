import React from 'react';
import RuleMatrixTable from '../components/RuleMatrixTable';
import { Scale, BookOpen, ShieldCheck } from 'lucide-react';

export default function RuleMatrixPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-brand-50 text-brand-600 border border-brand-200">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Rule Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized Legal Metrology and packaged commodities regulatory framework.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Active Gazette Dataset
          </span>
        </div>
      </div>

      {/* Main Content: Single Clear Rule Matrix Table */}
      <RuleMatrixTable />
    </div>
  );
}
