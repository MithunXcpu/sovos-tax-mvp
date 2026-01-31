import { Jurisdiction, ComplianceOverview, ComplianceAlert, FilingEvent } from "@/types/compliance";

export type ExportType = "jurisdictions" | "compliance" | "full";

interface ExportData {
  jurisdictions: Jurisdiction[];
  overview: ComplianceOverview;
  alerts: ComplianceAlert[];
  filingEvents: FilingEvent[];
}

export function generateJurisdictionCSV(jurisdictions: Jurisdiction[]): string {
  const headers = [
    "Name",
    "Code",
    "Type",
    "Status",
    "Current Liability",
    "YTD Collected",
    "YTD Remitted",
    "Tax Rate (%)",
    "Filing Frequency",
    "Next Filing Date",
    "Registration Number",
  ];

  const rows = jurisdictions.map((j) => [
    j.name,
    j.code,
    j.type,
    j.status,
    j.currentLiability.toFixed(2),
    j.ytdCollected.toFixed(2),
    j.ytdRemitted.toFixed(2),
    j.taxRate.toString(),
    j.filingFrequency,
    j.nextFilingDate.toISOString().split("T")[0],
    j.registrationNumber,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function generateComplianceCSV(
  overview: ComplianceOverview,
  jurisdictions: Jurisdiction[]
): string {
  const summaryHeaders = ["Metric", "Value"];
  const summaryRows = [
    ["Compliance Score", overview.score.toString()],
    ["Trend", overview.trend],
    ["Total Jurisdictions", overview.totalJurisdictions.toString()],
    ["Compliant", overview.compliantCount.toString()],
    ["At Risk", overview.atRiskCount.toString()],
    ["Non-Compliant", overview.nonCompliantCount.toString()],
    ["Total Liability", `$${overview.totalLiability.toLocaleString()}`],
    ["YTD Collected", `$${overview.ytdCollected.toLocaleString()}`],
    ["Upcoming Filings", overview.upcomingFilings.toString()],
  ];

  const summary = [
    "COMPLIANCE SUMMARY",
    summaryHeaders.join(","),
    ...summaryRows.map((row) => row.join(",")),
  ].join("\n");

  const breakdownHeaders = ["Jurisdiction", "Status", "Liability", "Action Required"];
  const breakdownRows = jurisdictions.map((j) => [
    j.name,
    j.status,
    `$${j.currentLiability.toLocaleString()}`,
    j.status === "non_compliant"
      ? "Immediate action required"
      : j.status === "at_risk"
      ? "Review recommended"
      : "No action needed",
  ]);

  const breakdown = [
    "",
    "JURISDICTION BREAKDOWN",
    breakdownHeaders.join(","),
    ...breakdownRows.map((row) => row.join(",")),
  ].join("\n");

  return summary + breakdown;
}

export function generateFullExportJSON(data: ExportData): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    overview: {
      ...data.overview,
    },
    jurisdictions: data.jurisdictions.map((j) => ({
      ...j,
      nextFilingDate: j.nextFilingDate.toISOString(),
      lastFilingDate: j.lastFilingDate?.toISOString() || null,
    })),
    alerts: data.alerts.map((a) => ({
      ...a,
      dueDate: a.dueDate?.toISOString() || null,
      createdAt: a.createdAt.toISOString(),
    })),
    filingEvents: data.filingEvents.map((f) => ({
      ...f,
      dueDate: f.dueDate.toISOString(),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportData(
  type: ExportType,
  data: ExportData
): { filename: string; success: boolean } {
  const timestamp = new Date().toISOString().split("T")[0];

  try {
    switch (type) {
      case "jurisdictions": {
        const csv = generateJurisdictionCSV(data.jurisdictions);
        downloadFile(csv, `jurisdictions-${timestamp}.csv`, "text/csv");
        return { filename: `jurisdictions-${timestamp}.csv`, success: true };
      }
      case "compliance": {
        const csv = generateComplianceCSV(data.overview, data.jurisdictions);
        downloadFile(csv, `compliance-report-${timestamp}.csv`, "text/csv");
        return { filename: `compliance-report-${timestamp}.csv`, success: true };
      }
      case "full": {
        const json = generateFullExportJSON(data);
        downloadFile(json, `dashboard-export-${timestamp}.json`, "application/json");
        return { filename: `dashboard-export-${timestamp}.json`, success: true };
      }
      default:
        return { filename: "", success: false };
    }
  } catch (error) {
    console.error("Export failed:", error);
    return { filename: "", success: false };
  }
}
