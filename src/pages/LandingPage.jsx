import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>{t('subtitle')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('heroTitle1')}<br />
            <span className="text-brand-600">{t('heroTitle2')}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <span>{t('launchPlatform')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/rules"
              className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-brand-600" />
              <span>{t('exploreRules')}</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Evidence-Backed OCR
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dynamic Gazette Mapping
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Human-in-the-Loop Signoff
            </span>
          </div>

        </div>
      </section>

      {/* Three Stakeholder Portals Section (STRICT MINIMAL TEXT AS REQUESTED) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Consumer Portal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('consumerPortal')}
              </h3>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {t('consumerTagline')}
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/consumer/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100"
              >
                <span>{t('enterPortal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Inspector Portal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('inspectorPortal')}
              </h3>
              <p className="text-sm font-semibold text-emerald-600 mt-1">
                {t('inspectorTagline')}
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/inspector/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50/60 px-3 py-1.5 rounded-lg border border-emerald-100"
              >
                <span>{t('enterPortal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Manufacturer Portal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('manufacturerPortal')}
              </h3>
              <p className="text-sm font-semibold text-purple-600 mt-1">
                {t('manufacturerTagline')}
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/manufacturer/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50/60 px-3 py-1.5 rounded-lg border border-purple-100"
              >
                <span>{t('enterPortal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Note: Cross-source Triangulation is completely REMOVED from the Homepage as instructed! */}

    </div>
  );
}
