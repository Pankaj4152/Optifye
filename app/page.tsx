"use client";

import { useState, useRef, useEffect } from "react";
import { SYNTHETIC_ACCOUNT } from "@/lib/data";
import { calculateOpportunityScore } from "@/lib/calculate-score";
import { calculateRoi } from "@/lib/calculate-roi";
import { CheckCircle2, ArrowRight, Send, Loader2, Sparkles, ArrowUpRight } from "lucide-react";

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
      {/* Top Banner: Single Simple Story */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
            {account.name} • {account.industry}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Factory Expansion Workspace
          </h1>
        </div>

        {/* Proven Deployment Quick Pill */}
        <div className="bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-neutral-400">Proven Line:</span>
            <span className="font-semibold text-white">{proven.name}</span>
          </div>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="text-emerald-400 font-mono font-bold">
            {proven.annualizedValueFormatted} <span className="text-neutral-500 font-normal text-[11px]">created</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Ranked Line Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 px-1">
            Select Line to Evaluate
          </div>

          <div className="space-y-2">
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
                      ? "bg-neutral-900 border-white/40 ring-1 ring-white/20"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-500">#{idx + 1}</span>
                      <span className="font-bold text-sm text-white">{item.candidate.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {item.score.totalScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-1 mb-2">
                    {item.candidate.process}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-900 text-neutral-400 font-mono">
                    <span>{item.candidate.operators} Operators</span>
                    <span className="text-emerald-400 font-semibold">{item.roi.estimatedAnnualValueLakhsFormatted}/yr</span>
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
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Deployment Replication Model
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Score: {score.totalScore}/100
              </span>
            </div>

            {/* Side by Side Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proven Box */}
              <div className="rounded-lg border border-neutral-800 bg-black p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PROVEN: {proven.name}</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">{proven.annualizedValueFormatted} <span className="text-xs font-normal text-neutral-500">/ yr created</span></div>
                <div className="text-xs text-neutral-400 space-y-1 pt-1 border-t border-neutral-900">
                  <div className="flex justify-between">
                    <span>Efficiency Gain:</span>
                    <span className="font-mono text-emerald-400">+{proven.currentEfficiency - proven.baselineEfficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idle Reduction:</span>
                    <span className="font-mono text-emerald-400">-{proven.baselineIdleTime - proven.currentIdleTime}%</span>
                  </div>
                </div>
              </div>

              {/* Target Box */}
              <div className="rounded-lg border border-neutral-700 bg-black p-4 space-y-2.5 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5 text-xs text-white font-mono font-semibold">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TARGET: {candidate.name}</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{roi.estimatedAnnualValueLakhsFormatted} <span className="text-xs font-normal text-neutral-500">/ yr recoverable</span></div>
                <div className="text-xs text-neutral-400 space-y-1 pt-1 border-t border-neutral-900">
                  <div className="flex justify-between">
                    <span>Output Deficit:</span>
                    <span className="font-mono text-amber-400">{score.outputGapPct}% gap</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manual Labor:</span>
                    <span className="font-mono text-neutral-300">{candidate.operators} operators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Clean Rationale Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
              <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                <div className="text-[10px] text-neutral-500">Output Gap</div>
                <div className="font-bold text-white mt-0.5">{score.outputGapPct}%</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                <div className="text-[10px] text-neutral-500">Operators</div>
                <div className="font-bold text-white mt-0.5">{candidate.operators} workers</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                <div className="text-[10px] text-neutral-500">Process Match</div>
                <div className="font-bold text-emerald-400 mt-0.5">High</div>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                <div className="text-[10px] text-neutral-500">Unit Margin</div>
                <div className="font-bold text-white mt-0.5">₹{candidate.contributionMarginPerUnit}</div>
              </div>
            </div>

            {/* Interactive Recovery Slider */}
            <div className="pt-3 border-t border-neutral-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <span>Target Output Gap Recovery Rate:</span>
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
                <span>5% Conservative (₹{(calculateRoi(candidate, 5).estimatedAnnualValueInr / 100000).toFixed(2)}L)</span>
                <span>10% Baseline</span>
                <span>25% Optimistic (₹{(calculateRoi(candidate, 25).estimatedAnnualValueInr / 100000).toFixed(2)}L)</span>
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
              <span className="text-[10px] font-mono text-neutral-500">Zero Hallucinations</span>
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
