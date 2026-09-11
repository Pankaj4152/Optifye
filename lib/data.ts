export interface Deployment {
  id: string;
  name: string;
  status: "monitored";
  process: string;
  operators: number;
  baselineEfficiency: number; // e.g. 68%
  currentEfficiency: number;  // e.g. 79%
  baselineIdleTime: number;   // e.g. 21%
  currentIdleTime: number;    // e.g. 14%
  annualizedValueCreated: number; // in INR (e.g. 1420000 -> ₹14.2L)
  annualizedValueFormatted: string;
  cycleTimeSec: number;
  installedDate: string;
  cameraCount: number;
}

export interface CandidateLine {
  id: string;
  name: string;
  process: string;
  processType: "manual_assembly" | "packaging" | "quality_inspection";
  operators: number;
  currentMonthlyOutput: number;
  targetMonthlyOutput: number;
  idleTimePct: number;
  cycleVariancePct: number;
  contributionMarginPerUnit: number; // in INR
  description: string;
  recommendedReason: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  industry: string;
  plantCount: number;
  totalLines: number;
  monitoredDeployment: Deployment;
  candidates: CandidateLine[];
}

export const SYNTHETIC_ACCOUNT: CustomerAccount = {
  id: "apex-auto-components",
  name: "Apex Auto Components Ltd.",
  industry: "Tier 1 Automotive Systems",
  plantCount: 2,
  totalLines: 12,
  monitoredDeployment: {
    id: "assembly-a1",
    name: "Assembly Line A1",
    status: "monitored",
    process: "Manual Assembly (Steering Sub-assembly)",
    operators: 30,
    baselineEfficiency: 68,
    currentEfficiency: 79,
    baselineIdleTime: 21,
    currentIdleTime: 14,
    annualizedValueCreated: 1420000,
    annualizedValueFormatted: "₹14.2L",
    cycleTimeSec: 42,
    installedDate: "Nov 2025 (4 mos ago)",
    cameraCount: 6,
  },
  candidates: [
    {
      id: "assembly-b2",
      name: "Assembly Line B2",
      process: "Manual Assembly (HVAC Control Modules)",
      processType: "manual_assembly",
      operators: 38,
      currentMonthlyOutput: 41000,
      targetMonthlyOutput: 48000,
      idleTimePct: 19,
      cycleVariancePct: 18,
      contributionMarginPerUnit: 220,
      description: "High-volume manual assembly line with notable cycle-time drift across operator shifts and elevated micro-stoppages.",
      recommendedReason: "Direct topology & process match to Assembly A1 with a 14.6% output deficit and 38 manual operators.",
    },
    {
      id: "packaging-a3",
      name: "Packaging Line A3",
      process: "Semi-Automated Box Packing & Labelling",
      processType: "packaging",
      operators: 20,
      currentMonthlyOutput: 62000,
      targetMonthlyOutput: 67500,
      idleTimePct: 14,
      cycleVariancePct: 11,
      contributionMarginPerUnit: 85,
      description: "Semi-automated packaging cell with steady throughput but intermittent conveyor buffering bottlenecks.",
      recommendedReason: "Moderate output gap (8.1%) with lower manual labor touchpoints and lower per-unit contribution margin.",
    },
    {
      id: "inspection-b4",
      name: "Inspection Line B4",
      process: "Manual Quality Gate & Optical Verification",
      processType: "quality_inspection",
      operators: 12,
      currentMonthlyOutput: 38000,
      targetMonthlyOutput: 40000,
      idleTimePct: 8,
      cycleVariancePct: 7,
      contributionMarginPerUnit: 140,
      description: "Dedicated end-of-line inspection fixture with low operator headcount and relatively stable takt time.",
      recommendedReason: "Narrow output gap (5.0%) with lower manual exposure and baseline idle already under 8%.",
    },
  ],
};
