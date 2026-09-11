import { CandidateLine, Deployment } from "@/lib/data";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ComparisonHeroProps {
  proven: Deployment;
  candidate: CandidateLine;
  outputGapPct: number;
  recoverableAnnualValue: string;
}

export function ComparisonHero({
  proven,
  candidate,
  outputGapPct,
  recoverableAnnualValue,
}: ComparisonHeroProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-7">
      {/* Narrative Header */}
      <div className="pb-5 mb-6 border-b border-neutral-800">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
          Expansion Pattern Replication
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Proven Deployment (A1) → Recommended Expansion (B2)
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Optifye computer vision already digitalized and improved {proven.name}. Applying the identical camera setup to {candidate.name} addresses an active {outputGapPct}% output deficit.
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Proven Line */}
        <div className="rounded-xl border border-neutral-800 bg-black p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Proven Deployment
              </span>
              <span className="text-xs text-neutral-500 font-mono">{proven.installedDate}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{proven.name}</h3>
            <p className="text-xs text-neutral-400 mt-0.5 mb-4">{proven.process}</p>

            <div className="space-y-2 pt-2 border-t border-neutral-900 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Efficiency Transformation:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {proven.baselineEfficiency}% → {proven.currentEfficiency}% (+{proven.currentEfficiency - proven.baselineEfficiency}%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Idle Reduction:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {proven.baselineIdleTime}% → {proven.currentIdleTime}% (-{proven.baselineIdleTime - proven.currentIdleTime}%)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Hardware Setup:</span>
                <span className="text-neutral-300 font-mono">{proven.cameraCount} Cameras ({proven.operators} Operators)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-900 flex justify-between items-center">
            <span className="text-xs text-neutral-500">Demonstrated Annual Value</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{proven.annualizedValueFormatted}</span>
          </div>
        </div>

        {/* Right: Expansion Target */}
        <div className="rounded-xl border border-neutral-700 bg-black p-5 flex flex-col justify-between ring-1 ring-white/10">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white text-black flex items-center gap-1.5 font-semibold">
                <ArrowRight className="w-3.5 h-3.5" />
                Target Line
              </span>
              <span className="text-xs text-amber-400 font-mono">14.6% Output Gap</span>
            </div>

            <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
            <p className="text-xs text-neutral-400 mt-0.5 mb-4">{candidate.process}</p>

            <div className="space-y-2 pt-2 border-t border-neutral-900 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Monthly Output Deficit:</span>
                <span className="font-mono font-semibold text-amber-400">
                  {candidate.currentMonthlyOutput.toLocaleString()} / {candidate.targetMonthlyOutput.toLocaleString()} ({outputGapPct}%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Manual Labor Exposure:</span>
                <span className="text-neutral-300 font-mono">{candidate.operators} Operators ({candidate.idleTimePct}% Idle)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Process Match:</span>
                <span className="text-emerald-400 font-mono">High (Matches Assembly A1)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-900 flex justify-between items-center">
            <span className="text-xs text-neutral-500">Est. Annual Recoverable (10%)</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{recoverableAnnualValue} / yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
