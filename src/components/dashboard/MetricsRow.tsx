"use client";

import { DollarSign, Receipt, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MetricsRowProps {
  totalLiability: number;
  ytdCollected: number;
  upcomingFilings: number;
}

export function MetricsRow({ totalLiability, ytdCollected, upcomingFilings }: MetricsRowProps) {
  const metrics = [
    {
      label: "Current Liability",
      value: formatCurrency(totalLiability),
      icon: DollarSign,
      subtext: "Across all jurisdictions",
      color: "text-danger",
    },
    {
      label: "YTD Tax Collected",
      value: formatCurrency(ytdCollected),
      icon: Receipt,
      subtext: "Total collected this year",
      color: "text-success",
    },
    {
      label: "Upcoming Filings",
      value: upcomingFilings.toString(),
      icon: Calendar,
      subtext: "Next 30 days",
      color: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-xs text-subtle mt-1">{metric.subtext}</p>
            </div>
            <div className="p-2 rounded-lg bg-surface">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
