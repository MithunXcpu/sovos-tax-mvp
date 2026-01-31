"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Percent, MapPin, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxRateInfo {
  code: string;
  name: string;
  rate: number;
  type: "Sales Tax" | "VAT";
  effectiveDate: string;
  notes?: string;
}

const taxRates: TaxRateInfo[] = [
  { code: "CA", name: "California", rate: 7.25, type: "Sales Tax", effectiveDate: "Jan 1, 2024", notes: "Base rate, local rates may apply" },
  { code: "TX", name: "Texas", rate: 6.25, type: "Sales Tax", effectiveDate: "Oct 1, 2023" },
  { code: "NY", name: "New York", rate: 8.0, type: "Sales Tax", effectiveDate: "Jun 1, 2023", notes: "State + NYC local rate" },
  { code: "FL", name: "Florida", rate: 6.0, type: "Sales Tax", effectiveDate: "Jan 1, 2024" },
  { code: "UK", name: "United Kingdom", rate: 20.0, type: "VAT", effectiveDate: "Jan 4, 2011" },
  { code: "DE", name: "Germany", rate: 19.0, type: "VAT", effectiveDate: "Jan 1, 2007" },
];

interface TaxRateLookupProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function TaxRateLookup({ onClose, isModal = false }: TaxRateLookupProps) {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<TaxRateInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRates = taxRates.filter(
    (rate) =>
      rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = (
    <div className={cn("card", isModal && "max-w-md w-full")}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tax Rate Lookup</h3>
            <p className="text-xs text-foreground-muted">Quick rate reference</p>
          </div>
        </div>
        {isModal && onClose && (
          <button onClick={onClose} className="btn btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown Selector */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-surface hover:bg-surface/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground-muted" />
              <span className={selectedJurisdiction ? "text-foreground" : "text-foreground-muted"}>
                {selectedJurisdiction ? selectedJurisdiction.name : "Select jurisdiction..."}
              </span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-foreground-muted transition-transform", isOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 top-full left-0 right-0 mt-2 bg-background-elevated border border-border rounded-xl shadow-xl overflow-hidden"
              >
                {/* Search */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredRates.map((rate) => (
                    <button
                      key={rate.code}
                      onClick={() => {
                        setSelectedJurisdiction(rate);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 hover:bg-surface transition-colors",
                        selectedJurisdiction?.code === rate.code && "bg-primary/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {rate.type === "VAT" ? (rate.code === "UK" ? "🇬🇧" : "🇩🇪") : "🇺🇸"}
                        </span>
                        <span className="text-foreground">{rate.name}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{rate.rate}%</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Rate Details */}
        <AnimatePresence mode="wait">
          {selectedJurisdiction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Tax Rate</span>
                  <span className="text-2xl font-bold text-primary">{selectedJurisdiction.rate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Type</span>
                  <span className={cn(
                    "badge",
                    selectedJurisdiction.type === "VAT" ? "badge-info" : "badge-success"
                  )}>
                    {selectedJurisdiction.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Effective
                  </span>
                  <span className="text-sm text-foreground">{selectedJurisdiction.effectiveDate}</span>
                </div>
                {selectedJurisdiction.notes && (
                  <p className="text-xs text-foreground-muted pt-2 border-t border-border">
                    {selectedJurisdiction.notes}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Reference */}
        {!selectedJurisdiction && (
          <div className="text-center py-4 text-foreground-muted">
            <Percent className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a jurisdiction to view tax rate</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
}
