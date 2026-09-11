import { notFound } from "next/navigation";
import { SYNTHETIC_ACCOUNT } from "@/lib/data";
import { calculateOpportunityScore } from "@/lib/calculate-score";
import { calculateRoi } from "@/lib/calculate-roi";
import { ComparisonHero } from "@/components/comparison-hero";
import { ScoreBreakdownView } from "@/components/score-breakdown";
import { ClientOpportunityView } from "./client-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function OpportunityDetailPage({ params }: PageProps) {
  const account = SYNTHETIC_ACCOUNT;
  const proven = account.monitoredDeployment;
  const candidate = account.candidates.find((c) => c.id === params.id);

  if (!candidate) {
    notFound();
  }

  const score = calculateOpportunityScore(candidate, proven);
  const baselineRoi = calculateRoi(candidate, 10);

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>
      </div>

      {/* Hero Comparison Moment */}
      <ComparisonHero
        proven={proven}
        candidate={candidate}
        outputGapPct={score.outputGapPct}
        recoverableAnnualValue={baselineRoi.estimatedAnnualValueLakhsFormatted}
      />

      {/* Interactive Detail Split: Score Breakdown + ROI + AI Copilot */}
      <ClientOpportunityView
        candidate={candidate}
        proven={proven}
        score={score}
        initialRoi={baselineRoi}
      />
    </div>
  );
}
