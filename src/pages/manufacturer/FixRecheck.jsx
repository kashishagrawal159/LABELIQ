import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Layers,
  Wrench,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FixRecheck() {
  const [fixedState, setFixedState] = useState(false); // false: Issue state (68), true: Rechecked state (98)
  const [rechecking, setRechecking] = useState(false);

  const handleRecheck = () => {
    setRechecking(true);
    setTimeout(() => {
      setRechecking(false);
      setFixedState(true);
    }, 1200);
  };

  const handleReset = () => {
    setFixedState(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              <RefreshCw className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Fix & Recheck Lab
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Remediate packaging non-compliances and re-evaluate compliance score instantly.
          </p>
        </div>

        {fixedState && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Reset to Original Issue
          </button>
        )}
      </div>

      {/* Before / After Score Transition Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target SKU: NIM-BVR-250
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Nimbudi Refreshing Lemon Drink (250 ml)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Category: Food & Beverage • Domestic Packaged Commodity
            </p>
          </div>

          {/* Dynamic Score Comparison Badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Original</span>
              <span className="text-2xl font-black text-rose-600 block">68</span>
              <span className="text-[10px] text-rose-700 font-medium">Issue</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400" />

            <div className="text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Rechecked</span>
              <span className={`text-2xl font-black block transition-all ${fixedState ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
                {fixedState ? '98' : '—'}
              </span>
              <span className={`text-[10px] font-medium ${fixedState ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                {fixedState ? '✓ Cleared' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Fix & Recheck Workflow */}
      {!fixedState ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Detected Issues & Recommendations */}
          <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold">
                2 Non-Compliances Flagged on Original Proof
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 space-y-1">
                <div className="font-bold text-rose-900">
                  1. Missing Unit Sale Price (Rule 6(1)(f) / Rule 18)
                </div>
                <p className="text-slate-700">
                  <strong>Detected:</strong> No Unit Sale Price declared alongside retail price of ₹25.00 for 250 ml pack.
                </p>
                <p className="text-rose-800 font-semibold pt-1">
                  ✓ Recommended Action: Add text "Unit Sale Price: ₹0.10 / ml" adjacent to MRP in min 1.5mm font.
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 space-y-1">
                <div className="font-bold text-rose-900">
                  2. E-Commerce Dual Pricing Mismatch (Rule 18(2))
                </div>
                <p className="text-slate-700">
                  <strong>Detected:</strong> Online marketplace listing displays ₹35.00 against stamped ₹25.00.
                </p>
                <p className="text-rose-800 font-semibold pt-1">
                  ✓ Recommended Action: Synchronize marketplace catalog price to match stamped package MRP ₹25.00.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Upload Revised Artwork & Trigger Recheck */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Upload Revised Label Artwork (Proof v2.0)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload revised digital artwork containing corrected Unit Sale Price declarations.
              </p>

              <div className="mt-4 border-2 border-dashed border-purple-200 bg-purple-50/20 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-900 block">
                  nimbudi_front_revised_v2.jpg
                </span>
                <span className="text-[11px] text-purple-700 mt-0.5 block">
                  Revised Proof with "USP ₹0.10/ml" ready
                </span>
              </div>
            </div>

            <button
              onClick={handleRecheck}
              disabled={rechecking}
              className="w-full py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              {rechecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-executing Legal Metrology Engine...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Recheck Revised Artwork</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* Recheck Complete Success State */
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  Recheck Passed
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  All Mandatory Requirements Cleared
                </h3>
                <p className="text-xs text-slate-500">
                  Compliance Score improved from 68/100 to 98/100.
                </p>
              </div>
            </div>

            <Link
              to="/consumer/passport"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Generate Compliance Passport</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Unit Sale Price Check: PASS</span>
              <p className="text-slate-600">
                "₹0.10 / ml" detected adjacent to MRP on Principal Display Panel. Meets LMPC Rule 6(1)(f) standards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Marketplace Pricing Check: PASS</span>
              <p className="text-slate-600">
                Catalog price updated to ₹25.00 inclusive of taxes, eliminating dual pricing violation.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
