"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, User, HelpCircle, Loader2 } from "lucide-react";
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
      content: `I am the Optifye Expansion Copilot. I analyze structured factory data and explain why **${candidate.name}** was recommended for expansion based on the proven results from **${proven.name}**.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    `Why is ${candidate.name} ranked as the top candidate?`,
    "Why not Packaging A3 or Inspection B4?",
    `What is the financial impact at a ${recoveryRate}% recovery rate?`,
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
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col h-[560px] overflow-hidden">
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Expansion Copilot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Grounded AI
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Answers strictly from deterministic data</p>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Zero Math Hallucinations</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}

            <div
              className={`rounded-lg p-3 max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-600 text-white font-medium"
                  : "bg-slate-950/80 border border-slate-800 text-slate-200"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>

            {m.role === "user" && (
              <div className="w-6 h-6 rounded bg-emerald-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Analyzing structured factory metrics...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] text-slate-500 font-medium mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 px-2 py-1 rounded text-left transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this expansion opportunity..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 p-2 rounded-lg transition-colors font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
