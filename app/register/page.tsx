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
  Building,
  Mail,
  User,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Cpu,
  Globe,
  Database,
  FileCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp } from "@/lib/store/app-context";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [industry, setIndustry] = useState("Financial Services");
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !email.trim() || !organizationName.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please provide a valid corporate email address.");
      return;
    }

    if (password.length > 0 && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please accept the Enterprise Security and Deterministic Execution terms.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        fullName,
        email,
        organizationName,
        industry,
        role,
        password,
      });

      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Failed to initialize workspace.");
      }
    } catch (err) {
      setErrorMessage("An unexpected registration error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", score: 0, color: "bg-slate-300" };
    if (password.length < 6) return { label: "Weak", score: 1, color: "bg-red-500" };
    if (password.length < 10) return { label: "Good", score: 2, color: "bg-amber-500" };
    return { label: "Strong (Enterprise Grade)", score: 3, color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Left Column: Organization Setup & Architecture Specs */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

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
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Dedicated Multi-Tenant Workspace Provisioning</span>
          </div>
        </div>

        {/* Mid Value Features */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
            Transform high-volume document workflows into autonomous intelligence.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create an isolated tenant instance configured with zero-shot multimodal extractors,
            pgvector semantic embeddings, and strict deterministic compliance triggers.
          </p>

          {/* Provisioning Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Isolated PostgreSQL & pgvector Embeddings
                </div>
                <div className="text-xs text-slate-400">
                  Semantic chunk search with HNSW index and cosine similarity distance.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Deterministic Business Rule Sandbox
                </div>
                <div className="text-xs text-slate-400">
                  Strict numerical operator evaluations that guarantee 0% hallucination.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">
                  Visual 14-Node Workflow DAG Orchestrator
                </div>
                <div className="text-xs text-slate-400">
                  Conditional forks, human review escalations, and automated ERP webhooks.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Provisioning • No Credit Card Required</span>
          </div>
          <span>Release v2.4.0-Enterprise</span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <Logo size="md" />
            <Link
              href="/login"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign In →
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>14-Day Full-Featured Enterprise Trial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Create your AI-FLOW workspace
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Deploy your intelligent document automation suite in seconds.
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@company.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Organization Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-org"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-org"
                    name="organization"
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Meridian Capital"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-industry"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Industry Sector
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    id="reg-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs cursor-pointer appearance-none"
                  >
                    <option value="Financial Services">Financial Services & Banking</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="Legal & Compliance">Legal & Regulatory Compliance</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="Enterprise SaaS">Enterprise SaaS & Tech</option>
                    <option value="Other">Other Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-role"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Initial Account Role & Permissions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["ADMIN", "MANAGER", "APPROVER", "EMPLOYEE"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      role === r
                        ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="text-xs">{r}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min 6 chars)"
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

              {/* Password strength indicator */}
              {password && (
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <div className="flex gap-1">
                    <span className={`h-1.5 w-6 rounded-full ${strength.score >= 1 ? strength.color : "bg-slate-200 dark:bg-slate-800"}`} />
                    <span className={`h-1.5 w-6 rounded-full ${strength.score >= 2 ? strength.color : "bg-slate-200 dark:bg-slate-800"}`} />
                    <span className={`h-1.5 w-6 rounded-full ${strength.score >= 3 ? strength.color : "bg-slate-200 dark:bg-slate-800"}`} />
                  </div>
                  <span>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Terms and Deterministic Compliance */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  I agree to the{" "}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Enterprise Service Terms</span>{" "}
                  and confirm that automated document decisions will follow deterministic rule audits.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Provisioning isolated tenant...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back to Login */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an enterprise account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
