import { CandidateLine, Deployment } from "./data";

export interface ScoreBreakdown {
  operationalGapScore: number;    // 0 - 35 points
  manualExposureScore: number;    // 0 - 20 points
  processSimilarityScore: number; // 0 - 25 points
  productionScaleScore: number;   // 0 - 20 points
  totalScore: number;             // 0 - 100 points
  
  // Normalized raw metrics for display
  outputGapPct: number;
  gapContribution: string;
  exposureContribution: string;
  similarityContribution: string;
  scaleContribution: string;
}

/**
 * Deterministic Opportunity Scoring Engine
 * Evaluates candidate factory lines against proven Optifye deployment profile.
 * Total points out of 100 based on natural operational weights.
 */
export function calculateOpportunityScore(
  candidate: CandidateLine,
  proven: Deployment
): ScoreBreakdown {
  // 1. Operational Gap (0 - 35 points)
  // Combines output gap percentage and idle time percentage
  const outputGapPct = ((candidate.targetMonthlyOutput - candidate.currentMonthlyOutput) / candidate.targetMonthlyOutput) * 100;
  // Normalized: 15% output gap gives ~20pts, 20% idle gives ~15pts
  const gapPtsFromOutput = Math.min(22, (outputGapPct / 16) * 22);
  const gapPtsFromIdle = Math.min(13, (candidate.idleTimePct / 20) * 13);
  const operationalGapScore = Math.round(gapPtsFromOutput + gapPtsFromIdle);

  // 2. Manual Labor Exposure (0 - 20 points)
  // Optifye's CV shines in operator-heavy manual operations (30-40 operators is ideal sweet spot)
  const operatorScore = Math.min(20, (candidate.operators / 40) * 20);
  const manualExposureScore = Math.round(operatorScore);

  // 3. Process & Topology Similarity to Monitored Line (0 - 25 points)
  let processSimilarityScore = 0;
  if (candidate.processType === "manual_assembly") {
    processSimilarityScore = 23; // Very close to A1
  } else if (candidate.processType === "packaging") {
    processSimilarityScore = 14;
  } else {
    processSimilarityScore = 9;
  }

  // 4. Production Scale & Economic Leverage (0 - 20 points)
  // Monthly throughput volume & margin leverage
  const volumeWeight = Math.min(10, (candidate.targetMonthlyOutput / 50000) * 10);
  const marginWeight = Math.min(10, (candidate.contributionMarginPerUnit / 250) * 10);
  const productionScaleScore = Math.round(volumeWeight + marginWeight);

  const totalScore = Math.min(
    100,
    operationalGapScore + manualExposureScore + processSimilarityScore + productionScaleScore
  );

  return {
    operationalGapScore,
    manualExposureScore,
    processSimilarityScore,
    productionScaleScore,
    totalScore,
    outputGapPct: parseFloat(outputGapPct.toFixed(1)),
    gapContribution: `${operationalGapScore}/35 pts (Output gap ${outputGapPct.toFixed(1)}%, Idle ${candidate.idleTimePct}%)`,
    exposureContribution: `${manualExposureScore}/20 pts (${candidate.operators} manual operators)`,
    similarityContribution: `${processSimilarityScore}/25 pts (${candidate.processType === "manual_assembly" ? "High match to Assembly A1" : "Moderate match"})`,
    scaleContribution: `${productionScaleScore}/20 pts (${candidate.targetMonthlyOutput.toLocaleString()} target units @ ₹${candidate.contributionMarginPerUnit}/unit)`,
  };
}
