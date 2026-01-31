"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  MessageCircle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { ComplianceOverview, Jurisdiction, ComplianceAlert } from "@/types/compliance";
import { formatCurrency, cn } from "@/lib/utils";
import { AIInsightDetailModal, Insight } from "./AIInsightDetailModal";

interface AIInsightsCardProps {
  overview: ComplianceOverview;
  jurisdictions: Jurisdiction[];
  alerts: ComplianceAlert[];
  onOpenChat: () => void;
  onViewJurisdiction?: (name: string) => void;
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
      title: `${j.name} filing overdue`,
      description: `Estimated penalty: ${formatCurrency(j.currentLiability * 0.05)}`,
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
      title: `${atRiskCount} filing${atRiskCount > 1 ? "s" : ""} due soon`,
      description: "Due within 10 days",
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
      title: `+${potentialImprovement} pts possible`,
      description: "Fix overdue filings",
    });
  }

  // Success: YTD performance
  const collectionRate = (overview.ytdCollected / (overview.ytdCollected + overview.totalLiability)) * 100;
  if (collectionRate > 90) {
    insights.push({
      id: "performance",
      type: "success",
      icon: DollarSign,
      title: `${collectionRate.toFixed(0)}% collected`,
      description: "Strong performance",
    });
  }

  // General tip if few insights
  if (insights.length < 3) {
    insights.push({
      id: "tip",
      type: "info",
      icon: Lightbulb,
      title: "Pro tip",
      description: "Set 7-day reminders",
    });
  }

  return insights.slice(0, 4);
}

const typeStyles = {
  critical: {
    bg: "bg-danger/10",
    border: "border-danger/30",
    icon: "text-danger",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "text-warning",
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/30",
    icon: "text-info",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "text-success",
  },
};

export function AIInsightsCard({
  overview,
  jurisdictions,
  alerts,
  onOpenChat,
  onViewJurisdiction,
}: AIInsightsCardProps) {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const insights = generateInsights(overview, jurisdictions, alerts);

  const handleAskAI = (question: string) => {
    // In a real app, this would pre-fill the chat with the question
    onOpenChat();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Insights</h3>
                <p className="text-xs text-foreground-muted">Click any insight for details</p>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="btn btn-ghost text-sm gap-2 text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              const styles = typeStyles[insight.type];

              return (
                <motion.button
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedInsight(insight)}
                  className={cn(
                    "p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] text-left w-full",
                    "hover:shadow-lg hover:shadow-primary/5",
                    styles.bg,
                    styles.border
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", styles.icon)} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-foreground-muted mt-0.5 truncate">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <span className="text-xs text-primary font-medium mt-1 inline-block">
                          {insight.action} →
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <AIInsightDetailModal
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
            onAskAI={handleAskAI}
            onViewJurisdiction={onViewJurisdiction}
          />
        )}
      </AnimatePresence>
    </>
  );
}
