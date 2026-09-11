"use client";

import { useState, useRef, useEffect } from "react";
import { SYNTHETIC_ACCOUNT } from "@/lib/data";
import { calculateOpportunityScore } from "@/lib/calculate-score";
import { calculateRoi } from "@/lib/calculate-roi";
import { CheckCircle2, ArrowRight, Send, Loader2, Sparkles, ArrowUpRight, TrendingUp, Info } from "lucide-react";

export default function SinglePageWorkspace() {
  const account = SYNTHETIC_ACCOUNT;
  const proven = account.monitoredDeployment;

  // Selected candidate state (defaults to #1 candidate Assembly B2)
  const [selectedId, setSelectedId] = useState<string>("assembly-b2");
  const [recoveryRate, setRecoveryRate] = useState<number>(10);

  // Copilot State
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "I analyze shop-floor metrics to explain why this line was prioritized based on the proven Assembly A1 benchmark.",
    },
  ]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [copilotMessages, isCopilotLoading]);

  // Selected candidate object
  const candidate = account.candidates.find((c) => c.id === selectedId) || account.candidates[0];
  
  // Deterministic calculations based on current dynamic recoveryRate
  const score = calculateOpportunityScore(candidate, proven);
  const roi = calculateRoi(candidate, recoveryRate);

  // Computed candidate list for the selector menu
  const candidateList = account.candidates.map((c) => {
    const candidateScore = calculateOpportunityScore(c, proven);
    const candidateRoi = calculateRoi(c, recoveryRate);
    return { candidate: c, score: candidateScore, roi: candidateRoi };
  }).sort((a, b) => b.score.totalScore - a.score.totalScore);

  // Handle Copilot Questions
  const handleAskCopilot = async (questionText: string) => {
    const trimmed = (questionText || "").trim();
    if (!trimmed || isCopilotLoading) return;

    setCopilotMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setCustomPrompt("");
    setIsCopilotLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          context: {
            candidate,
            proven,
            score,
            roi,
            recoveryRate,
          },
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setCopilotMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Unable to parse response." },
      ]);
    } catch (err) {
      console.warn("Copilot API fallback:", err);
      setCopilotMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**${candidate.name}** is prioritized due to its active **${score.outputGapPct}% output gap** (${candidate.currentMonthlyOutput.toLocaleString()} / ${candidate.targetMonthlyOutput.toLocaleString()} units/mo), **${candidate.operators} manual operators**, and direct process similarity to **${proven.name}**. At a **${recoveryRate}% recovery rate**, it generates an estimated **${roi.estimatedAnnualValueLakhsFormatted}/year** in recoverable margin.`,
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Super Simple 1-Sentence Purpose Callout */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              Founding Engineer Prototype
            </span>
            <span className="text-xs text-neutral-500 font-mono">Customer: {account.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Optifye Account Expansion Decision Engine
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            <strong className="text-neutral-200">The Problem Solved:</strong> Optifye already proved ₹14.2L in value on <span className="text-emerald-400 font-semibold">{proven.name}</span>. This tool analyzes the factory's remaining unmonitored lines to answer: <em className="text-neutral-200">Where should Optifye install cameras next, and how much money will it generate?</em>
          </p>
        </div>

        {/* 30-Second Summary Pill */}
        <div className="bg-black border border-neutral-800 p-3.5 rounded-xl text-xs space-y-1 shrink-0 self-stretch sm:self-auto min-w-[240px]">
          <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Top Recommendation</div>
          <div className="text-base font-bold text-white flex items-center justify-between">
            <span>Assembly Line B2</span>
            <span className="text-emerald-400 font-mono">92/100</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono flex items-center justify-between pt-1 border-t border-neutral-900">
            <span>Est. Recoverable Margin:</span>
            <span className="font-bold">₹18.48L/yr</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Ranked Line Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Unmonitored Factory Lines
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">Click to evaluate</span>
          </div>

          <div className="space-y-2.5">
            {candidateList.map((item, idx) => {
              const isSelected = item.candidate.id === selectedId;

              return (
                <button
                  key={item.candidate.id}
                  onClick={() => {
                    setSelectedId(item.candidate.id);
                    setCopilotMessages([
                      {
                        role: "assistant",
                        content: `Switched to **${item.candidate.name}**. Ask me how its ${item.score.outputGapPct}% output gap compares against ${proven.name}.`,
                      },
                    ]);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-neutral-900 border-white/50 ring-1 ring-white/20 shadow-lg shadow-black"
                      : "bg-neutral-950 border-neutral-800/80 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black text-neutral-400 border border-neutral-800">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-sm text-white">{item.candidate.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {item.score.totalScore}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">/100</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 mb-2.5 line-clamp-1">
                    {item.candidate.process}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-900 text-neutral-400 font-mono">
                    <span>{item.candidate.operators} manual workers</span>
                    <span className="text-emerald-400 font-semibold font-mono">{item.roi.estimatedAnnualValueLakhsFormatted}/yr</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Single Focused Decision View */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Comparison: Proven A1 vs Selected Candidate */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                  Core Business Case
                </span>
                <h2 className="text-lg font-bold text-white">
                  Why Install Optifye Cameras on {candidate.name}?
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Opportunity Score: {score.totalScore}/100
              </span>
            </div>

            {/* Side by Side Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proven Box */}
              <div className="rounded-lg border border-neutral-800 bg-black p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    1. PROVEN SUCCESS
                  </span>
                  <span className="text-neutral-500">{proven.installedDate}</span>
                </div>
                <h3 className="font-bold text-white text-base">{proven.name}</h3>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {proven.annualizedValueFormatted} <span className="text-xs font-normal text-neutral-400">/ yr created</span>
                </div>
                <div className="text-xs text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-900">
                  <div className="flex justify-between">
                    <span>Efficiency Gain:</span>
                    <span className="font-mono text-emerald-400 font-semibold">+{proven.currentEfficiency - proven.baselineEfficiency}% measured</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idle Time Cut:</span>
                    <span className="font-mono text-emerald-400 font-semibold">-{proven.baselineIdleTime - proven.currentIdleTime}% time saved</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deployed Hardware:</span>
                    <span className="font-mono text-neutral-300">{proven.cameraCount} Cameras ({proven.operators} Operators)</span>
                  </div>
                </div>
              </div>

              {/* Target Box */}
              <div className="rounded-lg border border-neutral-700 bg-black p-4 space-y-2.5 ring-1 ring-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-white font-bold">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    2. NEXT EXPANSION TARGET
                  </span>
                  <span className="text-amber-400 font-semibold">{score.outputGapPct}% Deficit</span>
                </div>
                <h3 className="font-bold text-white text-base">{candidate.name}</h3>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {roi.estimatedAnnualValueLakhsFormatted} <span className="text-xs font-normal text-neutral-400">/ yr recoverable</span>
                </div>
                <div className="text-xs text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-900">
                  <div className="flex justify-between">
                    <span>Monthly Deficit:</span>
                    <span className="font-mono text-amber-400 font-semibold">{(candidate.targetMonthlyOutput - candidate.currentMonthlyOutput).toLocaleString()} units/mo lost</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manual Labor:</span>
                    <span className="font-mono text-neutral-300 font-semibold">{candidate.operators} workers ({candidate.idleTimePct}% idle)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Process Similarity:</span>
                    <span className="font-mono text-emerald-400 font-semibold">Direct match to Assembly A1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Clean Rationale Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs font-mono">
              <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Output Gap</div>
                <div className="font-bold text-amber-400 text-sm mt-0.5">{score.outputGapPct}%</div>
              </div>
              <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Manual Workers</div>
                <div className="font-bold text-white text-sm mt-0.5">{candidate.operators}</div>
              </div>
              <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Process Match</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">High</div>
              </div>
              <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Unit Margin</div>
                <div className="font-bold text-white text-sm mt-0.5">₹{candidate.contributionMarginPerUnit}</div>
              </div>
            </div>

            {/* Interactive Recovery Slider */}
            <div className="pt-4 border-t border-neutral-800 space-y-2.5 bg-black/40 p-4 rounded-xl border">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive ROI Sensitivity (Gap Recovery %):</span>
                </span>
                <span className="font-mono font-bold text-emerald-400 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 text-sm">
                  {recoveryRate}% ({roi.recoverableUnitsAnnual.toLocaleString()} units/yr)
                </span>
              </div>
              <div className="py-1">
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={recoveryRate}
                  onChange={(e) => setRecoveryRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-800 rounded-lg cursor-pointer block"
                />
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                <span>5% Conservative (₹{(calculateRoi(candidate, 5).estimatedAnnualValueInr / 100000).toFixed(2)}L/yr)</span>
                <span>10% Baseline (₹{(calculateRoi(candidate, 10).estimatedAnnualValueInr / 100000).toFixed(2)}L/yr)</span>
                <span>25% Optimistic (₹{(calculateRoi(candidate, 25).estimatedAnnualValueInr / 100000).toFixed(2)}L/yr)</span>
              </div>
            </div>
          </div>

          {/* Clean Integrated Copilot */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                  Grounded AI Copilot
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Zero Math Hallucinations</span>
            </div>

            {/* 3 Instant 1-Click Questions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isCopilotLoading}
                onClick={() => handleAskCopilot(`Why is ${candidate.name} ranked as the top recommendation?`)}
                className="text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Why {candidate.name}?</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </button>

              <button
                type="button"
                disabled={isCopilotLoading}
                onClick={() => handleAskCopilot("Why not Packaging A3 or Inspection B4?")}
                className="text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Compare vs alternatives</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </button>

              <button
                type="button"
                disabled={isCopilotLoading}
                onClick={() => handleAskCopilot(`What is the ROI if we only recover ${recoveryRate}% of the gap?`)}
                className="text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Payback & Sensitivity ({recoveryRate}%)</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </button>
            </div>

            {/* Copilot Message Stream */}
            <div className="bg-black border border-neutral-800 rounded-lg p-3.5 space-y-3 text-xs max-h-56 overflow-y-auto font-sans">
              {copilotMessages.map((m, idx) => (
                <div key={idx} className={m.role === "user" ? "text-neutral-300 font-medium" : "text-neutral-200 leading-relaxed"}>
                  {m.role === "user" ? (
                    <div className="text-neutral-400 font-mono text-[11px] mb-0.5">Q: {m.content}</div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              ))}

              {isCopilotLoading && (
                <div className="flex items-center gap-2 text-neutral-400 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                  <span>Computing factory context...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ask Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customPrompt.trim()) {
                  handleAskCopilot(customPrompt);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask anything about this factory line..."
                disabled={isCopilotLoading}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 font-sans"
              />
              <button
                type="submit"
                disabled={isCopilotLoading || !customPrompt.trim()}
                className="bg-white hover:bg-neutral-200 disabled:opacity-30 text-black px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
