"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Bot,
  Building,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp, DEMO_USERS } from "@/lib/store/app-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, availableUsers, currentUser } = useApp();

  const [email, setEmail] = useState("sarah.chen@apexglobal.io");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Unable to sign in. Please check your credentials.");
      }
    } catch (err) {
      setErrorMessage("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await login(userEmail, "demo-password");
      if (res.success) {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Left Column: Enterprise Value & Live Intelligence Preview */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden border-r border-slate-800">
        {/* Ambient background glow & grid */}
        <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/dashboard" className="inline-block">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <Logo size="md" />
              </div>
            </div>
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-400/30 text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Powered Autonomous Document Platform</span>
          </div>
        </div>

        {/* Mid Hero Value Statement */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Smart Documents. <br />
            Smart Workflows. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Smarter Decisions.
            </span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Eliminate operational friction with deterministic Python rules and hybrid
            neural document extraction. Every classification, threshold check, and approval
            is immutably audited.
          </p>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <FileCheck className="w-4 h-4" />
                <span>99.4% Precision</span>
              </div>
              <p className="text-slate-400 text-xs">
                Multimodal OCR & dynamic bounding box verification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucination</span>
              </div>
              <p className="text-slate-400 text-xs">
                Deterministic business logic never delegates to guessing models.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Security */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOC2 Type II Certified • GDPR • HIPAA Compliant</span>
          </div>
          <span>Apex Global Tenant #102</span>
        </div>
      </div>

      {/* Right Column: Sign In Form & 1-Click Role Switcher */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <Logo size="md" />
            <Link
              href="/dashboard"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Guest Preview →
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Enterprise Identity & Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Sign in to your workspace
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your corporate credentials or select a pre-configured role below.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("For demo purposes, any password will sign in, or click a demo account below!")}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security token"
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Deterministic Auth Flag */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Trust this enterprise device for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-200 dark:border-slate-800" />
              <span className="shrink-0 mx-3 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Instant 1-Click Demo Profiles
              </span>
              <div className="grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.email)}
                  disabled={isLoading}
                  className="p-2.5 text-left rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white/70 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {user.fullName}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {user.role}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Registration Link & Guest Mode */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Need a new enterprise instance?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create Workspace
              </Link>
            </p>
            <div>
              <Link
                href="/dashboard"
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Skip authentication and explore as Guest →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
