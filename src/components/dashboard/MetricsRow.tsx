"use client";

import { DollarSign, Receipt, Calendar } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export type MetricType = "liability" | "ytdCollected" | "upcomingFilings";

interface MetricsRowProps {
  totalLiability: number;
  ytdCollected: number;
  upcomingFilings: number;
  onMetricClick?: (metricType: MetricType) => void;
}

export function MetricsRow({ totalLiability, ytdCollected, upcomingFilings, onMetricClick }: MetricsRowProps) {
  const metrics: {
    key: MetricType;
    label: string;
    value: string;
    icon: typeof DollarSign;
    subtext: string;
    color: string;
  }[] = [
    {
      key: "liability",
      label: "Current Liability",
      value: formatCurrency(totalLiability),
      icon: DollarSign,
      subtext: "Across all jurisdictions",
      color: "text-danger",
    },
    {
      key: "ytdCollected",
      label: "YTD Tax Collected",
      value: formatCurrency(ytdCollected),
      icon: Receipt,
      subtext: "Total collected this year",
      color: "text-success",
    },
    {
      key: "upcomingFilings",
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
        <div
          key={metric.key}
          onClick={() => onMetricClick?.(metric.key)}
          className={cn(
            "card",
            onMetricClick && "card-interactive cursor-pointer"
          )}
        >
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
