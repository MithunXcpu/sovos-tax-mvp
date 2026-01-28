import {
  Jurisdiction,
  Transaction,
  ComplianceAlert,
  FilingEvent,
  ComplianceOverview,
  DashboardData,
} from "@/types/compliance";
import { SuggestedPrompt } from "@/types/chat";

// Helper to create dates relative to today
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const jurisdictions: Jurisdiction[] = [
  {
    id: "ca",
    name: "California",
    code: "CA",
    type: "state",
    status: "compliant",
    nextFilingDate: daysFromNow(15),
    lastFilingDate: daysAgo(15),
    currentLiability: 45230,
    ytdCollected: 892450,
    ytdRemitted: 847220,
    taxRate: 7.25,
    filingFrequency: "monthly",
    registrationNumber: "SR-CA-2024-001234",
  },
  {
    id: "tx",
    name: "Texas",
    code: "TX",
    type: "state",
    status: "compliant",
    nextFilingDate: daysFromNow(22),
    lastFilingDate: daysAgo(8),
    currentLiability: 38750,
    ytdCollected: 654320,
    ytdRemitted: 615570,
    taxRate: 6.25,
    filingFrequency: "monthly",
    registrationNumber: "SR-TX-2024-005678",
  },
  {
    id: "ny",
    name: "New York",
    code: "NY",
    type: "state",
    status: "at_risk",
    nextFilingDate: daysFromNow(5),
    lastFilingDate: daysAgo(25),
    currentLiability: 67890,
    ytdCollected: 1234560,
    ytdRemitted: 1166670,
    taxRate: 8.0,
    filingFrequency: "quarterly",
    registrationNumber: "SR-NY-2024-009012",
  },
  {
    id: "fl",
    name: "Florida",
    code: "FL",
    type: "state",
    status: "compliant",
    nextFilingDate: daysFromNow(30),
    lastFilingDate: daysAgo(1),
    currentLiability: 29450,
    ytdCollected: 543210,
    ytdRemitted: 513760,
    taxRate: 6.0,
    filingFrequency: "monthly",
    registrationNumber: "SR-FL-2024-003456",
  },
  {
    id: "uk-vat",
    name: "United Kingdom",
    code: "UK",
    type: "vat",
    status: "at_risk",
    nextFilingDate: daysFromNow(8),
    lastFilingDate: daysAgo(82),
    currentLiability: 125600,
    ytdCollected: 2456780,
    ytdRemitted: 2331180,
    taxRate: 20.0,
    filingFrequency: "quarterly",
    registrationNumber: "GB-VAT-123456789",
  },
  {
    id: "de-vat",
    name: "Germany",
    code: "DE",
    type: "vat",
    status: "non_compliant",
    nextFilingDate: daysAgo(2),
    lastFilingDate: daysAgo(92),
    currentLiability: 89340,
    ytdCollected: 1876540,
    ytdRemitted: 1787200,
    taxRate: 19.0,
    filingFrequency: "monthly",
    registrationNumber: "DE-VAT-987654321",
  },
];

export const generateTransactions = (jurisdictionId: string): Transaction[] => {
  const transactions: Transaction[] = [];
  const customers = [
    "Acme Corp",
    "TechStart Inc",
    "Global Retail",
    "Enterprise Solutions",
    "Digital Commerce",
    "Cloud Systems",
    "Smart Shop",
    "E-Commerce Plus",
  ];

  for (let i = 0; i < 10; i++) {
    const amount = Math.floor(Math.random() * 5000) + 500;
    const taxRate = jurisdictions.find((j) => j.id === jurisdictionId)?.taxRate || 7;
    const isRefund = Math.random() < 0.1;

    transactions.push({
      id: `txn-${jurisdictionId}-${i}`,
      jurisdictionId,
      date: daysAgo(Math.floor(Math.random() * 30)),
      type: isRefund ? "refund" : "sale",
      amount: isRefund ? -amount : amount,
      taxAmount: isRefund ? -(amount * taxRate) / 100 : (amount * taxRate) / 100,
      orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      status: Math.random() < 0.95 ? "completed" : "pending",
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const alerts: ComplianceAlert[] = [
  {
    id: "alert-1",
    jurisdictionId: "de-vat",
    jurisdictionName: "Germany",
    type: "filing_due",
    severity: "critical",
    title: "VAT Filing Overdue",
    description: "Your monthly VAT filing for Germany is 2 days overdue. Immediate action required to avoid penalties.",
    dueDate: daysAgo(2),
    createdAt: daysAgo(2),
    isRead: false,
  },
  {
    id: "alert-2",
    jurisdictionId: "ny",
    jurisdictionName: "New York",
    type: "filing_due",
    severity: "warning",
    title: "Quarterly Filing Due Soon",
    description: "Your Q4 sales tax filing for New York is due in 5 days. Prepare your documentation.",
    dueDate: daysFromNow(5),
    createdAt: daysAgo(1),
    isRead: false,
  },
  {
    id: "alert-3",
    jurisdictionId: "uk-vat",
    jurisdictionName: "United Kingdom",
    type: "filing_due",
    severity: "warning",
    title: "VAT Return Due Soon",
    description: "Your quarterly VAT return for the UK is due in 8 days.",
    dueDate: daysFromNow(8),
    createdAt: daysAgo(0),
    isRead: true,
  },
  {
    id: "alert-4",
    jurisdictionId: "ca",
    jurisdictionName: "California",
    type: "rate_change",
    severity: "info",
    title: "Tax Rate Update",
    description: "Alameda County has updated their local tax rate effective next month. Review your rate tables.",
    dueDate: null,
    createdAt: daysAgo(3),
    isRead: true,
  },
  {
    id: "alert-5",
    jurisdictionId: "tx",
    jurisdictionName: "Texas",
    type: "threshold_exceeded",
    severity: "info",
    title: "Sales Threshold Exceeded",
    description: "You've exceeded the economic nexus threshold in Harris County. Consider reviewing your filing frequency.",
    dueDate: null,
    createdAt: daysAgo(5),
    isRead: true,
  },
];

export const filingEvents: FilingEvent[] = [
  {
    id: "filing-1",
    jurisdictionId: "de-vat",
    jurisdictionName: "Germany",
    jurisdictionCode: "DE",
    type: "filing",
    dueDate: daysAgo(2),
    estimatedAmount: 89340,
    status: "overdue",
  },
  {
    id: "filing-2",
    jurisdictionId: "ny",
    jurisdictionName: "New York",
    jurisdictionCode: "NY",
    type: "filing",
    dueDate: daysFromNow(5),
    estimatedAmount: 67890,
    status: "due_soon",
  },
  {
    id: "filing-3",
    jurisdictionId: "uk-vat",
    jurisdictionName: "United Kingdom",
    jurisdictionCode: "UK",
    type: "filing",
    dueDate: daysFromNow(8),
    estimatedAmount: 125600,
    status: "due_soon",
  },
  {
    id: "filing-4",
    jurisdictionId: "ca",
    jurisdictionName: "California",
    jurisdictionCode: "CA",
    type: "filing",
    dueDate: daysFromNow(15),
    estimatedAmount: 45230,
    status: "upcoming",
  },
  {
    id: "filing-5",
    jurisdictionId: "tx",
    jurisdictionName: "Texas",
    jurisdictionCode: "TX",
    type: "filing",
    dueDate: daysFromNow(22),
    estimatedAmount: 38750,
    status: "upcoming",
  },
  {
    id: "filing-6",
    jurisdictionId: "fl",
    jurisdictionName: "Florida",
    jurisdictionCode: "FL",
    type: "filing",
    dueDate: daysFromNow(30),
    estimatedAmount: 29450,
    status: "upcoming",
  },
];

export const complianceOverview: ComplianceOverview = {
  score: 78,
  trend: "down",
  totalJurisdictions: 6,
  compliantCount: 3,
  atRiskCount: 2,
  nonCompliantCount: 1,
  totalLiability: 396260,
  ytdCollected: 7657860,
  upcomingFilings: 6,
};

export const dashboardData: DashboardData = {
  overview: complianceOverview,
  jurisdictions,
  alerts,
  filingEvents,
};

export const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "1",
    label: "Compliance Status",
    prompt: "What is my current compliance status across all jurisdictions?",
    icon: "Shield",
  },
  {
    id: "2",
    label: "Upcoming Filings",
    prompt: "What tax filings do I have coming up in the next 30 days?",
    icon: "Calendar",
  },
  {
    id: "3",
    label: "Tax Liability",
    prompt: "What is my total tax liability and how does it break down by jurisdiction?",
    icon: "DollarSign",
  },
  {
    id: "4",
    label: "Risk Assessment",
    prompt: "Which jurisdictions are at risk and what should I do about them?",
    icon: "AlertTriangle",
  },
];
