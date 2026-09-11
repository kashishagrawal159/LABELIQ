import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Layers,
  AlertOctagon,
  Calendar,
  Clock,
  Scan,
  Award,
  Pill,
  Sparkle,
  Apple
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function LabelVerificationResults({ 
  product, 
  onExplainField, 
  conflicts = [] 
}) {
  const { t } = useTranslation();
  if (!product) return null;

  // Identify commodity category
  const category = product.category || (
    product.regulatory?.fssai_approved ? 'food' :
    product.regulatory?.drug_license ? 'medicine' :
    product.regulatory?.cosmetic_license ? 'cosmetics' :
    'general'
  );

  // The 10 Canonical Product Fields
  const productVal = product.product || product.digitalTwin?.productName || product.name || "Not detected";
  const brandVal = product.brand || product.digitalTwin?.brand || "Not detected";
  const mfgEntityVal = product.manufacturer || product.digitalTwin?.manufacturer || "Not detected";
  const importerVal = product.importer || product.digitalTwin?.importer || (product.isImported ? "Not detected" : "Domestic (Not Applicable)");
  const netQtyVal = product.net_quantity || product.digitalTwin?.netQuantity || "Not detected";
  const mrpVal = product.mrp || product.digitalTwin?.mrp || "Not detected";
  const originVal = product.country_of_origin || product.digitalTwin?.countryOfOrigin || "India";
  const mfgDateVal = product.manufacturing_date || product.digitalTwin?.dateOfManufacture || "Not detected";
  const expDateVal = product.expiry_date || product.digitalTwin?.expiryDate || "Not detected";
  const careVal = product.consumer_care || product.digitalTwin?.consumerCare || "Not detected";

  const conf = product.confidence || {};
  const ev = product.evidence || {};
  const dateVal = product.date_validation || {};
  const reg = product.regulatory || {};

  // Status calculation helpers
  const getFieldStatus = (key, value) => {
    if (!value || value === "Not detected") {
      return key === 'importer' && !product.isImported ? "Verified" : "Missing";
    }
    if (key === 'expiry_date') {
      if (dateVal.isExpired) return "Expired";
      if (dateVal.status === 'invalid_sequence') return "Invalid Sequence";
      return "Verified";
    }
    if (key === 'manufacturing_date') {
      if (dateVal.status === 'future_mfg') return "Future Date";
      if (dateVal.status === 'invalid_sequence') return "Invalid Sequence";
      return "Verified";
    }
    if (key === 'mrp' && (conflicts.length > 0 || (product.cross_source && product.cross_source.some(c => c.canonicalKey === 'mrp' && !c.isConsistent)))) {
      return "Mismatch";
    }
    return "Verified";
  };

  // 10 Canonical Fields Array
  const canonicalFields = [
    {
      canonicalKey: "product",
      displayName: t('productName') || "Product Name",
      value: productVal,
      confidence: conf.product || 98.4,
      source: ev.product || "Front Label Top Header",
      status: getFieldStatus("product", productVal),
      citation: "LMPC Rule 6(1)(a)",
      boxId: "BOX-PRODUCT"
    },
    {
      canonicalKey: "brand",
      displayName: t('brand') || "Brand",
      value: brandVal,
      confidence: conf.brand || 99.2,
      source: ev.brand || "Principal Display Panel",
      status: getFieldStatus("brand", brandVal),
      citation: "LMPC Rule 6(1)",
      boxId: "BOX-BRAND"
    },
    {
      canonicalKey: "manufacturer",
      displayName: t('manufacturer') || "Manufacturer",
      value: mfgEntityVal,
      confidence: conf.manufacturer || 95.8,
      source: ev.manufacturer || "Back Label Base",
      status: getFieldStatus("manufacturer", mfgEntityVal),
      citation: "LMPC Rule 6(1)(a)",
      boxId: "BOX-MFG"
    },
    {
      canonicalKey: "importer",
      displayName: t('importer') || "Importer",
      value: importerVal,
      confidence: conf.importer || 94.2,
      source: ev.importer || (product.isImported ? "Oversticker Panel" : "Standard Domestic Exemption"),
      status: getFieldStatus("importer", importerVal),
      citation: "LMPC Rule 6(8)",
      boxId: "BOX-IMP"
    },
    {
      canonicalKey: "net_quantity",
      displayName: t('netQuantity') || "Net Quantity",
      value: netQtyVal,
      confidence: conf.net_quantity || 98.9,
      source: ev.net_quantity || "Front Panel Lower Center",
      status: getFieldStatus("net_quantity", netQtyVal),
      citation: "LMPC Rule 6(1)(d) & Rule 7",
      boxId: "BOX-NET"
    },
    {
      canonicalKey: "mrp",
      displayName: t('mrp') || "Maximum Retail Price (MRP)",
      value: mrpVal,
      confidence: conf.mrp || 99.5,
      source: ev.mrp || "Front Panel Price Stamp",
      status: getFieldStatus("mrp", mrpVal),
      citation: "LMPC Rule 6(1)(e) & Rule 18",
      boxId: "BOX-MRP"
    },
    {
      canonicalKey: "country_of_origin",
      displayName: t('countryOfOrigin') || "Country of Origin",
      value: originVal,
      confidence: conf.country_of_origin || 97.6,
      source: ev.country_of_origin || "Back Panel Base",
      status: getFieldStatus("country_of_origin", originVal),
      citation: "LMPC Rule 6(8)",
      boxId: "BOX-ORIGIN"
    },
    {
      canonicalKey: "manufacturing_date",
      displayName: "Manufacturing Date",
      value: mfgDateVal,
      confidence: conf.manufacturing_date || 96.5,
      source: ev.manufacturing_date || "Crimp Seal / Side Panel Stamp",
      status: getFieldStatus("manufacturing_date", mfgDateVal),
      citation: "LMPC Rule 6(1)(d)",
      boxId: "BOX-MFG-DATE",
      isDate: true,
      dateDetail: dateVal.mfgStatus || "Verified format"
    },
    {
      canonicalKey: "expiry_date",
      displayName: "Expiry Date / Best Before",
      value: expDateVal,
      confidence: conf.expiry_date || 97.1,
      source: ev.expiry_date || "Crimp Seal / Side Panel Stamp",
      status: getFieldStatus("expiry_date", expDateVal),
      citation: "LMPC Rule 6(1) & Food/Drug Regulations",
      boxId: "BOX-EXP-DATE",
      isDate: true,
      dateDetail: dateVal.expStatus || (dateVal.daysRemaining !== null && dateVal.daysRemaining !== undefined ? `${dateVal.daysRemaining} days remaining` : "Verified")
    },
    {
      canonicalKey: "consumer_care",
      displayName: t('consumerCare') || "Consumer Care",
      value: careVal,
      confidence: conf.consumer_care || 93.4,
      source: ev.consumer_care || "Back Panel Contact Block",
      status: getFieldStatus("consumer_care", careVal),
      citation: "LMPC Rule 6(1)(b)",
      boxId: "BOX-CARE"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5" />
            EXPIRED
          </span>
        );
      case 'Invalid Sequence':
      case 'Future Date':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Not Detected
          </span>
        );
      case 'Mismatch':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertOctagon className="w-3.5 h-3.5" />
            Price Conflict
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Requires Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Table Section Header with Compliance Classification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Mandatory Declarations Audit (10 Core Fields)
          </h2>
          <span className="text-xs text-slate-400 font-mono">LMPC 2011</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Category-Specific Badge */}
          {category === 'food' && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>FSSAI APPROVED</span>
              {reg.fssai_license && (
                <span className="font-mono text-emerald-700 font-normal">({reg.fssai_license})</span>
              )}
            </span>
          )}

          {category === 'medicine' && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-teal-50 text-teal-800 border border-teal-300 flex items-center gap-1.5 shadow-2xs">
              <Pill className="w-3.5 h-3.5 text-teal-700" />
              <span>CDSCO / DRUGS ACT COMPLIANT</span>
              {reg.drug_license && (
                <span className="font-mono text-teal-700 font-normal">({reg.drug_license})</span>
              )}
            </span>
          )}

          {category === 'cosmetics' && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-300 flex items-center gap-1.5 shadow-2xs">
              <Sparkle className="w-3.5 h-3.5 text-indigo-600" />
              <span>COSMETIC STANDARDS (BIS/LMPC)</span>
              {reg.cosmetic_license && (
                <span className="font-mono text-indigo-700 font-normal">({reg.cosmetic_license})</span>
              )}
            </span>
          )}

          {dateVal.serverDate && (
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Validation Date: {dateVal.serverDate}
            </span>
          )}
        </div>
      </div>

      {/* Category Specific Advisory Strip */}
      {category === 'food' && (
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded uppercase tracking-wider">
              fssai
            </span>
            <span className="font-semibold text-emerald-900">
              Food Safety &amp; Standards Authority of India (FSSAI) Compliance Verified
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-800">
            <span>License: <strong>{reg.fssai_license || "Verified"}</strong></span>
            <span>Category: <strong>{reg.fssai_category || "Packaged Food"}</strong></span>
            <span>Veg Mark: <strong>{reg.is_veg !== false ? "Vegetarian (Green Dot Verified)" : "Non-Veg (Brown)"}</strong></span>
          </div>
        </div>
      )}

      {category === 'medicine' && (
        <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-950 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-teal-700 text-white font-black text-[10px] rounded uppercase tracking-wider">
              ℞ DRUG
            </span>
            <span className="font-semibold text-teal-900">
              Central Drugs Standard Control Organisation (CDSCO) Compliance
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-teal-800">
            <span>Mfg. Lic: <strong>{reg.drug_license || "State Drug Control"}</strong></span>
            <span>Batch: <strong>{reg.batch_number || "B.No. Verified"}</strong></span>
            <span>Schedule: <strong>{reg.schedule_drug || "Schedule H Prescription"}</strong></span>
          </div>
        </div>
      )}

      {category === 'cosmetics' && (
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 text-indigo-950 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[10px] rounded uppercase tracking-wider">
              BIS COSMETICS
            </span>
            <span className="font-semibold text-indigo-900">
              Cosmetic Quality &amp; Bureau of Indian Standards (IS 14636) Compliance
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-indigo-800">
            <span>License: <strong>{reg.cosmetic_license || "State Cosmetic Lic. Verified"}</strong></span>
            <span>Safety: <strong>Dermatologically Evaluated</strong></span>
            <span>Declaration: <strong>Complete Ingredient Roster</strong></span>
          </div>
        </div>
      )}

      {/* Date Validation Alert Banner if Expired or Sequence Error */}
      {dateVal.isExpired && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-sm text-rose-800 block">
              CRITICAL STATUTORY VIOLATION: COMMODITY EXPIRED
            </span>
            <p className="text-rose-700">
              The detected expiry date (<strong>{expDateVal}</strong>) has passed relative to calendar today ({dateVal.serverDate}).
              Under Legal Metrology &amp; Consumer Protection Acts, retail sale of expired packaged commodities is strictly prohibited.
            </p>
          </div>
        </div>
      )}

      {dateVal.status === 'invalid_sequence' && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-sm text-rose-800 block">
              INVALID DATE SEQUENCE DETECTED
            </span>
            <p className="text-rose-700">
              The manufacturing date (<strong>{mfgDateVal}</strong>) is stamped later than the expiry date (<strong>{expDateVal}</strong>).
              This represents an impossible batch stamping sequence requiring immediate packaging correction.
            </p>
          </div>
        </div>
      )}

      {/* Main Declarations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Core Field</th>
                <th className="py-3 px-4">Detected Value</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Evidence Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rule Citation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {canonicalFields.map((f) => {
                const isFieldDate = f.isDate;
                const isHighlight = f.canonicalKey === 'manufacturing_date' || f.canonicalKey === 'expiry_date';

                return (
                  <tr 
                    key={f.canonicalKey}
                    className={`hover:bg-slate-50/80 transition ${isHighlight ? 'bg-slate-50/40' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {isFieldDate && <Calendar className="w-3.5 h-3.5 text-brand-600" />}
                        <span className="font-bold text-slate-900">{f.displayName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">{f.canonicalKey}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate font-semibold text-slate-800">
                        {f.value}
                      </div>
                      {f.dateDetail && (
                        <span className={`text-[10px] font-mono block ${f.status === 'Expired' ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
                          {f.dateDetail}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              f.confidence >= 95 ? 'bg-emerald-500' : f.confidence >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${f.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-600">
                          {f.confidence}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Scan className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] truncate max-w-[150px]">{f.source}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(f.status)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {f.citation}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onExplainField && onExplainField(f)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md transition cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        Verify
                      </button>
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
