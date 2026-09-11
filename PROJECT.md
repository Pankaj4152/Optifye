# Optifye AI Expansion Copilot

## Goal

Build an 8-hour proof-of-work prototype specifically for Optifye.ai.

The prototype should answer one question:

> Based on the performance of existing Optifye deployments, where should Optifye expand next inside a customer account, and why?

The objective is not to build a complete analytics platform.

The objective is to show:

- I understand Optifye's business
- I identified a plausible expansion-revenue opportunity
- I can build deterministic business logic
- I can add a useful AI agent layer
- I can create a polished full-stack prototype quickly

No computer vision.

Assume Optifye's existing system already produces structured factory metrics.

---

# 1. Core Business Thesis

Optifye already helps factories identify inefficiency and improve operations.

A likely expansion opportunity is:

Successful deployment
→ measurable improvement
→ identify another similar underperforming line
→ quantify potential value
→ recommend expansion

The prototype explores this workflow.

This is a hypothesis, not a claim about Optifye's internal process.

---

# 2. Product Concept

Name:

# Optifye Expansion Copilot

One-line concept:

> An AI copilot that identifies the next best factory line for Optifye expansion using deterministic operational and ROI analysis.

Core flow:

1. Show existing customer deployment.
2. Rank 3 unmonitored lines.
3. Recommend the strongest candidate.
4. Show why it was selected.
5. Show estimated financial value.
6. Let the user ask the AI copilot questions about the recommendation.

That's it.

---

# 3. Use Synthetic Data Only

Use one fictional customer.

Example:

## Apex Auto Components

Two plants.

Existing Optifye deployment:

### Assembly A1

Status:
Monitored

Operators:
30

Baseline efficiency:
68%

Current efficiency:
79%

Baseline idle time:
21%

Current idle time:
14%

Annualized value created:
₹14.2L

---

Candidate lines:

### Assembly B2

Operators:
38

Current output:
41,000 units/month

Target:
48,000

Idle time:
19%

Cycle-time variance:
18%

Process:
Manual Assembly

Contribution margin:
₹220/unit

This should rank #1.

---

### Packaging A3

Operators:
20

Output gap:
8%

Idle:
14%

Medium opportunity.

---

### Inspection B4

Operators:
12

Output gap:
5%

Idle:
8%

Low opportunity.

---

Clearly label:

> Synthetic demo data

Never imply these are real Optifye customer metrics.

---

# 4. MVP Screens

Only build 3 screens/surfaces.

## Screen 1: Account Overview

Show:

Apex Auto Components

Current Optifye deployment:

- 1 monitored line
- ₹14.2L annualized demonstrated value

Top expansion recommendation:

### Assembly B2

Opportunity Score:
92 / 100

Estimated recoverable value:
₹18.4L / year

Reason:

> Similar manual assembly process to A1, combined with a 14.6% output gap and high idle time.

CTA:

**View Recommendation**

Do not create lots of cards.

The founder should understand the product in under 10 seconds.

---

## Screen 2: Recommendation Detail

This is the most important screen.

Show side-by-side:

### Proven Deployment

Assembly A1

Efficiency:
68% → 79%

Idle:
21% → 14%

Value created:
₹14.2L / year

↓

### Recommended Expansion

Assembly B2

Output gap:
14.6%

Idle:
19%

Cycle variance:
18%

Estimated opportunity:
₹18.4L / year

Opportunity score:
92 / 100

Then show:

### Why B2?

- Similar process type
- Similar operator count
- High manual labor exposure
- Large output gap
- High idle time

---

# 5. Deterministic Opportunity Score

Do not use AI for ranking.

Use simple explainable logic.

Total score = 100.

Example:

Operational gap:
0–35

Manual labor exposure:
0–20

Similarity to successful line:
0–25

Production scale:
0–20

For B2:

Operational gap:
32/35

Manual exposure:
18/20

Similarity:
23/25

Production scale:
19/20

Total:
92/100

Keep logic simple and readable.

No ML model needed.

---

# 6. Simple ROI Calculation

Use a straightforward model.

monthlyGap =
targetMonthlyOutput - currentMonthlyOutput

annualGap =
monthlyGap × 12

recoverableUnits =
annualGap × recoveryRate

estimatedValue =
recoverableUnits × contributionMarginPerUnit

Example:

Current:
41,000

Target:
48,000

Monthly gap:
7,000

Annual gap:
84,000

Assumed recovery:
10%

Recoverable:
8,400 units

Margin:
₹220

Estimated value:

₹18.48L/year

Show:

> Illustrative estimate using synthetic assumptions.

Do not add complicated financial modeling.

---

# 7. AI Copilot

Add one small agent/chat surface.

This is mainly to better match the Founding Engineer AI/ML role.

The AI should NOT calculate scores or financial values itself.

It receives structured computed data.

Example questions:

> Which line should we expand to next?

Expected answer:

> Assembly B2 is the strongest candidate with a 92/100 opportunity score. It has a large output gap, high idle time, and closely resembles Assembly A1, where the existing Optifye deployment showed strong operational improvement.

---

User:

> Why not Packaging A3?

Agent:

> A3 has a smaller output gap and lower manual labor exposure. Its estimated recoverable value is also lower than B2.

---

User:

> What if we only recover 5% of the output gap?

The application recalculates using deterministic logic.

Then the AI explains the updated result.

Important:

AI explains.

Code calculates.

---

# 8. Agent Implementation

Keep this extremely small.

Give the LLM:

- existing deployment metrics
- candidate opportunity scores
- ROI calculations
- scoring breakdown

Prompt it to answer only from this structured context.

Do not build:

- vector database
- RAG
- tool orchestration framework
- multiple agents
- memory
- complex workflows

One agent/chat endpoint is enough.

If no API key exists, provide 3 predefined suggested questions and deterministic responses so the demo still works.

---

# 9. Tech Stack

Use:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui if useful

Data:

- static TypeScript objects

Backend:

- Next.js API route / server action

AI:

- OpenAI API or another available model

Do not add a database.

Do not add auth.

Do not add Supabase.

Do not add separate backend infrastructure.

---

# 10. Suggested Code Structure

/app
/page.tsx

/app/opportunity/[id]
/page.tsx

/api/copilot
/route.ts

/components
/account-summary.tsx
/recommendation-card.tsx
/opportunity-comparison.tsx
/copilot.tsx

/lib
/data.ts
/calculate-score.ts
/calculate-roi.ts

Keep architecture small.

---

# 11. UI Direction

The interface should look like a credible Optifye product extension.

Prioritize:

- strong typography
- simple layout
- white / neutral background
- dark text
- restrained accent color
- clear hierarchy
- very few charts
- no generic SaaS dashboard look

The main visual story should be:

**Optifye worked here → therefore expand here next**

Make that comparison visually obvious.

---

# 12. Hero Moment

The most important part of the entire project:

Show this clearly:

## Proven

Assembly A1

68% → 79% efficiency

₹14.2L annualized value

↓

## Next Opportunity

Assembly B2

92 / 100 score

₹18.4L estimated annual value

Then:

> Similar process. Larger current operational gap.

This should be understandable immediately.

---

# 13. Do NOT Build

Do not build:

- CV
- video processing
- factory camera integration
- authentication
- database
- CRM integration
- PDF export
- multi-tenant support
- proposal history
- Kubernetes
- Redis
- queues
- background jobs
- complex charts
- multi-agent systems
- embeddings
- RAG
- ML training
- huge analytics dashboard

Every extra feature hurts the 8-hour goal.

---

# 14. 8-Hour Build Plan

## Hour 0–1

Set up:

- Next.js
- TypeScript
- Tailwind
- synthetic dataset

Implement:

- scoring function
- ROI calculation

Success criteria:

Assembly B2 ranks first with correct values.

---

## Hour 1–3

Build Account Overview.

Must show:

- existing Optifye deployment
- demonstrated value
- top 3 candidate lines
- clear recommendation

Do not polish excessively yet.

---

## Hour 3–5

Build Recommendation Detail.

Focus heavily here.

Build:

- A1 vs B2 comparison
- score breakdown
- ROI calculation
- clean visual hierarchy

This should become the strongest screen.

---

## Hour 5–6.5

Add AI Copilot.

Support 3–5 questions.

Agent should receive computed data.

Ensure numbers always come from deterministic calculations.

---

## Hour 6.5–7.5

Polish UI.

Improve:

- spacing
- typography
- loading state
- responsive layout
- synthetic-data disclaimer
- button states

Remove anything unnecessary.

---

## Hour 7.5–8

Deploy and test demo.

Check:

- all numbers
- mobile-ish layout
- AI failure fallback
- no broken routes
- no claims that synthetic data is real

Prepare demo flow.

---

# 15. Exact 60–90 Second Demo

## 0–15 sec

Open dashboard.

Say:

> I noticed Optifye already creates measurable operational value after deployment, so I explored what the next revenue problem might be: deciding where to expand inside an existing customer.

Show:

Assembly B2
92/100
₹18.4L/year

---

## 15–40 sec

Open recommendation.

Say:

> B2 is ranked highest based on operational gap, manual exposure, production scale, and similarity to a successful existing deployment.

Show:

A1:
68% → 79%

B2:
14.6% output gap

---

## 40–60 sec

Show ROI.

Say:

> The ranking is deterministic and explainable. The financial model estimates recoverable value using explicit assumptions rather than letting an LLM invent numbers.

---

## 60–80 sec

Ask Copilot:

> Why B2 instead of A3?

Show answer.

Then:

> The agent explains the recommendation, but all calculations come from deterministic business logic.

Done.

---

# 16. What This Demonstrates

## Full-stack

Real functional application.

## AI / Agents

Small AI copilot over structured operational context.

## Production thinking

Deterministic calculations instead of hallucinated business metrics.

## Product sense

Feature tied directly to account expansion.

## Design

Clean enterprise UX.

## Factory understanding

Uses operational metrics relevant to Optifye.

## Speed

Built as a focused prototype rather than over-engineered software.

---

# 17. Technical Interview Talking Points

Be ready to explain:

### Why isn't the recommendation generated by the LLM?

Because scoring and financial calculations should be:

- deterministic
- explainable
- testable

The LLM is used for natural-language reasoning and interaction.

---

### Why no database?

The prototype only needs one synthetic customer.

Adding persistence provides almost zero proof-of-work value.

---

### How would production work?

Real version could consume:

- Optifye operational data
- CRM/account data
- historical line performance
- deployment costs
- successful expansion history

The ranking model could later learn from actual expansion outcomes.

---

### Why this feature?

Because once a company proves measurable value at one deployment, expansion within an existing customer can potentially be easier than acquiring a completely new customer.

This prototype explores software that supports that motion.

---

# 18. Honesty

Always distinguish:

## Implemented

- scoring
- ROI
- ranking
- AI explanation
- UI

## Synthetic

- customer
- line metrics
- deployment results
- financial values

## Hypothesis

- that Optifye needs this workflow
- that it would increase expansion revenue

Do not claim this solves an existing confirmed Optifye problem.

---

# 19. Final Success Condition

If Vivaan opens the link for 30 seconds, he should understand:

> This candidate studied our business, thought about account expansion, built an explainable recommendation engine, added an agent appropriately, and shipped it cleanly.

That is the entire purpose of the prototype.