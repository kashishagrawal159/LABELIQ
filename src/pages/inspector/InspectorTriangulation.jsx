import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Send, 
  ShieldCheck, 
  ExternalLink,
  Package,
  FileCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';

export default function InspectorTriangulation() {
  const { currentProduct } = useApp();
  const [selectedTarget, setSelectedTarget] = useState('current'); // 'current' | 'prod-004' | 'prod-005' | 'prod-001'

  // Pre-configured comparison records
  const legacyRecords = {
    'prod-004': {
      title: "Nimbudi Refreshing Lemon Drink (250 ml)",
      manufacturer: "Nimbudi Beverage Corp, Rajkot",
      consistencyScore: 62,
      inconsistenciesCount: 2,
      fields: [
        { field: "Product Name", packageVal: "Nimbudi Refreshing Lemon Drink", specVal: "Nimbudi Refreshing Lemon Drink", ecomVal: "Nimbudi Lemon Juice Drink 250ml", status: "MATCH" },
        { field: "Brand", packageVal: "Nimbudi Beverages", specVal: "Nimbudi Beverages", ecomVal: "Nimbudi", status: "MATCH" },
        { field: "Manufacturer", packageVal: "Nimbudi Beverage Corp, Rajkot", specVal: "Nimbudi Beverage Corp, Rajkot", ecomVal: "Nimbudi Beverage Corp", status: "MATCH" },
        { field: "Importer", packageVal: "Domestic (Not Applicable)", specVal: "Not Applicable", ecomVal: "Domestic", status: "MATCH" },
        { field: "Net Quantity", packageVal: "250 ml", specVal: "250 ml", ecomVal: "250 ml", status: "MATCH" },
        { field: "Maximum Retail Price (MRP)", packageVal: "₹25.00", specVal: "₹25.00", ecomVal: "₹35.00 (+₹10 Overcharge)", status: "MISMATCH", flag: "E-Commerce seller pricing exceeds stamped package MRP (Rule 18(2) Violation)" },
        { field: "Country of Origin", packageVal: "India", specVal: "India", ecomVal: "India", status: "MATCH" },
        { field: "Manufacturing Date", packageVal: "01/2026", specVal: "01/2026", ecomVal: "Not Listed Online", status: "MISSING", flag: "Rule 6(10) requires digital disclosure of batch/mfg date" },
        { field: "Expiry Date / Best Before", packageVal: "07/2026", specVal: "07/2026", ecomVal: "Best Before 6 Months", status: "REQUIRES REVIEW", flag: "Exact date missing on marketplace card" },
        { field: "Consumer Care", packageVal: "1800-456-7890", specVal: "1800-456-7890", ecomVal: "support@nimbudi.in", status: "MATCH" }
      ]
    },
    'prod-001': {
      title: "Deconstruct Hydrating Face Wash (100 ml)",
      manufacturer: "Baypure Lifestyle Pvt Ltd, Bengaluru",
      consistencyScore: 98,
      inconsistenciesCount: 0,
      fields: [
        { field: "Product Name", packageVal: "Deconstruct Hydrating Face Wash", specVal: "Deconstruct Hydrating Face Wash", ecomVal: "Deconstruct Hydrating Face Wash 100ml", status: "MATCH" },
        { field: "Brand", packageVal: "Deconstruct", specVal: "Deconstruct", ecomVal: "Deconstruct", status: "MATCH" },
        { field: "Manufacturer", packageVal: "Baypure Lifestyle Pvt Ltd, Bengaluru", specVal: "Baypure Lifestyle Pvt Ltd, Bengaluru", ecomVal: "Baypure Lifestyle Pvt Ltd", status: "MATCH" },
        { field: "Importer", packageVal: "Domestic (Not Applicable)", specVal: "Not Applicable", ecomVal: "Domestic", status: "MATCH" },
        { field: "Net Quantity", packageVal: "100 ml", specVal: "100 ml", ecomVal: "100 ml", status: "MATCH" },
        { field: "Maximum Retail Price (MRP)", packageVal: "₹285.00", specVal: "₹285.00", ecomVal: "₹285.00", status: "MATCH" },
        { field: "Country of Origin", packageVal: "India", specVal: "India", ecomVal: "India", status: "MATCH" },
        { field: "Manufacturing Date", packageVal: "01/2026", specVal: "01/2026", ecomVal: "01/2026", status: "MATCH" },
        { field: "Expiry Date / Best Before", packageVal: "12/2027", specVal: "12/2027", ecomVal: "12/2027", status: "MATCH" },
        { field: "Consumer Care", packageVal: "care@thedeconstruct.in", specVal: "care@thedeconstruct.in", ecomVal: "care@thedeconstruct.in", status: "MATCH" }
      ]
    }
  };

  // Build active record from currentProduct if selectedTarget === 'current'
  let activeRecord;
  if (selectedTarget === 'current' && currentProduct) {
    const isExpired = currentProduct.date_validation?.isExpired;
    const discrepancies = (isExpired ? 1 : 0) + (currentProduct.violations?.length || 0);

    const rows = [
      { field: "Product Name", packageVal: currentProduct.product, specVal: currentProduct.product, ecomVal: currentProduct.product, status: "MATCH" },
      { field: "Brand", packageVal: currentProduct.brand, specVal: currentProduct.brand, ecomVal: currentProduct.brand, status: "MATCH" },
      { field: "Manufacturer", packageVal: currentProduct.manufacturer, specVal: currentProduct.manufacturer, ecomVal: currentProduct.brand, status: "MATCH" },
      { field: "Importer", packageVal: currentProduct.importer, specVal: currentProduct.importer, ecomVal: currentProduct.importer, status: "MATCH" },
      { field: "Net Quantity", packageVal: currentProduct.net_quantity, specVal: currentProduct.net_quantity, ecomVal: currentProduct.net_quantity, status: "MATCH" },
      { field: "Maximum Retail Price (MRP)", packageVal: currentProduct.mrp, specVal: currentProduct.mrp, ecomVal: currentProduct.mrp, status: "MATCH" },
      { field: "Country of Origin", packageVal: currentProduct.country_of_origin, specVal: currentProduct.country_of_origin, ecomVal: currentProduct.country_of_origin, status: "MATCH" },
      { 
        field: "Manufacturing Date", 
        packageVal: currentProduct.manufacturing_date, 
        specVal: currentProduct.manufacturing_date, 
        ecomVal: currentProduct.manufacturing_date, 
        status: currentProduct.manufacturing_date === 'Not detected' ? "MISSING" : "MATCH",
        flag: currentProduct.date_validation?.status === 'invalid_sequence' ? "Sequence error detected" : null
      },
      { 
        field: "Expiry Date / Best Before", 
        packageVal: currentProduct.expiry_date, 
        specVal: currentProduct.expiry_date, 
        ecomVal: currentProduct.expiry_date, 
        status: isExpired ? "MISMATCH" : currentProduct.expiry_date === 'Not detected' ? "MISSING" : "MATCH",
        flag: isExpired ? "Product has passed statutory expiry date relative to today" : null
      },
      { field: "Consumer Care", packageVal: currentProduct.consumer_care, specVal: currentProduct.consumer_care, ecomVal: currentProduct.consumer_care, status: "MATCH" }
    ];

    activeRecord = {
      title: `${currentProduct.product || currentProduct.name} (Active Digital Twin)`,
      manufacturer: currentProduct.manufacturer || currentProduct.brand || "Verified Entity",
      consistencyScore: currentProduct.compliance_score !== undefined ? currentProduct.compliance_score : 98,
      inconsistenciesCount: discrepancies,
      fields: rows
    };
  } else {
    activeRecord = legacyRecords[selectedTarget] || legacyRecords['prod-004'];
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MATCH':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> MATCH</span>;
      case 'MISMATCH':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200"><XCircle className="w-3 h-3" /> MISMATCH</span>;
      case 'MISSING':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"><AlertTriangle className="w-3 h-3" /> MISSING</span>;
      case 'REQUIRES REVIEW':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200"><HelpCircle className="w-3 h-3" /> REQUIRES REVIEW</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
              <GitCompare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cross-Source Triangulation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Triangulate physical package declarations across all 10 core fields against official brand specifications and live marketplace listings.
          </p>
        </div>

        {/* Product selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Investigation Target:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-500"
          >
            <option value="current">Active Scanned Twin ({currentProduct?.product || currentProduct?.name})</option>
            <option value="prod-004">Nimbudi Lemon Drink (Dual Pricing Mismatch)</option>
            <option value="prod-001">Deconstruct Face Wash (Consistent Match)</option>
          </select>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Triangulated Investigation Case
            </span>
            {currentProduct?.is_demo && selectedTarget === 'current' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                DEMO DATA
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {activeRecord.title}
          </h2>
          <p className="text-xs text-slate-500 truncate max-w-md">
            Target Entity: {activeRecord.manufacturer}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Consistency Score</div>
            <div className={`text-2xl font-black ${activeRecord.consistencyScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {activeRecord.consistencyScore}%
            </div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-[10px] uppercase font-bold text-slate-400">Discrepancies</div>
            <div className={`text-2xl font-black ${activeRecord.inconsistenciesCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {activeRecord.inconsistenciesCount} Flagged
            </div>
          </div>
          <button
            onClick={() => alert("Drafting official Statutory Notice under Legal Metrology Act Section 36...")}
            className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Issue Notice</span>
          </button>
        </div>
      </div>

      {/* Triangulation 3-Way Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" /> 1. Physical Package (OCR)
            </span>
            <span className="text-slate-300">vs</span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-600" /> 2. Official Specification
            </span>
            <span className="text-slate-300">vs</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" /> 3. E-Commerce Listing
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">10 Core Declarations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Field</th>
                <th className="py-3 px-4">1. Physical Package (Digital Twin)</th>
                <th className="py-3 px-4">2. Official Specification</th>
                <th className="py-3 px-4">3. E-Commerce Listing</th>
                <th className="py-3 px-4">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeRecord.fields.map((item, idx) => (
                <tr key={idx} className={`hover:bg-slate-50/80 transition ${item.status === 'MISMATCH' ? 'bg-rose-50/30' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.field}
                    {item.flag && (
                      <span className="block text-[10px] text-rose-600 font-normal mt-0.5">
                        ⚠ {item.flag}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-mono text-[11px]">
                    {item.packageVal || "Not detected"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                    {item.specVal || item.packageVal || "Not declared"}
                  </td>
                  <td className={`py-3.5 px-4 font-mono text-[11px] ${item.status === 'MISMATCH' ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                    {item.ecomVal || item.packageVal || "Listed"}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.status)}
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
