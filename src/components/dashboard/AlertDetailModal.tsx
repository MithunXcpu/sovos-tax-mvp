"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, AlertCircle, AlertTriangle, Info, Clock, MapPin, Bell, BellOff } from "lucide-react";
import { ComplianceAlert } from "@/types/compliance";
import { formatDate, cn } from "@/lib/utils";

interface AlertDetailModalProps {
  alert: ComplianceAlert;
  onClose: () => void;
  onDismiss: (alertId: string) => void;
  onSnooze: (alertId: string, duration: "day" | "week") => void;
  onMarkRead: (alertId: string) => void;
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bgClass: "bg-danger/10",
    borderClass: "border-danger/30",
    iconClass: "text-danger",
    badgeClass: "badge-danger",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
    iconClass: "text-warning",
    badgeClass: "badge-warning",
  },
  info: {
    icon: Info,
    bgClass: "bg-info/10",
    borderClass: "border-info/30",
    iconClass: "text-info",
    badgeClass: "badge-info",
  },
};

export function AlertDetailModal({
  alert,
  onClose,
  onDismiss,
  onSnooze,
  onMarkRead,
}: AlertDetailModalProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn("p-6 border-b border-border", config.bgClass)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-xl", config.bgClass, config.borderClass, "border")}>
                <Icon className={cn("w-6 h-6", config.iconClass)} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-foreground">{alert.title}</h2>
                  {!alert.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className={cn("badge", config.badgeClass)}>{alert.severity}</span>
              </div>
            </div>
            <button className="btn btn-ghost p-2" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-foreground-muted mb-2">Description</h3>
            <p className="text-foreground leading-relaxed">{alert.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-foreground-muted mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Jurisdiction</span>
              </div>
              <p className="font-medium">{alert.jurisdictionName}</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-foreground-muted mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Created</span>
              </div>
              <p className="font-medium">{formatDate(alert.createdAt)}</p>
            </div>

            {alert.dueDate && (
              <div className="card p-4 col-span-2">
                <div className="flex items-center gap-2 text-foreground-muted mb-1">
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Due Date</span>
                </div>
                <p className="font-medium">{formatDate(alert.dueDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface/50">
          <div className="flex items-center gap-2">
            {!alert.isRead && (
              <button
                onClick={() => onMarkRead(alert.id)}
                className="btn btn-ghost text-sm"
              >
                Mark as Read
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="btn btn-secondary text-sm">
                <BellOff className="w-4 h-4" />
                Snooze
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-background-elevated border border-border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => onSnooze(alert.id, "day")}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-surface"
                  >
                    Snooze 1 Day
                  </button>
                  <button
                    onClick={() => onSnooze(alert.id, "week")}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-surface"
                  >
                    Snooze 1 Week
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className="btn btn-primary text-sm"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
