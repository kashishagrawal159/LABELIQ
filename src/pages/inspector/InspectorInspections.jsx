import React from 'react';
import { FileSearch, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InspectorInspections() {
  const inspections = [
    { id: "INSP-2026-0421", date: "2026-03-09", premise: "Reliance Fresh, Andheri W, Mumbai", itemsChecked: 14, issues: 1, officer: "R. K. Sharma" },
    { id: "INSP-2026-0420", date: "2026-03-08", premise: "Jawaharlal Nehru Port CFS, Nhava Sheva", itemsChecked: 28, issues: 3, officer: "P. Deshmukh" },
    { id: "INSP-2026-0419", date: "2026-03-07", premise: "Blinkit Dark Store, Indiranagar, Bengaluru", itemsChecked: 19, issues: 0, officer: "S. K. Iyer" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Market Surveillance Inspections</h1>
        <p className="text-xs text-slate-500 mt-1">Field inspections, customs clearances, and retail surveillance audits.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Inspection ID</th>
              <th className="py-3 px-4">Premise / Location</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Packages Tested</th>
              <th className="py-3 px-4">Issues Found</th>
              <th className="py-3 px-4">Officer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {inspections.map(i => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{i.id}</td>
                <td className="py-3 px-4 text-slate-800">{i.premise}</td>
                <td className="py-3 px-4 text-slate-500">{i.date}</td>
                <td className="py-3 px-4">{i.itemsChecked} items</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${i.issues > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {i.issues} issues
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{i.officer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
