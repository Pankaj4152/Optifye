import { SYNTHETIC_ACCOUNT } from "./lib/data";
import { calculateOpportunityScore } from "./lib/calculate-score";
import { calculateRoi } from "./lib/calculate-roi";

console.log("=== Testing Deterministic Business Engine ===");
console.log(`Account: ${SYNTHETIC_ACCOUNT.name}`);
console.log(`Proven Deployment: ${SYNTHETIC_ACCOUNT.monitoredDeployment.name} (Demonstrated Value: ${SYNTHETIC_ACCOUNT.monitoredDeployment.annualizedValueFormatted})`);
console.log("\n--- Ranked Candidates ---");

const ranked = SYNTHETIC_ACCOUNT.candidates.map(candidate => {
  const score = calculateOpportunityScore(candidate, SYNTHETIC_ACCOUNT.monitoredDeployment);
  const roi = calculateRoi(candidate, 10);
  return { candidate, score, roi };
}).sort((a, b) => b.score.totalScore - a.score.totalScore);

ranked.forEach((item, idx) => {
  console.log(`\nRank #${idx + 1}: ${item.candidate.name} (${item.candidate.process})`);
  console.log(`Opportunity Score: ${item.score.totalScore}/100`);
  console.log(`  - Operational Gap: ${item.score.gapContribution}`);
  console.log(`  - Manual Exposure: ${item.score.exposureContribution}`);
  console.log(`  - Similarity: ${item.score.similarityContribution}`);
  console.log(`  - Production Scale: ${item.score.scaleContribution}`);
  console.log(`Estimated Annual Recoverable Value (10% rec): ${item.roi.estimatedAnnualValueLakhsFormatted} (${item.roi.recoverableUnitsAnnual.toLocaleString()} units/yr @ ₹${item.roi.contributionMarginPerUnit})`);
});
