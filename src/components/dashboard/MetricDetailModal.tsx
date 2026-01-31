"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Receipt, Calendar, TrendingUp } from "lucide-react";
import { Jurisdiction, FilingEvent } from "@/types/compliance";
import { formatCurrency, cn } from "@/lib/utils";

type MetricType = "liability" | "ytdCollected" | "upcomingFilings";

interface MetricDetailModalProps {
  metric: MetricType;
  jurisdictions: Jurisdiction[];
  filingEvents: FilingEvent[];
  onClose: () => void;
  onViewJurisdiction: (jurisdiction: Jurisdiction) => void;
}

const metricConfig = {
  liability: {
    title: "Current Tax Liability",
    subtitle: "Breakdown by jurisdiction",
    icon: DollarSign,
    iconColor: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
    getValue: (j: Jurisdiction) => j.currentLiability,
  },
  ytdCollected: {
    title: "Year-to-Date Collected",
    subtitle: "Tax collected by jurisdiction",
    icon: Receipt,
    iconColor: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    getValue: (j: Jurisdiction) => j.ytdCollected,
  },
  upcomingFilings: {
    title: "Upcoming Filings",
    subtitle: "Next 30 days by jurisdiction",
    icon: Calendar,
    iconColor: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
    getValue: (j: Jurisdiction) => j.currentLiability,
  },
};

const flagEmojis: Record<string, string> = {
  CA: "🇺🇸",
  TX: "🇺🇸",
  NY: "🇺🇸",
  FL: "🇺🇸",
  UK: "🇬🇧",
  DE: "🇩🇪",
};

export function MetricDetailModal({
  metric,
  jurisdictions,
  filingEvents,
  onClose,
  onViewJurisdiction,
}: MetricDetailModalProps) {
  const config = metricConfig[metric];
  const Icon = config.icon;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Sort jurisdictions by value (descending)
  const sortedJurisdictions = [...jurisdictions].sort(
    (a, b) => config.getValue(b) - config.getValue(a)
  );

  const total = jurisdictions.reduce((sum, j) => sum + config.getValue(j), 0);
  const maxValue = Math.max(...jurisdictions.map((j) => config.getValue(j)));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="modal-content max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-xl border", config.bgColor, config.borderColor)}>
              <Icon className={cn("w-6 h-6", config.iconColor)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{config.title}</h2>
              <p className="text-sm text-foreground-muted">{config.subtitle}</p>
            </div>
          </div>
          <button className="btn btn-ghost p-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {sortedJurisdictions.map((jurisdiction) => {
            const value = config.getValue(jurisdiction);
            const percentage = (value / maxValue) * 100;

            return (
              <div
                key={jurisdiction.id}
                onClick={() => onViewJurisdiction(jurisdiction)}
                className="card card-interactive p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {flagEmojis[jurisdiction.code] || "🌍"}
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">{jurisdiction.name}</h4>
                      <p className="text-xs text-foreground-muted">
                        {jurisdiction.type === "vat" ? "VAT" : "Sales Tax"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(value)}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {((value / total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={cn("h-full rounded-full", config.bgColor.replace("/10", ""))}
                    style={{
                      backgroundColor:
                        metric === "liability"
                          ? "var(--danger)"
                          : metric === "ytdCollected"
                          ? "var(--success)"
                          : "var(--info)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface/50">
          <div className="flex items-center gap-2 text-foreground-muted">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(total)}</p>
        </div>
      </motion.div>
    </div>
  );
}
