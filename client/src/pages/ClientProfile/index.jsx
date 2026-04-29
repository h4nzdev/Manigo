import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  ArrowLeft, Phone, MapPin, Calendar, Briefcase, TrendingUp,
  TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, CreditCard,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  getClientById, getLoanByClientId, getPaymentsByLoanId, getRiskScore,
} from '../../data/demoData';
import { workflowForAlert, workflows } from '../../data/workflows';
import WorkflowSuggestion from '../../components/WorkflowSuggestion';
import { getRiskMeta, PAYMENT_STATUS_META, LOAN_STATUS_META } from '../../utils/riskScore';

// ─── SVG risk score ring ───────────────────────────────────
function RiskRing({ score, level }) {
  const meta = getRiskMeta(level);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  const TrendIcon = score > 50 ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        {/* Value arc */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={meta.ringColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Score text */}
        <text x="70" y="65" textAnchor="middle" fontSize="26" fontWeight="700" fill={meta.ringColor}>
          {score}
        </text>
        <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8">
          out of 100
        </text>
      </svg>
      <span className={`text-sm font-semibold ${meta.textColor}`}>{meta.label}</span>
    </div>
  );
}

// ─── Factor breakdown bar ──────────────────────────────────
function FactorBar({ factor, riskLevel }) {
  const meta = getRiskMeta(riskLevel);
  const pct = (factor.score / factor.max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-700">{factor.label}</span>
        <span className={`text-xs font-bold ${meta.textColor}`}>{factor.score}<span className="text-slate-400 font-normal">/{factor.max}</span></span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: meta.ringColor }}
        />
      </div>
      <p className="text-[11px] text-slate-400">{factor.detail}</p>
    </div>
  );
}

// ─── Payment status badge ──────────────────────────────────
function StatusBadge({ status }) {
  const m = PAYMENT_STATUS_META[status] ?? PAYMENT_STATUS_META.upcoming;
  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${m.className}`}>
      {m.label}
    </span>
  );
}

// ─── Payment bar chart colors ──────────────────────────────
const PAYMENT_BAR_COLOR = {
  on_time:  '#10b981',
  late:     '#f59e0b',
  missed:   '#ef4444',
  overdue:  '#b91c1c',
  upcoming: '#cbd5e1',
};

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const client = getClientById(id);
  const loan   = getLoanByClientId(id);
  const risk   = getRiskScore(id);

  if (!client) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 text-sm">Client not found.</p>
        <button onClick={() => navigate('/')} className="mt-3 text-emerald-700 text-sm font-medium hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const payments   = loan ? getPaymentsByLoanId(loan.id) : [];
  const riskMeta   = getRiskMeta(risk?.level ?? 'low');
  const loanMeta   = loan ? (LOAN_STATUS_META[loan.status] ?? LOAN_STATUS_META.good) : null;
  const visiblePayments = historyExpanded ? payments : payments.slice(0, 5);

  const paidCount    = payments.filter(p => p.status === 'on_time').length;
  const lateCount    = payments.filter(p => p.status === 'late').length;
  const missedCount  = payments.filter(p => ['missed', 'overdue'].includes(p.status)).length;

  const paidPct = payments.length > 0 ? Math.round((paidCount / payments.length) * 100) : 0;

  const suggestedWorkflow = (() => {
    if (!risk) return null;
    if (risk.level === 'high')   return workflows.find(w => w.id === 'risk-flag-followup');
    if (risk.level === 'medium') return workflows.find(w => w.id === 'missed-payment');
    return null;
  })();

  const trendScore = risk ? risk.total - risk.previousTotal : 0;
  const TrendIcon  = trendScore > 0 ? TrendingUp : trendScore < 0 ? TrendingDown : Minus;
  const trendColor = trendScore > 0 ? 'text-red-600' : trendScore < 0 ? 'text-emerald-600' : 'text-slate-400';

  return (
    <div className="p-4 space-y-5">
      {/* ── Back nav ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* ── Client header ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-start gap-4">
        <div className={`w-14 h-14 rounded-full ${client.avatarColor} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
          {client.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-slate-800">{client.name}</h1>
              <p className="text-sm text-slate-500">{client.businessType}</p>
            </div>
            {risk && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${riskMeta.badgeClass}`}>
                {riskMeta.label}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Phone size={11} />{client.phone}</span>
            <span className="flex items-center gap-1"><MapPin size={11} />{client.address}</span>
            <span className="flex items-center gap-1"><Calendar size={11} />Joined {client.joinedDate}</span>
            <span className="flex items-center gap-1"><Briefcase size={11} />{client.businessAgeYears}y in business</span>
          </div>
        </div>
      </div>

      {/* ── Risk + Loan row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk score card */}
        {risk && (
          <div className={`bg-white rounded-xl border shadow-sm p-4 ${riskMeta.borderColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700">Risk Score</h2>
              <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon size={13} />
                {trendScore > 0 ? `+${trendScore}` : trendScore} since last review
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <RiskRing score={risk.total} level={risk.level} />
              <div className="flex-1 w-full space-y-4">
                {risk.breakdown.map(f => (
                  <FactorBar key={f.key} factor={f} riskLevel={risk.level} />
                ))}
              </div>
            </div>
            {risk.flagReason && (
              <div className={`mt-4 p-3 rounded-lg ${riskMeta.bgColor} flex items-start gap-2`}>
                <AlertTriangle size={14} className={`${riskMeta.textColor} mt-0.5 shrink-0`} />
                <div>
                  <p className={`text-xs font-semibold ${riskMeta.textColor}`}>Flag reason</p>
                  <p className={`text-xs ${riskMeta.textColor} opacity-80`}>{risk.flagReason}</p>
                  {risk.flaggedAt && <p className="text-[11px] text-slate-400 mt-0.5">Flagged {risk.flaggedAt}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loan + suggested action */}
        <div className="space-y-4">
          {loan && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Current Loan</h2>
                {loanMeta && (
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${loanMeta.className}`}>
                    {loanMeta.label}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Loan Code</p>
                  <p className="font-medium text-slate-700">{loan.loanCode}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Principal</p>
                  <p className="font-bold text-slate-800">₱{loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Monthly Payment</p>
                  <p className="font-medium text-slate-700">₱{loan.monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Remaining Balance</p>
                  <p className="font-bold text-amber-700">₱{loan.remainingBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Term</p>
                  <p className="font-medium text-slate-700">{loan.termMonths} months</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Disbursed</p>
                  <p className="font-medium text-slate-700">{loan.disbursedDate}</p>
                </div>
              </div>
              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400">Purpose</p>
                <p className="text-xs text-slate-600 mt-0.5">{loan.purpose}</p>
              </div>

              {/* Payment summary stats */}
              <div className="mt-3 flex gap-3 text-center">
                <div className="flex-1 bg-emerald-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-emerald-700">{paidCount}</p>
                  <p className="text-[10px] text-emerald-600">On Time</p>
                </div>
                <div className="flex-1 bg-amber-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-amber-700">{lateCount}</p>
                  <p className="text-[10px] text-amber-600">Late</p>
                </div>
                <div className="flex-1 bg-red-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-red-700">{missedCount}</p>
                  <p className="text-[10px] text-red-600">Missed</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-700">{paidPct}%</p>
                  <p className="text-[10px] text-slate-500">On-time rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Suggested action */}
          {suggestedWorkflow && (
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-700">Suggested Action</h2>
                <AlertTriangle size={15} className="text-amber-500" />
              </div>
              {!showWorkflow ? (
                <div>
                  <p className="text-xs text-slate-500 mb-3">
                    Based on risk score and payment history, the following workflow is recommended:
                  </p>
                  <button
                    onClick={() => setShowWorkflow(true)}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-sm font-semibold text-amber-800 flex items-center justify-center gap-2 transition"
                  >
                    <CreditCard size={14} /> Start: {suggestedWorkflow.title}
                  </button>
                </div>
              ) : (
                <WorkflowSuggestion
                  workflow={suggestedWorkflow}
                  onDismiss={() => setShowWorkflow(false)}
                />
              )}
            </div>
          )}

          {!suggestedWorkflow && risk?.level === 'low' && (
            <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">No immediate action needed</p>
                <p className="text-xs text-emerald-600 mt-0.5">Client is in good standing. Continue regular monitoring.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Payment trend chart ── */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Payment Timeline</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={payments.filter(p => p.status !== 'upcoming')}
              barSize={18}
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="no"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `#${v}`}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v, n, props) => {
                  const p = props.payload;
                  return [`₱${v.toLocaleString()}`, p.status === 'late' ? `Late ${p.daysLate}d` : PAYMENT_STATUS_META[p.status]?.label ?? p.status];
                }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                {payments.filter(p => p.status !== 'upcoming').map((p, i) => (
                  <Cell key={i} fill={PAYMENT_BAR_COLOR[p.status] ?? '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-slate-50">
            {Object.entries(PAYMENT_BAR_COLOR).filter(([k]) => k !== 'upcoming').map(([k, color]) => (
              <span key={k} className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: color }} />
                {PAYMENT_STATUS_META[k]?.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Payment history table ── */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Payment History</h2>
            <span className="text-xs text-slate-400">{payments.length} installments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left py-2 pr-3 font-medium">#</th>
                  <th className="text-left py-2 pr-3 font-medium">Due Date</th>
                  <th className="text-left py-2 pr-3 font-medium">Paid Date</th>
                  <th className="text-right py-2 pr-3 font-medium">Amount</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visiblePayments.map((p) => {
                  const dot = PAYMENT_STATUS_META[p.status]?.dot ?? 'bg-slate-300';
                  return (
                    <tr key={p.no} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 pr-3 font-medium text-slate-500">{p.no}</td>
                      <td className="py-2 pr-3 text-slate-600">{p.due}</td>
                      <td className="py-2 pr-3">
                        {p.paid ? (
                          <span className="text-slate-600">{p.paid}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                        {p.daysLate && <span className="text-amber-600 ml-1">(+{p.daysLate}d)</span>}
                        {p.daysOverdue && <span className="text-red-700 ml-1 font-semibold">({p.daysOverdue}d overdue)</span>}
                      </td>
                      <td className="py-2 pr-3 text-right font-medium text-slate-700">₱{p.amount.toLocaleString()}</td>
                      <td className="py-2">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {payments.length > 5 && (
            <button
              onClick={() => setHistoryExpanded(e => !e)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 py-1.5 border-t border-slate-100 transition"
            >
              {historyExpanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show all {payments.length} payments</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
