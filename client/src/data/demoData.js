// Rich demo data for hackathon presentation
// 6 clients with distinct risk stories for the demo narrative

export const demoBranch = {
  id: 1,
  name: 'Metro Manila Branch',
  region: 'NCR',
  manager: 'Ligaya Reyes',
  managerEmail: 'manager@manigo.ph',
};

export const demoOfficer = {
  id: 7,
  name: 'Juan Dela Cruz',
  branch: 'Metro Manila',
  id_code: 'FO-2024-0147',
};

// ─── Clients ──────────────────────────────────────────────
export const demoClients = [
  {
    id: 1,
    name: 'Maria Santos',
    initials: 'MS',
    phone: '+63 917 123 4567',
    address: '12 Calle Real, Binondo',
    barangay: 'Binondo',
    businessType: 'Sari-sari store',
    businessAgeYears: 0.8,
    monthlyIncome: 12000,
    avatarColor: 'bg-rose-400',
    joinedDate: '2025-08-15',
  },
  {
    id: 2,
    name: 'Jose Reyes',
    initials: 'JR',
    phone: '+63 918 234 5678',
    address: '34 Rizal Ave, Sampaloc',
    barangay: 'Sampaloc',
    businessType: 'Jeepney operator',
    businessAgeYears: 4.2,
    monthlyIncome: 18000,
    avatarColor: 'bg-amber-400',
    joinedDate: '2025-07-01',
  },
  {
    id: 3,
    name: 'Ana Cruz',
    initials: 'AC',
    phone: '+63 919 345 6789',
    address: '8 Mabini St, Quiapo',
    barangay: 'Quiapo',
    businessType: 'Carenderia',
    businessAgeYears: 0.5,
    monthlyIncome: 9500,
    avatarColor: 'bg-purple-400',
    joinedDate: '2025-09-01',
  },
  {
    id: 4,
    name: 'Pedro Lim',
    initials: 'PL',
    phone: '+63 920 456 7890',
    address: '56 Ongpin St, Binondo',
    barangay: 'Binondo',
    businessType: 'General merchandise',
    businessAgeYears: 6.3,
    monthlyIncome: 42000,
    avatarColor: 'bg-emerald-500',
    joinedDate: '2024-03-10',
  },
  {
    id: 5,
    name: 'Rosa Mendoza',
    initials: 'RM',
    phone: '+63 921 567 8901',
    address: 'Sitio Masagana, Paco',
    barangay: 'Paco',
    businessType: 'Rice farming',
    businessAgeYears: 3.1,
    monthlyIncome: 11000,
    avatarColor: 'bg-teal-500',
    joinedDate: '2025-05-20',
  },
  {
    id: 6,
    name: 'Carlos Bautista',
    initials: 'CB',
    phone: '+63 922 678 9012',
    address: '90 Luna St, Malate',
    barangay: 'Malate',
    businessType: 'Home improvement',
    businessAgeYears: 8.0,
    monthlyIncome: 28000,
    avatarColor: 'bg-blue-500',
    joinedDate: '2024-11-05',
  },
];

// ─── Loans ────────────────────────────────────────────────
export const demoLoans = [
  {
    id: 101, clientId: 1, loanCode: 'LN-2025-0892',
    amount: 15000, termMonths: 12, monthlyPayment: 1500,
    disbursedDate: '2025-09-01', status: 'at_risk', officerId: 7,
    purpose: 'Business capital — restock sari-sari store',
    remainingBalance: 6000,
  },
  {
    id: 102, clientId: 2, loanCode: 'LN-2025-0761',
    amount: 25000, termMonths: 12, monthlyPayment: 2400,
    disbursedDate: '2025-08-01', status: 'overdue', officerId: 7,
    purpose: 'Vehicle repair and operating capital',
    remainingBalance: 12000,
  },
  {
    id: 103, clientId: 3, loanCode: 'LN-2025-1021',
    amount: 10000, termMonths: 8, monthlyPayment: 1400,
    disbursedDate: '2025-10-01', status: 'at_risk', officerId: 7,
    purpose: 'Carenderia equipment and stock',
    remainingBalance: 5600,
  },
  {
    id: 104, clientId: 4, loanCode: 'LN-2024-0312',
    amount: 50000, termMonths: 18, monthlyPayment: 3200,
    disbursedDate: '2024-04-01', status: 'good', officerId: 7,
    purpose: 'Expansion of general merchandise store',
    remainingBalance: 19200,
  },
  {
    id: 105, clientId: 5, loanCode: 'LN-2025-0544',
    amount: 20000, termMonths: 10, monthlyPayment: 2200,
    disbursedDate: '2025-06-01', status: 'monitor', officerId: 7,
    purpose: 'Agricultural inputs — seeds and fertilizer',
    remainingBalance: 8800,
  },
  {
    id: 106, clientId: 6, loanCode: 'LN-2024-0891',
    amount: 30000, termMonths: 12, monthlyPayment: 2800,
    disbursedDate: '2024-12-01', status: 'good', officerId: 7,
    purpose: 'Home renovation — roof and flooring',
    remainingBalance: 11200,
  },
];

// ─── Payment histories ────────────────────────────────────
// status: 'on_time' | 'late' | 'missed' | 'overdue'
export const demoPayments = {
  // Maria Santos — 4 good, then decline
  101: [
    { no: 1, due: '2025-10-01', paid: '2025-10-01', amount: 1500, status: 'on_time' },
    { no: 2, due: '2025-11-01', paid: '2025-11-01', amount: 1500, status: 'on_time' },
    { no: 3, due: '2025-12-01', paid: '2025-12-01', amount: 1500, status: 'on_time' },
    { no: 4, due: '2026-01-01', paid: '2026-01-01', amount: 1500, status: 'on_time' },
    { no: 5, due: '2026-02-01', paid: '2026-02-08', amount: 1500, status: 'late', daysLate: 7 },
    { no: 6, due: '2026-03-01', paid: null,         amount: 1500, status: 'missed' },
    { no: 7, due: '2026-04-01', paid: null,         amount: 1500, status: 'overdue', daysOverdue: 14 },
    { no: 8, due: '2026-05-01', paid: null,         amount: 1500, status: 'upcoming' },
  ],
  // Jose Reyes — consistently late, never missed
  102: [
    { no: 1, due: '2025-09-01', paid: '2025-09-08', amount: 2400, status: 'late', daysLate: 7 },
    { no: 2, due: '2025-10-01', paid: '2025-10-10', amount: 2400, status: 'late', daysLate: 9 },
    { no: 3, due: '2025-11-01', paid: '2025-11-06', amount: 2400, status: 'late', daysLate: 5 },
    { no: 4, due: '2025-12-01', paid: '2025-12-12', amount: 2400, status: 'late', daysLate: 11 },
    { no: 5, due: '2026-01-01', paid: '2026-01-07', amount: 2400, status: 'late', daysLate: 6 },
    { no: 6, due: '2026-02-01', paid: '2026-02-09', amount: 2400, status: 'late', daysLate: 8 },
    { no: 7, due: '2026-03-01', paid: '2026-03-10', amount: 2400, status: 'late', daysLate: 9 },
    { no: 8, due: '2026-04-01', paid: null,         amount: 2400, status: 'overdue', daysOverdue: 18 },
  ],
  // Ana Cruz — worst pattern, multiple misses
  103: [
    { no: 1, due: '2025-11-01', paid: '2025-11-01', amount: 1400, status: 'on_time' },
    { no: 2, due: '2025-12-01', paid: '2025-12-05', amount: 1400, status: 'late', daysLate: 4 },
    { no: 3, due: '2026-01-01', paid: null,         amount: 1400, status: 'missed' },
    { no: 4, due: '2026-02-01', paid: '2026-02-15', amount: 1400, status: 'late', daysLate: 14 },
    { no: 5, due: '2026-03-01', paid: null,         amount: 1400, status: 'missed' },
    { no: 6, due: '2026-04-01', paid: null,         amount: 1400, status: 'overdue', daysOverdue: 22 },
    { no: 7, due: '2026-05-01', paid: null,         amount: 1400, status: 'upcoming' },
  ],
  // Pedro Lim — near perfect
  104: [
    { no: 1, due: '2024-05-01', paid: '2024-05-01', amount: 3200, status: 'on_time' },
    { no: 2, due: '2024-06-01', paid: '2024-06-01', amount: 3200, status: 'on_time' },
    { no: 3, due: '2024-07-01', paid: '2024-07-01', amount: 3200, status: 'on_time' },
    { no: 4, due: '2024-08-01', paid: '2024-08-01', amount: 3200, status: 'on_time' },
    { no: 5, due: '2024-09-01', paid: '2024-09-01', amount: 3200, status: 'on_time' },
    { no: 6, due: '2024-10-01', paid: '2024-10-02', amount: 3200, status: 'late', daysLate: 1 },
    { no: 7, due: '2024-11-01', paid: '2024-11-01', amount: 3200, status: 'on_time' },
    { no: 8, due: '2024-12-01', paid: '2024-12-01', amount: 3200, status: 'on_time' },
    { no: 9, due: '2025-01-01', paid: '2025-01-01', amount: 3200, status: 'on_time' },
    { no: 10, due: '2025-02-01', paid: '2025-02-01', amount: 3200, status: 'on_time' },
    { no: 11, due: '2025-03-01', paid: '2025-03-01', amount: 3200, status: 'on_time' },
    { no: 12, due: '2025-04-01', paid: '2025-04-01', amount: 3200, status: 'on_time' },
  ],
  // Rosa Mendoza — seasonal gap in planting season
  105: [
    { no: 1, due: '2025-07-01', paid: '2025-07-01', amount: 2200, status: 'on_time' },
    { no: 2, due: '2025-08-01', paid: '2025-08-01', amount: 2200, status: 'on_time' },
    { no: 3, due: '2025-09-01', paid: '2025-09-05', amount: 2200, status: 'late', daysLate: 4 },
    { no: 4, due: '2025-10-01', paid: '2025-10-01', amount: 2200, status: 'on_time' },
    { no: 5, due: '2025-11-01', paid: null,         amount: 2200, status: 'missed' },
    { no: 6, due: '2025-12-01', paid: '2025-12-15', amount: 2200, status: 'late', daysLate: 14 },
    { no: 7, due: '2026-01-01', paid: '2026-01-01', amount: 2200, status: 'on_time' },
    { no: 8, due: '2026-02-01', paid: '2026-02-01', amount: 2200, status: 'on_time' },
    { no: 9, due: '2026-03-01', paid: '2026-03-01', amount: 2200, status: 'on_time' },
    { no: 10, due: '2026-04-01', paid: '2026-04-08', amount: 2200, status: 'late', daysLate: 7 },
  ],
  // Carlos Bautista — solid, minor blip
  106: [
    { no: 1, due: '2025-01-01', paid: '2025-01-01', amount: 2800, status: 'on_time' },
    { no: 2, due: '2025-02-01', paid: '2025-02-01', amount: 2800, status: 'on_time' },
    { no: 3, due: '2025-03-01', paid: '2025-03-01', amount: 2800, status: 'on_time' },
    { no: 4, due: '2025-04-01', paid: '2025-04-01', amount: 2800, status: 'on_time' },
    { no: 5, due: '2025-05-01', paid: '2025-05-01', amount: 2800, status: 'on_time' },
    { no: 6, due: '2025-06-01', paid: '2025-06-01', amount: 2800, status: 'on_time' },
    { no: 7, due: '2025-07-01', paid: '2025-07-01', amount: 2800, status: 'on_time' },
    { no: 8, due: '2025-08-01', paid: '2025-08-01', amount: 2800, status: 'on_time' },
    { no: 9, due: '2025-09-01', paid: '2025-09-01', amount: 2800, status: 'on_time' },
    { no: 10, due: '2025-10-01', paid: '2025-10-01', amount: 2800, status: 'on_time' },
    { no: 11, due: '2025-11-01', paid: '2025-11-03', amount: 2800, status: 'late', daysLate: 2 },
    { no: 12, due: '2025-12-01', paid: '2025-12-01', amount: 2800, status: 'on_time' },
  ],
};

// ─── Risk score breakdowns (computed from histories) ──────
export const demoRiskScores = {
  1: {
    total: 74,
    level: 'high',
    previousTotal: 41,
    trend: 'up',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 28, max: 40, detail: '2 missed · 1 late of 7 due' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 21, max: 30, detail: '14 days past due date' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 16, max: 20, detail: 'ratio 0.61 (threshold: 0.5)' },
      { key: 'bizStability',   label: 'Business Age',    score: 9,  max: 10, detail: 'Operating < 1 year' },
    ],
    flaggedAt: '2026-04-15',
    flagReason: 'Consecutive missed payments — installments 6 and 7',
  },
  2: {
    total: 52,
    level: 'medium',
    previousTotal: 48,
    trend: 'up',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 20, max: 40, detail: 'All 7 paid — chronic lateness (avg 7.9d)' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 18, max: 30, detail: '18 days past due' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 10, max: 20, detail: 'ratio 0.48 (within threshold)' },
      { key: 'bizStability',   label: 'Business Age',    score: 4,  max: 10, detail: 'Operating 4+ years' },
    ],
    flaggedAt: '2026-04-11',
    flagReason: 'Chronic lateness pattern detected — 7 consecutive late payments',
  },
  3: {
    total: 82,
    level: 'high',
    previousTotal: 61,
    trend: 'up',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 36, max: 40, detail: '2 missed of 6 due (33%)' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 22, max: 30, detail: '22 days past due date' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 15, max: 20, detail: 'ratio 0.59 (above threshold)' },
      { key: 'bizStability',   label: 'Business Age',    score: 9,  max: 10, detail: 'Operating < 1 year' },
    ],
    flaggedAt: '2026-04-24',
    flagReason: 'Risk score elevated — multiple factors combined',
  },
  4: {
    total: 12,
    level: 'low',
    previousTotal: 14,
    trend: 'down',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 2, max: 40, detail: '1 minor late (1d) of 12 due' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 0, max: 30, detail: 'No overdue payments' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 6, max: 20, detail: 'ratio 0.28 (well within range)' },
      { key: 'bizStability',   label: 'Business Age',    score: 4, max: 10, detail: 'Operating 6+ years' },
    ],
    flaggedAt: null,
    flagReason: null,
  },
  5: {
    total: 38,
    level: 'medium',
    previousTotal: 45,
    trend: 'down',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 14, max: 40, detail: '1 missed of 10 due — seasonal gap' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 7,  max: 30, detail: '7 days late (Apr payment)' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 13, max: 20, detail: 'ratio 0.52 (borderline)' },
      { key: 'bizStability',   label: 'Business Age',    score: 4,  max: 10, detail: 'Operating 3+ years' },
    ],
    flaggedAt: '2026-04-08',
    flagReason: 'Seasonal income gap — improving, now under monitoring',
  },
  6: {
    total: 18,
    level: 'low',
    previousTotal: 21,
    trend: 'down',
    breakdown: [
      { key: 'paymentHistory', label: 'Payment History', score: 4, max: 40, detail: '1 minor late (2d) of 12 due' },
      { key: 'daysOverdue',    label: 'Days Overdue',    score: 0, max: 30, detail: 'No overdue payments' },
      { key: 'loanToIncome',   label: 'Loan-to-Income',  score: 10, max: 20, detail: 'ratio 0.38 (within range)' },
      { key: 'bizStability',   label: 'Business Age',    score: 4,  max: 10, detail: 'Operating 8+ years' },
    ],
    flaggedAt: null,
    flagReason: null,
  },
};

// ─── Helpers ──────────────────────────────────────────────
export function getClientById(id) {
  return demoClients.find((c) => c.id === Number(id));
}
export function getLoanByClientId(clientId) {
  return demoLoans.find((l) => l.clientId === Number(clientId));
}
export function getPaymentsByLoanId(loanId) {
  return demoPayments[loanId] || [];
}
export function getRiskScore(clientId) {
  return demoRiskScores[Number(clientId)];
}
