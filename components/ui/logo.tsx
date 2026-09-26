import React from "react";

export function Logo({
  className = "w-7 h-7",
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* SVG matching the mockup: 3 white circular nodes with connecting white flow paths on a blue-purple gradient rounded square */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <rect width="36" height="36" rx="9" fill="url(#logo-gradient)" />

          {/* Connected Flow Lines */}
          <path
            d="M18 11L12 24"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M18 11L24 24"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12 24H24"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Top Node */}
          <circle cx="18" cy="11" r="3.2" fill="white" />
          <circle cx="18" cy="11" r="1.5" fill="#4F46E5" />

          {/* Bottom Left Node */}
          <circle cx="12" cy="24" r="3" fill="white" />
          <circle cx="12" cy="24" r="1.4" fill="#2563EB" />

          {/* Bottom Right Node */}
          <circle cx="24" cy="24" r="3" fill="white" />
          <circle cx="24" cy="24" r="1.4" fill="#7C3AED" />

          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0"
              y1="0"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight text-slate-900 dark:text-white ${
            size === "sm"
              ? "text-base"
              : size === "lg"
              ? "text-2xl"
              : "text-lg"
          }`}
        >
          AI-FLOW
        </span>
      )}
    </div>
  );
}
