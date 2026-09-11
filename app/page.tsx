import { SYNTHETIC_ACCOUNT } from "@/lib/data";
import { calculateOpportunityScore } from "@/lib/calculate-score";
import { calculateRoi } from "@/lib/calculate-roi";
import { CandidateCard } from "@/components/candidate-card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AccountOverviewPage() {
  const account = SYNTHETIC_ACCOUNT;
  const proven = account.monitoredDeployment;

  // Compute deterministic scores & ROI for all candidate lines
  const rankedCandidates = account.candidates
    .map((candidate) => {
      const score = calculateOpportunityScore(candidate, proven);
      const roi = calculateRoi(candidate, 10);
      return { candidate, score, roi };
    })
    .sort((a, b) => b.score.totalScore - a.score.totalScore);

  const topCandidate = rankedCandidates[0];

  return (
    <div className="space-y-8">
      {/* Hero Headline Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
            {account.name} • {account.industry}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Where should Optifye expand next?
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Evaluate unmonitored factory lines based on proven deployment benchmark metrics, operational deficit, and estimated recoverable margin.
          </p>
        </div>

        <Link
          href={`/opportunity/${topCandidate.candidate.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shrink-0"
        >
          <span>View #1 Target ({topCandidate.candidate.name})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Proven Deployment Summary Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Deployment
              </span>
              <span className="text-xs text-neutral-500">{proven.installedDate}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{proven.name}</h2>
            <p className="text-xs text-neutral-400">
              {proven.process} • {proven.operators} Operators • {proven.cameraCount} AI Cameras
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-8">
            <div>
              <div className="text-xs text-neutral-500">Efficiency Gain</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {proven.baselineEfficiency}% → {proven.currentEfficiency}%
              </div>
              <div className="text-[11px] text-emerald-400">+{proven.currentEfficiency - proven.baselineEfficiency}% measured</div>
            </div>

            <div>
              <div className="text-xs text-neutral-500">Idle Reduction</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {proven.baselineIdleTime}% → {proven.currentIdleTime}%
              </div>
              <div className="text-[11px] text-emerald-400">-{proven.baselineIdleTime - proven.currentIdleTime}% idle time</div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-neutral-500">Value Created</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                {proven.annualizedValueFormatted}
              </div>
              <div className="text-[11px] text-neutral-500">Annualized impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Ranking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Ranked Expansion Candidates
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            3 Lines Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {rankedCandidates.map((item, idx) => (
            <CandidateCard
              key={item.candidate.id}
              candidate={item.candidate}
              score={item.score}
              roi={item.roi}
              rank={idx + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
