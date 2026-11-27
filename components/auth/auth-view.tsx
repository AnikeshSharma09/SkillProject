"use client";

import React, { useState, useEffect } from "react";
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
  Building,
  AlertCircle,
  FileCheck,
  User,
  KeyRound,
  Copy,
  Check,
  Briefcase,
  Users,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp, DEMO_USERS } from "@/lib/store/app-context";
import { UserRole } from "@/types";

export interface AuthViewProps {
  initialMode?: "login" | "register";
}

export function AuthView({ initialMode = "login" }: AuthViewProps) {
  const router = useRouter();
  const { login, register, isAuthenticated, isHydrated } = useApp();

  const [mode, setMode] = useState<"login" | "register">(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__aiflow_current_mode) {
        return (window as any).__aiflow_current_mode;
      }
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      if (urlMode === "register" || urlMode === "login") {
        return urlMode;
      }
    }
    return initialMode;
  });

  // If already authenticated and state is hydrated, auto-redirect to dashboard
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isHydrated, isAuthenticated]);

  // Sync mode and password visibility on initial client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.setAttribute("data-hydrated", "true");
      const currentGlobalMode = (window as any).__aiflow_current_mode;
      const params = new URLSearchParams(window.location.search);
      const urlMode = currentGlobalMode || params.get("mode");
      if (urlMode === "register" || urlMode === "login") {
        setMode(urlMode);
        if ((window as any).__aiflow_switch) {
          (window as any).__aiflow_switch(urlMode);
        }
      }
      if ((window as any).__aiflow_pwd_visibility) {
        if ((window as any).__aiflow_pwd_visibility["login-password"] !== undefined) {
          setShowLoginPassword((window as any).__aiflow_pwd_visibility["login-password"]);
        }
        if ((window as any).__aiflow_pwd_visibility["reg-pass"] !== undefined) {
          setShowRegPassword((window as any).__aiflow_pwd_visibility["reg-pass"]);
        }
        if ((window as any).__aiflow_pwd_visibility["reg-confirm-pass"] !== undefined) {
          setShowRegConfirmPassword((window as any).__aiflow_pwd_visibility["reg-confirm-pass"]);
        }
      }
    }
  }, []);

  // Tab switching helpers that update state and keep URL synchronized
  const handleSwitchToRegister = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode("register");
    setErrorMessage("");
    setSuccessMessage("");
    if (typeof window !== "undefined") {
      if ((window as any).__aiflow_switch) {
        (window as any).__aiflow_switch("register");
      }
      const url = new URL(window.location.href);
      url.searchParams.set("mode", "register");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleSwitchToLogin = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMode("login");
    setErrorMessage("");
    setSuccessMessage("");
    if (typeof window !== "undefined") {
      if ((window as any).__aiflow_switch) {
        (window as any).__aiflow_switch("login");
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("mode");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("anikesh.sharma@aiflow.company");
  const [loginPassword, setLoginPassword] = useState("Admin@2026#Secure");
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(() => {
    if (typeof window !== "undefined" && (window as any).__aiflow_pwd_visibility) {
      return Boolean((window as any).__aiflow_pwd_visibility["login-password"]);
    }
    return false;
  });
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regOrgName, setRegOrgName] = useState("Symbiosis Enterprise");
  const [regDepartment, setRegDepartment] = useState("Finance & Accounts");
  const [regRole, setRegRole] = useState<UserRole>("ADMIN");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState<boolean>(() => {
    if (typeof window !== "undefined" && (window as any).__aiflow_pwd_visibility) {
      return Boolean((window as any).__aiflow_pwd_visibility["reg-pass"]);
    }
    return false;
  });
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(() => {
    if (typeof window !== "undefined" && (window as any).__aiflow_pwd_visibility) {
      return Boolean((window as any).__aiflow_pwd_visibility["reg-confirm-pass"]);
    }
    return false;
  });
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // General Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sign In Submission
  const handleLoginSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage("");
    setSuccessMessage("");

    // Read directly from DOM input values or state to ensure latest credentials
    const domEmail = (document.getElementById("login-email") as HTMLInputElement)?.value;
    const domPassword = (document.getElementById("login-password") as HTMLInputElement)?.value;
    const emailToUse = (domEmail !== undefined && domEmail.trim() !== "" ? domEmail : loginEmail).trim();
    const passwordToUse = (domPassword !== undefined && domPassword.trim() !== "" ? domPassword : loginPassword).trim();

    if (!emailToUse) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }

    if (!passwordToUse) {
      setErrorMessage("Please enter your corporate account password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(emailToUse, passwordToUse);
      if (res.success) {
        setSuccessMessage("Authentication successful! Loading workspace...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 300);
      } else {
        setErrorMessage(res.error || "Unable to sign in. Please verify your credentials.");
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Registration Submission
  const handleRegisterSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage("");
    setSuccessMessage("");

    const domName = (document.getElementById("reg-name") as HTMLInputElement)?.value;
    const domEmail = (document.getElementById("reg-email") as HTMLInputElement)?.value;
    const domPassword = (document.getElementById("reg-pass") as HTMLInputElement)?.value;
    const domConfirmPassword = (document.getElementById("reg-confirm-pass") as HTMLInputElement)?.value;
    const domOrg = (document.getElementById("reg-org") as HTMLInputElement)?.value;
    const domRole = (document.getElementById("reg-role") as HTMLSelectElement)?.value as UserRole;
    const domDept = (document.getElementById("reg-dept") as HTMLInputElement)?.value;

    const nameToUse = (domName !== undefined && domName.trim() !== "" ? domName : regFullName).trim();
    const emailToUse = (domEmail !== undefined && domEmail.trim() !== "" ? domEmail : regEmail).trim();
    const passwordToUse = (domPassword !== undefined && domPassword.trim() !== "" ? domPassword : regPassword).trim();
    const confirmPasswordToUse = (domConfirmPassword !== undefined && domConfirmPassword.trim() !== "" ? domConfirmPassword : regConfirmPassword).trim();
    const orgToUse = (domOrg !== undefined && domOrg.trim() !== "" ? domOrg : regOrgName).trim() || "Symbiosis Enterprise";
    const deptToUse = (domDept !== undefined && domDept.trim() !== "" ? domDept : regDepartment).trim() || "Operations";
    const roleToUse = (domRole || regRole);

    if (!nameToUse) {
      setErrorMessage("Please enter your full legal name.");
      return;
    }

    if (!emailToUse) {
      setErrorMessage("Please provide your corporate email address.");
      return;
    }

    if (!emailToUse.includes("@")) {
      setErrorMessage("Please provide a valid email address with an '@' symbol.");
      return;
    }

    if (!passwordToUse) {
      setErrorMessage("Please choose a security password for your account.");
      return;
    }

    if (passwordToUse.length < 6) {
      setErrorMessage("Password must be at least 6 characters in length.");
      return;
    }

    if (passwordToUse !== confirmPasswordToUse) {
      setErrorMessage("Passwords do not match. Please verify both password entries.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please accept the corporate security and platform terms.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        fullName: nameToUse,
        email: emailToUse,
        password: passwordToUse,
        organizationName: orgToUse,
        department: deptToUse,
        role: roleToUse,
      });

      if (res.success) {
        setSuccessMessage("Account created successfully! Forwarding to your dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 400);
      } else {
        setErrorMessage(res.error || "Failed to register account.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected registration error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Login for Authorized Personnel
  const handleQuickLogin = async (userEmail: string, userPass?: string) => {
    setLoginEmail(userEmail);
    if (userPass) setLoginPassword(userPass);

    // Sync input values in the DOM immediately
    const emailInp = document.getElementById("login-email") as HTMLInputElement;
    const passInp = document.getElementById("login-password") as HTMLInputElement;
    if (emailInp) emailInp.value = userEmail;
    if (passInp) passInp.value = userPass || "Admin@2026#Secure";

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await login(userEmail, userPass || "Admin@2026#Secure");
      if (res.success) {
        setSuccessMessage("Signed in! Loading dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 300);
      } else {
        setErrorMessage(res.error || "Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill into form without submitting
  const handleSelectCredentials = (userEmail: string, userPass: string) => {
    handleSwitchToLogin();
    setLoginEmail(userEmail);
    setLoginPassword(userPass);
    setShowCredentialsModal(false);
    setErrorMessage("");
  };

  // Password Strength Indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "Empty", score: 0, color: "bg-slate-200 dark:bg-slate-700" };
    if (pwd.length < 6) return { label: "Weak (min 6 chars)", score: 1, color: "bg-red-500" };
    if (pwd.length < 10) return { label: "Good", score: 2, color: "bg-amber-500" };
    return { label: "Enterprise Grade", score: 3, color: "bg-emerald-500" };
  };

  const regStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ========================================================
          LEFT COLUMN: Enterprise Showcase & Credentials Access
          ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden border-r border-slate-800">
        {/* Ambient background glows */}
        <div className="absolute inset-0 subtle-grid-bg opacity-25 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo & Platform Identity */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Logo size="md" />
            </div>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-400/30 text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Powered Autonomous Document Platform</span>
          </div>
        </div>

        {/* Mid: Value Proposition & Credentials Banner */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-black tracking-tight leading-tight text-white">
            Enterprise Ingestion. <br />
            Maker-Checker Rules. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Zero-Trust Disbursals.
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            AI-FLOW streamlines commercial tax invoices, purchase orders, and multi-tier
            approval workflows with deterministic Python condition-action rules and
            immutable cryptographic audit logging.
          </p>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <FileCheck className="w-4 h-4" />
                <span>99.4% OCR Precision</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Client Tesseract WASM with server PaddleOCR capability.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Rules</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Never delegates mission-critical thresholds to guessing models.
              </p>
            </div>
          </div>

          {/* Dedicated Company Credentials Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>Authorized Company Credentials</span>
              </div>
              <button
                type="button"
                id="open-credentials-hero-btn"
                onClick={() => setShowCredentialsModal(true)}
                className="open-credentials-trigger text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full List</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mb-3">
              Pre-configured personnel with assigned roles (Admin, CFO, Operations Manager, Compliance Officer, Accounts).
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_USERS.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  data-quick-email={u.email}
                  data-quick-password={u.password || "Admin@2026#Secure"}
                  onClick={() => handleSelectCredentials(u.email, u.password || "Admin@2026#Secure")}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{u.fullName.split(" ")[0]} ({u.role})</span>
                </button>
              ))}
              <button
                type="button"
                id="open-credentials-more-btn"
                onClick={() => setShowCredentialsModal(true)}
                className="open-credentials-trigger px-2 py-1 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/30 text-[11px] font-semibold text-blue-200 transition-colors cursor-pointer"
              >
                +2 More
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Security Standards & Tenant Indicator */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2FA PIN Verification Active (Disbursals: 7792)</span>
          </div>
          <span>Symbiosis Enterprise Tenant #01</span>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Dynamic Auth Form (Sign In / Register)
          ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <Logo size="md" />
            <button
              type="button"
              id="open-credentials-mobile-btn"
              onClick={() => setShowCredentialsModal(true)}
              className="open-credentials-trigger text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Company Credentials</span>
            </button>
          </div>

          {/* Mode Switcher Segmented Control: [Sign In] vs [Register] */}
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 relative z-10">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={handleSwitchToLogin}
              onMouseDown={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined" && (window as any).__aiflow_switch) {
                  (window as any).__aiflow_switch("login");
                }
                handleSwitchToLogin();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                mode === "login"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Sign In (Existing User)</span>
            </button>

            <button
              type="button"
              id="tab-register-btn"
              onClick={handleSwitchToRegister}
              onMouseDown={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined" && (window as any).__aiflow_switch) {
                  (window as any).__aiflow_switch("register");
                }
                handleSwitchToRegister();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                mode === "register"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Register (New User)</span>
            </button>
          </div>

          {/* Form Header Info */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span id="auth-badge-text">
                {mode === "login" ? "Corporate Identity Verification" : "New Enterprise Account Setup"}
              </span>
            </div>
            <h2 id="auth-heading-text" className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {mode === "login" ? "Welcome back to AI-FLOW" : "Create your corporate account"}
            </h2>
            <p id="auth-sub-text" className="text-slate-500 dark:text-slate-400 text-xs">
              {mode === "login"
                ? "Enter your registered credentials below, or click an authorized company profile."
                : "Register a new user profile to access document ingestion, OCR parsing, and workflows."}
            </p>
          </div>

          {/* Feedback Messages (Top Level) */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================
              FORM 1: SIGN IN (FOR OLD / EXISTING USERS)
              Both forms exist in SSR HTML for zero hydration lag
              ======================================================== */}
          <div
            id="auth-login-box"
            style={{ display: mode === "login" ? "block" : "none" }}
          >
            <form noValidate onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Corporate Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Corporate Email Address
                  </label>
                  <button
                    type="button"
                    id="open-credentials-form-btn"
                    onClick={() => setShowCredentialsModal(true)}
                    className="open-credentials-trigger text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Company Emails</span>
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@aiflow.company"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Field with Guaranteed Interactive Eye Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    id="open-credentials-forgot-btn"
                    onClick={() => setShowCredentialsModal(true)}
                    className="open-credentials-trigger text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="login-password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter corporate password"
                    className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs font-mono text-xs"
                  />
                  <button
                    type="button"
                    id="login-eye-toggle-btn"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                        (window as any).__aiflow_toggle_pwd("login-password");
                      }
                      setShowLoginPassword((prev) => !prev);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                        (window as any).__aiflow_toggle_pwd("login-password");
                      }
                      setShowLoginPassword((prev) => !prev);
                    }}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    title={showLoginPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Eye className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Keep me signed in on this corporate workstation
                  </span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                id="signin-submit-btn"
                disabled={isLoading}
                onClick={handleLoginSubmit}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer z-10"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Authorized Corporate Personas */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200 dark:border-slate-800" />
                  <span className="shrink-0 mx-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Instant 1-Click Authorized Personas</span>
                  </span>
                  <div className="grow border-t border-slate-200 dark:border-slate-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      data-quick-email={user.email}
                      data-quick-password={user.password || "Admin@2026#Secure"}
                      onClick={() => handleQuickLogin(user.email, user.password)}
                      disabled={isLoading}
                      className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {user.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{user.role}</span>
                            <span className="text-[9px] text-slate-400 truncate max-w-[80px]">
                              {user.department?.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* ========================================================
              FORM 2: REGISTER (FOR NEW USERS)
              Pre-rendered in HTML for immediate responsiveness
              ======================================================== */}
          <div
            id="auth-register-box"
            style={{ display: mode === "register" ? "block" : "none" }}
          >
            <form noValidate onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Priya Nair"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Corporate Email */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Organization & Role in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-org"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="reg-org"
                      type="text"
                      required
                      value={regOrgName}
                      onChange={(e) => setRegOrgName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-role"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Assigned Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      id="reg-role"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-semibold"
                    >
                      <option value="ADMIN">ADMIN (Full Platform)</option>
                      <option value="MANAGER">MANAGER (Operations & Approvals)</option>
                      <option value="APPROVER">APPROVER (Risk & Compliance)</option>
                      <option value="EMPLOYEE">EMPLOYEE (Accounts & OCR Entry)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-dept"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Department / Business Unit
                </label>
                <input
                  id="reg-dept"
                  type="text"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  placeholder="e.g. Finance, Accounts Payable, Logistics"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-pass"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password (min 6) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-pass"
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                    />
                    <button
                      type="button"
                      id="reg-eye-toggle-btn"
                      tabIndex={-1}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                          (window as any).__aiflow_toggle_pwd("reg-pass");
                        }
                        setShowRegPassword((prev) => !prev);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                          (window as any).__aiflow_toggle_pwd("reg-pass");
                        }
                        setShowRegPassword((prev) => !prev);
                      }}
                      title={showRegPassword ? "Hide password" : "Show password"}
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-confirm-pass"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm-pass"
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                    />
                    <button
                      type="button"
                      id="reg-confirm-eye-toggle-btn"
                      tabIndex={-1}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                          (window as any).__aiflow_toggle_pwd("reg-confirm-pass");
                        }
                        setShowRegConfirmPassword((prev) => !prev);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof window !== "undefined" && (window as any).__aiflow_toggle_pwd) {
                          (window as any).__aiflow_toggle_pwd("reg-confirm-pass");
                        }
                        setShowRegConfirmPassword((prev) => !prev);
                      }}
                      title={showRegConfirmPassword ? "Hide password" : "Show password"}
                      aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
                    >
                      {showRegConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Status */}
              {regConfirmPassword && (
                <div className="text-[11px] flex items-center gap-1.5">
                  {regPassword === regConfirmPassword ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Passwords match</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Passwords do not match yet</span>
                    </span>
                  )}
                </div>
              )}

              {/* Password Strength Meter */}
              {regPassword && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Security Strength:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {regStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full flex-1 rounded-full ${
                        regStrength.score >= 1 ? regStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full ${
                        regStrength.score >= 2 ? regStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full ${
                        regStrength.score >= 3 ? regStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer mt-0.5"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    I acknowledge corporate multi-tenant governance, immutable audit logging,
                    and maker-checker financial disbursement protocols.
                  </span>
                </label>
              </div>

              {/* Inline Error Notice Directly Above Submit */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-fadeIn"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Register Submit Button */}
              <button
                type="submit"
                id="register-submit-btn"
                disabled={isLoading}
                onClick={handleRegisterSubmit}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer z-10"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Provisioning corporate profile...</span>
                  </>
                ) : (
                  <>
                    <span>Register New User & Access Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Helper Switch */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <div id="footer-login-msg" style={{ display: mode === "login" ? "block" : "none" }}>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you a new employee or tenant?{" "}
                <button
                  type="button"
                  id="footer-register-link"
                  onClick={handleSwitchToRegister}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (typeof window !== "undefined" && (window as any).__aiflow_switch) {
                      (window as any).__aiflow_switch("register");
                    }
                    handleSwitchToRegister();
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </div>
            <div id="footer-register-msg" style={{ display: mode === "register" ? "block" : "none" }}>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Already have an authorized account?{" "}
                <button
                  type="button"
                  id="footer-login-link"
                  onClick={handleSwitchToLogin}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (typeof window !== "undefined" && (window as any).__aiflow_switch) {
                      (window as any).__aiflow_switch("login");
                    }
                    handleSwitchToLogin();
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CREDENTIALS DIRECTORY MODAL (POPUP FOR ALL 5 ACCOUNTS)
          Pre-rendered in DOM so it can open at 0ms before hydration
          ======================================================== */}
      <div
        id="auth-credentials-modal"
        style={{ display: showCredentialsModal ? "flex" : "none" }}
        className="fixed inset-0 z-50 items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      >
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Authorized Company Credentials Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-configured executive &amp; operational personnel accounts with passwords.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="close-credentials-modal-top"
              onClick={() => setShowCredentialsModal(false)}
              className="close-credentials-trigger w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Modal Body: Personnel Table */}
          <div className="p-5 overflow-y-auto space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                Click <strong>Auto-Fill</strong> to automatically populate credentials and switch to the login tab,
                or copy individual emails and passwords for manual testing.
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_USERS.map((person) => (
                <div
                  key={person.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={person.avatarUrl}
                      alt={person.fullName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {person.fullName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            person.role === "ADMIN"
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : person.role === "MANAGER"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : person.role === "APPROVER"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {person.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {person.title || person.department || "Enterprise Officer"}
                      </div>

                      {/* Email & Password display */}
                      <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                        {/* Email badge */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{person.email}</span>
                          <button
                            type="button"
                            data-copy-text={person.email}
                            onClick={() => handleCopy(person.email, `email-${person.id}`)}
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ml-0.5"
                            title="Copy Email"
                          >
                            {copiedKey === `email-${person.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Password badge */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>{person.password || "Admin@2026#Secure"}</span>
                          <button
                            type="button"
                            data-copy-text={person.password || "Admin@2026#Secure"}
                            onClick={() =>
                              handleCopy(person.password || "Admin@2026#Secure", `pass-${person.id}`)
                            }
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ml-0.5"
                            title="Copy Password"
                          >
                            {copiedKey === `pass-${person.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto Fill Button */}
                  <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                    <button
                      type="button"
                      data-modal-autofill-email={person.email}
                      data-modal-autofill-password={person.password || "Admin@2026#Secure"}
                      onClick={() =>
                        handleSelectCredentials(person.email, person.password || "Admin@2026#Secure")
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                    <button
                      type="button"
                      data-modal-signin-email={person.email}
                      data-modal-signin-password={person.password || "Admin@2026#Secure"}
                      onClick={() => {
                        setShowCredentialsModal(false);
                        handleQuickLogin(person.email, person.password);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Sign In Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
            <span>Security PIN for High-Value Payment Disbursal: <strong>7792</strong></span>
            <button
              type="button"
              id="close-credentials-modal-bottom"
              onClick={() => setShowCredentialsModal(false)}
              className="close-credentials-trigger px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
