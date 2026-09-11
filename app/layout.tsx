import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optifye Expansion Copilot | Account Expansion Intelligence",
  description: "Identify and quantify the next highest-ROI factory lines for Optifye camera & AI deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* Top Navigation Banner */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center font-black text-xs text-slate-950">
                  O
                </div>
                <span className="font-bold text-sm tracking-tight text-white">Optifye<span className="text-emerald-400 font-mono text-xs ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">EXPANSION COPILOT</span></span>
              </div>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-slate-400 font-medium">Apex Auto Components</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
                Synthetic Demo Data
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Optifye.ai Expansion Intelligence Prototype</span>
            <span className="text-slate-600 font-mono">Deterministic Math + Grounded LLM Reasoning</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
