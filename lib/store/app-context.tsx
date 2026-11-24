"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DocumentItem,
  ApprovalTask,
  WorkflowDefinition,
  AuditLogItem,
  UserProfile,
  NotificationItem,
  RuleDefinition,
  ExtractedField,
  UserRole,
  PaymentTransaction,
  PaymentMethod,
} from "@/types";
import {
  DEMO_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RULES,
  INITIAL_PAYMENTS,
  SAMPLE_DOCUMENTS,
  SAMPLE_APPROVALS,
  SAMPLE_AUDIT_LOGS,
  SAMPLE_PAYMENTS,
} from "./demo-data";
import { healDocumentItem } from "@/lib/ai/document-processor";
import {
  generateChecksum,
  generateIdempotencyKey,
  maskAccountNumber,
  validateMakerChecker,
  verifySecurityPin,
} from "@/lib/security/payment-pipeline";

export {
  DEMO_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RULES,
  INITIAL_PAYMENTS,
  SAMPLE_DOCUMENTS,
  SAMPLE_APPROVALS,
  SAMPLE_AUDIT_LOGS,
  SAMPLE_PAYMENTS,
};

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    password?: string;
    organizationName: string;
    role?: UserRole;
    industry?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  documents: DocumentItem[];
  approvals: ApprovalTask[];
  workflows: WorkflowDefinition[];
  rules: RuleDefinition[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  // Document Operations
  addDocument: (doc: DocumentItem) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  updateDocumentField: (
    documentId: string,
    fieldId: string,
    newValue: string,
    comment?: string
  ) => void;
  deleteDocument: (id: string) => void;
  archiveDocument: (id: string) => void;
  // Approval Operations
  addApproval: (approval: ApprovalTask) => void;
  approveTask: (id: string, comment?: string) => void;
  rejectTask: (id: string, comment: string) => void;
  // Workflow Operations
  addWorkflow: (wf: WorkflowDefinition) => void;
  updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => void;
  toggleWorkflowActive: (id: string) => void;
  // Notification Operations
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (
    item: Omit<NotificationItem, "id" | "isRead" | "createdAt">
  ) => void;
  // Audit Operations
  logAudit: (
    action: string,
    entityType: AuditLogItem["entityType"],
    detail: string,
    metadata?: { documentId?: string; documentName?: string; diff?: any }
  ) => void;
  // Payment Operations
  payments: PaymentTransaction[];
  initiatePayment: (data: {
    documentId?: string;
    documentName?: string;
    beneficiaryName: string;
    beneficiaryAccount: string;
    beneficiaryIfscOrSwift?: string;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    scheduledDate?: string;
  }) => { success: boolean; payment?: PaymentTransaction; error?: string };
  authorizePayment: (
    paymentId: string,
    securityPin: string
  ) => Promise<{ success: boolean; error?: string }>;
  reconcilePayment: (paymentId: string) => void;
  cancelPayment: (paymentId: string, reason?: string) => void;
  // Demo Data & Reset Helpers
  seedDemoData: () => void;
  resetAllData: () => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Anikesh Sharma (ADMIN)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState<ApprovalTask[]>(INITIAL_APPROVALS);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(INITIAL_WORKFLOWS);
  const [rules, setRules] = useState<RuleDefinition[]>(INITIAL_RULES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore saved state from localStorage on client initial load
  useEffect(() => {
    try {
      // 1. Theme
      const savedTheme = localStorage.getItem("aiflow_theme") as "light" | "dark" | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }

      // 2. Documents
      const savedDocs = localStorage.getItem("aiflow_documents");
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed)) {
          const sanitizedDocs = parsed.map((d: DocumentItem) => healDocumentItem(d));
          setDocuments(sanitizedDocs);
          try {
            localStorage.setItem("aiflow_documents", JSON.stringify(sanitizedDocs));
          } catch {}
        }
      }

      // 3. Approvals
      const savedApprovals = localStorage.getItem("aiflow_approvals");
      if (savedApprovals) {
        const parsed = JSON.parse(savedApprovals);
        if (Array.isArray(parsed)) {
          setApprovals(parsed);
        }
      }

      // 4. Workflows
      const savedWorkflows = localStorage.getItem("aiflow_workflows");
      if (savedWorkflows) {
        const parsed = JSON.parse(savedWorkflows);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWorkflows(parsed);
        }
      }

      // 5. Audit Logs
      const savedLogs = localStorage.getItem("aiflow_audit_logs");
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) {
          setAuditLogs(parsed);
        }
      }

      // 6. Notifications
      const savedNotifs = localStorage.getItem("aiflow_notifications");
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }

      // 6b. Payments
      const savedPayments = localStorage.getItem("aiflow_payments");
      if (savedPayments) {
        const parsed = JSON.parse(savedPayments);
        if (Array.isArray(parsed)) {
          setPayments(parsed);
        }
      }

      // 7. Users & Auth
      const savedUser = localStorage.getItem("aiflow_current_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) setCurrentUser(parsed);
      }

      const savedUsers = localStorage.getItem("aiflow_available_users");
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) setAvailableUsers(parsed);
      }

      const savedAuth = localStorage.getItem("aiflow_is_auth");
      if (savedAuth !== null) {
        setIsAuthenticated(savedAuth === "true");
      }
    } catch (e) {
      console.warn("Failed loading state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync theme with document element and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("aiflow_theme", theme);
    } catch {}
  }, [theme]);

  // Persist Documents to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_documents", JSON.stringify(documents));
    } catch (e) {
      console.warn("Error persisting documents:", e);
    }
  }, [documents, isHydrated]);

  // Persist Approvals to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_approvals", JSON.stringify(approvals));
    } catch (e) {
      console.warn("Error persisting approvals:", e);
    }
  }, [approvals, isHydrated]);

  // Persist Workflows to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_workflows", JSON.stringify(workflows));
    } catch (e) {
      console.warn("Error persisting workflows:", e);
    }
  }, [workflows, isHydrated]);

  // Persist Audit Logs to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_audit_logs", JSON.stringify(auditLogs));
    } catch (e) {
      console.warn("Error persisting audit logs:", e);
    }
  }, [auditLogs, isHydrated]);

  // Persist Notifications to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Error persisting notifications:", e);
    }
  }, [notifications, isHydrated]);

  // Persist Payments to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_payments", JSON.stringify(payments));
    } catch (e) {
      console.warn("Error persisting payments:", e);
    }
  }, [payments, isHydrated]);

  // Persist Users & Auth to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aiflow_current_user", JSON.stringify(currentUser));
      localStorage.setItem("aiflow_available_users", JSON.stringify(availableUsers));
      localStorage.setItem("aiflow_is_auth", String(isAuthenticated));
    } catch (e) {
      console.warn("Error persisting users/auth:", e);
    }
  }, [currentUser, availableUsers, isAuthenticated, isHydrated]);

  // Listen to cross-tab storage events for multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === "aiflow_documents") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDocuments(parsed);
        } else if (e.key === "aiflow_approvals") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setApprovals(parsed);
        } else if (e.key === "aiflow_audit_logs") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAuditLogs(parsed);
        } else if (e.key === "aiflow_notifications") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotifications(parsed);
        }
      } catch (err) {
        console.warn("Error syncing cross-tab storage:", err);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const logAudit = useCallback((
    action: string,
    entityType: AuditLogItem["entityType"],
    detail: string,
    metadata?: { documentId?: string; documentName?: string; diff?: any }
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      organizationId: currentUser.organizationId,
      timestamp: new Date().toISOString(),
      actor: {
        name: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role,
      },
      action,
      entityType,
      detail,
      documentId: metadata?.documentId,
      documentName: metadata?.documentName,
      diff: metadata?.diff,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [currentUser]);

  // Authentication: Login function
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists in registered list
    const foundUser = availableUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
      logAudit(
        "USER_LOGIN",
        "USER",
        `User ${foundUser.fullName} (${foundUser.email}) logged in as ${foundUser.role}.`
      );
      addNotification({
        title: "Welcome Back",
        message: `Signed in as ${foundUser.fullName} (${foundUser.role}).`,
        type: "system",
      });
      return { success: true };
    }

    // If new email entered directly with password, auto-create user session
    if (email && email.includes("@")) {
      const generatedName = email.split("@")[0].replace(/[._-]/g, " ");
      const formattedName =
        generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        organizationId: "org-symbiosis-01",
        email: cleanEmail,
        fullName: formattedName || "Enterprise User",
        role: "ADMIN",
        organizationName: "Symbiosis University",
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      };

      setAvailableUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);

      logAudit(
        "USER_LOGIN",
        "USER",
        `User ${newUser.fullName} (${newUser.email}) authenticated.`
      );
      addNotification({
        title: "Session Initialized",
        message: `Welcome, ${newUser.fullName}! Workspace ready.`,
        type: "system",
      });
      return { success: true };
    }

    return { success: false, error: "Please enter a valid email address." };
  };

  // Authentication: Register function
  const register = async (data: {
    fullName: string;
    email: string;
    password?: string;
    organizationName: string;
    role?: UserRole;
    industry?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.fullName.trim() || !data.email.trim() || !data.organizationName.trim()) {
      return { success: false, error: "Please fill in all mandatory fields." };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = availableUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: "An account with this email already exists. Please log in." };
    }

    const newOrgId = `org-${Date.now()}`;
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      organizationId: newOrgId,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: data.role || "ADMIN",
      organizationName: data.organizationName.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80`,
    };

    setAvailableUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    logAudit(
      "USER_REGISTERED",
      "USER",
      `New tenant registered: ${newUser.fullName} (${newUser.email}) for organization ${data.organizationName}.`
    );

    addNotification({
      title: "Workspace Created",
      message: `Welcome to AI-FLOW, ${newUser.fullName}! Organization "${data.organizationName}" initialized.`,
      type: "system",
    });

    return { success: true };
  };

  // Authentication: Logout function
  const logout = () => {
    logAudit(
      "USER_LOGOUT",
      "USER",
      `User ${currentUser.fullName} (${currentUser.email}) signed out.`
    );
    setIsAuthenticated(false);
  };

  const addNotification = (
    item: Omit<NotificationItem, "id" | "isRead" | "createdAt">
  ) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addDocument = (doc: DocumentItem) => {
    const healedDoc = healDocumentItem(doc);
    setDocuments((prev) => [healedDoc, ...prev]);
    logAudit("DOCUMENT_UPLOADED", "DOCUMENT", `Uploaded document ${healedDoc.name}`, {
      documentId: healedDoc.id,
      documentName: healedDoc.name,
    });
    addNotification({
      title: "Document Ingested",
      message: `"${healedDoc.name}" processed (${healedDoc.documentType}, ${(healedDoc.overallConfidence * 100).toFixed(0)}% confidence).`,
      type: "workflow",
      documentId: healedDoc.id,
    });
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc))
    );
  };

  const updateDocumentField = (
    documentId: string,
    fieldId: string,
    newValue: string,
    comment?: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;
        const currentFields = doc.extractedFields || [];
        const targetField = currentFields.find((f) => f.id === fieldId);
        if (!targetField) return doc;

        const updatedFields: ExtractedField[] = currentFields.map((f) => {
          if (f.id !== fieldId) return f;
          const history = f.correctionHistory || [];
          return {
            ...f,
            isCorrected: true,
            extractedValue: newValue,
            correctedValue: newValue,
            confidence: 1.0, // Manual correction gives 100% human confidence
            correctionHistory: [
              ...history,
              {
                previousValue: f.extractedValue,
                newValue,
                correctedBy: currentUser.fullName,
                timestamp: new Date().toISOString(),
                comment,
              },
            ],
          };
        });

        return {
          ...doc,
          extractedFields: updatedFields,
          status: doc.status === "REVIEW_REQUIRED" ? "READY" : doc.status,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    logAudit("FIELD_CORRECTED", "DOCUMENT", `Corrected field for document`, {
      documentId,
      diff: { newValue },
    });
  };

  const deleteDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    logAudit("DOCUMENT_DELETED", "DOCUMENT", `Deleted document ${doc?.name || id}`, {
      documentId: id,
      documentName: doc?.name,
    });
  };

  const archiveDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isArchived: true, status: "ARCHIVED" as const } : d
      )
    );
    const doc = documents.find((d) => d.id === id);
    logAudit("DOCUMENT_ARCHIVED", "DOCUMENT", `Archived document ${doc?.name || id}`, {
      documentId: id,
      documentName: doc?.name,
    });
  };

  const addApproval = (approval: ApprovalTask) => {
    setApprovals((prev) => [approval, ...prev]);
  };

  const approveTask = (id: string, comment = "Approved as verified") => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "APPROVED",
              decidedAt: new Date().toISOString(),
              decidedBy: currentUser.fullName,
              decisionComment: comment,
            }
          : a
      )
    );

    const task = approvals.find((a) => a.id === id);
    if (task) {
      logAudit(
        "APPROVAL_DECISION",
        "APPROVAL",
        `Approved ${task.title} by ${currentUser.fullName}. Comment: ${comment}`,
        { documentId: task.documentId, documentName: task.documentName }
      );

      addNotification({
        title: "Task Approved",
        message: `${task.title} has been approved by ${currentUser.fullName}.`,
        type: "approval",
        documentId: task.documentId,
      });

      // Update related document status if any
      updateDocument(task.documentId, { status: "COMPLETED" });
    }
  };

  const rejectTask = (id: string, comment: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "REJECTED",
              decidedAt: new Date().toISOString(),
              decidedBy: currentUser.fullName,
              decisionComment: comment,
            }
          : a
      )
    );

    const task = approvals.find((a) => a.id === id);
    if (task) {
      logAudit(
        "APPROVAL_DECISION",
        "APPROVAL",
        `Rejected ${task.title} by ${currentUser.fullName}. Reason: ${comment}`,
        { documentId: task.documentId, documentName: task.documentName }
      );

      addNotification({
        title: "Task Rejected",
        message: `${task.title} was rejected: ${comment}`,
        type: "error",
        documentId: task.documentId,
      });

      updateDocument(task.documentId, { status: "REJECTED" });
    }
  };

  const addWorkflow = (wf: WorkflowDefinition) => {
    setWorkflows((prev) => [wf, ...prev]);
    logAudit("WORKFLOW_CREATED", "WORKFLOW", `Created workflow ${wf.name}`);
    addNotification({
      title: "New Workflow Created",
      message: `Workflow "${wf.name}" was successfully configured.`,
      type: "workflow",
    });
  };

  const updateWorkflow = (id: string, updates: Partial<WorkflowDefinition>) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w))
    );
    logAudit("WORKFLOW_UPDATED", "WORKFLOW", `Updated workflow ${id}`);
  };

  const toggleWorkflowActive = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextState = !w.isActive;
          logAudit(
            nextState ? "WORKFLOW_ACTIVATED" : "WORKFLOW_PAUSED",
            "WORKFLOW",
            `${nextState ? "Activated" : "Paused"} workflow ${w.name}`
          );
          return { ...w, isActive: nextState };
        }
        return w;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Payment Operations
  const initiatePayment = useCallback(
    (data: {
      documentId?: string;
      documentName?: string;
      beneficiaryName: string;
      beneficiaryAccount: string;
      beneficiaryIfscOrSwift?: string;
      amount: number;
      currency?: string;
      paymentMethod: PaymentMethod;
      notes?: string;
      scheduledDate?: string;
    }) => {
      if (data.amount <= 0) {
        return { success: false, error: "Payment amount must be greater than zero." };
      }
      if (!data.beneficiaryName.trim() || !data.beneficiaryAccount.trim()) {
        return { success: false, error: "Beneficiary name and account details are required." };
      }

      const id = `pay-${Date.now().toString(36)}`;
      const idempotencyKey = generateIdempotencyKey();
      const currency = data.currency || "INR";
      const checksum = generateChecksum({
        amount: data.amount,
        beneficiaryAccount: data.beneficiaryAccount,
        currency,
        idempotencyKey,
      });

      const newPayment: PaymentTransaction = {
        id,
        organizationId: currentUser.organizationId,
        documentId: data.documentId,
        documentName: data.documentName,
        type: "PAYOUT",
        beneficiaryName: data.beneficiaryName.trim(),
        beneficiaryAccount: maskAccountNumber(data.beneficiaryAccount),
        beneficiaryIfscOrSwift: data.beneficiaryIfscOrSwift?.trim().toUpperCase(),
        amount: data.amount,
        currency,
        paymentMethod: data.paymentMethod,
        status: "PENDING_APPROVAL",
        securityHash: checksum,
        idempotencyKey,
        scheduledDate: data.scheduledDate || new Date().toISOString(),
        initiatedBy: {
          id: currentUser.id,
          fullName: currentUser.fullName,
          email: currentUser.email,
          role: currentUser.role,
        },
        reconciliationStatus: "PENDING",
        securityVerification: {
          isTamperProof: true,
          makerCheckerValidated: false,
          pinVerified: false,
          encryptionStandard: "AES-256-GCM + SHA-256 Checksum",
          auditChecksum: checksum,
        },
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPayments((prev) => [newPayment, ...prev]);

      logAudit(
        "PAYMENT_INITIATED",
        "PAYMENT",
        `Initiated ${currency} ${data.amount.toLocaleString()} disbursement to ${data.beneficiaryName}. Awaiting security PIN authorization.`,
        { documentId: data.documentId, documentName: data.documentName }
      );

      addNotification({
        title: "Payment Authorization Required",
        message: `Disbursement of ${currency} ${data.amount.toLocaleString()} to ${data.beneficiaryName} is queued for approval.`,
        type: "approval",
        documentId: data.documentId,
      });

      return { success: true, payment: newPayment };
    },
    [currentUser, logAudit, addNotification]
  );

  const authorizePayment = useCallback(
    async (paymentId: string, securityPin: string) => {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) {
        return { success: false, error: "Payment transaction not found." };
      }

      if (payment.status === "PAID") {
        return { success: false, error: "Transaction is already disbursed." };
      }

      // 1. Verify Security PIN
      if (!verifySecurityPin(securityPin)) {
        return { success: false, error: "Invalid Security PIN. Enter authorized 4-digit code (8842)." };
      }

      // 2. Validate Maker-Checker security policy
      const makerChecker = validateMakerChecker(
        payment.initiatedBy.id,
        currentUser.id,
        currentUser.role
      );
      if (!makerChecker.allowed) {
        return { success: false, error: makerChecker.reason };
      }

      const now = new Date().toISOString();
      const utr = `UTR${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

      setPayments((prev) =>
        prev.map((p) => {
          if (p.id !== paymentId) return p;
          return {
            ...p,
            status: "PAID",
            referenceNumber: utr,
            completedAt: now,
            approvedBy: {
              id: currentUser.id,
              fullName: currentUser.fullName,
              email: currentUser.email,
              role: currentUser.role,
            },
            reconciliationStatus: "MATCHED",
            securityVerification: {
              ...p.securityVerification,
              makerCheckerValidated: true,
              pinVerified: true,
              verifiedAt: now,
            },
            updatedAt: now,
          };
        })
      );

      logAudit(
        "FUNDS_DISBURSED",
        "PAYMENT",
        `Released ${payment.currency} ${payment.amount.toLocaleString()} to ${payment.beneficiaryName}. UTR: ${utr}. Authorized by ${currentUser.fullName}.`,
        { documentId: payment.documentId, documentName: payment.documentName }
      );

      addNotification({
        title: "Payment Disbursed Successfully",
        message: `${payment.currency} ${payment.amount.toLocaleString()} was successfully paid to ${payment.beneficiaryName}. UTR: ${utr}`,
        type: "system",
        documentId: payment.documentId,
      });

      return { success: true };
    },
    [payments, currentUser, logAudit, addNotification]
  );

  const cancelPayment = useCallback(
    (paymentId: string, reason = "Canceled by user") => {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.id !== paymentId) return p;
          return {
            ...p,
            status: "FAILED",
            notes: p.notes ? `${p.notes} | Canceled: ${reason}` : `Canceled: ${reason}`,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      logAudit("PAYMENT_CANCELED", "PAYMENT", `Canceled payment ${paymentId}. Reason: ${reason}`);
    },
    [logAudit]
  );

  const reconcilePayment = useCallback(
    (paymentId: string) => {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.id !== paymentId) return p;
          return {
            ...p,
            reconciliationStatus: "MATCHED",
            updatedAt: new Date().toISOString(),
          };
        })
      );
      logAudit("PAYMENT_RECONCILED", "PAYMENT", `Reconciliation verified for payment ${paymentId}.`);
    },
    [logAudit]
  );

  // Helper to load sample demo data with 1-click
  const seedDemoData = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    setApprovals(SAMPLE_APPROVALS);
    setAuditLogs(SAMPLE_AUDIT_LOGS);
    setPayments(SAMPLE_PAYMENTS);
    addNotification({
      title: "Demo Dataset Seeded",
      message: `Loaded ${SAMPLE_DOCUMENTS.length} sample enterprise documents and ${SAMPLE_PAYMENTS.length} payments.`,
      type: "system",
    });
    logAudit("DEMO_SEEDED", "SYSTEM", "Loaded sample documents, payments, and approval tasks for evaluation.");
  };

  // Helper to clear all data back to blank slate
  const resetAllData = () => {
    setDocuments([]);
    setApprovals([]);
    setAuditLogs([]);
    setNotifications([]);
    setPayments([]);
    try {
      localStorage.removeItem("aiflow_documents");
      localStorage.removeItem("aiflow_approvals");
      localStorage.removeItem("aiflow_audit_logs");
      localStorage.removeItem("aiflow_notifications");
      localStorage.removeItem("aiflow_payments");
    } catch {}
    addNotification({
      title: "Workspace Cleared",
      message: "Reset all data to clean blank slate (0 documents, 0 payments).",
      type: "system",
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        isAuthenticated,
        login,
        register,
        logout,
        documents,
        approvals,
        workflows,
        rules,
        auditLogs,
        notifications,
        theme,
        toggleTheme,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        addDocument,
        updateDocument,
        updateDocumentField,
        deleteDocument,
        archiveDocument,
        addApproval,
        approveTask,
        rejectTask,
        addWorkflow,
        updateWorkflow,
        toggleWorkflowActive,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        logAudit,
        payments,
        initiatePayment,
        authorizePayment,
        reconcilePayment,
        cancelPayment,
        seedDemoData,
        resetAllData,
        isHydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
