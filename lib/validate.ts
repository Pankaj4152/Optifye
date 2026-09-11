import { SYNTHETIC_ACCOUNT } from "./data";
import { calculateOpportunityScore } from "./calculate-score";
import { calculateRoi } from "./calculate-roi";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runValidationSuite() {
  console.log("🔍 Running Optifye Business Logic Validation Suite...\n");

  const account = SYNTHETIC_ACCOUNT;
  const proven = account.monitoredDeployment;

  // 1. Validate Monitored Line
  assert(proven.id === "assembly-a1", "Proven deployment must be Assembly A1");
  assert(proven.currentEfficiency > proven.baselineEfficiency, "Efficiency must have improved");
  assert(proven.currentIdleTime < proven.baselineIdleTime, "Idle time must have dropped");
  console.log("✅ 1. Proven deployment (Assembly A1) metrics verified.");

  // 2. Validate Ranking Logic
  const scored = account.candidates.map((c) => ({
    candidate: c,
    score: calculateOpportunityScore(c, proven),
    roi: calculateRoi(c, 10),
  })).sort((a, b) => b.score.totalScore - a.score.totalScore);

  assert(scored[0].candidate.id === "assembly-b2", "Assembly B2 must rank as #1 target");
  assert(scored[1].candidate.id === "packaging-a3", "Packaging A3 must rank as #2 target");
  assert(scored[2].candidate.id === "inspection-b4", "Inspection B4 must rank as #3 target");
  console.log("✅ 2. Deterministic ranking order verified: B2 (#1) > A3 (#2) > B4 (#3).");

  // 3. Validate Natural Score Boundaries (Explainable range, not hardcoded 92)
  const b2Score = scored[0].score;
  assert(b2Score.totalScore >= 85 && b2Score.totalScore <= 98, `B2 Score (${b2Score.totalScore}) within expected high-priority band`);
  assert(b2Score.operationalGapScore > 0, "Operational gap points must be positive");
  assert(b2Score.processSimilarityScore === 23, "Similarity score for manual assembly matches benchmark");
  console.log(`✅ 3. Candidate scoring breakdown verified: B2 computed naturally at ${b2Score.totalScore}/100.`);

  // 4. Validate ROI Math Sensitivity
  const b2BaselineRoi = scored[0].roi; // 10% recovery
  // Gap = 48,000 - 41,000 = 7,000/mo -> 84,000/yr. 10% = 8,400 units. @ ₹220 = ₹18,48,000 -> ₹18.48L
  assert(b2BaselineRoi.annualGapUnits === 84000, "Annual gap must be 84,000 units");
  assert(b2BaselineRoi.recoverableUnitsAnnual === 8400, "10% recovery of 84,000 must equal 8,400 units");
  assert(b2BaselineRoi.estimatedAnnualValueInr === 1848000, "Estimated value at 10% must be ₹18,48,000");
  assert(b2BaselineRoi.estimatedAnnualValueLakhsFormatted === "₹18.48L", "Formatted lakhs must be ₹18.48L");
  console.log("✅ 4. ROI baseline math verified: 8,400 recoverable units = ₹18.48L/year.");

  // Test sensitivity slider edge cases: 5% and 25%
  const roi5 = calculateRoi(scored[0].candidate, 5);
  assert(roi5.recoverableUnitsAnnual === 4200, "5% recovery must be 4,200 units");
  assert(roi5.estimatedAnnualValueInr === 924000, "5% recovery value must be ₹9,24,000");

  const roi25 = calculateRoi(scored[0].candidate, 25);
  assert(roi25.recoverableUnitsAnnual === 21000, "25% recovery must be 21,000 units");
  assert(roi25.estimatedAnnualValueInr === 4620000, "25% recovery value must be ₹46,20,000");
  console.log("✅ 5. ROI dynamic sensitivity (5% to 25%) verified.");

  console.log("\n🎉 ALL 5 VERIFICATION SUITES PASSED CLEANLY!");
}
