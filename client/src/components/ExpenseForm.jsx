import { useState, useRef } from "react";
import API from "../services/api";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "food",          label: "Food & Dining",      icon: "🍽" },
  { value: "transport",     label: "Transport",           icon: "🚗" },
  { value: "subscriptions", label: "Subscriptions",       icon: "📦" },
  { value: "shopping",      label: "Shopping",            icon: "🛍" },
  { value: "utilities",     label: "Utilities",           icon: "⚡" },
  { value: "health",        label: "Health",              icon: "💊" },
  { value: "entertainment", label: "Entertainment",       icon: "🎬" },
  { value: "other",         label: "Other",               icon: "📎" },
];

const INITIAL = { amount: "", category: "", description: "", date: "" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function validate(form) {
  const errors = {};
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
    errors.amount = "Enter a valid amount";
  if (!form.category)
    errors.category = "Select a category";
  if (form.description && form.description.length > 120)
    errors.description = "Keep it under 120 characters";
  return errors;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExpenseForm({ onSuccess }) {
  const [form,    setForm]    = useState({ ...INITIAL, date: today() });
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState("idle"); // idle | loading | success | error
  const [touched, setTouched] = useState({});
  const amountRef = useRef(null);

  function today() {
    return new Date().toISOString().split("T")[0];
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value });
      setErrors((e) => ({ ...e, [field]: errs[field] }));
    }
  }

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors((e) => ({ ...e, [field]: errs[field] }));
  }

  async function handleSubmit() {
    const allTouched = { amount: true, category: true, description: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    try {
      await API.post("/expenses", {
        amount:      parseFloat(form.amount),
        category:    form.category,
        description: form.description.trim(),
        date:        form.date || today(),
      });
      setStatus("success");
      setForm({ ...INITIAL, date: today() });
      setTouched({});
      setErrors({});
      onSuccess?.();
      setTimeout(() => {
        setStatus("idle");
        amountRef.current?.focus();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const isLoading = status === "loading";

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.headerLabel}>New expense</p>
          <p style={s.headerSub}>Track where your money goes</p>
        </div>
        <div style={s.headerIcon}>₹</div>
      </div>

      {/* Amount */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Amount</label>
        <div style={{ position: "relative" }}>
          <span style={s.currencyPrefix}>₹</span>
          <input
            ref={amountRef}
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            onBlur={() => blur("amount")}
            style={{
              ...s.input,
              ...s.amountInput,
              ...(errors.amount ? s.inputError : {}),
            }}
            disabled={isLoading}
          />
        </div>
        {errors.amount && <p style={s.errorMsg}>{errors.amount}</p>}
      </div>

      {/* Category grid */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Category</label>
        <div style={s.catGrid}>
          {CATEGORIES.map((c) => {
            const active = form.category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => set("category", c.value)}
                style={{ ...s.catChip, ...(active ? s.catChipActive : {}) }}
                disabled={isLoading}
              >
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <span style={{ fontSize: 11, lineHeight: 1.2 }}>{c.label}</span>
              </button>
            );
          })}
        </div>
        {errors.category && <p style={s.errorMsg}>{errors.category}</p>}
      </div>

      {/* Description */}
      <div style={s.fieldGroup}>
        <label style={s.label}>
          Description
          <span style={s.optional}> — optional</span>
        </label>
        <textarea
          placeholder="What was this for?"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          onBlur={() => blur("description")}
          rows={2}
          style={{
            ...s.input,
            ...s.textarea,
            ...(errors.description ? s.inputError : {}),
          }}
          disabled={isLoading}
        />
        <div style={s.charRow}>
          {errors.description
            ? <p style={s.errorMsg}>{errors.description}</p>
            : <span />}
          <span style={{ ...s.charCount, ...(form.description.length > 100 ? s.charCountWarn : {}) }}>
            {form.description.length}/120
          </span>
        </div>
      </div>

      {/* Date */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Date</label>
        <input
          type="date"
          value={form.date}
          max={today()}
          onChange={(e) => set("date", e.target.value)}
          style={s.input}
          disabled={isLoading}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || status === "success"}
        style={{
          ...s.submitBtn,
          ...(status === "success" ? s.submitSuccess : {}),
          ...(status === "error"   ? s.submitErr    : {}),
        }}
      >
        {status === "loading" && <span style={s.spinner} />}
        {status === "success" && "✓  Expense added"}
        {status === "error"   && "Something went wrong — retry"}
        {(status === "idle")  && "Add expense"}
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  card: {
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    background: "var(--color-background-primary, #fff)",
    border: "0.5px solid var(--color-border-tertiary, #ddd)",
    borderRadius: 16,
    padding: "24px 24px 20px",
    maxWidth: 460,
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
    margin: "0 0 2px",
  },
  headerSub: {
    fontSize: 12,
    color: "var(--color-text-tertiary, #aaa)",
    margin: 0,
  },
  headerIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    background: "#FAEEDA",
    color: "#BA7517",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 500,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "var(--color-text-tertiary, #aaa)",
    marginBottom: 8,
  },
  optional: {
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: 400,
    fontSize: 11,
    color: "var(--color-text-tertiary, #bbb)",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "var(--color-text-primary, #111)",
    background: "var(--color-background-secondary, #f7f7f5)",
    border: "0.5px solid var(--color-border-tertiary, #ddd)",
    borderRadius: 8,
    outline: "none",
    transition: "border-color 0.15s",
  },
  inputError: {
    borderColor: "#E24B4A",
  },
  amountInput: {
    paddingLeft: 32,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 20,
    fontWeight: 500,
  },
  currencyPrefix: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    color: "var(--color-text-tertiary, #aaa)",
    pointerEvents: "none",
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  catChip: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: "10px 6px",
    borderRadius: 8,
    border: "0.5px solid var(--color-border-tertiary, #ddd)",
    background: "var(--color-background-secondary, #f7f7f5)",
    color: "var(--color-text-secondary, #555)",
    cursor: "pointer",
    transition: "all 0.12s",
  },
  catChipActive: {
    border: "1.5px solid #BA7517",
    background: "#FAEEDA",
    color: "#BA7517",
  },
  textarea: {
    resize: "none",
    lineHeight: 1.6,
  },
  charRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: "var(--color-text-tertiary, #bbb)",
    marginLeft: "auto",
  },
  charCountWarn: {
    color: "#E24B4A",
  },
  errorMsg: {
    fontSize: 11,
    color: "#E24B4A",
    margin: "4px 0 0",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    marginTop: 4,
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
    borderRadius: 8,
    border: "none",
    background: "#BA7517",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.15s, background 0.15s",
    letterSpacing: "0.03em",
  },
  submitSuccess: {
    background: "#3B6D11",
    cursor: "default",
  },
  submitErr: {
    background: "#A32D2D",
  },
  spinner: {
    width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
};
