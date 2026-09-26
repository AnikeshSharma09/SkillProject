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
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Subtle AI gradient glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 blur-[6px]" />
        
        {/* SVG representing 3 connected nodes forming a stylized 'A' & flow */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-sm"
        >
          <rect width="36" height="36" rx="9" fill="url(#logo-bg)" />
          
          {/* Interconnecting flow lines */}
          <path
            d="M18 10L11 25"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1 3"
            opacity="0.6"
          />
          <path
            d="M18 10L25 25"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1 3"
            opacity="0.6"
          />
          <path
            d="M13 21H23"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Node 1: Top Core */}
          <circle cx="18" cy="10" r="3.5" fill="#FFFFFF" />
          <circle cx="18" cy="10" r="1.8" fill="#7C3AED" />

          {/* Node 2: Bottom Left */}
          <circle cx="11" cy="25" r="3" fill="#FFFFFF" />
          <circle cx="11" cy="25" r="1.5" fill="#2563EB" />

          {/* Node 3: Bottom Right */}
          <circle cx="25" cy="25" r="3" fill="#FFFFFF" />
          <circle cx="25" cy="25" r="1.5" fill="#2563EB" />

          <defs>
            <linearGradient
              id="logo-bg"
              x1="0"
              y1="0"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-slate-900 dark:text-slate-100 ${
                size === "sm"
                  ? "text-base"
                  : size === "lg"
                  ? "text-2xl"
                  : "text-lg"
              }`}
            >
              AI-FLOW
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              SaaS
            </span>
          </div>
          {size !== "sm" && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Intelligent Workflow Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
