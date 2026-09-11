import React from 'react';
import { ListTree, ShieldCheck, Clock } from 'lucide-react';

export default function InspectorAudit() {
  const logs = [
    { time: "2026-03-09 11:30 AM", event: "Case Review Started", caseNo: "LM-SZ-2026-0881", actor: "Inspector R. K. Sharma", outcome: "In Progress" },
    { time: "2026-03-09 10:14 AM", event: "Automated OCR & LMPC Audit", caseNo: "LM-SZ-2026-0881", actor: "System Engine", outcome: "Score 68 (Dual Pricing Flagged)" },
    { time: "2026-03-08 04:15 PM", event: "Statutory Notice Issued (Sec 36)", caseNo: "LM-WZ-2026-0882", actor: "Inspector P. Deshmukh", outcome: "Notice Dispatched" },
    { time: "2026-03-08 02:20 PM", event: "Port Consignment Scan", caseNo: "LM-WZ-2026-0882", actor: "Customs Metrology Liaison", outcome: "Origin Missing" },
    { time: "2026-03-06 10:00 AM", event: "Officer Sign-Off Completed", caseNo: "LM-NZ-2026-0883", actor: "Inspector A. Verma", outcome: "Passport Verified & Case Closed" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Official Metrology Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">Immutable enforcement logs, officer sign-offs, and automated scan records.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Case Reference</th>
              <th className="py-3 px-4">Actor / System</th>
              <th className="py-3 px-4">Audit Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {logs.map((l, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{l.time}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{l.event}</td>
                <td className="py-3 px-4 font-mono text-brand-700">{l.caseNo}</td>
                <td className="py-3 px-4 text-slate-700">{l.actor}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                    {l.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
