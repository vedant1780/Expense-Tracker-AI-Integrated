import { useState, useRef, useEffect } from "react";
import API from "../services/api";

const SUGGESTIONS = [
  "Where am I overspending?",
  "How do I reduce food costs?",
  "Predict my month-end spend",
  "Show my top expense category",
];

export default function Chatbot() {
  const [message,  setMessage]  = useState("");
  const [chat,     setChat]     = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  async function send(text) {
    const msg = (text ?? message).trim();
    if (!msg || loading) return;

    setChat((c) => [...c, { role: "user", text: msg }]);
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      const res = await API.post("/chat", { message: msg });
      setChat((c) => [...c, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the assistant. Try again.");
      setChat((c) => c.slice(0, -1)); // remove optimistic user msg
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const isEmpty = chat.length === 0;

  return (
    <div style={s.root}>

      {/* Messages */}
      <div style={s.messages}>

        {isEmpty && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>💬</div>
            <p style={s.emptyTitle}>Ask about your spending</p>
            <p style={s.emptySub}>I can analyse trends, flag risks, and suggest savings.</p>
            <div style={s.suggestions}>
              {SUGGESTIONS.map((q) => (
                <button key={q} style={s.sugChip} onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...s.msgRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "bot" && <div style={s.avatar}>AI</div>}
            <div
              style={{
                ...s.bubble,
                ...(msg.role === "user" ? s.bubbleUser : s.bubbleBot),
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
            <div style={s.avatar}>AI</div>
            <div style={{ ...s.bubble, ...s.bubbleBot, ...s.typingBubble }}>
              <span style={s.dot} />
              <span style={{ ...s.dot, animationDelay: "0.18s" }} />
              <span style={{ ...s.dot, animationDelay: "0.36s" }} />
            </div>
          </div>
        )}

        {error && (
          <p style={s.errorMsg}>{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={s.inputBar}>
        <textarea
          ref={inputRef}
          rows={1}
          placeholder="Ask about your expenses…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          style={s.input}
        />
        <button
          onClick={() => send()}
          disabled={!message.trim() || loading}
          style={{
            ...s.sendBtn,
            ...(!message.trim() || loading ? s.sendBtnDisabled : {}),
          }}
        >
          ↑
        </button>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 14px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  // Empty state
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "24px 12px 8px",
    gap: 6,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
  },
  emptySub: {
    fontSize: 12,
    color: "var(--color-text-tertiary, #aaa)",
    lineHeight: 1.5,
    maxWidth: 220,
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  sugChip: {
    fontFamily: "inherit",
    fontSize: 11,
    padding: "5px 11px",
    borderRadius: 20,
    border: "0.5px solid var(--color-border-secondary, #ccc)",
    background: "var(--color-background-secondary, #f5f5f5)",
    color: "var(--color-text-secondary, #555)",
    cursor: "pointer",
    lineHeight: 1.4,
    textAlign: "left",
  },

  // Messages
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 7,
  },
  avatar: {
    width: 26, height: 26,
    borderRadius: "50%",
    background: "#FAEEDA",
    color: "#BA7517",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.05em",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "78%",
    padding: "9px 13px",
    borderRadius: 14,
    fontSize: 13,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  bubbleUser: {
    background: "#BA7517",
    color: "#fff",
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    background: "var(--color-background-secondary, #f5f5f5)",
    color: "var(--color-text-primary, #111)",
    borderBottomLeftRadius: 4,
  },

  // Typing indicator
  typingBubble: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "12px 14px",
  },
  dot: {
    display: "inline-block",
    width: 6, height: 6,
    borderRadius: "50%",
    background: "var(--color-text-tertiary, #aaa)",
    animation: "bounce 0.9s infinite ease-in-out",
  },

  // Error
  errorMsg: {
    fontSize: 11,
    color: "#E24B4A",
    textAlign: "center",
    padding: "4px 0",
  },

  // Input bar
  inputBar: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    padding: "10px 14px 14px",
    borderTop: "0.5px solid var(--color-border-tertiary, #ddd)",
  },
  input: {
    flex: 1,
    fontFamily: "inherit",
    fontSize: 13,
    color: "var(--color-text-primary, #111)",
    background: "var(--color-background-secondary, #f5f5f5)",
    border: "0.5px solid var(--color-border-tertiary, #ddd)",
    borderRadius: 10,
    padding: "9px 12px",
    resize: "none",
    outline: "none",
    lineHeight: 1.5,
  },
  sendBtn: {
    width: 34, height: 34,
    borderRadius: "50%",
    border: "none",
    background: "#BA7517",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.15s",
  },
  sendBtnDisabled: {
    opacity: 0.35,
    cursor: "default",
  },
};
