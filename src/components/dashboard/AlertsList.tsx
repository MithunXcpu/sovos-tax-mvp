"use client";

import { AlertTriangle, Info, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { ComplianceAlert } from "@/types/compliance";
import { formatDate, cn } from "@/lib/utils";

interface AlertsListProps {
  alerts: ComplianceAlert[];
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
    iconColor: "text-danger",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    iconColor: "text-warning",
  },
  info: {
    icon: Info,
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
    iconColor: "text-info",
  },
};

export function AlertsList({ alerts }: AlertsListProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
          {unreadCount > 0 && (
            <span className="badge badge-danger">{unreadCount} new</span>
          )}
        </div>
        <button className="btn btn-ghost text-sm">View All</button>
      </div>

      <div className="space-y-3">
        {sortedAlerts.slice(0, 4).map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50",
                config.bgColor,
                config.borderColor,
                !alert.isRead && "ring-1 ring-primary/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-1.5 rounded-lg", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{alert.title}</span>
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-muted line-clamp-2">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-subtle">
                    <span>{alert.jurisdictionName}</span>
                    {alert.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(alert.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8 text-muted">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No active alerts</p>
        </div>
      )}
    </div>
  );
}
