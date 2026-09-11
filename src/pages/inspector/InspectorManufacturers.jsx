import React from 'react';
import { Building, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InspectorManufacturers() {
  const mfgs = [
    { name: "Baypure Lifestyle Pvt Ltd", location: "Bengaluru, Karnataka", category: "Cosmetics", complianceRating: "98% (Grade A)", monitoredSKUs: 12, violations: 0 },
    { name: "Marico Limited", location: "Mumbai, Maharashtra", category: "Cosmetics & Oils", complianceRating: "96% (Grade A)", monitoredSKUs: 45, violations: 0 },
    { name: "Nimbudi Beverage Corp", location: "Rajkot, Gujarat", category: "Food & Beverages", complianceRating: "68% (Notice Issued)", monitoredSKUs: 4, violations: 2 },
    { name: "Indo-Pacific Retail Logistics Pvt Ltd", location: "Mumbai, Maharashtra", category: "Import Logistics", complianceRating: "54% (Notice Issued)", monitoredSKUs: 8, violations: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Packer & Manufacturer Registry</h1>
        <p className="text-xs text-slate-500 mt-1">Registered manufacturers, packers, and importers tracked under Legal Metrology rules.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Entity Name</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Compliance Rating</th>
              <th className="py-3 px-4">Monitored SKUs</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {mfgs.map((m, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                <td className="py-3 px-4 text-slate-600">{m.location}</td>
                <td className="py-3 px-4 text-slate-600">{m.category}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                    m.violations === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {m.complianceRating}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700">{m.monitoredSKUs} SKUs</td>
                <td className="py-3 px-4 text-right">
                  <Link to="/inspector/dashboard" className="text-brand-600 font-bold hover:underline">
                    View Cases
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
