import { useState, useCallback } from "react";
import Dashboard from "./pages/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import Chatbot from "./components/Chatbot";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatOpen,   setChatOpen]   = useState(false);

  const handleExpenseAdded = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div style={s.root}>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--color-background-tertiary, #f2f0ea); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── Top nav ── */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navBrand}>
            <div style={s.navLogo}>₹</div>
            <div>
              <p style={s.navTitle}>Expense Manager</p>
              <p style={s.navSub}>AI-powered insights</p>
            </div>
          </div>
          <button
            style={{ ...s.chatToggle, ...(chatOpen ? s.chatToggleActive : {}) }}
            onClick={() => setChatOpen((o) => !o)}
          >
            {chatOpen ? "✕  Close chat" : "💬  Ask AI"}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={s.main}>
        <div style={s.layout}>

          {/* Left column — form */}
          <aside style={s.sidebar}>
            <div style={s.stickyWrap}>
              <p style={s.colLabel}>Add expense</p>
              <ExpenseForm onSuccess={handleExpenseAdded} />
            </div>
          </aside>

          {/* Right column — dashboard */}
          <section style={s.content}>
            <p style={s.colLabel}>Overview</p>
            <Dashboard key={refreshKey} />
          </section>

        </div>
      </main>

      {/* ── Chatbot drawer ── */}
      {chatOpen && (
        <div style={s.chatDrawer}>
          <div style={s.chatHeader}>
            <span style={s.chatTitle}>AI Assistant</span>
            <button style={s.chatClose} onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div style={s.chatBody}>
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  root: {
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "var(--color-background-tertiary, #f2f0ea)",
  },

  // Nav
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "var(--color-background-primary, #fff)",
    borderBottom: "0.5px solid var(--color-border-tertiary, #ddd)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  navLogo: {
    width: 36, height: 36,
    borderRadius: 10,
    background: "#FAEEDA",
    color: "#BA7517",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 600,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
    lineHeight: 1.2,
  },
  navSub: {
    fontSize: 11,
    color: "var(--color-text-tertiary, #aaa)",
    letterSpacing: "0.05em",
  },
  chatToggle: {
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 500,
    padding: "7px 16px",
    borderRadius: 20,
    border: "0.5px solid var(--color-border-secondary, #ccc)",
    background: "transparent",
    color: "var(--color-text-secondary, #555)",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
  chatToggleActive: {
    background: "#FAEEDA",
    borderColor: "#BA7517",
    color: "#BA7517",
  },

  // Layout
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 24px 60px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "380px minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
  },
  sidebar: {},
  stickyWrap: {
    position: "sticky",
    top: 72,
  },
  content: {},
  colLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--color-text-tertiary, #aaa)",
    marginBottom: 12,
  },

  // Chat drawer
  chatDrawer: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 360,
    maxHeight: "70vh",
    background: "var(--color-background-primary, #fff)",
    border: "0.5px solid var(--color-border-tertiary, #ddd)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 200,
    animation: "slideUp 0.2s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "0.5px solid var(--color-border-tertiary, #ddd)",
  },
  chatTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
  },
  chatClose: {
    background: "none",
    border: "none",
    fontSize: 13,
    color: "var(--color-text-tertiary, #aaa)",
    cursor: "pointer",
  },
  chatBody: {
    flex: 1,
    overflowY: "auto",
  },
};
