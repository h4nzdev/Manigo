export const RISK_LEVELS = {
  low:    { label: 'Low Risk',    range: '0–30',   textColor: 'text-emerald-700', bgColor: 'bg-emerald-50',  borderColor: 'border-emerald-200', ringColor: '#10b981', badgeClass: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Moderate',    range: '31–60',  textColor: 'text-amber-700',   bgColor: 'bg-amber-50',    borderColor: 'border-amber-200',   ringColor: '#f59e0b', badgeClass: 'bg-amber-100 text-amber-700' },
  high:   { label: 'High Risk',   range: '61–100', textColor: 'text-red-700',     bgColor: 'bg-red-50',      borderColor: 'border-red-200',     ringColor: '#ef4444', badgeClass: 'bg-red-100 text-red-700' },
};

export function getRiskMeta(level) {
  return RISK_LEVELS[level] ?? RISK_LEVELS.low;
}

export function scoreToLevel(score) {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

export const PAYMENT_STATUS_META = {
  on_time:  { label: 'On Time',  className: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  late:     { label: 'Late',     className: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500' },
  missed:   { label: 'Missed',   className: 'bg-red-100 text-red-700',         dot: 'bg-red-500' },
  overdue:  { label: 'Overdue',  className: 'bg-red-200 text-red-800',         dot: 'bg-red-700' },
  upcoming: { label: 'Upcoming', className: 'bg-slate-100 text-slate-500',     dot: 'bg-slate-300' },
};

export const LOAN_STATUS_META = {
  good:    { label: 'Good Standing', className: 'bg-emerald-100 text-emerald-700' },
  monitor: { label: 'Monitoring',    className: 'bg-amber-100 text-amber-700' },
  at_risk: { label: 'At Risk',       className: 'bg-orange-100 text-orange-700' },
  overdue: { label: 'Overdue',       className: 'bg-red-100 text-red-700' },
};
