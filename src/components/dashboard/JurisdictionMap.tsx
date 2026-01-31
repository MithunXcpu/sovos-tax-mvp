"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Jurisdiction } from "@/types/compliance";
import { formatCurrency, cn } from "@/lib/utils";

interface JurisdictionMapProps {
  jurisdictions: Jurisdiction[];
  selectedJurisdiction: Jurisdiction | null;
  onSelectJurisdiction: (jurisdiction: Jurisdiction) => void;
}

// Simplified coordinates for jurisdiction pins on our custom map
const jurisdictionCoords: Record<string, { x: number; y: number; region: "us" | "eu" }> = {
  CA: { x: 52, y: 145, region: "us" },   // California
  TX: { x: 135, y: 185, region: "us" },  // Texas
  NY: { x: 245, y: 115, region: "us" },  // New York
  FL: { x: 230, y: 195, region: "us" },  // Florida
  UK: { x: 410, y: 95, region: "eu" },   // United Kingdom
  DE: { x: 435, y: 105, region: "eu" },  // Germany
};

const statusColors = {
  compliant: { fill: "#10B981", stroke: "#059669", glow: "rgba(16, 185, 129, 0.5)" },
  at_risk: { fill: "#F59E0B", stroke: "#D97706", glow: "rgba(245, 158, 11, 0.5)" },
  non_compliant: { fill: "#EF4444", stroke: "#DC2626", glow: "rgba(239, 68, 68, 0.5)" },
  pending: { fill: "#6B7280", stroke: "#4B5563", glow: "rgba(107, 114, 128, 0.5)" },
};

export function JurisdictionMap({
  jurisdictions,
  selectedJurisdiction,
  onSelectJurisdiction,
}: JurisdictionMapProps) {
  const [hoveredJurisdiction, setHoveredJurisdiction] = useState<string | null>(null);

  return (
    <div className="card p-4 h-full">
      <h4 className="text-sm font-medium text-foreground-muted mb-3">Global Overview</h4>

      <div className="relative w-full aspect-[16/10] bg-surface/50 rounded-xl overflow-hidden border border-border">
        <svg
          viewBox="0 0 500 280"
          className="w-full h-full"
          style={{ background: "linear-gradient(135deg, #0A0F1A 0%, #111827 100%)" }}
        >
          {/* Grid lines for visual depth */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(55, 65, 81, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="500" height="280" fill="url(#grid)" />

          {/* Simplified US outline */}
          <path
            d="M 30,90 L 80,85 L 120,75 L 160,80 L 200,70 L 240,75 L 270,85 L 280,95 L 275,120 L 280,150 L 270,180 L 250,200 L 220,210 L 180,205 L 140,210 L 100,200 L 60,190 L 40,170 L 35,140 L 30,110 Z"
            fill="rgba(55, 65, 81, 0.3)"
            stroke="rgba(75, 85, 99, 0.5)"
            strokeWidth="1"
          />

          {/* Simplified Europe outline */}
          <path
            d="M 380,60 L 420,55 L 460,65 L 480,90 L 475,120 L 460,140 L 430,150 L 400,145 L 380,130 L 375,100 L 380,70 Z"
            fill="rgba(55, 65, 81, 0.3)"
            stroke="rgba(75, 85, 99, 0.5)"
            strokeWidth="1"
          />

          {/* Region labels */}
          <text x="150" y="240" className="text-[10px]" fill="rgba(156, 163, 175, 0.5)">
            United States
          </text>
          <text x="410" y="170" className="text-[10px]" fill="rgba(156, 163, 175, 0.5)">
            Europe
          </text>

          {/* Connection lines between regions */}
          <path
            d="M 280,130 Q 340,100 380,110"
            fill="none"
            stroke="rgba(0, 102, 204, 0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Jurisdiction pins */}
          {jurisdictions.map((jurisdiction) => {
            const coords = jurisdictionCoords[jurisdiction.code];
            if (!coords) return null;

            const colors = statusColors[jurisdiction.status];
            const isHovered = hoveredJurisdiction === jurisdiction.id;
            const isSelected = selectedJurisdiction?.id === jurisdiction.id;

            return (
              <g key={jurisdiction.id}>
                {/* Glow effect */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered || isSelected ? 18 : 12}
                  fill={colors.glow}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered || isSelected ? 0.6 : 0.3 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Main pin */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered || isSelected ? 10 : 8}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                  filter="url(#glow)"
                  style={{ cursor: "pointer" }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredJurisdiction(jurisdiction.id)}
                  onMouseLeave={() => setHoveredJurisdiction(null)}
                  onClick={() => onSelectJurisdiction(jurisdiction)}
                />

                {/* Jurisdiction code label */}
                <text
                  x={coords.x}
                  y={coords.y + 4}
                  textAnchor="middle"
                  className="text-[8px] font-bold pointer-events-none"
                  fill="white"
                >
                  {jurisdiction.code}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={coords.x + 15}
                      y={coords.y - 25}
                      width="100"
                      height="50"
                      rx="6"
                      fill="rgba(17, 24, 39, 0.95)"
                      stroke="rgba(55, 65, 81, 0.8)"
                      strokeWidth="1"
                    />
                    <text
                      x={coords.x + 20}
                      y={coords.y - 10}
                      className="text-[9px] font-medium"
                      fill="white"
                    >
                      {jurisdiction.name}
                    </text>
                    <text
                      x={coords.x + 20}
                      y={coords.y + 2}
                      className="text-[8px]"
                      fill="#9CA3AF"
                    >
                      {formatCurrency(jurisdiction.currentLiability)}
                    </text>
                    <text
                      x={coords.x + 20}
                      y={coords.y + 14}
                      className="text-[8px]"
                      fill={colors.fill}
                    >
                      {jurisdiction.status.replace("_", " ").toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-background/80 backdrop-blur rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-[10px] text-foreground-muted">Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-[10px] text-foreground-muted">At Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-danger" />
            <span className="text-[10px] text-foreground-muted">Non-Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
