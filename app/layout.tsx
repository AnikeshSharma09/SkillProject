import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store/app-context";
import { Shell } from "@/components/layout/shell";

export const metadata: Metadata = {
  title: "AI-FLOW | Intelligent Document & Workflow Automation Platform",
  description:
    "Smart Documents. Smart Workflows. Smarter Decisions. Enterprise-grade AI document parsing, OCR, confidence scoring, deterministic rule routing, and visual workflow orchestration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  window.__aiflow_pwd_visibility = window.__aiflow_pwd_visibility || {};

  function switchMode(newMode) {
    window.__aiflow_current_mode = newMode;
    var loginBox = document.getElementById('auth-login-box');
    var regBox = document.getElementById('auth-register-box');
    var footLog = document.getElementById('footer-login-msg');
    var footReg = document.getElementById('footer-register-msg');
    var btnLogin = document.getElementById('tab-signin-btn');
    var btnReg = document.getElementById('tab-register-btn');
    var badgeText = document.getElementById('auth-badge-text');
    var headingText = document.getElementById('auth-heading-text');
    var subText = document.getElementById('auth-sub-text');

    var activeTabClass = "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700";
    var inactiveTabClass = "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50";

    if (newMode === 'register') {
      if (loginBox) loginBox.style.display = 'none';
      if (regBox) regBox.style.display = 'block';
      if (footLog) footLog.style.display = 'none';
      if (footReg) footReg.style.display = 'block';
      if (btnLogin) btnLogin.className = inactiveTabClass;
      if (btnReg) btnReg.className = activeTabClass;
      if (badgeText) badgeText.textContent = 'New Enterprise Account Setup';
      if (headingText) headingText.textContent = 'Create your corporate account';
      if (subText) subText.textContent = 'Register a new user profile to access document ingestion, OCR parsing, and workflows.';
      try {
        var u = new URL(window.location.href);
        u.searchParams.set('mode', 'register');
        window.history.replaceState({}, '', u.toString());
      } catch (err) {}
    } else {
      if (loginBox) loginBox.style.display = 'block';
      if (regBox) regBox.style.display = 'none';
      if (footLog) footLog.style.display = 'block';
      if (footReg) footReg.style.display = 'none';
      if (btnLogin) btnLogin.className = activeTabClass;
      if (btnReg) btnReg.className = inactiveTabClass;
      if (badgeText) badgeText.textContent = 'Corporate Identity Verification';
      if (headingText) headingText.textContent = 'Welcome back to AI-FLOW';
      if (subText) subText.textContent = 'Enter your registered credentials below, or click an authorized company profile.';
      try {
        var u = new URL(window.location.href);
        u.searchParams.delete('mode');
        window.history.replaceState({}, '', u.toString());
      } catch (err) {}
    }
  }

  function togglePassword(inputId, btn) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    var nextType = (inp.type === 'password') ? 'text' : 'password';
    inp.type = nextType;
    window.__aiflow_pwd_visibility[inputId] = (nextType === 'text');

    if (!btn) {
      if (inputId === 'login-password') btn = document.getElementById('login-eye-toggle-btn');
      else if (inputId === 'reg-pass') btn = document.getElementById('reg-eye-toggle-btn');
      else if (inputId === 'reg-confirm-pass') btn = document.getElementById('reg-confirm-eye-toggle-btn');
    }

    if (btn) {
      var isSm = inputId !== 'login-password';
      var sz = isSm ? 'w-3.5 h-3.5' : 'w-4 h-4';
      if (nextType === 'text') {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + sz + ' shrink-0 text-blue-600 dark:text-blue-400"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
        btn.title = 'Hide password';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + sz + ' shrink-0 text-slate-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
        btn.title = 'Show password';
        btn.setAttribute('aria-label', 'Show password');
      }
    }
  }

  function openModal() {
    var m = document.getElementById('auth-credentials-modal');
    if (m) {
      m.style.display = 'flex';
    }
  }

  function closeModal() {
    var m = document.getElementById('auth-credentials-modal');
    if (m) {
      m.style.display = 'none';
    }
  }

  function autoFillLogin(email, pass) {
    var emailInp = document.getElementById('login-email');
    var passInp = document.getElementById('login-password');
    if (emailInp) emailInp.value = email;
    if (passInp) passInp.value = pass || 'Admin@2026#Secure';
    switchMode('login');
    closeModal();
  }

  function doPreHydrationLogin(overrideEmail, overridePass) {
    var emailInp = document.getElementById('login-email');
    var passInp = document.getElementById('login-password');
    var email = (overrideEmail || (emailInp ? emailInp.value.trim() : '') || 'anikesh.sharma@aiflow.company').trim();
    var pass = (overridePass || (passInp ? passInp.value.trim() : '') || 'Admin@2026#Secure').trim();

    var knownUsers = {
      'anikesh.sharma@aiflow.company': { id: 'usr-1', fullName: 'Anikesh Sharma', role: 'ADMIN', department: 'Corporate Strategy & Finance' },
      'rohit.verma@aiflow.company': { id: 'usr-2', fullName: 'Rohit Verma', role: 'APPROVER', department: 'Treasury & Finance' },
      'priya.patel@aiflow.company': { id: 'usr-3', fullName: 'Priya Patel', role: 'MANAGER', department: 'Global Operations' },
      'vikram.aditya@aiflow.company': { id: 'usr-4', fullName: 'Vikram Aditya', role: 'APPROVER', department: 'Legal & Regulatory Compliance' },
      'neha.gupta@aiflow.company': { id: 'usr-5', fullName: 'Neha Gupta', role: 'EMPLOYEE', department: 'Accounts Payable' }
    };

    var matched = knownUsers[email.toLowerCase()] || {
      id: 'usr-1',
      fullName: 'Anikesh Sharma',
      role: 'ADMIN',
      department: 'Corporate Strategy & Finance'
    };

    var userObj = {
      id: matched.id,
      fullName: matched.fullName,
      email: email,
      role: matched.role,
      organizationName: 'Symbiosis Enterprise',
      department: matched.department,
      password: pass,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    try {
      localStorage.setItem('aiflow_is_auth', 'true');
      localStorage.setItem('aiflow_current_user', JSON.stringify(userObj));
    } catch (e) {}

    window.location.href = '/dashboard';
  }

  // Pre-hydration instant capture dispatcher: intercepts user clicks at 0ms
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (!target) return;
    var btn = target.closest ? target.closest('button, a') : null;
    if (!btn) return;
    var id = btn.id || '';

    // Tab switcher always works at 0ms
    if (id === 'tab-register-btn' || id === 'footer-register-link') {
      e.preventDefault();
      e.stopPropagation();
      switchMode('register');
      return;
    }
    if (id === 'tab-signin-btn' || id === 'footer-login-link') {
      e.preventDefault();
      e.stopPropagation();
      switchMode('login');
      return;
    }

    // Password visibility toggle always works at 0ms
    if (id === 'login-eye-toggle-btn') {
      e.preventDefault();
      e.stopPropagation();
      togglePassword('login-password', btn);
      return;
    }
    if (id === 'reg-eye-toggle-btn') {
      e.preventDefault();
      e.stopPropagation();
      togglePassword('reg-pass', btn);
      return;
    }
    if (id === 'reg-confirm-eye-toggle-btn') {
      e.preventDefault();
      e.stopPropagation();
      togglePassword('reg-confirm-pass', btn);
      return;
    }

    // Modal open / close triggers
    if (btn.classList.contains('open-credentials-trigger')) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
      return;
    }
    if (btn.classList.contains('close-credentials-trigger')) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
      return;
    }

    // Copy trigger
    if (btn.hasAttribute('data-copy-text')) {
      e.preventDefault();
      e.stopPropagation();
      var cText = btn.getAttribute('data-copy-text');
      if (cText && navigator.clipboard) {
        navigator.clipboard.writeText(cText);
      }
      return;
    }

    // Pre-hydration fallback only (when React has not hydrated yet)
    var isHydrated = document.body && document.body.getAttribute('data-hydrated') === 'true';
    if (!isHydrated) {
      if (id === 'signin-submit-btn') {
        e.preventDefault();
        e.stopPropagation();
        doPreHydrationLogin();
        return;
      }
      if (btn.hasAttribute('data-quick-email')) {
        e.preventDefault();
        e.stopPropagation();
        var qEmail = btn.getAttribute('data-quick-email');
        var qPass = btn.getAttribute('data-quick-password');
        doPreHydrationLogin(qEmail, qPass);
        return;
      }
      if (btn.hasAttribute('data-modal-autofill-email')) {
        e.preventDefault();
        e.stopPropagation();
        var mEmail = btn.getAttribute('data-modal-autofill-email');
        var mPass = btn.getAttribute('data-modal-autofill-password');
        autoFillLogin(mEmail, mPass);
        return;
      }
      if (btn.hasAttribute('data-modal-signin-email')) {
        e.preventDefault();
        e.stopPropagation();
        var sEmail = btn.getAttribute('data-modal-signin-email');
        var sPass = btn.getAttribute('data-modal-signin-password');
        doPreHydrationLogin(sEmail, sPass);
        return;
      }
    }
  }, true);

  // Capture mousedown for buttons to eliminate any perceived click latency
  document.addEventListener('mousedown', function(e) {
    var target = e.target;
    if (!target) return;
    var btn = target.closest ? target.closest('button, a') : null;
    if (!btn) return;
    var id = btn.id || '';
    if (id === 'tab-register-btn' || id === 'footer-register-link') {
      e.preventDefault();
      switchMode('register');
    } else if (id === 'tab-signin-btn' || id === 'footer-login-link') {
      e.preventDefault();
      switchMode('login');
    } else if (id === 'login-eye-toggle-btn' || id === 'reg-eye-toggle-btn' || id === 'reg-confirm-eye-toggle-btn') {
      e.preventDefault();
    }
  }, true);

  window.__aiflow_switch = switchMode;
  window.__aiflow_toggle_pwd = togglePassword;
  window.__aiflow_open_modal = openModal;
  window.__aiflow_close_modal = closeModal;
})();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100" suppressHydrationWarning>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
