"use client";

import { Search, X, Filter } from "lucide-react";
import { ComplianceStatus, JurisdictionType } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | ComplianceStatus;
  onStatusFilterChange: (value: "all" | ComplianceStatus) => void;
  typeFilter: "all" | JurisdictionType;
  onTypeFilterChange: (value: "all" | JurisdictionType) => void;
  resultCount: number;
  totalCount: number;
}

const statusOptions: { value: "all" | ComplianceStatus; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "compliant", label: "Compliant" },
  { value: "at_risk", label: "At Risk" },
  { value: "non_compliant", label: "Non-Compliant" },
];

const typeOptions: { value: "all" | JurisdictionType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "state", label: "Sales Tax" },
  { value: "vat", label: "VAT" },
];

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  resultCount,
  totalCount,
}: SearchFilterBarProps) {
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || typeFilter !== "all";

  const handleClearFilters = () => {
    onSearchChange("");
    onStatusFilterChange("all");
    onTypeFilterChange("all");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-xl border border-border mb-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search jurisdictions..."
          className="input pl-10 pr-4"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-foreground-subtle" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as "all" | ComplianceStatus)}
          className={cn(
            "appearance-none bg-background border border-border rounded-lg",
            "px-3 py-2 pr-8 text-sm text-foreground cursor-pointer",
            "focus:outline-none focus:border-primary",
            "bg-no-repeat bg-[right_0.5rem_center]",
            statusFilter !== "all" && "border-primary text-primary"
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value as "all" | JurisdictionType)}
        className={cn(
          "appearance-none bg-background border border-border rounded-lg",
          "px-3 py-2 pr-8 text-sm text-foreground cursor-pointer",
          "focus:outline-none focus:border-primary",
          "bg-no-repeat bg-[right_0.5rem_center]",
          typeFilter !== "all" && "border-primary text-primary"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        }}
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="btn btn-ghost text-sm px-3 py-2 text-foreground-muted hover:text-foreground"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}

      {/* Result Count */}
      <div className="ml-auto text-sm text-foreground-muted">
        Showing <span className="font-medium text-foreground">{resultCount}</span> of{" "}
        <span className="font-medium text-foreground">{totalCount}</span>
      </div>
    </div>
  );
}
