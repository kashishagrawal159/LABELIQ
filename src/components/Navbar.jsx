import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Scale, 
  User, 
  LogOut, 
  Building2, 
  FileText, 
  Globe, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActiveUserBadge = () => {
    if (!user) return null;
    if (user.role === 'inspector') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {user.govtId || 'Official Inspector'}
        </span>
      );
    }
    if (user.role === 'manufacturer') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Building2 className="w-3.5 h-3.5 text-purple-600" />
          {t('manufacturer')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <User className="w-3.5 h-3.5 text-blue-600" />
        {t('consumer')}
      </span>
    );
  };

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:opacity-90 transition">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-tight">
                  LABEL<span className="text-brand-600">IQ</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                  {t('tagline')}
                </span>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md transition ${location.pathname === '/' ? 'text-brand-600 bg-brand-50' : 'hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {t('home')}
              </Link>
              <Link
                to="/consumer"
                className={`px-3 py-1.5 rounded-md transition ${location.pathname.startsWith('/consumer') ? 'text-brand-600 bg-brand-50' : 'hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {t('consumer')}
              </Link>
              <Link
                to="/inspector"
                className={`px-3 py-1.5 rounded-md transition ${location.pathname.startsWith('/inspector') ? 'text-brand-600 bg-brand-50' : 'hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {t('inspector')}
              </Link>
              <Link
                to="/manufacturer"
                className={`px-3 py-1.5 rounded-md transition ${location.pathname.startsWith('/manufacturer') ? 'text-brand-600 bg-brand-50' : 'hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {t('manufacturer')}
              </Link>
              <Link
                to="/rules"
                className={`px-3 py-1.5 rounded-md transition ${location.pathname === '/rules' ? 'text-brand-600 bg-brand-50' : 'hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {t('ruleMatrix')}
              </Link>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector Dropdown (Whole Website i18n) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                title="Change Website Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline font-semibold">{currentLangObj.native}</span>
                <span className="sm:hidden font-semibold">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Indian Languages
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                          language === l.code ? 'font-bold text-brand-600 bg-brand-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{l.native}</span>
                        <span className="text-[10px] text-slate-400">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User or Login Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {getActiveUserBadge()}

                <Link
                  to={
                    user.role === 'inspector' ? '/inspector/dashboard' :
                    user.role === 'manufacturer' ? '/manufacturer/dashboard' :
                    '/consumer/dashboard'
                  }
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition shadow-xs"
                >
                  {t('dashboard')}
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition shadow-xs"
                >
                  {t('login')}
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
