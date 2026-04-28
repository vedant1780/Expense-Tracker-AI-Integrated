import { useEffect, useState, useRef } from "react";
import API from "../services/api";

// ─── Chart.js (loaded via CDN in index.html or imported via your bundler) ───
// Make sure Chart.js is available: npm install chart.js
import {
  Chart,
  BarController,
  DoughnutController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  DoughnutController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
// ─── Constants ───────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_COLORS = [
  "#EF9F27", "#378ADD", "#D4537E",
  "#1D9E75", "#7F77DD", "#888780",
];

const RISK_COLOR = { High: "#E24B4A", Medium: "#BA7517", Low: "#3B6D11" };
const RISK_BG    = { High: "#FCEBEB", Medium: "#FAEEDA", Low: "#EAF3DE" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const pct = (a, b) =>
  b === 0 ? "0" : (((a - b) / b) * 100).toFixed(1);

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, subType = "neutral", accentColor }) {
  return (
    <div style={styles.kpi}>
      <div style={{ ...styles.kpiAccent, background: accentColor }} />
      <p style={styles.kpiLabel}>{label}</p>
      <p style={styles.kpiValue}>{value}</p>
      <p style={{ ...styles.kpiSub, color: subType === "up" ? "#3B6D11" : subType === "down" ? "#A32D2D" : "var(--color-text-tertiary, #888)" }}>
        {sub}
      </p>
    </div>
  );
}

function SuggestionItem({ text }) {
  return (
    <div style={styles.sugItem}>
      <span style={styles.sugDot} />
      <span style={{ fontSize: 13, color: "var(--color-text-secondary, #555)", lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

function BarChartCanvas({ monthlyData }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !monthlyData) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Spent",
            data: monthlyData.spent,
            backgroundColor: "#EF9F2780",
            borderColor: "#EF9F27",
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: "Predicted",
            data: monthlyData.predicted,
            backgroundColor: "#378ADD40",
            borderColor: "#378ADD",
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw ?? 0) } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#888780", font: { size: 11 } } },
          y: {
            grid: { color: "rgba(136,135,128,0.15)" },
            ticks: {
              color: "#888780",
              font: { size: 11 },
              callback: (v) => "₹" + v / 1000 + "k",
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [monthlyData]);

  return (
    <div style={{ position: "relative", width: "100%", height: 200 }}>
      <canvas ref={canvasRef} aria-label="Monthly spend bar chart" role="img" />
    </div>
  );
}

function DonutChartCanvas({ categories }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !categories) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: categories.labels,
        datasets: [{
          data: categories.values,
          backgroundColor: categories.colors ?? CATEGORY_COLORS.slice(0, categories.labels.length),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        cutout: "68%",
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ctx.label + ": " + fmt(ctx.raw) } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [categories]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 180 }}>
      <canvas ref={canvasRef} width={160} height={160} aria-label="Category spend donut chart" role="img" />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeMonth,  setActiveMonth]  = useState(null);

  // Derive current month name for default chip
  const currentMonthName = MONTHS[new Date().getMonth()];

  useEffect(() => {
    setActiveMonth(currentMonthName);
  }, [currentMonthName]);

 useEffect(() => {
  setLoading(true);
  setError(null);

  const token = localStorage.getItem("token");

  API.get("/insights", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError("Failed to load insights. Please try again.");
      setLoading(false);
    });
}, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div style={styles.centerState}>
        <div style={styles.spinner} />
        <p style={styles.stateText}>Loading insights…</p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div style={styles.centerState}>
        <p style={{ ...styles.stateText, color: "#E24B4A" }}>{error}</p>
      </div>
    );
  }

  // ── Derived values ──
  const totalSpent   = data.analysis?.totalSpent ?? 0;
  const prediction   = data.prediction           ?? 0;
  const riskLevel    = data.insights?.riskLevel  ?? "—";
  const suggestions  = data.insights?.suggestions ?? [];

  // Optional fields — gracefully fallback if your API doesn't return them yet
  const budget       = data.budget       ?? null;
  const prevSpent    = data.prevMonthSpent ?? null;
  const daysLeft     = data.daysLeft     ?? null;
  const categoryData=data.analysis?.categoryBreakdown ?? [];
  const categories   = {
    labels: categoryData.map(i => i.category ?? "Unknown"),
    values: categoryData.map(i => i.totalSpent ?? 0),
    colors:categoryData.map(
      (_,i)=>CATEGORY_COLORS[i% CATEGORY_COLORS.length]
    )
  };
  const monthlyData  = data.monthly      ?? null;

  const spentDiff    = prevSpent != null ? pct(totalSpent, prevSpent) : null;
  const budgetLeft   = budget    != null ? budget - totalSpent        : null;

  // ── Chart legend ──
  const totalCatSpend = (categories?.values || []).reduce((a, b) => a + b, 0) ?? 1;
  const catColors     = categories?.colors ?? CATEGORY_COLORS;

  return (
    <div style={styles.dash}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={styles.brand}>Spend Intelligence</span>
        <div style={styles.chipRow}>
          {MONTHS.slice(0, new Date().getMonth() + 1).slice(-4).map((m) => (
            <button
              key={m}
              style={{ ...styles.chip, ...(activeMonth === m ? styles.chipActive : {}) }}
              onClick={() => setActiveMonth(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={styles.kpiRow}>
        <KpiCard
          label="Total Spent"
          value={fmt(totalSpent)}
          sub={spentDiff != null
            ? `${parseFloat(spentDiff) >= 0 ? "↑" : "↓"} ${Math.abs(spentDiff)}% vs last month`
            : "current period"}
          subType={spentDiff != null ? (parseFloat(spentDiff) >= 0 ? "down" : "up") : "neutral"}
          accentColor="#BA7517"
        />
        <KpiCard
          label="Prediction"
          value={fmt(prediction)}
          sub="end-of-month est."
          accentColor="#185FA5"
        />
        {budgetLeft != null ? (
          <KpiCard
            label="Budget Left"
            value={fmt(budgetLeft)}
            sub={daysLeft != null ? `${daysLeft} days remaining` : "remaining"}
            subType={budgetLeft < 10000 ? "down" : "up"}
            accentColor="#0F6E56"
          />
        ) : (
          <KpiCard
            label="vs Prediction"
            value={fmt(prediction - totalSpent)}
            sub={prediction > totalSpent ? "under forecast" : "over forecast"}
            subType={prediction > totalSpent ? "up" : "down"}
            accentColor="#0F6E56"
          />
        )}
        <KpiCard
          label="Risk Level"
          value={riskLevel}
          sub="current assessment"
          accentColor={RISK_COLOR[riskLevel] ?? "#888780"}
        />
      </div>

      {/* Charts row */}
      <div style={styles.mainGrid}>
        {/* Bar chart */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Monthly spend breakdown</p>
          {monthlyData ? (
            <BarChartCanvas monthlyData={monthlyData} />
          ) : (
            <div style={styles.chartPlaceholder}>
              <p style={{ color: "var(--color-text-tertiary, #aaa)", fontSize: 13 }}>
                No historical data available
              </p>
            </div>
          )}
          {/* Manual legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            {[{ color: "#EF9F27", label: "Spent" }, { color: "#378ADD", label: "Predicted" }].map((l) => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-secondary, #555)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div style={styles.panel}>
          <p style={styles.panelTitle}>Spend by category</p>
          {categories ? (
            <>
              <DonutChartCanvas categories={{ ...categories, colors: catColors }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                {categories.labels.map((l, i) => {
                  const p = ((categories.values[i] / totalCatSpend) * 100).toFixed(0);
                  return (
                    <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-secondary, #555)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: catColors[i] }} />
                      {l} {p}%
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={styles.chartPlaceholder}>
              <p style={{ color: "var(--color-text-tertiary, #aaa)", fontSize: 13 }}>
                No category data available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div style={{ ...styles.panel, marginBottom: 12 }}>
        <p style={styles.panelTitle}>AI insights &amp; suggestions</p>
        {suggestions.length > 0
          ? suggestions.map((s, i) => <SuggestionItem key={i} text={s} />)
          : <p style={{ fontSize: 13, color: "var(--color-text-tertiary, #aaa)" }}>No suggestions at this time.</p>
        }
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.predBlock}>
          <p style={styles.predLabel}>Projected month-end spend</p>
          <p style={styles.predValue}>{fmt(prediction)}</p>
        </div>
        <div style={styles.riskBadge(riskLevel)}>
          <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Risk</span>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{riskLevel}</span>
        </div>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  dash: {
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    padding: "1.5rem",
    maxWidth: 960,
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  brand: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.12em",
    color: "var(--color-text-tertiary, #aaa)",
    textTransform: "uppercase",
  },
  chipRow: { display: "flex", gap: 4 },
  chip: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    border: "0.5px solid var(--color-border-tertiary, #ccc)",
    color: "var(--color-text-secondary, #555)",
    cursor: "pointer",
    background: "transparent",
  },
  chipActive: {
    background: "#BA7517",
    borderColor: "#BA7517",
    color: "#fff",
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginBottom: "1.25rem",
  },
  kpi: {
    background: "var(--color-background-secondary, #f5f5f5)",
    borderRadius: 8,
    padding: "14px 16px",
    position: "relative",
    overflow: "hidden",
  },
  kpiAccent: {
    position: "absolute",
    top: 0, right: 0,
    width: 3, height: "100%",
  },
  kpiLabel: {
    fontSize: 11,
    letterSpacing: "0.07em",
    color: "var(--color-text-tertiary, #aaa)",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },
  kpiValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 20,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
    lineHeight: 1,
    margin: 0,
  },
  kpiSub: {
    fontSize: 11,
    marginTop: 5,
    margin: "5px 0 0",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
    gap: 12,
    marginBottom: 12,
  },
  panel: {
    background: "var(--color-background-secondary, #f5f5f5)",
    borderRadius: 12,
    padding: "16px 18px",
  },
  panelTitle: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-text-tertiary, #aaa)",
    margin: "0 0 14px",
  },
  chartPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
  },
  sugItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 0",
    borderTop: "0.5px solid var(--color-border-tertiary, #ddd)",
  },
  sugDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#BA7517",
    marginTop: 5,
    flexShrink: 0,
  },
  bottomBar: {
    display: "flex",
    alignItems: "stretch",
    gap: 10,
  },
  predBlock: {
    background: "var(--color-background-secondary, #f5f5f5)",
    borderRadius: 8,
    padding: "14px 18px",
    flex: 1,
  },
  predLabel: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-text-tertiary, #aaa)",
    margin: "0 0 4px",
  },
  predValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 26,
    fontWeight: 500,
    color: "var(--color-text-primary, #111)",
    margin: 0,
  },
  riskBadge: (level) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: "0 24px",
    borderRadius: 8,
    background: RISK_BG[level] ?? "#f5f5f5",
    color: RISK_COLOR[level] ?? "#555",
  }),
  centerState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    gap: 12,
  },
  spinner: {
    width: 28, height: 28,
    border: "2px solid #ddd",
    borderTop: "2px solid #BA7517",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  stateText: {
    fontSize: 14,
    color: "var(--color-text-secondary, #555)",
  },
};
