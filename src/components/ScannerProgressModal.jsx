import React, { useEffect, useState } from 'react';
import { 
  Scan, 
  CheckCircle2, 
  Loader2, 
  Calendar, 
  FileSearch, 
  Scale, 
  ShieldCheck, 
  Eye, 
  Cpu, 
  Layers 
} from 'lucide-react';

export const SCANNER_STAGES = [
  { id: 1, name: "Detecting Package", desc: "Isolating bounding geometry & principal display panel (PDP)" },
  { id: 2, name: "Detecting Text Regions", desc: "Identifying declaration blocks and stamp positions" },
  { id: 3, name: "OCR Processing", desc: "Extracting optical text tokens across panels" },
  { id: 4, name: "Detecting Product Fields", desc: "Extracting Product, Brand, Manufacturer, Net Quantity, MRP" },
  { id: 5, name: "Detecting Manufacturing Date", desc: "Searching for MFG, MFD, PKD patterns and validating calendar format" },
  { id: 6, name: "Detecting Expiry Date", desc: "Searching for EXP, Best Before patterns & shelf-life derivation" },
  { id: 7, name: "Validating Against Rulebook", desc: "Cross-checking against Legal Metrology Rules 2011 & Date rules" },
  { id: 8, name: "Generating Compliance Result", desc: "Synthesizing Digital Twin, Risk Priority, & Compliance Passport" },
];

export default function ScannerProgressModal({ 
  isOpen, 
  isDemo = true,
  imagePreview = null,
  onComplete,
  autoStart = true
}) {
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      setCompletedStages([]);
      return;
    }

    if (!autoStart) return;

    let stageTimer;
    let stageIndex = 1;

    // Progression cadence: ~350ms per stage so total ~2.8s total (responsive & authentic)
    const runNextStage = () => {
      if (stageIndex <= 8) {
        setCurrentStage(stageIndex);
        setCompletedStages(prev => [...new Set([...prev, stageIndex - 1])]);

        stageTimer = setTimeout(() => {
          stageIndex++;
          runNextStage();
        }, 360);
      } else {
        setCompletedStages([1, 2, 3, 4, 5, 6, 7, 8]);
        stageTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    };

    runNextStage();

    return () => {
      clearTimeout(stageTimer);
    };
  }, [isOpen, autoStart]);

  if (!isOpen) return null;

  const progressPercentage = Math.round((currentStage / 8) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              LABEL IQ SCANNER — MULTIMODAL OCR PIPELINE
            </span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isDemo ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
          }`}>
            {isDemo ? "DEMO MODE" : "LIVE ANALYSIS"}
          </span>
        </div>

        {/* Scanner Body */}
        <div className="p-6 space-y-5">
          
          {/* Visual Scanner HUD with Product Image Preview */}
          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Scanning Product" 
                className="w-full h-full object-contain opacity-80"
              />
            ) : (
              <div className="text-center space-y-2">
                <Scan className="w-12 h-12 text-brand-400 mx-auto animate-pulse" />
                <span className="text-xs font-mono text-slate-400 block">
                  Processing Packaging Evidence Stream...
                </span>
              </div>
            )}

            {/* Glowing Laser Scan Line Animation */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-[bounce_2s_infinite]" />

            {/* Corner HUD Reticles */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Current Stage Overlay Badge */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Stage {currentStage}/8: {SCANNER_STAGES[currentStage - 1]?.name}</span>
              </span>
              <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* 8 Stages Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-h-48 overflow-y-auto space-y-2">
            {SCANNER_STAGES.map(stage => {
              const isCompleted = completedStages.includes(stage.id);
              const isCurrent = currentStage === stage.id;
              const isUpcoming = stage.id > currentStage;

              return (
                <div 
                  key={stage.id}
                  className={`flex items-center gap-2.5 text-xs transition-all ${
                    isCompleted 
                      ? 'text-slate-800 font-medium' 
                      : isCurrent 
                        ? 'text-brand-700 font-bold bg-brand-50/80 px-2 py-1 rounded-md' 
                        : 'text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-brand-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}

                  <span className="flex-1 truncate">
                    {stage.name}
                  </span>

                  {isCurrent && (
                    <span className="text-[10px] text-brand-600 font-mono shrink-0 animate-pulse">
                      Analyzing...
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Deterministic verification under Legal Metrology Rules</span>
            <span className="font-mono text-slate-400">SIH26034</span>
          </div>

        </div>

      </div>
    </div>
  );
}
