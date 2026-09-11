import Link from "next/link";
import { CandidateLine } from "@/lib/data";
import { ScoreBreakdown } from "@/lib/calculate-score";
import { RoiProjection } from "@/lib/calculate-roi";
import { ArrowRight, Users, Activity, Clock, TrendingUp, Award } from "lucide-react";

interface CandidateCardProps {
  candidate: CandidateLine;
  score: ScoreBreakdown;
  roi: RoiProjection;
  rank: number;
}

export function CandidateCard({ candidate, score, roi, rank }: CandidateCardProps) {
  const isTopCandidate = rank === 1;

  return (
    <div
      className={`relative rounded-xl p-6 border transition-all duration-200 ${
        isTopCandidate
          ? "bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20"
          : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60"
      }`}
    >
      {isTopCandidate && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-slate-950 shadow-sm">
          <Award className="w-3.5 h-3.5" />
          <span>TOP EXPANSION TARGET</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-500 font-semibold">#{rank} CANDIDATE</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
              {candidate.process}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{candidate.name}</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">{candidate.description}</p>
        </div>

        {/* Opportunity Score & Recoverable Value */}
        <div className="flex items-center gap-6 self-start md:self-auto bg-slate-950/60 px-4 py-3 rounded-lg border border-slate-800">
          <div>
            <div className="text-xs text-slate-400 font-medium">Opportunity Score</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-2xl font-black ${isTopCandidate ? "text-emerald-400" : "text-white"}`}>
                {score.totalScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400 font-medium">Est. Recoverable Value</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-2xl font-black ${isTopCandidate ? "text-emerald-400" : "text-white"}`}>
                {roi.estimatedAnnualValueLakhsFormatted}
              </span>
              <span className="text-xs text-slate-500">/yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 py-4 border-y border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <div className="text-slate-400">Manual Operators</div>
            <div className="font-semibold text-slate-200 mt-0.5">{candidate.operators} workers</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <div className="text-slate-400">Output Gap</div>
            <div className="font-semibold text-amber-400 mt-0.5">{score.outputGapPct}% deficit</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <div className="text-slate-400">Idle / Micro-stoppage</div>
            <div className="font-semibold text-slate-200 mt-0.5">{candidate.idleTimePct}% time</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <div className="text-slate-400">Target Output</div>
            <div className="font-semibold text-slate-200 mt-0.5">{candidate.targetMonthlyOutput.toLocaleString()}/mo</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-400">
          <span className="font-medium text-slate-300">Why ranked here:</span> {candidate.recommendedReason}
        </div>

        <Link
          href={`/opportunity/${candidate.id}`}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            isTopCandidate
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          }`}
        >
          <span>View Recommendation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
