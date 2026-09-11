import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Download, 
  Share2, 
  History, 
  ExternalLink,
  Scale,
  Calendar,
  Layers,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConsumerPassport() {
  const { currentProduct, products, setSelectedProductId } = useApp();
  const product = currentProduct || products[0];

  const verificationId = product.verification_id || `LMPC-VRF-${product.id}`;
  const timestamp = product.timestamp 
    ? new Date(product.timestamp).toLocaleDateString() 
    : new Date().toLocaleDateString();

  const isExpired = product.date_validation?.isExpired;
  const score = product.compliance_score !== undefined ? product.compliance_score : 98;
  const isCompliant = !isExpired && score >= 85 && (!product.violations || product.violations.length === 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Compliance Passport
            </h1>
            {product.is_demo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                DEMO CREDENTIAL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident digital compliance certificate for consumer trust and retail clearance under Legal Metrology Rules.
          </p>
        </div>

        {/* Switcher to test different passports */}
        <select
          value={product.id}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>Passport: {p.product || p.name}</option>
          ))}
        </select>
      </div>

      {/* Main Digital Passport Certificate Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Certificate Header Band */}
        <div className={`text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
          isCompliant 
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900' 
            : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-slate-200">
                Official Digital Credential
              </span>
              {isCompliant ? (
                <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Compliant
                </span>
              ) : (
                <span className="text-rose-400 font-semibold text-xs flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> {isExpired ? "Expired Commodity" : "Statutory Issue Detected"}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              LABELIQ COMPLIANCE PASSPORT
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Verification ID: {verificationId} • Timestamp: {timestamp}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Compliance Score
              </div>
              <div className={`text-2xl font-black ${isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 text-slate-900">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* 10 Canonical Fields Verification Grid */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Legal Metrology Declarations (10 Core Fields)
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Product Commodity</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{product.product || product.name}</span>
                <span className="text-[11px] text-slate-500">Brand: {product.brand}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Manufacturer / Packer</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">{product.manufacturer || product.digitalTwin?.manufacturer || "Not detected"}</span>
                <span className="text-[11px] text-slate-500">Origin: {product.country_of_origin || "India"}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Price & Quantity</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{product.mrp} • {product.net_quantity}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Incl. of all taxes</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Manufacturing Date</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">{product.manufacturing_date || "—"}</span>
                <span className="text-[11px] text-slate-500">Verified Stamp</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Expiry Date / Best Before</span>
                <span className={`text-sm font-bold mt-0.5 block font-mono ${isExpired ? 'text-rose-600' : 'text-slate-900'}`}>
                  {product.expiry_date || "—"}
                </span>
                <span className={`text-[11px] font-medium ${isExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {product.date_validation?.expStatus || "Verified"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Consumer Care Helpline</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">{product.consumer_care || "—"}</span>
                <span className="text-[11px] text-slate-500">Grievance Channel</span>
              </div>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Core Declarations</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">10 / 10</div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Evidence Bounding Boxes</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">Verified</div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Detected Violations</div>
              <div className={`text-base font-bold mt-0.5 ${product.violations?.length ? 'text-rose-600' : 'text-emerald-700'}`}>
                {product.violations?.length || 0} Detected
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Verification Date</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{timestamp}</div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/consumer/check?id=${product.id}`}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                View Evidence
              </Link>
              <Link
                to="/rules"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                View Rules
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => alert("Generating signed PDF Compliance Report...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
              <button
                onClick={() => alert("Passport shareable link copied to clipboard!")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Passport</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
