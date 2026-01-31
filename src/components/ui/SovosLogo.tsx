"use client";

import { cn } from "@/lib/utils";

interface SovosLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function SovosLogo({ size = "md", showText = true, className }: SovosLogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", subtitle: "text-[10px]" },
    md: { icon: "w-10 h-10", text: "text-xl", subtitle: "text-xs" },
    lg: { icon: "w-14 h-14", text: "text-2xl", subtitle: "text-sm" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Custom Logo Icon */}
      <div
        className={cn(
          s.icon,
          "relative rounded-xl bg-gradient-to-br from-primary via-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25"
        )}
      >
        {/* Stylized S with data flow lines */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Background glow */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Stylized S letter */}
          <path
            d="M28 12C28 12 24 8 18 8C12 8 8 12 8 16C8 20 12 22 18 24C24 26 28 28 28 32C28 36 24 40 18 40C12 40 8 36 8 36"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            transform="translate(2, -4) scale(0.9)"
          />

          {/* Data flow dots */}
          <circle cx="10" cy="10" r="2" fill="white" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="14" r="1.5" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="30" r="1.5" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>

          {/* Checkmark accent */}
          <path
            d="M28 18L32 22L38 14"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            transform="translate(-4, 2) scale(0.6)"
          />
        </svg>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
      </div>

      {/* Text */}
      {showText && (
        <div>
          <h1 className={cn(s.text, "font-bold text-foreground tracking-tight")}>
            Sovos
          </h1>
          <p className={cn(s.subtitle, "text-foreground-muted -mt-0.5")}>
            Tax Compliance Cloud
          </p>
        </div>
      )}
    </div>
  );
}
