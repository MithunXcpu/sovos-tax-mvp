"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceScoreCardProps {
  score: number;
  trend: "up" | "down" | "stable";
  compliantCount: number;
  totalJurisdictions: number;
}

export function ComplianceScoreCard({
  score,
  trend,
  compliantCount,
  totalJurisdictions,
}: ComplianceScoreCardProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Overall Compliance</h3>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === "up" && "text-success",
            trend === "down" && "text-danger",
            trend === "stable" && "text-muted"
          )}
        >
          <TrendIcon className="w-4 h-4" />
          <span>{trend === "up" ? "+5%" : trend === "down" ? "-3%" : "0%"}</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg width="160" height="160" className="circular-progress">
            {/* Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              strokeWidth="12"
              className="circular-progress-track"
            />
            {/* Fill */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              strokeWidth="12"
              className="circular-progress-fill"
              style={{
                stroke: getScoreColor(),
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: getScoreColor() }}>
              {score}
            </span>
            <span className="text-sm text-muted">out of 100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="status-dot status-dot-success" />
              <span className="text-sm text-muted">Compliant</span>
            </div>
            <span className="text-2xl font-semibold">{compliantCount}</span>
            <span className="text-muted ml-1">/ {totalJurisdictions}</span>
          </div>

          <div className="h-px bg-border" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="status-dot status-dot-warning" />
                <span className="text-xs text-muted">At Risk</span>
              </div>
              <span className="text-lg font-medium">2</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="status-dot status-dot-danger" />
                <span className="text-xs text-muted">Non-Compliant</span>
              </div>
              <span className="text-lg font-medium">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
