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
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EXPANSION THESIS: PROVEN PATTERN REPLICATION</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Replicating Optifye Success Across Factory Floor
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Optifye computer vision already digitalized and improved {proven.name}. Replicating the same
          deployment architecture on {candidate.name} addresses an active {outputGapPct}% output deficit.
        </p>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left Card: Proven Deployment */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PROVEN DEPLOYMENT
              </span>
              <span className="text-xs text-slate-500">{proven.installedDate}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{proven.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">{proven.process}</p>

            <div className="space-y-3 pt-2 border-t border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Efficiency Transformation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {proven.baselineEfficiency}% → {proven.currentEfficiency}% (+{proven.currentEfficiency - proven.baselineEfficiency}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Idle Time Reduction:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {proven.baselineIdleTime}% → {proven.currentIdleTime}% (-{proven.baselineIdleTime - proven.currentIdleTime}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Camera Sensors:</span>
                <span className="font-mono text-slate-300">{proven.cameraCount} AI Cameras</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-emerald-950/20 -mx-5 -mb-5 p-4 rounded-b-xl border-t-emerald-900/30">
            <div>
              <div className="text-[11px] text-emerald-400/80 uppercase tracking-wider font-semibold">Demonstrated Annual Value</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{proven.annualizedValueFormatted}</div>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400/60" />
          </div>
        </div>

        {/* Right Card: Recommended Expansion */}
        <div className="rounded-xl bg-slate-950/80 border border-emerald-500/40 p-5 flex flex-col justify-between ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/10">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" />
                RECOMMENDED EXPANSION
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                Unmonitored Bottleneck
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">{candidate.process}</p>

            <div className="space-y-3 pt-2 border-t border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current vs Target Output:</span>
                <span className="font-mono font-bold text-amber-400">
                  {candidate.currentMonthlyOutput.toLocaleString()} / {candidate.targetMonthlyOutput.toLocaleString()} units/mo
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Output Deficit:</span>
                <span className="font-mono font-bold text-amber-400">
                  {outputGapPct}% output gap
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Manual Labor Exposure:</span>
                <span className="font-mono text-slate-300">{candidate.operators} Operators ({candidate.idleTimePct}% Idle)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-emerald-950/40 -mx-5 -mb-5 p-4 rounded-b-xl border-t-emerald-800/40">
            <div>
              <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">Estimated Recoverable Value</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">{recoverableAnnualValue} <span className="text-xs font-normal text-emerald-400/80">/ year</span></div>
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
