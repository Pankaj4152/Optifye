"use client";

import { useState } from "react";
import { CandidateLine } from "@/lib/data";
import { calculateRoi } from "@/lib/calculate-roi";
import { Calculator, Sparkles, RefreshCw } from "lucide-react";

interface RoiCalculatorProps {
  candidate: CandidateLine;
  onRecoveryRateChange?: (rate: number) => void;
}

export function RoiCalculator({ candidate, onRecoveryRateChange }: RoiCalculatorProps) {
  const [recoveryRate, setRecoveryRate] = useState<number>(10); // default 10%

  const roi = calculateRoi(candidate, recoveryRate);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRecoveryRate(val);
    if (onRecoveryRateChange) {
      onRecoveryRateChange(val);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Dynamic Expansion ROI Sensitivity</h3>
            <p className="text-xs text-slate-400">Deterministic financial model quantifying value from gap recovery.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setRecoveryRate(10);
            if (onRecoveryRateChange) onRecoveryRateChange(10);
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto py-1 px-2 rounded hover:bg-slate-800 transition-colors"
          title="Reset to 10% baseline"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset (10%)</span>
        </button>
      </div>

      {/* Recovery Rate Single Slider Control */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 mb-5">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="recovery-slider" className="text-xs font-semibold text-slate-300">
            Target Output Gap Recovery Rate
          </label>
          <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
            {recoveryRate}%
          </span>
        </div>

        <input
          id="recovery-slider"
          type="range"
          min="5"
          max="25"
          step="1"
          value={recoveryRate}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
          <span>5% (Conservative)</span>
          <span>10% (Baseline)</span>
          <span>25% (Optimistic)</span>
        </div>
      </div>

      {/* Formula & Calculation Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/60">
          <div className="text-xs text-slate-400">Annual Output Gap</div>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            {roi.annualGapUnits.toLocaleString()} <span className="text-xs font-normal text-slate-500">units/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {roi.monthlyGapUnits.toLocaleString()} units/mo deficit × 12
          </div>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/60">
          <div className="text-xs text-slate-400">Recoverable Units</div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
            {roi.recoverableUnitsAnnual.toLocaleString()} <span className="text-xs font-normal text-slate-500">units/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {roi.annualGapUnits.toLocaleString()} × {recoveryRate}% rate
          </div>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/10">
          <div className="text-xs text-emerald-300 font-medium">Estimated Annual Value</div>
          <div className="text-xl font-mono font-black text-emerald-300 mt-0.5">
            {roi.estimatedAnnualValueLakhsFormatted} <span className="text-xs font-normal text-slate-400">/yr</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {roi.recoverableUnitsAnnual.toLocaleString()} × ₹{candidate.contributionMarginPerUnit} margin
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-1.5 italic">
        <Sparkles className="w-3 h-3 text-slate-500 shrink-0" />
        <span>Calculated deterministically using synthetic operating margins. Zero LLM hallucinations.</span>
      </div>
    </div>
  );
}
