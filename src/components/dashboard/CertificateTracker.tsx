"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck, AlertCircle, Clock, FileX, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateDetailModal } from "./CertificateDetailModal";

interface CertificateStats {
  valid: number;
  expiringSoon: number;
  expired: number;
  missing: number;
}

// Mock certificate data
const certificateStats: CertificateStats = {
  valid: 42,
  expiringSoon: 8,
  expired: 3,
  missing: 5,
};

export function CertificateTracker() {
  const [showModal, setShowModal] = useState(false);
  const total = certificateStats.valid + certificateStats.expiringSoon + certificateStats.expired + certificateStats.missing;
  const validPercent = (certificateStats.valid / total) * 100;
  const expiringPercent = (certificateStats.expiringSoon / total) * 100;
  const expiredPercent = (certificateStats.expired / total) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 border border-success/30">
              <FileCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Exemption Certificates</h3>
              <p className="text-xs text-foreground-muted">Certificate status tracker</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-ghost text-sm gap-1 text-primary hover:bg-primary/10"
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Valid */}
            <div className="p-3 rounded-xl bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-4 h-4 text-success" />
                <span className="text-xs text-foreground-muted">Valid</span>
              </div>
              <p className="text-2xl font-bold text-success">{certificateStats.valid}</p>
            </div>

            {/* Expiring Soon */}
            <button
              onClick={() => setShowModal(true)}
              className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-left hover:bg-warning/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-xs text-foreground-muted">Expiring</span>
              </div>
              <p className="text-2xl font-bold text-warning">{certificateStats.expiringSoon}</p>
            </button>

            {/* Expired */}
            <button
              onClick={() => setShowModal(true)}
              className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-left hover:bg-danger/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-danger" />
                <span className="text-xs text-foreground-muted">Expired</span>
              </div>
              <p className="text-2xl font-bold text-danger">{certificateStats.expired}</p>
            </button>

            {/* Missing */}
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2 mb-1">
                <FileX className="w-4 h-4 text-foreground-muted" />
                <span className="text-xs text-foreground-muted">Missing</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{certificateStats.missing}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Certificate Health</span>
              <span>{validPercent.toFixed(0)}% valid</span>
            </div>
            <div className="h-3 bg-surface rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${validPercent}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full bg-success"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expiringPercent}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-warning"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expiredPercent}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full bg-danger"
              />
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-foreground-muted">Valid</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-foreground-muted">Expiring</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-danger" />
                <span className="text-foreground-muted">Expired</span>
              </div>
            </div>
          </div>

          {/* Action Items */}
          {(certificateStats.expiringSoon > 0 || certificateStats.expired > 0) && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full p-3 rounded-xl bg-warning/5 border border-warning/20 text-left hover:bg-warning/10 transition-colors"
            >
              <p className="text-sm text-foreground">
                <span className="font-medium">Action needed:</span>{" "}
                {certificateStats.expiringSoon > 0 && (
                  <span>{certificateStats.expiringSoon} certificates expiring within 30 days. </span>
                )}
                {certificateStats.expired > 0 && (
                  <span>{certificateStats.expired} certificates need renewal.</span>
                )}
              </p>
            </button>
          )}
        </div>
      </motion.div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <CertificateDetailModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
