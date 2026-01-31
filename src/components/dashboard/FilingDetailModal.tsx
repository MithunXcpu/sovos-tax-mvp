"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, FileText, DollarSign } from "lucide-react";
import { FilingEvent } from "@/types/compliance";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

interface FilingDetailModalProps {
  date: Date;
  events: FilingEvent[];
  onClose: () => void;
  onViewJurisdiction: (jurisdictionId: string) => void;
}

const statusConfig = {
  overdue: { label: "Overdue", badgeClass: "badge-danger" },
  due_soon: { label: "Due Soon", badgeClass: "badge-warning" },
  upcoming: { label: "Upcoming", badgeClass: "badge-info" },
  completed: { label: "Completed", badgeClass: "badge-success" },
};

const flagEmojis: Record<string, string> = {
  CA: "🇺🇸",
  TX: "🇺🇸",
  NY: "🇺🇸",
  FL: "🇺🇸",
  UK: "🇬🇧",
  DE: "🇩🇪",
};

export function FilingDetailModal({
  date,
  events,
  onClose,
  onViewJurisdiction,
}: FilingDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const totalAmount = events.reduce((sum, e) => sum + e.estimatedAmount, 0);

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
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Filings for {formatDate(date)}
              </h2>
              <p className="text-sm text-foreground-muted">
                {events.length} filing{events.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>
          </div>
          <button className="btn btn-ghost p-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8 text-foreground-muted">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No filings scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const config = statusConfig[event.status];
                return (
                  <div
                    key={event.id}
                    onClick={() => onViewJurisdiction(event.jurisdictionId)}
                    className="card card-interactive p-4 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {flagEmojis[event.jurisdictionCode] || "🌍"}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              {event.jurisdictionName}
                            </h4>
                            <span className={cn("badge text-xs", config.badgeClass)}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-sm text-foreground-muted capitalize">
                            {event.type} Filing
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatCurrency(event.estimatedAmount)}
                        </p>
                        <p className="text-xs text-foreground-muted">Estimated</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {events.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-border bg-surface/50">
            <div className="flex items-center gap-2 text-foreground-muted">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Total Estimated</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
