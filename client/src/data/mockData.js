export const kpiData = {
  totalDisbursed: 842000,
  totalOutstanding: 567400,
  collectedToday: 38200,
  atRiskLoans: 14,
  activeClients: 312,
  overdueAmount: 47600,
};

export const liquidityTrend = [
  { month: 'Nov', incoming: 52000, unpaid: 18000 },
  { month: 'Dec', incoming: 61000, unpaid: 22000 },
  { month: 'Jan', incoming: 58000, unpaid: 19000 },
  { month: 'Feb', incoming: 67000, unpaid: 25000 },
  { month: 'Mar', incoming: 71000, unpaid: 21000 },
  { month: 'Apr', incoming: 64000, unpaid: 23000 },
];

export const repaymentStatus = [
  { name: 'On Track', value: 248, color: '#22c55e' },
  { name: 'Late 1-30d', value: 38, color: '#f59e0b' },
  { name: 'Late 31-60d', value: 17, color: '#f97316' },
  { name: 'Defaulted', value: 9, color: '#ef4444' },
];

export const recentAlerts = [
  { id: 1, clientId: 1, client: 'Maria Santos', message: 'Missed 2nd installment', risk: 'high', days: 12 },
  { id: 2, clientId: 2, client: 'Jose Reyes', message: 'Payment 18 days overdue', risk: 'medium', days: 18 },
  { id: 3, clientId: 3, client: 'Ana Cruz', message: 'Risk score elevated to 82%', risk: 'high', days: 5 },
  { id: 4, clientId: 4, client: 'Pedro Lim', message: 'First late payment detected', risk: 'low', days: 3 },
];

export const interviewQuestions = [
  {
    id: 'q1',
    text: 'What is the primary purpose of this loan?',
    type: 'select',
    options: [
      { label: 'Business Capital', value: 'business', next: 'q2_business' },
      { label: 'Agricultural Input', value: 'agriculture', next: 'q2_agri' },
      { label: 'Personal / Emergency', value: 'personal', next: 'q2_personal' },
      { label: 'Home Improvement', value: 'home', next: 'q2_home' },
    ],
  },
  {
    id: 'q2_business',
    text: 'How long has this business been operating?',
    type: 'select',
    options: [
      { label: 'Less than 1 year', value: 'lt1', next: 'q3_new_business' },
      { label: '1–3 years', value: '1to3', next: 'q3' },
      { label: 'More than 3 years', value: 'gt3', next: 'q3' },
    ],
  },
  {
    id: 'q2_agri',
    text: 'What is the land area being cultivated (hectares)?',
    type: 'number',
    next: 'q3',
    placeholder: 'e.g. 2.5',
  },
  {
    id: 'q2_personal',
    text: 'What is the nature of the emergency or personal need?',
    type: 'text',
    next: 'q3',
    placeholder: 'Briefly describe...',
  },
  {
    id: 'q2_home',
    text: 'Does the borrower own the property?',
    type: 'select',
    options: [
      { label: 'Yes — with title', value: 'owned_title', next: 'q3' },
      { label: 'Yes — no title', value: 'owned_no_title', next: 'q3' },
      { label: 'Renting', value: 'renting', next: 'q3' },
    ],
  },
  {
    id: 'q3_new_business',
    text: 'New business detected. Has the borrower completed a business training?',
    type: 'select',
    options: [
      { label: 'Yes', value: 'yes', next: 'q3' },
      { label: 'No', value: 'no', next: 'q3' },
    ],
    flag: 'New business — higher monitoring recommended.',
  },
  {
    id: 'q3',
    text: 'What is the borrower\'s estimated monthly income?',
    type: 'number',
    next: 'q4',
    placeholder: 'Amount in PHP',
  },
  {
    id: 'q4',
    text: 'Does the borrower have existing loans with other institutions?',
    type: 'select',
    options: [
      { label: 'No other loans', value: 'none', next: 'q5' },
      { label: 'Yes — 1 other loan', value: 'one', next: 'q4b' },
      { label: 'Yes — 2 or more', value: 'multiple', next: 'q4b' },
    ],
  },
  {
    id: 'q4b',
    text: 'What is the total monthly obligation to other lenders (PHP)?',
    type: 'number',
    next: 'q5',
    placeholder: 'Total monthly repayment',
  },
  {
    id: 'q5',
    text: 'Any additional notes about this application?',
    type: 'textarea',
    next: null,
    placeholder: 'Optional remarks...',
  },
];

export const heatmapPoints = [
  { lat: 14.5995, lng: 120.9842, barangay: 'Binondo', overdue: 18, clients: 42, risk: 'high' },
  { lat: 14.6042, lng: 120.9822, barangay: 'Tondo', overdue: 22, clients: 65, risk: 'high' },
  { lat: 14.5831, lng: 120.9794, barangay: 'Ermita', overdue: 4, clients: 28, risk: 'low' },
  { lat: 14.5896, lng: 121.0090, barangay: 'Quiapo', overdue: 11, clients: 37, risk: 'medium' },
  { lat: 14.6112, lng: 121.0055, barangay: 'Sampaloc', overdue: 9, clients: 55, risk: 'medium' },
  { lat: 14.5515, lng: 121.0181, barangay: 'Paco', overdue: 2, clients: 19, risk: 'low' },
  { lat: 14.6201, lng: 121.0341, barangay: 'Santa Mesa', overdue: 15, clients: 41, risk: 'high' },
  { lat: 14.5706, lng: 121.0267, barangay: 'Pandacan', overdue: 7, clients: 33, risk: 'medium' },
  { lat: 14.5318, lng: 121.0176, barangay: 'Malate', overdue: 3, clients: 24, risk: 'low' },
  { lat: 14.6488, lng: 121.0428, barangay: 'Marikina', overdue: 19, clients: 48, risk: 'high' },
];

export const policyFAQs = [
  {
    id: 1,
    question: 'What is the maximum loan amount for a first-time borrower?',
    answer: 'First-time borrowers are eligible for a maximum of ₱15,000. After successful completion of the first loan cycle, the limit increases to ₱25,000.',
    category: 'Loan Limits',
  },
  {
    id: 2,
    question: 'How do I handle a client who missed their payment?',
    answer: 'Visit the client within 3 days of a missed payment. Document the reason in the system. If the client has a valid reason (illness, calamity), a restructuring request can be submitted to your branch manager.',
    category: 'Collections',
  },
  {
    id: 3,
    question: 'What documents are required for loan application?',
    answer: 'Required: Valid government ID, proof of income or business (for business loans), barangay clearance, and completed KYC form. For agricultural loans, also attach land certificate or lease agreement.',
    category: 'Documentation',
  },
  {
    id: 4,
    question: 'Can a client apply for a new loan while still paying an existing one?',
    answer: 'Yes, if the existing loan is at least 50% paid and there are zero missed payments. This is called a "top-up" loan and requires supervisor approval.',
    category: 'Loan Policy',
  },
  {
    id: 5,
    question: 'What is the interest rate for micro-enterprise loans?',
    answer: 'Micro-enterprise loans carry a flat rate of 2.5% per month. For loans above ₱50,000, the rate is 2.0% per month. All rates are subject to BSP regulations.',
    category: 'Rates & Fees',
  },
];

export const offlineQueue = [
  { id: 'q-001', type: 'Interview Form', client: 'Rosa Mendoza', timestamp: '2026-04-29 08:14', status: 'queued' },
  { id: 'q-002', type: 'Payment Record', client: 'Ben Aquino', timestamp: '2026-04-29 08:31', status: 'queued' },
  { id: 'q-003', type: 'Interview Form', client: 'Carla Dela Cruz', timestamp: '2026-04-29 09:05', status: 'queued' },
];
