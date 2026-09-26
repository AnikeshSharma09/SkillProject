"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
} from "@/types";
import {
  DEMO_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RULES,
} from "./demo-data";
export {
  DEMO_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RULES,
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Sarah Chen (ADMIN)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState<ApprovalTask[]>(INITIAL_APPROVALS);
  const [workflows, setWorkflows] =
    useState<WorkflowDefinition[]>(INITIAL_WORKFLOWS);
  const [rules, setRules] = useState<RuleDefinition[]>(INITIAL_RULES);
  const [auditLogs, setAuditLogs] =
    useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Invoice Approval Required",
      message: "Invoice INV-1024 (ABC Technologies) exceeds ₹50,000 threshold.",
      type: "approval",
      isRead: false,
      documentId: "doc-inv-1024",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-2",
      title: "Human Review Flagged",
      message: "Leave Request 203 has low confidence (64.2%). Verification needed.",
      type: "review",
      isRead: false,
      documentId: "doc-leave-203",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-3",
      title: "Workflow Complete",
      message: "Receipt #701 processed and archived automatically.",
      type: "workflow",
      isRead: true,
      documentId: "doc-rec-701",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
  ]);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

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

  const logAudit = (
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
  };

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
        organizationId: "org-apex-01",
        email: cleanEmail,
        fullName: formattedName || "Enterprise User",
        role: "ADMIN",
        organizationName: "Apex Global Enterprises",
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
    setDocuments((prev) => [doc, ...prev]);
    logAudit("DOCUMENT_UPLOADED", "DOCUMENT", `Uploaded document ${doc.name}`, {
      documentId: doc.id,
      documentName: doc.name,
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
        approveTask,
        rejectTask,
        addWorkflow,
        updateWorkflow,
        toggleWorkflowActive,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        logAudit,
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
