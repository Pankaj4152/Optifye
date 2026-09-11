"use client";

import { useState } from "react";
import { CandidateLine } from "@/lib/data";
import { calculateRoi } from "@/lib/calculate-roi";
import { RefreshCw } from "lucide-react";

interface RoiCalculatorProps {
  candidate: CandidateLine;
  onRecoveryRateChange?: (rate: number) => void;
}

export function RoiCalculator({ candidate, onRecoveryRateChange }: RoiCalculatorProps) {
  const [recoveryRate, setRecoveryRate] = useState<number>(10);

  const roi = calculateRoi(candidate, recoveryRate);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setRecoveryRate(val);
    if (onRecoveryRateChange) {
      onRecoveryRateChange(val);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            ROI Sensitivity Calculator
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Estimated financial recovery from output gap closure.</p>
        </div>

        <button
          onClick={() => {
            setRecoveryRate(10);
            if (onRecoveryRateChange) onRecoveryRateChange(10);
          }}
          className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 py-1 px-2 rounded bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset (10%)</span>
        </button>
      </div>

      {/* Recovery Rate Slider */}
      <div className="bg-black p-4 rounded-lg border border-neutral-800 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="recovery-slider" className="text-xs text-neutral-300 font-medium">
            Recovery Assumption
          </label>
          <span className="font-mono text-sm font-bold text-emerald-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
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
          className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
        />

        <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
          <span>5% Conservative</span>
          <span>10% Baseline</span>
          <span>25% Optimistic</span>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black p-3 rounded-lg border border-neutral-900">
          <div className="text-[11px] text-neutral-500">Annual Gap</div>
          <div className="text-base font-mono font-bold text-white mt-0.5">
            {roi.annualGapUnits.toLocaleString()} <span className="text-[10px] text-neutral-600 font-normal">units</span>
          </div>
        </div>

        <div className="bg-black p-3 rounded-lg border border-neutral-900">
          <div className="text-[11px] text-neutral-500">Recoverable Units</div>
          <div className="text-base font-mono font-bold text-white mt-0.5">
            {roi.recoverableUnitsAnnual.toLocaleString()} <span className="text-[10px] text-neutral-600 font-normal">units</span>
          </div>
        </div>

        <div className="bg-black p-3 rounded-lg border border-neutral-800">
          <div className="text-[11px] text-emerald-400">Recoverable Value</div>
          <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
            {roi.estimatedAnnualValueLakhsFormatted} <span className="text-[10px] text-neutral-400 font-normal">/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
