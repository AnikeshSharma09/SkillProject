"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  FileCheck,
  ShieldCheck,
  Zap,
  Lock,
  Upload,
  Cpu,
  Sliders,
  CheckCircle2,
  Check,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Navbar matching mockup */}
      <header className="h-18 max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo size="lg" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="#product" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Product
          </Link>
          <Link href="#solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Solutions
          </Link>
          <Link href="#how-it-works" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Resources
          </Link>
          <Link href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white btn-primary-gradient transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section matching Top-Left of mockup */}
      <section className="relative max-w-7xl mx-auto px-6 pt-8 pb-16 lg:py-16 overflow-hidden">
        {/* Soft pastel ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/25 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Powered Document Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Turn Documents <br />
              into <span className="text-[#2563EB]">Action</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              AI-FLOW understands your documents, extracts key information, triggers workflows,
              and automates your business processes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white btn-primary-gradient transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Bottom 3 Value Props matching mockup */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Document Intelligence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Workflow Automation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Secure & Scalable</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Floating Connected Cards Graphic matching mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Radial gradient background aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/60 via-purple-100/40 to-pink-100/30 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full blur-2xl pointer-events-none" />

              {/* Central Glowing 3D AI-FLOW Cube */}
              <div className="relative z-20 w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-1 shadow-2xl shadow-indigo-500/40 flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  <div className="w-12 h-12">
                    <Logo showText={false} className="w-12 h-12" />
                  </div>
                </div>
              </div>

              {/* Connecting SVG Flow lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <path
                  d="M140 140 Q 200 180 230 230"
                  stroke="#93C5FD"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M340 140 Q 280 180 250 230"
                  stroke="#C4B5FD"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M140 340 Q 200 300 230 250"
                  stroke="#93C5FD"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M340 340 Q 280 300 250 250"
                  stroke="#C4B5FD"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
              </svg>

              {/* Card 1 (Top-Left): INVOICE ABC Technologies ₹72,500 */}
              <div className="absolute top-4 left-0 sm:left-4 z-20 clean-card p-3.5 shadow-xl max-w-[170px] animate-bounce [animation-duration:6s]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-md bg-blue-50 text-blue-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    INVOICE
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  ABC Technologies
                </div>
                <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  ₹72,500
                </div>
              </div>

              {/* Card 2 (Top-Right): Contract NDA Agreement */}
              <div className="absolute top-8 right-0 sm:right-4 z-20 clean-card p-3.5 shadow-xl max-w-[170px] animate-bounce [animation-duration:7s] [animation-delay:1s]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Contract
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  NDA Agreement
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Signed
                </div>
              </div>

              {/* Card 3 (Bottom-Left): Purchase Order PO-8831 */}
              <div className="absolute bottom-6 left-0 sm:left-6 z-20 clean-card p-3.5 shadow-xl max-w-[170px] animate-bounce [animation-duration:8s] [animation-delay:2s]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Purchase Order
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  PO-8831
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  5 Items Verified
                </div>
              </div>

              {/* Card 4 (Bottom-Right): Leave Application Rahul Sharma */}
              <div className="absolute bottom-4 right-0 sm:right-6 z-20 clean-card p-3.5 shadow-xl max-w-[170px] animate-bounce [animation-duration:6.5s] [animation-delay:1.5s]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-md bg-purple-50 text-purple-600">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Leave Application
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  Rahul Sharma
                </div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                  Approved
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS Section matching Top-Right of mockup */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            From Documents to Decisions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            A seamless AI-powered workflow for your organization.
          </p>
        </div>

        {/* 5-Step Process Flow matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: "1",
              title: "Upload",
              desc: "Any document",
              icon: Upload,
              color: "text-blue-600 bg-blue-50 border-blue-200",
            },
            {
              step: "2",
              title: "AI Understands",
              desc: "Classify & extract",
              icon: Cpu,
              color: "text-purple-600 bg-purple-50 border-purple-200",
            },
            {
              step: "3",
              title: "Set Rules",
              desc: "Define workflows",
              icon: Sliders,
              color: "text-amber-600 bg-amber-50 border-amber-200",
            },
            {
              step: "4",
              title: "Automate",
              desc: "Approvals & actions",
              icon: Zap,
              color: "text-orange-600 bg-orange-50 border-orange-200",
            },
            {
              step: "5",
              title: "Track Results",
              desc: "Full audit trail",
              icon: CheckCircle2,
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="clean-card p-5 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {item.desc}
                </p>

                {/* Right Arrow indicator if not last */}
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enter Workspace Direct Button */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-primary-gradient shadow-lg transition-all"
          >
            <span>Launch Interactive Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Video Modal if user clicks Watch Demo */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="clean-card p-6 max-w-lg w-full text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI-FLOW Interactive Platform Walkthrough
            </h3>
            <p className="text-xs text-slate-500">
              AI-FLOW features OCR entity extraction, deterministic Python rule sandboxes,
              and multi-tier approval gates. You can explore all features directly in the workspace.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200"
              >
                Close
              </button>
              <Link
                href="/dashboard"
                className="px-5 py-2 text-xs font-bold text-white btn-primary-gradient rounded-xl"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
