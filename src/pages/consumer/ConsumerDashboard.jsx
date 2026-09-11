import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  FileText, 
  Award, 
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const { products, setSelectedProductId } = useApp();
  const navigate = useNavigate();

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    navigate(`/consumer/check?id=${id}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Good morning, {user?.name?.split(' ')[0] || 'Meera'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify retail package prices, declarations, and authentic compliance before you buy.
          </p>
        </div>

        <Link
          to="/consumer/check"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
        >
          <Camera className="w-4 h-4" />
          <span>Check a Product</span>
        </Link>
      </div>

      {/* Main Check Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
            Fast Consumer Verification
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Is that MRP stamped or overcharged?
          </h2>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Snap a photo of the product front or price panel. Our engine reads the legal declarations and tells you in plain English if it's verified.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => handleProductSelect('prod-001')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition"
          >
            Sample: Face Wash
          </button>
          <button
            onClick={() => handleProductSelect('prod-004')}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shadow-xs transition"
          >
            Sample: MRP Issue
          </button>
        </div>
      </div>

      {/* Recent Checks Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Recent Product Checks
          </h3>
          <span className="text-xs text-slate-400">
            Stored locally on your device
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {products.slice(0, 4).map((item) => {
            const isPass = item.status === 'verified';
            const isIssue = item.status === 'issue';

            return (
              <div
                key={item.id}
                onClick={() => handleProductSelect(item.id)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={item.images?.front} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.brand}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isPass && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </span>
                  )}
                  {isIssue && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      ISSUE DETECTED
                    </span>
                  )}
                  {item.status === 'retake_required' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      RETAKE
                    </span>
                  )}

                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
