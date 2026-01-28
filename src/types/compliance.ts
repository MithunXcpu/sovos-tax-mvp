export type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "pending";

export type FilingFrequency = "monthly" | "quarterly" | "annual";

export type JurisdictionType = "state" | "country" | "vat";

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertType =
  | "filing_due"
  | "rate_change"
  | "threshold_exceeded"
  | "registration_required"
  | "payment_due";

export interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  type: JurisdictionType;
  status: ComplianceStatus;
  nextFilingDate: Date;
  lastFilingDate: Date | null;
  currentLiability: number;
  ytdCollected: number;
  ytdRemitted: number;
  taxRate: number;
  filingFrequency: FilingFrequency;
  registrationNumber: string;
}

export interface Transaction {
  id: string;
  jurisdictionId: string;
  date: Date;
  type: "sale" | "refund" | "adjustment";
  amount: number;
  taxAmount: number;
  orderId: string;
  customer: string;
  status: "completed" | "pending" | "failed";
}

export interface ComplianceAlert {
  id: string;
  jurisdictionId: string;
  jurisdictionName: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  dueDate: Date | null;
  createdAt: Date;
  isRead: boolean;
}

export interface FilingEvent {
  id: string;
  jurisdictionId: string;
  jurisdictionName: string;
  jurisdictionCode: string;
  type: "filing" | "payment" | "registration";
  dueDate: Date;
  estimatedAmount: number;
  status: "upcoming" | "due_soon" | "overdue" | "completed";
}

export interface ComplianceOverview {
  score: number;
  trend: "up" | "down" | "stable";
  totalJurisdictions: number;
  compliantCount: number;
  atRiskCount: number;
  nonCompliantCount: number;
  totalLiability: number;
  ytdCollected: number;
  upcomingFilings: number;
}

export interface DashboardData {
  overview: ComplianceOverview;
  jurisdictions: Jurisdiction[];
  alerts: ComplianceAlert[];
  filingEvents: FilingEvent[];
}
