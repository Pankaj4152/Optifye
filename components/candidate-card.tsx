import Link from "next/link";
import { CandidateLine } from "@/lib/data";
import { ScoreBreakdown } from "@/lib/calculate-score";
import { RoiProjection } from "@/lib/calculate-roi";
import { ArrowRight, Users, Activity, Clock } from "lucide-react";

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
      className={`rounded-xl p-5 border transition-colors ${
        isTopCandidate
          ? "bg-neutral-950 border-neutral-700 ring-1 ring-white/10"
          : "bg-neutral-950/60 border-neutral-900 hover:border-neutral-800"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-neutral-400">
              #{rank}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-xs text-neutral-400 font-medium">
              {candidate.process}
            </span>
            {isTopCandidate && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Recommended
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{candidate.name}</h3>
          <p className="text-xs text-neutral-400 max-w-xl">{candidate.description}</p>
        </div>

        {/* Key Metrics Pill */}
        <div className="flex items-center gap-6 self-start md:self-auto bg-neutral-900/80 px-4 py-2.5 rounded-lg border border-neutral-800">
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Opportunity Score</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-bold font-mono ${isTopCandidate ? "text-emerald-400" : "text-white"}`}>
                {score.totalScore}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">/100</span>
            </div>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div>
            <div className="text-[11px] text-neutral-400 font-medium">Est. Value (10%)</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-bold font-mono ${isTopCandidate ? "text-emerald-400" : "text-white"}`}>
                {roi.estimatedAnnualValueLakhsFormatted}
              </span>
              <span className="text-[11px] text-neutral-500">/yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-3 gap-3 my-4 py-3 border-y border-neutral-900 text-xs">
        <div>
          <span className="text-neutral-500">Operators:</span>{" "}
          <span className="text-neutral-300 font-medium">{candidate.operators} workers</span>
        </div>
        <div>
          <span className="text-neutral-500">Output Gap:</span>{" "}
          <span className="text-amber-400 font-medium">{score.outputGapPct}%</span>
        </div>
        <div>
          <span className="text-neutral-500">Idle Time:</span>{" "}
          <span className="text-neutral-300 font-medium">{candidate.idleTimePct}%</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-neutral-400">
          <span className="text-neutral-500">Rationale:</span> {candidate.recommendedReason}
        </div>

        <Link
          href={`/opportunity/${candidate.id}`}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
            isTopCandidate
              ? "bg-white hover:bg-neutral-200 text-black font-semibold"
              : "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800"
          }`}
        >
          <span>View Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
