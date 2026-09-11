import { ScoreBreakdown } from "@/lib/calculate-score";

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
    },
    {
      title: "Process & Topology Similarity",
      score: score.processSimilarityScore,
      max: 25,
      detail: score.similarityContribution,
    },
    {
      title: "Manual Labor Exposure",
      score: score.manualExposureScore,
      max: 20,
      detail: score.exposureContribution,
    },
    {
      title: "Production Scale & Unit Margin",
      score: score.productionScaleScore,
      max: 20,
      detail: score.scaleContribution,
    },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Deterministic Opportunity Score
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Four explainable operational factors.</p>
        </div>
        <div className="flex items-baseline gap-1 bg-black px-3 py-1.5 rounded-lg border border-neutral-800">
          <span className="text-xl font-bold font-mono text-emerald-400">{score.totalScore}</span>
          <span className="text-xs text-neutral-500 font-mono">/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {factors.map((factor, idx) => {
          const pct = Math.round((factor.score / factor.max) * 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">{factor.title}</span>
                <span className="font-mono text-neutral-400">
                  {factor.score} / {factor.max} pts
                </span>
              </div>

              {/* Minimal bar */}
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="text-[11px] text-neutral-500 font-mono">
                {factor.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
