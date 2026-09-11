# Optifye Expansion Copilot

> Proof-of-work prototype built for the **Founding Engineer - AI/ML** application at **Optifye.ai (YC W25)**.

---

## 🎯 The Core Thesis

Optifye's computer vision system already drives quantifiable operational improvements on factory shop-floors (e.g., cutting operator idle time, smoothing cycle-time drift, increasing throughput).

Once Optifye proves value on an initial line (such as **Assembly Line A1**), a natural growth opportunity is:
**Where should Optifye expand next inside that existing factory account, and why?**

**Optifye Expansion Copilot** answers this question with:
1. **Deterministic Opportunity Scoring**: Ranks unmonitored factory lines using explainable operational metrics (operational deficit, manual labor exposure, process similarity, and production scale).
2. **Deterministic ROI Sensitivity**: Calculates recoverable production volume and margin without hallucinating financial figures.
3. **Grounded AI Copilot**: A reasoning layer that explains recommendations, compares line topologies, and responds dynamically to operator questions using strictly computed data.

> **Principle**: *Code calculates (deterministic, testable, explainable). AI explains (grounded strictly in structured factory metrics).*

---

## 🏗️ Architecture & Philosophy

```
┌────────────────────────────────────────────────────────┐
│                   SYNTHETIC DATASET                   │
│   (Apex Auto Components Ltd - 1 Monitored + 3 Lines)   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  DETERMINISTIC SCORE  │       │   DETERMINISTIC ROI   │
│  Operational Gap (35) │       │   Annual Gap × Rate   │
│  Similarity (25)      │       │   × Contribution      │
│  Manual Exposure (20) │       │   Margin              │
│  Scale (20)           │       │                       │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌───────────────────────────────────────────────────────┐
│                    ENTERPRISE UI                      │
│   - Account Overview & Ranked Candidate Cards         │
│   - Proven A1 vs Candidate B2 Comparison Hero        │
│   - Real-time ROI Recovery Rate Sensitivity Slider   │
└───────────────────────────┬───────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│             GROUNDED AI COPILOT LAYER                 │
│   - Answers from structured context only              │
│   - Zero hallucinated numbers or fake ROI math        │
│   - Instant deterministic fallback if no API key     │
└───────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/optifye-expansion-copilot.git
cd optifye-expansion-copilot

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

*(Optional)* Create a `.env.local` with `OPENAI_API_KEY=your_key` to enable live LLM synthesis, or run without an API key to use the built-in deterministic reasoning engine.

---

## 📊 Synthetic Case Study: Apex Auto Components

- **Proven Deployment**: *Assembly Line A1* (Monitored by 6 Optifye cameras, 68% → 79% efficiency, ₹14.2L annualized value created).
- **Candidate Lines Evaluated**:
  1. **Assembly Line B2** (*Score: ~92/100, Est. Value: ₹18.48L/yr*): **#1 Target** — High-volume manual assembly with 38 operators and an active 14.6% output deficit.
  2. **Packaging Line A3** (*Score: ~68/100, Est. Value: ₹7.02L/yr*): Moderate opportunity, but lower manual labor touchpoints and lower unit margin.
  3. **Inspection Line B4** (*Score: ~44/100, Est. Value: ₹3.08L/yr*): Narrow output gap (5%) and already low baseline idle time.

---

## ⚡ What This Demonstrates

- **Full-stack & Shipping Velocity**: Production-ready Next.js 14 App Router, TypeScript, and Tailwind CSS.
- **Factory & Domain Understanding**: Reflects industrial manufacturing constraints (takt-time variance, manual labor exposure, contribution margin).
- **Production AI Engineering**: Strict separation of deterministic computation from generative reasoning to eliminate business hallucinations.
- **Product & Commercial Sense**: Directly tackles expansion velocity and customer account retention.
