"use client";

import React, { useState } from "react";
import {
  Mail,
  Webhook,
  MessageSquare,
  FolderSync,
  Phone,
  Database,
  CheckCircle2,
  Plug,
  ExternalLink,
  Settings,
  Send,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { INITIAL_INTEGRATIONS } from "@/lib/store/demo-data";
import { IntegrationCard } from "@/types";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationCard[]>(INITIAL_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationCard | null>(null);
  const [modalMode, setModalMode] = useState<"configure" | "test" | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case "Mail":
        return Mail;
      case "Webhook":
        return Webhook;
      case "MessageSquare":
        return MessageSquare;
      case "FolderSync":
        return FolderSync;
      default:
        return Plug;
    }
  };

  const handleToggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "connected" ? "disconnected" : "connected";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 800));

    if (selectedIntegration?.id === "int-email") {
      setTestResult("250 OK: SMTP handshake succeeded. Test email dispatched to mailtrap inbox.");
    } else if (selectedIntegration?.id === "int-rest") {
      setTestResult("HTTP 200 OK: Payload accepted by endpoint. Response latency: 114ms.");
    } else {
      setTestResult("Connection handshake verified successfully.");
    }
    setIsTesting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Enterprise Integrations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Connect your ERP, communication channels, cloud storage, and webhooks
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {integrations.map((item) => {
          const Icon = getIcon(item.icon);
          const isConnected = item.status === "connected";

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isConnected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isConnected && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {isConnected && item.lastSyncedAt && (
                  <div className="mt-3 text-[11px] text-slate-400">
                    Last active: {new Date(item.lastSyncedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Action Buttons: Connect, Configure, Test, Disconnect */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleConnection(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isConnected
                      ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  }`}
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedIntegration(item);
                      setModalMode("configure");
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Configure
                  </button>

                  <button
                    onClick={() => {
                      setSelectedIntegration(item);
                      setModalMode("test");
                      handleRunTest();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Configuration or Test */}
      {selectedIntegration && modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => {
              setSelectedIntegration(null);
              setModalMode(null);
            }}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {modalMode === "test" ? (
                  <Send className="w-4 h-4 text-blue-600" />
                ) : (
                  <Settings className="w-4 h-4 text-slate-600" />
                )}
                <span>
                  {modalMode === "test" ? "Test Connection" : "Configure Integration"}:{" "}
                  {selectedIntegration.name}
                </span>
              </h3>
              <button
                onClick={() => {
                  setSelectedIntegration(null);
                  setModalMode(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalMode === "configure" ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    API Endpoint / Host
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedIntegration.config.endpoint || selectedIntegration.config.host || ""}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Authorization Header / Secret Key
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedIntegration(null);
                      setModalMode(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isTesting ? (
                  <div className="p-6 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                    <p className="text-xs font-medium text-slate-600">
                      Sending test payload to destination service...
                    </p>
                  </div>
                ) : testResult ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1 inline mr-1" />
                    {testResult}
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedIntegration(null);
                      setModalMode(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
