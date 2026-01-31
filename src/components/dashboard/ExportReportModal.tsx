"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Download, FileSpreadsheet, FileJson, FileText, Check, Loader2 } from "lucide-react";
import { exportData, ExportType } from "@/lib/export-utils";
import { Jurisdiction, ComplianceOverview, ComplianceAlert, FilingEvent } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface ExportReportModalProps {
  overview: ComplianceOverview;
  jurisdictions: Jurisdiction[];
  alerts: ComplianceAlert[];
  filingEvents: FilingEvent[];
  onClose: () => void;
  onExportComplete: (filename: string) => void;
}

const exportOptions = [
  {
    id: "jurisdictions" as ExportType,
    title: "Jurisdiction Summary",
    description: "Export all jurisdictions with status, liability, and tax rates",
    icon: FileSpreadsheet,
    format: "CSV",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  {
    id: "compliance" as ExportType,
    title: "Compliance Report",
    description: "Full compliance score breakdown with recommendations",
    icon: FileText,
    format: "CSV",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    id: "full" as ExportType,
    title: "Full Dashboard Export",
    description: "Complete data snapshot including alerts and filings",
    icon: FileJson,
    format: "JSON",
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
  },
];

export function ExportReportModal({
  overview,
  jurisdictions,
  alerts,
  filingEvents,
  onClose,
  onExportComplete,
}: ExportReportModalProps) {
  const [selectedType, setSelectedType] = useState<ExportType | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedType, setExportedType] = useState<ExportType | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleExport = async () => {
    if (!selectedType) return;

    setIsExporting(true);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = exportData(selectedType, {
      overview,
      jurisdictions,
      alerts,
      filingEvents,
    });

    setIsExporting(false);

    if (result.success) {
      setExportedType(selectedType);
      onExportComplete(result.filename);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

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
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Export Report</h2>
              <p className="text-sm text-foreground-muted">Choose an export format</p>
            </div>
          </div>
          <button className="btn btn-ghost p-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 space-y-3">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedType === option.id;
            const isExported = exportedType === option.id;

            return (
              <button
                key={option.id}
                onClick={() => !isExporting && setSelectedType(option.id)}
                disabled={isExporting}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  "hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface/50",
                  isExporting && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg", option.bgColor, option.borderColor, "border")}>
                    {isExported ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <Icon className={cn("w-5 h-5", option.color)} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{option.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-surface text-foreground-muted">
                        {option.format}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-muted mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button className="btn btn-secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={!selectedType || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
