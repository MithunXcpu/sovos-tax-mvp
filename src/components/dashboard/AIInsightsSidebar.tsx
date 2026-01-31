"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import { ComplianceOverview, Jurisdiction, ComplianceAlert } from "@/types/compliance";
import { formatCurrency, cn } from "@/lib/utils";

interface AIInsightsSidebarProps {
  overview: ComplianceOverview;
  jurisdictions: Jurisdiction[];
  alerts: ComplianceAlert[];
  onOpenChat: () => void;
}

interface Insight {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  action?: string;
}

function generateInsights(
  overview: ComplianceOverview,
  jurisdictions: Jurisdiction[],
  alerts: ComplianceAlert[]
): Insight[] {
  const insights: Insight[] = [];

  // Critical: Overdue filings
  const overdueJurisdictions = jurisdictions.filter(
    (j) => j.status === "non_compliant"
  );
  if (overdueJurisdictions.length > 0) {
    const j = overdueJurisdictions[0];
    insights.push({
      id: "overdue",
      type: "critical",
      icon: AlertTriangle,
      title: `${j.name} filing is overdue`,
      description: `Immediate action required. Estimated penalty could be ${formatCurrency(
        j.currentLiability * 0.05
      )} (5% of liability).`,
      action: "File now",
    });
  }

  // Warning: At-risk jurisdictions
  const atRiskCount = jurisdictions.filter((j) => j.status === "at_risk").length;
  if (atRiskCount > 0) {
    insights.push({
      id: "at-risk",
      type: "warning",
      icon: Calendar,
      title: `${atRiskCount} jurisdiction${atRiskCount > 1 ? "s" : ""} at risk`,
      description: "Filings due within 10 days. Prepare documentation to avoid delays.",
      action: "Review",
    });
  }

  // Info: Score improvement
  if (overview.nonCompliantCount > 0 || overview.atRiskCount > 0) {
    const potentialImprovement = overview.nonCompliantCount * 10 + overview.atRiskCount * 5;
    insights.push({
      id: "score-improvement",
      type: "info",
      icon: TrendingUp,
      title: `Improve score by ${potentialImprovement} points`,
      description: "Address overdue and at-risk filings to boost your compliance score.",
    });
  }

  // Success: YTD performance
  const collectionRate = (overview.ytdCollected / (overview.ytdCollected + overview.totalLiability)) * 100;
  if (collectionRate > 90) {
    insights.push({
      id: "performance",
      type: "success",
      icon: DollarSign,
      title: "Strong collection rate",
      description: `${collectionRate.toFixed(1)}% of taxes collected and remitted on time.`,
    });
  }

  // General tip if few insights
  if (insights.length < 3) {
    insights.push({
      id: "tip",
      type: "info",
      icon: Lightbulb,
      title: "Pro tip",
      description: "Set up automated reminders 7 days before filing deadlines to stay ahead.",
    });
  }

  return insights.slice(0, 4);
}

const typeStyles = {
  critical: {
    bg: "bg-danger/10",
    border: "border-danger/30",
    icon: "text-danger",
    dot: "bg-danger",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "text-warning",
    dot: "bg-warning",
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/30",
    icon: "text-info",
    dot: "bg-info",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "text-success",
    dot: "bg-success",
  },
};

export function AIInsightsSidebar({
  overview,
  jurisdictions,
  alerts,
  onOpenChat,
}: AIInsightsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const insights = generateInsights(overview, jurisdictions, alerts);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed right-0 top-20 bottom-6 z-30",
        "flex flex-col",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -left-4 top-8 z-10",
          "w-8 h-8 rounded-full",
          "bg-background-elevated border border-border",
          "flex items-center justify-center",
          "hover:bg-surface transition-colors",
          "shadow-lg"
        )}
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-foreground-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-foreground-muted" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center pt-4 gap-3 bg-background-elevated/95 backdrop-blur border-l border-border"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className={cn("w-2 h-2 rounded-full", typeStyles[insight.type].dot)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-background-elevated/95 backdrop-blur border-l border-border overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Insights</h3>
                  <p className="text-xs text-foreground-muted">Powered by Claude</p>
                </div>
              </div>
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                const styles = typeStyles[insight.type];

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-3 rounded-xl border",
                      styles.bg,
                      styles.border
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", styles.icon)} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                          {insight.description}
                        </p>
                        {insight.action && (
                          <button className="text-xs text-primary font-medium mt-2 hover:underline">
                            {insight.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ask AI Button */}
            <div className="p-4 border-t border-border">
              <button
                onClick={onOpenChat}
                className="w-full btn btn-primary justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Ask AI Assistant
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
