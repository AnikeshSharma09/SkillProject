import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store/app-context";
import { Shell } from "@/components/layout/shell";

export const metadata: Metadata = {
  title: "AI-FLOW | Intelligent Document & Workflow Automation Platform",
  description:
    "Smart Documents. Smart Workflows. Smarter Decisions. Enterprise-grade AI document parsing, OCR, confidence scoring, deterministic rule routing, and visual workflow orchestration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100" suppressHydrationWarning>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
