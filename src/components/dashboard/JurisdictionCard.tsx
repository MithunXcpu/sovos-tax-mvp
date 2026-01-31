"use client";

import { Calendar, ArrowRight, Eye, Download, Bell, ExternalLink } from "lucide-react";
import { Jurisdiction } from "@/types/compliance";
import { formatCurrency, getDaysUntil, cn } from "@/lib/utils";
import { DropdownMenu, DropdownItem } from "@/components/ui/DropdownMenu";
import { useToast } from "@/contexts/ToastContext";

interface JurisdictionCardProps {
  jurisdiction: Jurisdiction;
  onClick: () => void;
}

const statusConfig = {
  compliant: {
    label: "Compliant",
    badgeClass: "badge-success",
    dotClass: "status-dot-success",
  },
  at_risk: {
    label: "At Risk",
    badgeClass: "badge-warning",
    dotClass: "status-dot-warning",
  },
  non_compliant: {
    label: "Non-Compliant",
    badgeClass: "badge-danger",
    dotClass: "status-dot-danger",
  },
  pending: {
    label: "Pending",
    badgeClass: "badge-neutral",
    dotClass: "",
  },
};

const typeLabels = {
  state: "Sales Tax",
  country: "Tax",
  vat: "VAT",
};

const flagEmojis: Record<string, string> = {
  CA: "🇺🇸",
  TX: "🇺🇸",
  NY: "🇺🇸",
  FL: "🇺🇸",
  UK: "🇬🇧",
  DE: "🇩🇪",
};

export function JurisdictionCard({ jurisdiction, onClick }: JurisdictionCardProps) {
  const config = statusConfig[jurisdiction.status];
  const daysUntilFiling = getDaysUntil(jurisdiction.nextFilingDate);
  const isOverdue = daysUntilFiling < 0;
  const { addToast } = useToast();

  const dropdownItems: DropdownItem[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: () => onClick(),
    },
    {
      id: "export",
      label: "Export Data",
      icon: Download,
      onClick: () => {
        addToast("success", `Exported data for ${jurisdiction.name}`);
      },
    },
    {
      id: "reminder",
      label: "Set Reminder",
      icon: Bell,
      onClick: () => {
        addToast("info", `Reminder set for ${jurisdiction.name} filing`);
      },
    },
    {
      id: "portal",
      label: "Open Tax Portal",
      icon: ExternalLink,
      onClick: () => {
        addToast("info", `Opening ${jurisdiction.name} tax portal...`);
      },
    },
  ];

  return (
    <div className="card card-interactive group" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{flagEmojis[jurisdiction.code] || "🌍"}</span>
          <div>
            <h4 className="font-semibold text-foreground">{jurisdiction.name}</h4>
            <p className="text-xs text-muted">{typeLabels[jurisdiction.type]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("badge", config.badgeClass)}>{config.label}</span>
          <DropdownMenu items={dropdownItems} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Current Liability */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Current Liability</span>
          <span className="font-semibold">{formatCurrency(jurisdiction.currentLiability)}</span>
        </div>

        {/* Tax Rate */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Tax Rate</span>
          <span className="font-medium">{jurisdiction.taxRate}%</span>
        </div>

        {/* Next Filing */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Next Filing
          </span>
          <span
            className={cn(
              "text-sm font-medium",
              isOverdue && "text-danger",
              !isOverdue && daysUntilFiling <= 7 && "text-warning",
              !isOverdue && daysUntilFiling > 7 && "text-foreground"
            )}
          >
            {isOverdue
              ? `${Math.abs(daysUntilFiling)} days overdue`
              : daysUntilFiling === 0
              ? "Due today"
              : `${daysUntilFiling} days`}
          </span>
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted">View details</span>
        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
