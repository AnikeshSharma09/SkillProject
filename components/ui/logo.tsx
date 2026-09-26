import React from "react";

export function Logo({
  className = "w-8 h-8",
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Luminous Cyber Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 opacity-40 blur-md group-hover:opacity-75 transition-opacity" />

        {/* 3-Node Connected Graph Emblem */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md"
        >
          <rect width="36" height="36" rx="10" fill="url(#logo-cyber-bg)" />
          <rect
            width="36"
            height="36"
            rx="10"
            stroke="url(#logo-border-glow)"
            strokeWidth="1.2"
          />

          {/* Interconnecting flow lines */}
          <path
            d="M18 10L11 25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity="0.8"
          />
          <path
            d="M18 10L25 25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity="0.8"
          />
          <path
            d="M13 21H23"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Node 1: Top Intelligence Core */}
          <circle cx="18" cy="10" r="4" fill="#FFFFFF" />
          <circle cx="18" cy="10" r="2" fill="#6366F1" />

          {/* Node 2: Bottom Left Rule Engine */}
          <circle cx="11" cy="25" r="3.2" fill="#FFFFFF" />
          <circle cx="11" cy="25" r="1.6" fill="#06B6D4" />

          {/* Node 3: Bottom Right Execution */}
          <circle cx="25" cy="25" r="3.2" fill="#FFFFFF" />
          <circle cx="25" cy="25" r="1.6" fill="#A855F7" />

          <defs>
            <linearGradient
              id="logo-cyber-bg"
              x1="0"
              y1="0"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0F172A" />
              <stop offset="0.6" stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#31104B" />
            </linearGradient>
            <linearGradient
              id="logo-border-glow"
              x1="0"
              y1="0"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6366F1" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tighter text-slate-900 dark:text-white ${
                size === "sm"
                  ? "text-base"
                  : size === "lg"
                  ? "text-2xl"
                  : "text-lg"
              }`}
            >
              AI<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">-FLOW</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              v2.4
            </span>
          </div>
          {size !== "sm" && (
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Autonomous Document OS
            </span>
          )}
        </div>
      )}
    </div>
  );
}
