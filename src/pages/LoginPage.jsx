import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { ShieldCheck, User, Building2, Lock, Mail, BadgeCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginConsumer, loginInspector, loginManufacturer } = useAuth();
  const { t } = useTranslation();

  const roleParam = searchParams.get('role') || 'inspector';
  const [activeRole, setActiveRole] = useState(roleParam);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [govtId, setGovtId] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'inspector') {
      setEmail('rk.sharma@gov.in');
      setGovtId('GOV-LM-042');
      setPassword('Inspector@2026');
    } else if (role === 'manufacturer') {
      setEmail('compliance@baypure.com');
      setPassword('manufacturer1234');
      setGovtId('');
    } else {
      setEmail('meera.s@gmail.com');
      setPassword('consumer1234');
      setGovtId('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (activeRole === 'inspector') {
        if (!govtId) throw new Error('Government Inspector ID is required.');
        if (!email) throw new Error('Official email is required.');
        if (!password) throw new Error('Password is required.');
        loginInspector(govtId, email, password);
        navigate('/inspector/dashboard');
      } else if (activeRole === 'manufacturer') {
        if (!email) throw new Error('Company email is required.');
        if (!password) throw new Error('Password is required.');
        loginManufacturer(email, password);
        navigate('/manufacturer/dashboard');
      } else {
        if (!email) throw new Error('Email is required.');
        if (!password) throw new Error('Password is required.');
        loginConsumer(email, password);
        navigate('/consumer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => handleTabChange('consumer')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeRole === 'consumer'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Consumer
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('inspector')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeRole === 'inspector'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Inspector
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('manufacturer')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeRole === 'manufacturer'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Manufacturer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header per role */}
        <div className="text-center">
          {activeRole === 'inspector' && (
            <>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Inspector Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Legal Metrology Enforcement & Investigation
              </p>
            </>
          )}

          {activeRole === 'manufacturer' && (
            <>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 mx-auto flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Manufacturer Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pre-publish label compliance verification
              </p>
            </>
          )}

          {activeRole === 'consumer' && (
            <>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center mb-3">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Consumer Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Check package authenticity and compliance
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Government ID field for Inspector ONLY */}
          {activeRole === 'inspector' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Government Inspector ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={govtId}
                  onChange={(e) => setGovtId(e.target.value)}
                  placeholder="e.g. GOV-LM-042"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeRole === 'inspector' ? 'Official Email' : 'Email Address'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 text-xs font-bold text-white rounded-lg shadow-xs transition ${
                activeRole === 'inspector'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : activeRole === 'manufacturer'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {t('login')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
