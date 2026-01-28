"use client";

import { X, Calendar, DollarSign, FileText, Clock, TrendingUp } from "lucide-react";
import { Jurisdiction, Transaction } from "@/types/compliance";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { generateTransactions } from "@/lib/mock-data";
import { useEffect, useState } from "react";

interface JurisdictionModalProps {
  jurisdiction: Jurisdiction;
  onClose: () => void;
}

const statusConfig = {
  compliant: { label: "Compliant", badgeClass: "badge-success" },
  at_risk: { label: "At Risk", badgeClass: "badge-warning" },
  non_compliant: { label: "Non-Compliant", badgeClass: "badge-danger" },
  pending: { label: "Pending", badgeClass: "badge-neutral" },
};

const flagEmojis: Record<string, string> = {
  CA: "🇺🇸",
  TX: "🇺🇸",
  NY: "🇺🇸",
  FL: "🇺🇸",
  UK: "🇬🇧",
  DE: "🇩🇪",
};

export function JurisdictionModal({ jurisdiction, onClose }: JurisdictionModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const config = statusConfig[jurisdiction.status];

  useEffect(() => {
    setTransactions(generateTransactions(jurisdiction.id));
  }, [jurisdiction.id]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="modal-content animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{flagEmojis[jurisdiction.code] || "🌍"}</span>
            <div>
              <h2 className="text-xl font-bold text-foreground">{jurisdiction.name}</h2>
              <p className="text-sm text-muted">
                {jurisdiction.type === "vat" ? "VAT" : "Sales Tax"} ·{" "}
                {jurisdiction.registrationNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("badge", config.badgeClass)}>{config.label}</span>
            <button className="btn btn-ghost p-2" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Current Liability</span>
              </div>
              <p className="text-xl font-bold text-danger">
                {formatCurrency(jurisdiction.currentLiability)}
              </p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">YTD Collected</span>
              </div>
              <p className="text-xl font-bold text-success">
                {formatCurrency(jurisdiction.ytdCollected)}
              </p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs">YTD Remitted</span>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(jurisdiction.ytdRemitted)}
              </p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Tax Rate</span>
              </div>
              <p className="text-xl font-bold">{jurisdiction.taxRate}%</p>
            </div>
          </div>

          {/* Filing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Filing Schedule
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Frequency</span>
                  <span className="font-medium capitalize">{jurisdiction.filingFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Next Filing</span>
                  <span className="font-medium">{formatDate(jurisdiction.nextFilingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Last Filing</span>
                  <span className="font-medium">
                    {jurisdiction.lastFilingDate
                      ? formatDate(jurisdiction.lastFilingDate)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Registration Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Registration #</span>
                  <span className="font-mono text-xs">{jurisdiction.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Jurisdiction Code</span>
                  <span className="font-medium">{jurisdiction.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Type</span>
                  <span className="font-medium capitalize">{jurisdiction.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h4 className="font-semibold mb-3">Recent Transactions</h4>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted">Date</th>
                    <th className="text-left p-3 font-medium text-muted">Order ID</th>
                    <th className="text-left p-3 font-medium text-muted">Customer</th>
                    <th className="text-right p-3 font-medium text-muted">Amount</th>
                    <th className="text-right p-3 font-medium text-muted">Tax</th>
                    <th className="text-center p-3 font-medium text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((txn) => (
                    <tr key={txn.id} className="border-t border-border hover:bg-surface/50">
                      <td className="p-3">{formatDate(txn.date)}</td>
                      <td className="p-3 font-mono text-xs">{txn.orderId}</td>
                      <td className="p-3">{txn.customer}</td>
                      <td className={cn("p-3 text-right", txn.amount < 0 && "text-danger")}>
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className={cn("p-3 text-right", txn.taxAmount < 0 && "text-danger")}>
                        {formatCurrency(txn.taxAmount)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={cn(
                            "badge text-xs",
                            txn.status === "completed" && "badge-success",
                            txn.status === "pending" && "badge-warning",
                            txn.status === "failed" && "badge-danger"
                          )}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary">
            <FileText className="w-4 h-4" />
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
