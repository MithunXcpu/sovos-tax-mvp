"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Shield, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { Jurisdiction, ComplianceOverview } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface ComplianceDetailModalProps {
  overview: ComplianceOverview;
  jurisdictions: Jurisdiction[];
  onClose: () => void;
  onViewJurisdiction: (jurisdiction: Jurisdiction) => void;
}

const statusConfig = {
  compliant: {
    label: "Compliant",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
  at_risk: {
    label: "At Risk",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  non_compliant: {
    label: "Non-Compliant",
    icon: XCircle,
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
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

const recommendations = [
  "Address overdue filing for Germany VAT to improve score by ~10 points",
  "Complete pending filings before due dates to maintain compliance",
  "Review at-risk jurisdictions for potential issues",
  "Consider automating filing reminders to prevent future delays",
];

export function ComplianceDetailModal({
  overview,
  jurisdictions,
  onClose,
  onViewJurisdiction,
}: ComplianceDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const TrendIcon = overview.trend === "up" ? TrendingUp : overview.trend === "down" ? TrendingDown : Minus;

  const getScoreColor = () => {
    if (overview.score >= 80) return "text-success";
    if (overview.score >= 60) return "text-warning";
    return "text-danger";
  };

  // Group jurisdictions by status
  const grouped = {
    compliant: jurisdictions.filter((j) => j.status === "compliant"),
    at_risk: jurisdictions.filter((j) => j.status === "at_risk"),
    non_compliant: jurisdictions.filter((j) => j.status === "non_compliant"),
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="modal-content max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Compliance Score Details</h2>
              <p className="text-sm text-foreground-muted">
                Factors affecting your compliance score
              </p>
            </div>
          </div>
          <button className="btn btn-ghost p-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className={cn("text-5xl font-bold", getScoreColor())}>{overview.score}</p>
              <p className="text-sm text-foreground-muted">out of 100</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendIcon
                  className={cn(
                    "w-5 h-5",
                    overview.trend === "up" && "text-success",
                    overview.trend === "down" && "text-danger",
                    overview.trend === "stable" && "text-foreground-muted"
                  )}
                />
                <span className="text-sm text-foreground-muted">
                  {overview.trend === "up"
                    ? "Improving"
                    : overview.trend === "down"
                    ? "Declining"
                    : "Stable"}{" "}
                  from last month
                </span>
              </div>
              <div className="h-3 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overview.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      overview.score >= 80
                        ? "var(--success)"
                        : overview.score >= 60
                        ? "var(--warning)"
                        : "var(--danger)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {/* Jurisdiction Groups */}
          {(["non_compliant", "at_risk", "compliant"] as const).map((status) => {
            const config = statusConfig[status];
            const items = grouped[status];
            if (items.length === 0) return null;

            const Icon = config.icon;

            return (
              <div key={status} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <h3 className="font-medium text-foreground">{config.label}</h3>
                  <span className="text-sm text-foreground-muted">({items.length})</span>
                </div>
                <div className="space-y-2">
                  {items.map((jurisdiction) => (
                    <div
                      key={jurisdiction.id}
                      onClick={() => onViewJurisdiction(jurisdiction)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                        config.bg,
                        config.border,
                        "hover:border-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {flagEmojis[jurisdiction.code] || "🌍"}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{jurisdiction.name}</p>
                          <p className="text-xs text-foreground-muted">
                            {jurisdiction.type === "vat" ? "VAT" : "Sales Tax"}
                          </p>
                        </div>
                      </div>
                      <span className={cn("badge", `badge-${status === "compliant" ? "success" : status === "at_risk" ? "warning" : "danger"}`)}>
                        {config.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Recommendations */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground-muted">
                  <span className="text-primary mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
