"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSearch,
  TrendingUp,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface ReconciliationStats {
  totalTransactions: number;
  matched: number;
  discrepancies: number;
  autoResolved: number;
  accuracyRate: number;
}

const stats: ReconciliationStats = {
  totalTransactions: 24847,
  matched: 24831,
  discrepancies: 16,
  autoResolved: 14,
  accuracyRate: 99.94,
};

export function ReconciliationCard() {
  const pendingDiscrepancies = stats.discrepancies - stats.autoResolved;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-info/10 border border-info/30">
            <FileSearch className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tax Reconciliation</h3>
            <p className="text-xs text-foreground-muted">This month's accuracy</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-success">{stats.accuracyRate}%</p>
          <p className="text-xs text-foreground-muted">accuracy rate</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-4">
        {/* Progress bars */}
        <div className="space-y-3">
          {/* Matched */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-foreground">Matched</span>
              </div>
              <span className="text-foreground-muted">{stats.matched.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.matched / stats.totalTransactions) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-success rounded-full"
              />
            </div>
          </div>

          {/* Auto-Resolved */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-info" />
                <span className="text-foreground">Auto-Resolved</span>
              </div>
              <span className="text-foreground-muted">{stats.autoResolved}</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.autoResolved / stats.discrepancies) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full bg-info rounded-full"
              />
            </div>
          </div>

          {/* Pending Review */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-foreground">Pending Review</span>
              </div>
              <span className="text-foreground-muted">{pendingDiscrepancies}</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(pendingDiscrepancies / stats.discrepancies) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-warning rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 rounded-xl bg-success/5 border border-success/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium">87.5% auto-resolution rate</span>
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                Sovos AI automatically resolved 14 of 16 discrepancies this month
              </p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-foreground-muted text-center">
            vs. industry average: <span className="text-success font-medium">+12.4%</span> better accuracy
          </p>
        </div>
      </div>
    </motion.div>
  );
}
