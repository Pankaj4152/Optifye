"use client";

import { useState } from "react";
import { ArrowUpRight, Send, Loader2 } from "lucide-react";
import { CandidateLine, Deployment } from "@/lib/data";
import { ScoreBreakdown } from "@/lib/calculate-score";
import { RoiProjection } from "@/lib/calculate-roi";

interface CopilotProps {
  candidate: CandidateLine;
  proven: Deployment;
  score: ScoreBreakdown;
  roi: RoiProjection;
  recoveryRate: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Copilot({
  candidate,
  proven,
  score,
  roi,
  recoveryRate,
}: CopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I am the Optifye Copilot. Ask me why **${candidate.name}** was prioritized over other lines based on the **${proven.name}** deployment benchmark.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    `Why is ${candidate.name} ranked #1?`,
    "Why not Packaging A3 or Inspection B4?",
    `What is the value at a ${recoveryRate}% recovery rate?`,
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!promptText) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            candidate,
            proven,
            score,
            roi,
            recoveryRate,
          },
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Unable to parse copilot response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Copilot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Encountered a network error. Fallback reasoning: Assembly B2 is prioritized due to its 14.6% output deficit, 38 manual operators, and direct process similarity to the monitored Assembly A1 line.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-black flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            AI Expansion Copilot
          </h3>
          <p className="text-[11px] text-neutral-400">Strictly grounded in deterministic metrics</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Zero Hallucinations
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-[90%] leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black font-medium"
                  : "bg-black border border-neutral-800 text-neutral-200"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Analyzing factory metrics...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="px-3 py-2 border-t border-neutral-900 bg-black">
        <div className="text-[10px] font-mono text-neutral-500 mb-1.5 uppercase">
          Suggested Questions
        </div>
        <div className="flex flex-col gap-1">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 px-2.5 py-1.5 rounded text-left transition-colors flex items-center justify-between"
            >
              <span>{prompt}</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-neutral-800 bg-black flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this expansion..."
          disabled={isLoading}
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-white hover:bg-neutral-200 disabled:opacity-30 text-black px-3 py-2 rounded-lg transition-colors font-medium text-xs flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
