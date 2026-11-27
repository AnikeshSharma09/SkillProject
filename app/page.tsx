"use client";

import React, { Suspense } from "react";
import { AuthView } from "@/components/auth/auth-view";

export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] dark:bg-[#080B11]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-medium">
              Loading AI-FLOW Authentication Portal...
            </span>
          </div>
        </div>
      }
    >
      <AuthView initialMode="login" />
    </Suspense>
  );
}
