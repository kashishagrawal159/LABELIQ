import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { ShieldCheck, Mail, Lock, BadgeCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function InspectorLogin() {
  const { loginInspector } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [govtId, setGovtId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/inspector/dashboard';

  const handleDemoFill = () => {
    setGovtId('GOV-LM-042');
    setEmail('rk.sharma@gov.in');
    setPassword('Inspector@2026');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!govtId.trim()) {
      setError('Please enter your Government Inspector ID.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Official Government Email.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    try {
      loginInspector(govtId, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your official credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Government Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded border border-emerald-200">
              Government of India • Legal Metrology
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1.5">
              {t('inspectorLogin')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized surveillance, investigation & enforcement portal
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Government Inspector ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('govtInspectorId')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={govtId}
                onChange={(e) => setGovtId(e.target.value)}
                placeholder="e.g. GOV-LM-042"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('officialEmail')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t('password')} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('login')}</span>
            </button>
          </div>

        </form>

        {/* Quick Demo Pre-fill for judging/testing */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-semibold text-emerald-700 hover:underline"
          >
            Auto-fill Officer Credentials
          </button>
          <span className="text-[10px] text-slate-400 font-mono">LM-SURVEILLANCE-V2</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <KeyRound className="w-5 h-5" />
              <span>Reset Inspector Credentials</span>
            </div>
            <p className="text-xs text-slate-600">
              Enter your official government email to receive password recovery instructions via NIC Gov mail.
            </p>
            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium">
                ✓ Password recovery link dispatched to your official mail ID.
              </div>
            ) : (
              <input
                type="email"
                placeholder="officer@gov.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  onClick={() => setForgotSuccess(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Send Recovery Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
