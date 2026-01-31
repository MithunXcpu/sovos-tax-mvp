"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, FileCheck, AlertCircle, Clock, FileX, Building2, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/ToastContext";

interface Certificate {
  id: string;
  customerName: string;
  certificateType: string;
  state: string;
  expirationDate: Date;
  status: "valid" | "expiring" | "expired" | "missing";
  email?: string;
}

// Mock certificate data
const certificates: Certificate[] = [
  // Expired
  { id: "cert-1", customerName: "Acme Corporation", certificateType: "Resale Certificate", state: "California", expirationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: "expired", email: "tax@acme.com" },
  { id: "cert-2", customerName: "TechStart Inc", certificateType: "Exempt Organization", state: "New York", expirationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: "expired", email: "finance@techstart.com" },
  { id: "cert-3", customerName: "Global Retail LLC", certificateType: "Resale Certificate", state: "Texas", expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "expired", email: "accounts@globalretail.com" },
  // Expiring
  { id: "cert-4", customerName: "Enterprise Solutions", certificateType: "Manufacturing Exemption", state: "Florida", expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: "expiring", email: "tax@enterprise.com" },
  { id: "cert-5", customerName: "Cloud Systems Ltd", certificateType: "Resale Certificate", state: "California", expirationDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), status: "expiring", email: "billing@cloudsystems.com" },
  { id: "cert-6", customerName: "Digital Commerce Co", certificateType: "Resale Certificate", state: "New York", expirationDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), status: "expiring", email: "tax@digitalcommerce.com" },
  { id: "cert-7", customerName: "Smart Shop Inc", certificateType: "Exempt Organization", state: "Texas", expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), status: "expiring", email: "finance@smartshop.com" },
  { id: "cert-8", customerName: "E-Commerce Plus", certificateType: "Resale Certificate", state: "Florida", expirationDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), status: "expiring", email: "accounts@ecommerceplus.com" },
  { id: "cert-9", customerName: "Retail Giants Corp", certificateType: "Manufacturing Exemption", state: "California", expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: "expiring", email: "tax@retailgiants.com" },
  { id: "cert-10", customerName: "Tech Wholesale LLC", certificateType: "Resale Certificate", state: "New York", expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: "expiring", email: "compliance@techwholesale.com" },
  { id: "cert-11", customerName: "Green Energy Systems", certificateType: "Exempt Organization", state: "Texas", expirationDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), status: "expiring", email: "finance@greenenergy.com" },
];

interface CertificateDetailModalProps {
  onClose: () => void;
}

export function CertificateDetailModal({ onClose }: CertificateDetailModalProps) {
  const { addToast } = useToast();

  const expiredCerts = certificates.filter((c) => c.status === "expired");
  const expiringCerts = certificates.filter((c) => c.status === "expiring");

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysText = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return "Today";
    return `in ${days} days`;
  };

  const handleRequestRenewal = (cert: Certificate) => {
    addToast("success", `Renewal request sent to ${cert.email}`);
  };

  const statusConfig = {
    expired: {
      icon: AlertCircle,
      bg: "bg-danger/10",
      border: "border-danger/30",
      text: "text-danger",
      badge: "badge-danger",
    },
    expiring: {
      icon: Clock,
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      badge: "badge-warning",
    },
    valid: {
      icon: FileCheck,
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      badge: "badge-success",
    },
    missing: {
      icon: FileX,
      bg: "bg-surface",
      border: "border-border",
      text: "text-foreground-muted",
      badge: "badge-neutral",
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="modal-content max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 border border-success/30">
              <FileCheck className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Exemption Certificates</h2>
              <p className="text-sm text-foreground-muted">Manage certificate renewals</p>
            </div>
          </div>
          <button className="btn btn-ghost p-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Expired Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-danger" />
              <h3 className="font-semibold text-foreground">Expired ({expiredCerts.length})</h3>
              <span className="text-xs text-foreground-muted">Requires immediate action</span>
            </div>
            <div className="space-y-2">
              {expiredCerts.map((cert) => {
                const config = statusConfig[cert.status];
                return (
                  <div
                    key={cert.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-foreground-muted mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">{cert.customerName}</h4>
                          <p className="text-sm text-foreground-muted">{cert.certificateType}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-foreground-muted">
                            <span>{cert.state}</span>
                            <span className={config.text}>
                              Expired {getDaysText(cert.expirationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRequestRenewal(cert)}
                        className="btn btn-ghost text-xs gap-1 text-primary hover:bg-primary/10"
                      >
                        <Mail className="w-3 h-3" />
                        Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expiring Soon Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">Expiring Soon ({expiringCerts.length})</h3>
              <span className="text-xs text-foreground-muted">Within 30 days</span>
            </div>
            <div className="space-y-2">
              {expiringCerts.map((cert) => {
                const config = statusConfig[cert.status];
                return (
                  <div
                    key={cert.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-foreground-muted mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">{cert.customerName}</h4>
                          <p className="text-sm text-foreground-muted">{cert.certificateType}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-foreground-muted">
                            <span>{cert.state}</span>
                            <span className={config.text}>
                              Expires {getDaysText(cert.expirationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRequestRenewal(cert)}
                        className="btn btn-ghost text-xs gap-1 text-primary hover:bg-primary/10"
                      >
                        <Mail className="w-3 h-3" />
                        Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground-muted">
              {expiredCerts.length + expiringCerts.length} certificates need attention
            </p>
            <button
              onClick={() => {
                certificates.forEach((c) => {
                  if (c.status === "expired" || c.status === "expiring") {
                    handleRequestRenewal(c);
                  }
                });
                onClose();
              }}
              className="btn btn-primary"
            >
              Request All Renewals
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
