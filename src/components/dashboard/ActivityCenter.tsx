"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { FilingEvent, ComplianceAlert } from "@/types/compliance";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

interface ActivityCenterProps {
  filingEvents: FilingEvent[];
  alerts: ComplianceAlert[];
  onFilingClick: (date: Date, events: FilingEvent[]) => void;
  onAlertClick: (alert: ComplianceAlert) => void;
}

const statusConfig = {
  overdue: {
    label: "Overdue",
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    dot: "bg-danger",
  },
  due_soon: {
    label: "Due Soon",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    dot: "bg-warning",
  },
  upcoming: {
    label: "Upcoming",
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
    dot: "bg-info",
  },
  completed: {
    label: "Completed",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    dot: "bg-success",
  },
};

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
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

function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function ActivityCenter({
  filingEvents,
  alerts,
  onFilingClick,
  onAlertClick,
}: ActivityCenterProps) {
  // Sort filings by date
  const sortedFilings = [...filingEvents].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Group alerts by severity
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");
  const infoAlerts = alerts.filter((a) => a.severity === "info");
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="card p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
        <h3 className="text-lg font-semibold text-foreground">Activity Center</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left: Filings Timeline */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Upcoming Filings</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-foreground-muted">
              {filingEvents.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {sortedFilings.map((filing, index) => {
              const config = statusConfig[filing.status];
              const daysUntil = getDaysUntil(filing.dueDate);

              return (
                <motion.div
                  key={filing.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onFilingClick(filing.dueDate, [filing])}
                  className={cn(
                    "relative pl-6 pb-3 cursor-pointer group",
                    index !== sortedFilings.length - 1 && "border-l-2 border-border ml-2"
                  )}
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute -left-[5px] top-1.5 w-3 h-3 rounded-full border-2 border-background",
                      config.dot
                    )}
                  />

                  <div
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      config.bg,
                      config.border,
                      "group-hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {flagEmojis[filing.jurisdictionCode] || "🌍"}
                        </span>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {filing.jurisdictionName}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {formatCurrency(filing.estimatedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-xs font-medium", config.color)}>
                          {daysUntil < 0
                            ? `${Math.abs(daysUntil)}d overdue`
                            : daysUntil === 0
                            ? "Today"
                            : `${daysUntil}d`}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {formatDate(filing.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Alerts */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Alerts</h4>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-danger text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Severity Summary */}
          <div className="flex items-center gap-3 mb-4">
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-danger" />
                <span className="text-foreground-muted">
                  {criticalAlerts.length} Critical
                </span>
              </div>
            )}
            {warningAlerts.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-foreground-muted">
                  {warningAlerts.length} Warning
                </span>
              </div>
            )}
            {infoAlerts.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-info" />
                <span className="text-foreground-muted">{infoAlerts.length} Info</span>
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
            {alerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onAlertClick(alert)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    config.bg,
                    config.border,
                    "hover:border-primary/50",
                    !alert.isRead && "ring-1 ring-primary/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {alert.title}
                        </p>
                        {!alert.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-foreground-muted mt-0.5 line-clamp-1">
                        {alert.jurisdictionName}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground-muted flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-foreground-muted">
              <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
