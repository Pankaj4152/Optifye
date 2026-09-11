import { CandidateLine, Deployment } from "@/lib/data";
import { CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Core Expansion Narrative</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Proven Result (A1) → Recommended Expansion (B2)
          </h2>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          Same Plant • Same Operator Density
        </div>
      </div>

      {/* Side-by-Side Storyboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative">
        {/* Left Card: 1. Where Optifye Already Succeeded */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                STEP 1: PROVEN DEPLOYMENT
              </span>
              <span className="text-xs text-slate-500">{proven.installedDate}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{proven.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">{proven.process}</p>

            <div className="space-y-2.5 pt-3 border-t border-slate-900 text-xs">
              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Efficiency Transformation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {proven.baselineEfficiency}% → {proven.currentEfficiency}% (+{proven.currentEfficiency - proven.baselineEfficiency}%)
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Idle Time Reduction:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {proven.baselineIdleTime}% → {proven.currentIdleTime}% (-{proven.baselineIdleTime - proven.currentIdleTime}%)
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Active Camera Sensor Setup:</span>
                <span className="font-mono text-slate-300">{proven.cameraCount} AI Cameras ({proven.operators} Operators)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between bg-emerald-950/30 -mx-5 -mb-5 p-4 rounded-b-xl border-t-emerald-900/40">
            <div>
              <div className="text-[11px] text-emerald-400/90 uppercase tracking-wider font-semibold">Demonstrated Annual Value Created</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{proven.annualizedValueFormatted}</div>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400/70" />
          </div>
        </div>

        {/* Right Card: 2. Where Optifye Expands Next */}
        <div className="rounded-xl bg-slate-950 border border-emerald-500/50 p-5 flex flex-col justify-between ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-950/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500 text-slate-950 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" />
                STEP 2: RECOMMENDED EXPANSION
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Deficit
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">{candidate.process}</p>

            <div className="space-y-2.5 pt-3 border-t border-slate-900 text-xs">
              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Current Output Deficit:</span>
                <span className="font-mono font-bold text-amber-400">
                  {candidate.currentMonthlyOutput.toLocaleString()} / {candidate.targetMonthlyOutput.toLocaleString()} ({outputGapPct}% gap)
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Manual Labor Bottleneck:</span>
                <span className="font-mono font-bold text-slate-200">
                  {candidate.operators} Operators ({candidate.idleTimePct}% Idle)
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Process & Topology Similarity:</span>
                <span className="font-mono font-semibold text-emerald-400">High (Identical to Assembly A1)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between bg-emerald-950/50 -mx-5 -mb-5 p-4 rounded-b-xl border-t-emerald-800/50">
            <div>
              <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">Est. Recoverable Annual Value</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">{recoverableAnnualValue} <span className="text-xs font-normal text-emerald-400/80">/ year</span></div>
            </div>
            <div className="text-xs text-right text-slate-400 font-mono">
              @ 10% Recovery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
