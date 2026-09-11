import { SYNTHETIC_ACCOUNT } from "@/lib/data";
import { calculateOpportunityScore } from "@/lib/calculate-score";
import { calculateRoi } from "@/lib/calculate-roi";
import { CandidateCard } from "@/components/candidate-card";
import { Factory, TrendingUp, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
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
      {/* Account Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Factory className="w-4 h-4 text-emerald-400" />
            <span>{account.industry}</span>
            <span>•</span>
            <span>{account.plantCount} Manufacturing Plants</span>
            <span>•</span>
            <span>{account.totalLines} Production Lines</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">{account.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Account Expansion Intelligence: Identifying and prioritizing unmonitored factory lines with highest recoverable margin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/opportunity/${topCandidate.candidate.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-emerald-950/40"
          >
            <span>Evaluate Top Candidate ({topCandidate.candidate.name})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Proven Deployment Summary Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ACTIVE OPTIFYE DEPLOYMENT
              </span>
              <span className="text-xs text-slate-500 font-medium">Installed {proven.installedDate}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{proven.name}</h2>
            <p className="text-xs text-slate-400">{proven.process} • {proven.operators} Operators • {proven.cameraCount} AI Cameras</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-xs text-slate-400">Efficiency Gain</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {proven.baselineEfficiency}% → {proven.currentEfficiency}%
              </div>
              <div className="text-[11px] text-emerald-500/80 font-medium">+{proven.currentEfficiency - proven.baselineEfficiency}% gain</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Idle Time Reduction</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {proven.baselineIdleTime}% → {proven.currentIdleTime}%
              </div>
              <div className="text-[11px] text-emerald-500/80 font-medium">-{proven.baselineIdleTime - proven.currentIdleTime}% idle</div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">Annual Value Created</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {proven.annualizedValueFormatted}
              </div>
              <div className="text-[11px] text-slate-500">Verified shop-floor ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Lines Ranking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Ranked Expansion Opportunities</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked deterministically by operational deficit, manual exposure, process similarity, and production scale.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{rankedCandidates.length} Candidates Evaluated</span>
        </div>

        <div className="space-y-4">
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
