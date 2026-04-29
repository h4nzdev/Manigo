import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Filter,
  ChevronDown,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  X,
} from "lucide-react";
import {
  kpiData,
  liquidityTrend,
  repaymentStatus,
  recentAlerts,
} from "../../data/mockData";
import { workflows } from "../../data/workflows";
import WorkflowSuggestion from "../../components/WorkflowSuggestion";

const riskColor = {
  high: "text-red-600 bg-red-50",
  medium: "text-amber-600 bg-amber-50",
  low: "text-green-700 bg-green-50",
};

// ─── Enhanced KPI Card with trend indicator ───
function KpiCard({ label, value, sub, accent, trend, footer }) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-600"
        : "";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
          {label}
        </p>
        {TrendIcon && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
          >
            <TrendIcon size={14} />
            {trend === "up" ? "+8%" : "-3%"}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold mt-1 ${accent || "text-slate-800"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      {footer && (
        <div className="mt-2 pt-2 border-t border-slate-50">{footer}</div>
      )}
    </div>
  );
}

// ─── Quick action chip ───
function QuickAction({ icon: Icon, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors"
    >
      <Icon size={16} />
      <span>{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-auto">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Progress bar for collection target ───
function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function fmt(n) {
  return "₱" + n.toLocaleString();
}

// ─── Smart contextual suggestion banner ───
function SmartBanner({ kpi }) {
  const [dismissed, setDismissed] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const suggestion = (() => {
    const riskRatio = (kpi.atRiskLoans / kpi.activeClients) * 100;
    if (riskRatio > 4) return { workflow: workflows.find(w => w.id === 'risk-flag-followup'), reason: `${kpi.atRiskLoans} loans flagged as at-risk` };
    if (kpi.overdueAmount > 30000) return { workflow: workflows.find(w => w.id === 'missed-payment'), reason: `₱${kpi.overdueAmount.toLocaleString()} in overdue payments` };
    return null;
  })();

  if (!suggestion || dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">Action needed</p>
          <p className="text-xs text-amber-700 mt-0.5">{suggestion.reason}</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600 shrink-0">
          <X size={15} />
        </button>
      </div>
      {!showWorkflow ? (
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowWorkflow(true)}
            className="text-xs font-semibold text-amber-800 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <ArrowRight size={12} /> Start: {suggestion.workflow.title}
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <WorkflowSuggestion
            workflow={suggestion.workflow}
            onDismiss={() => { setShowWorkflow(false); setDismissed(true); }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Alert item with expandable workflow ───
function AlertItem({ alert: a }) {
  const navigate = useNavigate();

  return (
    <li className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => a.clientId && navigate(`/clients/${a.clientId}`)}
        className="w-full flex items-start gap-3 p-2.5 transition-colors text-left hover:bg-slate-50 cursor-pointer"
      >
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase mt-0.5 shrink-0 ${riskColor[a.risk]}`}>
          {a.risk}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{a.client}</p>
          <p className="text-xs text-slate-500 truncate">{a.message}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={11} />{a.days}d
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            View Profile
          </span>
        </div>
      </button>
    </li>
  );
}

// ─── MAIN DASHBOARD ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Calculate derived metrics from mock data
  const collectionRate =
    Math.round(
      (kpiData.collectedToday /
        (kpiData.collectedToday + kpiData.overdueAmount)) *
        100,
    ) || 0;
  const riskRatio =
    Math.round((kpiData.atRiskLoans / kpiData.activeClients) * 100) || 0;

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Liquidity Dashboard
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Clock size={14} />
            Updated 5 min ago · Metro Manila Region
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={14} /> Filter <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* ── Quick Action Bar ── */}
      <div className="flex flex-wrap gap-2">
        <QuickAction
          icon={AlertTriangle}
          label="At-Risk Clients"
          badge={kpiData.atRiskLoans}
        />
        <QuickAction icon={DollarSign} label="Record Payment" />
        <QuickAction icon={Users} label="New Client" />
        <QuickAction icon={MoreHorizontal} label="More" />
      </div>

      {/* ── Smart suggestion banner ── */}
      <SmartBanner kpi={kpiData} />

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Disbursed"
          value={fmt(kpiData.totalDisbursed)}
          sub="All active loans"
          trend="up"
        />
        <KpiCard
          label="Outstanding"
          value={fmt(kpiData.totalOutstanding)}
          sub="Current balance"
        />
        <KpiCard
          label="Collected Today"
          value={fmt(kpiData.collectedToday)}
          sub="Payments received"
          accent="text-emerald-700"
          trend="up"
        />
        <KpiCard
          label="Active Clients"
          value={kpiData.activeClients}
          sub="Enrolled borrowers"
        />
        <KpiCard
          label="At-Risk Loans"
          value={kpiData.atRiskLoans}
          sub={`${riskRatio}% of portfolio`}
          accent="text-amber-600"
          trend="down"
          footer={
            <ProgressBar value={riskRatio} max={30} color="bg-amber-400" />
          }
        />
        <KpiCard
          label="Overdue Amount"
          value={fmt(kpiData.overdueAmount)}
          sub="Past due balance"
          accent="text-red-600"
        />
        <KpiCard
          label="Collection Rate"
          value={`${collectionRate}%`}
          sub="Today's target progress"
          accent={collectionRate >= 80 ? "text-emerald-700" : "text-amber-600"}
          footer={
            <ProgressBar
              value={collectionRate}
              max={100}
              color={collectionRate >= 80 ? "bg-emerald-500" : "bg-amber-500"}
            />
          }
        />
        <KpiCard label="Avg. Loan Size" value={fmt(12500)} sub="Per borrower" />
      </div>

      {/* ── Summary Banner ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm opacity-90">Portfolio Health</p>
            <p className="text-xl font-bold">
              Good standing · 87% on-time repayment
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs opacity-75">Target</p>
              <p className="font-bold">₱1.2M</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">Projected</p>
              <p className="font-bold">₱1.35M</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Liquidity Trend ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Monthly Cash Flow (Incoming vs. Unpaid)
          </h2>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {["weekly", "monthly", "quarterly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${
                  selectedPeriod === period
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={liquidityTrend}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="incoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="unpaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => fmt(v)}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Area
              type="monotone"
              dataKey="incoming"
              stroke="#059669"
              fill="url(#incoming)"
              name="Incoming"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="unpaid"
              stroke="#ef4444"
              fill="url(#unpaid)"
              name="Unpaid"
              strokeWidth={2}
            />
            <Legend iconSize={10} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Repayment Status + Alerts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut with summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Repayment Status
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={repaymentStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                paddingAngle={2}
              >
                {repaymentStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v} clients`, n]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend iconType="circle" iconSize={9} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2 pt-2 border-t border-slate-50">
            {repaymentStatus.map((s) => (
              <div key={s.name} className="text-center">
                <p className="text-xs text-slate-500">{s.name}</p>
                <p className="text-sm font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts with inline workflow */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Recent Risk Alerts
            </h2>
            <button className="text-xs text-emerald-700 font-medium hover:underline">
              View all
            </button>
          </div>
          <ul className="space-y-2">
            {recentAlerts.map((a) => (
              <AlertItem key={a.id} alert={a} />
            ))}
          </ul>
          {recentAlerts.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              <AlertTriangle size={24} className="mx-auto mb-2" />
              <p className="text-sm">No active alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Collections vs. Unpaid by Month
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={liquidityTrend}
            barGap={4}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => fmt(v)}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar
              dataKey="incoming"
              name="Incoming"
              fill="#059669"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="unpaid"
              name="Unpaid"
              fill="#fca5a5"
              radius={[3, 3, 0, 0]}
            />
            <Legend iconSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Recent Activity Feed (NEW) ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Recent Activity
          </h2>
          <button className="text-xs text-emerald-700 font-medium hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-3">
          {[
            {
              action: "Payment received",
              client: "Maria Santos",
              amount: 2500,
              time: "12 min ago",
              type: "payment",
            },
            {
              action: "Loan disbursed",
              client: "Juan Dela Cruz",
              amount: 15000,
              time: "1 hour ago",
              type: "disbursement",
            },
            {
              action: "Risk flag raised",
              client: "Pedro Reyes",
              amount: null,
              time: "2 hours ago",
              type: "alert",
            },
            {
              action: "Interview completed",
              client: "Ana Gonzales",
              amount: null,
              time: "3 hours ago",
              type: "interview",
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  activity.type === "payment"
                    ? "bg-emerald-100 text-emerald-700"
                    : activity.type === "disbursement"
                      ? "bg-blue-100 text-blue-700"
                      : activity.type === "alert"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                }`}
              >
                {activity.type === "payment" ? (
                  <DollarSign size={14} />
                ) : activity.type === "disbursement" ? (
                  <ArrowUpRight size={14} />
                ) : activity.type === "alert" ? (
                  <AlertTriangle size={14} />
                ) : (
                  <Users size={14} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {activity.action} ·{" "}
                  <span className="font-normal">{activity.client}</span>
                </p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
              {activity.amount && (
                <span className="text-sm font-semibold text-slate-800">
                  {fmt(activity.amount)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
