"use client";

import { useState } from "react";
import { CandidateLine, Deployment } from "@/lib/data";
import { ScoreBreakdown } from "@/lib/calculate-score";
import { RoiProjection, calculateRoi } from "@/lib/calculate-roi";
import { ScoreBreakdownView } from "@/components/score-breakdown";
import { RoiCalculator } from "@/components/roi-calculator";
import { Copilot } from "@/components/copilot";

interface ClientOpportunityViewProps {
  candidate: CandidateLine;
  proven: Deployment;
  score: ScoreBreakdown;
  initialRoi: RoiProjection;
}

export function ClientOpportunityView({
  candidate,
  proven,
  score,
  initialRoi,
}: ClientOpportunityViewProps) {
  const [recoveryRate, setRecoveryRate] = useState<number>(10);
  const currentRoi = calculateRoi(candidate, recoveryRate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (7 cols): Score Breakdown & ROI Slider */}
      <div className="lg:col-span-7 space-y-6">
        <ScoreBreakdownView score={score} lineName={candidate.name} />
        <RoiCalculator
          candidate={candidate}
          onRecoveryRateChange={(newRate) => setRecoveryRate(newRate)}
        />
      </div>

      {/* Right Column (5 cols): AI Copilot Grounded Reasoning */}
      <div className="lg:col-span-5 sticky top-20">
        <Copilot
          candidate={candidate}
          proven={proven}
          score={score}
          roi={currentRoi}
          recoveryRate={recoveryRate}
        />
      </div>
    </div>
  );
}
