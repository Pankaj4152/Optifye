import { CandidateLine } from "./data";

export interface RoiProjection {
  monthlyGapUnits: number;
  annualGapUnits: number;
  recoveryRatePct: number;
  recoverableUnitsAnnual: number;
  contributionMarginPerUnit: number;
  estimatedAnnualValueInr: number;
  estimatedAnnualValueLakhsFormatted: string;
}

/**
 * Deterministic ROI Calculation Engine
 * Pure math based on synthetic operational assumptions.
 * Code calculates. AI explains.
 */
export function calculateRoi(
  candidate: CandidateLine,
  recoveryRatePct: number = 10 // Default 10% conservative recovery
): RoiProjection {
  const monthlyGapUnits = Math.max(0, candidate.targetMonthlyOutput - candidate.currentMonthlyOutput);
  const annualGapUnits = monthlyGapUnits * 12;
  const rateFraction = recoveryRatePct / 100;
  const recoverableUnitsAnnual = Math.round(annualGapUnits * rateFraction);
  const estimatedAnnualValueInr = recoverableUnitsAnnual * candidate.contributionMarginPerUnit;
  
  // Format to Lakhs (₹ in Lakhs)
  const lakhs = (estimatedAnnualValueInr / 100000).toFixed(2);
  const estimatedAnnualValueLakhsFormatted = `₹${lakhs}L`;

  return {
    monthlyGapUnits,
    annualGapUnits,
    recoveryRatePct,
    recoverableUnitsAnnual,
    contributionMarginPerUnit: candidate.contributionMarginPerUnit,
    estimatedAnnualValueInr,
    estimatedAnnualValueLakhsFormatted,
  };
}
