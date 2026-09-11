import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const handleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  const handleQuickDemo = (role) => {
    loginAs(role);
    if (role === 'consumer') navigate('/consumer/dashboard');
    else if (role === 'manufacturer') navigate('/manufacturer/dashboard');
    else if (role === 'inspector') navigate('/inspector/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select Your Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1.5">
          Choose an access role to continue to the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Consumer Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Consumer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Check products before buying.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={() => handleSelect('consumer')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleQuickDemo('consumer')}
              className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
            >
              Demo Quick Access
            </button>
          </div>
        </div>

        {/* Manufacturer Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Manufacturer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Validate labels before publishing.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={() => handleSelect('manufacturer')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleQuickDemo('manufacturer')}
              className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
            >
              Demo Quick Access
            </button>
          </div>
        </div>

        {/* Inspector Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review evidence and compliance cases.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={() => handleSelect('inspector')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleQuickDemo('inspector')}
              className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
            >
              Demo Quick Access
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
