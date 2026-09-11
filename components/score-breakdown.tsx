import { ScoreBreakdown } from "@/lib/calculate-score";
import { Check, Target, Users, GitFork, BarChart3 } from "lucide-react";

interface ScoreBreakdownViewProps {
  score: ScoreBreakdown;
  lineName: string;
}

export function ScoreBreakdownView({ score, lineName }: ScoreBreakdownViewProps) {
  const factors = [
    {
      title: "Operational Deficit & Idle Time",
      score: score.operationalGapScore,
      max: 35,
      detail: score.gapContribution,
      icon: Target,
      color: "bg-amber-500",
    },
    {
      title: "Process & Topology Similarity",
      score: score.processSimilarityScore,
      max: 25,
      detail: score.similarityContribution,
      icon: GitFork,
      color: "bg-blue-500",
    },
    {
      title: "Manual Labor Exposure",
      score: score.manualExposureScore,
      max: 20,
      detail: score.exposureContribution,
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "Production Scale & Unit Margin",
      score: score.productionScaleScore,
      max: 20,
      detail: score.scaleContribution,
      icon: BarChart3,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Deterministic Opportunity Score Breakdown</h3>
          <p className="text-xs text-slate-400">Explainable operational weighting evaluated against deployment benchmarks.</p>
        </div>
        <div className="flex items-baseline gap-1.5 self-start sm:self-auto bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Composite Score:</span>
          <span className="text-xl font-black text-emerald-400">{score.totalScore}</span>
          <span className="text-xs text-slate-500 font-mono">/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {factors.map((factor, idx) => {
          const Icon = factor.icon;
          const pct = Math.round((factor.score / factor.max) * 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{factor.title}</span>
                </div>
                <div className="font-mono text-slate-300 font-semibold">
                  {factor.score} / {factor.max} pts
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full ${factor.color} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Check className="w-3 h-3 text-slate-500" />
                <span>{factor.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
