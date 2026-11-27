"use client";

import React from "react";
import { AuthView } from "@/components/auth/auth-view";

export default function RootPage() {
  return <AuthView initialMode="login" />;
}
