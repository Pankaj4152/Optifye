import { SYNTHETIC_ACCOUNT } from "./data";
import { calculateOpportunityScore } from "./calculate-score";
import { calculateRoi } from "./calculate-roi";

export function getRankedCandidates() {
  return SYNTHETIC_ACCOUNT.candidates.map((candidate) => {
    const score = calculateOpportunityScore(candidate, SYNTHETIC_ACCOUNT.monitoredDeployment);
    const roi = calculateRoi(candidate, 10);
    return { candidate, score, roi };
  }).sort((a, b) => b.score.totalScore - a.score.totalScore);
}
