import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Mail } from 'lucide-react';

export default function ConsumerProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">User Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage credentials and verified notification preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
            {user?.name?.[0] || 'M'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{user?.name || 'Meera Sundaram'}</h3>
            <p className="text-slate-500">{user?.email || 'meera.s@gmail.com'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {user?.role || 'Consumer'} Account
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-slate-400 block font-medium">Account Status</span>
            <span className="font-semibold text-emerald-700 mt-0.5 block">Active & Verified</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Surveillance Alerts</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">Enabled for Recalled Batches</span>
          </div>
        </div>
      </div>
    </div>
  );
}
