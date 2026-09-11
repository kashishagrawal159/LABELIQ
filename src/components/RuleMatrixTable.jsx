import React, { useState } from 'react';
import { REGULATORY_RULES } from '../data/regulatoryRules';
import { DEMO_RULEBOOK_DATA } from '../data/demoRulebook';
import { Search, Filter, Scale, CheckCircle2, ExternalLink, ShieldCheck, ChevronRight, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export default function RuleMatrixTable() {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'gazette'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedRuleId, setExpandedRuleId] = useState(null);

  const filteredDemoRules = DEMO_RULEBOOK_DATA.filter(rule => {
    const q = search.toLowerCase();
    return (
      rule.rule_id.toLowerCase().includes(q) ||
      rule.field.toLowerCase().includes(q) ||
      rule.field_label.toLowerCase().includes(q) ||
      rule.requirement.toLowerCase().includes(q) ||
      rule.validation.toLowerCase().includes(q) ||
      rule.severity.toLowerCase().includes(q)
    );
  });

  const filteredGazetteRules = REGULATORY_RULES.filter(rule => {
    const q = search.toLowerCase();
    const matchesSearch = 
      rule.requirement.toLowerCase().includes(q) ||
      rule.provision.toLowerCase().includes(q) ||
      rule.framework.toLowerCase().includes(q) ||
      rule.description.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || rule.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      
      {/* Tab Switcher: Demo Dataset vs Official Gazette Reference */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-2 ${
              activeTab === 'demo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo Rulebook Dataset (10 Core Fields)</span>
          </button>

          <button
            onClick={() => setActiveTab('gazette')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-2 ${
              activeTab === 'gazette' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Official Gazette Reference Matrix</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* TAB 1: DEMO RULEBOOK DATASET */}
      {activeTab === 'demo' && (
        <div className="space-y-4">
          
          {/* Prominent Demo Data Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold block tracking-wider uppercase text-[11px] text-amber-800">
                DEMO / SAMPLE DATA — REGULATORY SYSTEM DEMOSET
              </span>
              <p className="text-amber-700">
                This dataset contains demonstration rules for the required 10 label fields. This is ONLY demonstration data and must not be presented as verified official legal requirements.
              </p>
            </div>
          </div>

          {/* Table of Demo Rules */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rule ID</th>
                    <th className="py-3 px-4">Field</th>
                    <th className="py-3 px-4">Requirement</th>
                    <th className="py-3 px-4">Validation</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDemoRules.map((rule) => {
                    const isDateRule = rule.field === 'manufacturing_date' || rule.field === 'expiry_date';
                    return (
                      <tr 
                        key={rule.rule_id}
                        className={`hover:bg-slate-50/80 transition ${isDateRule ? 'bg-amber-50/30' : ''}`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {rule.rule_id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{rule.field_label}</span>
                          <span className="text-[10px] font-mono text-slate-400 block">{rule.field}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 max-w-xs">
                          {rule.requirement}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px] max-w-xs">
                          {rule.validation}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            rule.severity === 'CRITICAL' 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : rule.severity === 'HIGH'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {rule.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {rule.source}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {rule.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: OFFICIAL GAZETTE REFERENCE */}
      {activeTab === 'gazette' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Requirement</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Legal Provision</th>
                    <th className="py-3 px-4">Applicability</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGazetteRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{rule.requirement}</td>
                      <td className="py-3 px-4 text-slate-600">{rule.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{rule.provision}</td>
                      <td className="py-3 px-4 text-slate-600">{rule.applicability}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{rule.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
