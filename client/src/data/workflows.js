import {
  Phone, MapPin, FileText, ClipboardList,
  Send, Bell, Search, ShieldAlert, Users, CreditCard,
  MessageSquare, Calendar,
} from 'lucide-react';

export const workflows = [
  {
    id: 'missed-payment',
    title: 'Handle Missed Payment',
    description: 'Standard follow-up protocol for a missed installment.',
    estimatedTime: '30–45 min',
    color: 'amber',
    keywords: ['missed', 'payment', 'collection', 'overdue', 'late', 'installment'],
    steps: [
      {
        id: 1, label: 'Contact client via phone or SMS',
        type: 'task', Icon: Phone, required: true,
      },
      {
        id: 2, label: 'Send payment reminder message',
        type: 'message', Icon: MessageSquare, required: false,
        defaultMessage: 'Hi [Client Name], this is a friendly reminder from Manigo regarding your loan payment that was due on [Due Date]. Please contact us or settle your payment at your earliest convenience. Thank you.',
      },
      {
        id: 3, label: 'Schedule a follow-up visit',
        type: 'schedule', Icon: Calendar, required: false,
      },
      {
        id: 4, label: 'Document the reason for non-payment',
        type: 'task', Icon: FileText, required: true,
      },
      {
        id: 5, label: 'Assess if loan restructuring is appropriate',
        type: 'task', Icon: ClipboardList, required: false,
      },
      {
        id: 6, label: 'Submit follow-up report in system',
        type: 'task', Icon: Send, required: true,
      },
      {
        id: 7, label: 'Escalate to branch manager if high risk',
        type: 'message', Icon: Bell, required: false,
        defaultMessage: 'Hi [Manager Name], client [Client Name] has missed payment #[Payment No.]. Current risk score: [Risk Score]. Please review and advise.',
      },
    ],
  },
  {
    id: 'loan-application',
    title: 'Process Loan Application',
    description: 'End-to-end steps for evaluating and processing a new loan.',
    estimatedTime: '1–2 hours',
    color: 'blue',
    keywords: ['loan', 'limit', 'application', 'new client', 'first-time', 'apply', 'borrow'],
    steps: [
      {
        id: 1, label: 'Collect required documents from borrower',
        type: 'task', Icon: FileText, required: true,
      },
      {
        id: 2, label: 'Conduct borrower interview',
        type: 'task', Icon: ClipboardList, required: true,
      },
      {
        id: 3, label: 'Verify references and background',
        type: 'task', Icon: Search, required: true,
      },
      {
        id: 4, label: 'Compute loan-to-income ratio',
        type: 'task', Icon: CreditCard, required: true,
      },
      {
        id: 5, label: 'Notify client of expected decision date',
        type: 'message', Icon: MessageSquare, required: false,
        defaultMessage: 'Hi [Client Name], your loan application has been received. We will notify you of the decision by [Decision Date]. Thank you for choosing Manigo.',
      },
      {
        id: 6, label: 'Schedule credit committee review',
        type: 'schedule', Icon: Calendar, required: true,
      },
      {
        id: 7, label: 'Notify client of final decision',
        type: 'message', Icon: Bell, required: true,
        defaultMessage: 'Hi [Client Name], we are pleased to inform you that your loan application has been [approved/declined]. [Additional details here.]',
      },
    ],
  },
  {
    id: 'document-collection',
    title: 'Collect Required Documents',
    description: 'Checklist for gathering all borrower documents before filing.',
    estimatedTime: '15–30 min',
    color: 'purple',
    keywords: ['document', 'requirement', 'id', 'clearance', 'kyc', 'requirements'],
    steps: [
      { id: 1, label: 'Valid government-issued ID', type: 'task', Icon: FileText, required: true },
      { id: 2, label: 'Proof of income or business', type: 'task', Icon: FileText, required: true },
      { id: 3, label: 'Barangay clearance', type: 'task', Icon: FileText, required: true },
      { id: 4, label: 'Completed KYC form', type: 'task', Icon: ClipboardList, required: true },
      { id: 5, label: 'Land certificate or lease agreement (agricultural loans only)', type: 'task', Icon: FileText, required: false },
      {
        id: 6, label: 'Send document checklist to client',
        type: 'message', Icon: MessageSquare, required: false,
        defaultMessage: 'Hi [Client Name], please prepare the following for your loan application: (1) Valid ID, (2) Proof of income, (3) Barangay clearance, (4) KYC form. Contact us if you have questions.',
      },
    ],
  },
  {
    id: 'top-up-loan',
    title: 'Process Top-Up Loan Request',
    description: 'Steps to verify eligibility and process a top-up loan.',
    estimatedTime: '45 min',
    color: 'emerald',
    keywords: ['top-up', 'additional', 'renewal', 'reloan', 'existing loan', 'while paying'],
    steps: [
      { id: 1, label: 'Verify existing loan is at least 50% paid', type: 'task', Icon: Search, required: true },
      { id: 2, label: 'Confirm zero missed payments on record', type: 'task', Icon: ShieldAlert, required: true },
      { id: 3, label: 'Assess current repayment capacity', type: 'task', Icon: ClipboardList, required: true },
      { id: 4, label: 'Get supervisor pre-approval', type: 'task', Icon: Users, required: true },
      {
        id: 5, label: 'Notify client of top-up eligibility',
        type: 'message', Icon: MessageSquare, required: false,
        defaultMessage: 'Hi [Client Name], congratulations! You are eligible for a top-up loan of up to [Amount]. Please visit our office or contact us to proceed.',
      },
      {
        id: 6, label: 'Schedule loan signing appointment',
        type: 'schedule', Icon: Calendar, required: true,
      },
    ],
  },
  {
    id: 'risk-flag-followup',
    title: 'Risk Flag Follow-Up',
    description: 'Protocol when a client is flagged as high-risk by the system.',
    estimatedTime: '1 hour',
    color: 'red',
    keywords: ['risk', 'flag', 'default', 'at-risk', 'score', 'risk score', 'elevated'],
    steps: [
      { id: 1, label: 'Review client payment history in full', type: 'task', Icon: Search, required: true },
      {
        id: 2, label: 'Schedule unannounced visit',
        type: 'schedule', Icon: Calendar, required: false,
      },
      { id: 3, label: 'Assess current business or livelihood status', type: 'task', Icon: ClipboardList, required: true },
      { id: 4, label: 'Update risk assessment notes in system', type: 'task', Icon: FileText, required: true },
      {
        id: 5, label: 'Send risk alert to branch manager',
        type: 'message', Icon: Bell, required: true,
        defaultMessage: 'Hi [Manager Name], client [Client Name] has been flagged with a risk score of [Score]. Payment history: [Summary]. Recommended action: [Action]. Please review.',
      },
      { id: 6, label: 'Recommend restructuring or write-off', type: 'task', Icon: ClipboardList, required: false },
      {
        id: 7, label: 'Notify client of account status',
        type: 'message', Icon: MessageSquare, required: false,
        defaultMessage: 'Hi [Client Name], we would like to discuss your loan account. Please contact us at your earliest convenience so we can assist you. Thank you.',
      },
    ],
  },
];

export function matchWorkflow(query) {
  const lower = query.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const w of workflows) {
    const score = w.keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = w;
    }
  }
  return bestScore > 0 ? best : null;
}

export function workflowForAlert(alertMessage) {
  const lower = alertMessage.toLowerCase();
  if (lower.includes('miss') || lower.includes('overdue') || lower.includes('late')) return workflows[0];
  if (lower.includes('risk') || lower.includes('score')) return workflows[4];
  return null;
}
