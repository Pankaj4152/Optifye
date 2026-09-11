import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optifye | Expansion Copilot",
  description: "Digitalizing manual operations & identifying high-yield factory expansion lines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
        {/* Minimal Clean Header - Optifye Style */}
        <header className="border-b border-neutral-800/80 bg-black/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center font-black text-xs text-black">
                O
              </div>
              <span className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
                Optifye
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  Expansion Copilot
                </span>
              </span>
            </Link>

            {/* Account & Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                <span className="text-neutral-500">Account:</span>
                <span className="font-medium text-neutral-200">Apex Auto Components</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-900 text-neutral-300 border border-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Demo Dataset
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Minimal Clean Footer */}
        <footer className="border-t border-neutral-900 bg-black py-6 text-xs text-neutral-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-400">Optifye.ai</span>
              <span>— Factory Performance Intelligence</span>
            </div>
            <div className="font-mono text-[11px] text-neutral-600">
              Deterministic Calculation Engine + Grounded AI Copilot
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
