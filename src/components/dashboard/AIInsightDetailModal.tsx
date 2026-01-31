"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Sparkles,
  AlertTriangle,
  Calendar,
  TrendingUp,
  DollarSign,
  Lightbulb,
  CheckCircle2,
  Circle,
  MessageCircle,
  ExternalLink,
  Clock,
  Target,
  Zap,
  Brain,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export interface Insight {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  action?: string;
}

interface InsightDetail {
  analysis: string;
  rootCause: string;
  actions: { text: string; completed: boolean }[];
  impact: {
    penalty?: string;
    scoreImpact: number;
    timeline?: string;
  };
  relatedJurisdiction?: string;
}

// Mock AI-generated details for each insight type
const getInsightDetails = (insight: Insight): InsightDetail => {
  switch (insight.id) {
    case "overdue":
      return {
        analysis: `Based on your filing history and current liability analysis, the ${insight.title.replace(" filing overdue", "")} VAT return is now past its deadline. Our AI has detected this is your first late filing for this jurisdiction in 12 months, which may qualify you for penalty relief under first-time abatement rules.`,
        rootCause: "The delay appears related to incomplete transaction reconciliation from Q4. Specifically, 3 cross-border invoices are pending VAT number validation, and 2 refund claims require additional documentation.",
        actions: [
          { text: "Submit VAT return within 24 hours to minimize penalties", completed: false },
          { text: "Request penalty waiver citing first-time delay", completed: false },
          { text: "Update invoice validation process to prevent future delays", completed: false },
          { text: "Set up automated reminders 7 days before deadlines", completed: false },
        ],
        impact: {
          penalty: insight.description.replace("Estimated penalty: ", ""),
          scoreImpact: -15,
          timeline: "2 days overdue",
        },
        relatedJurisdiction: insight.title.replace(" filing overdue", ""),
      };

    case "at-risk":
      return {
        analysis: `You have multiple filings approaching their deadlines within the next 10 days. Our AI analysis shows that these filings represent a combined liability of approximately $193,490. Prioritizing by deadline and amount will help maintain your compliance score.`,
        rootCause: "These filings cluster around the end of the quarter, which is typical for jurisdictions with quarterly reporting requirements. Consider staggering your internal review processes to avoid deadline congestion.",
        actions: [
          { text: "Prioritize New York quarterly filing (due in 5 days)", completed: false },
          { text: "Complete UK VAT return preparation (due in 8 days)", completed: false },
          { text: "Set calendar reminders for each deadline", completed: true },
          { text: "Pre-authorize payments to avoid last-minute delays", completed: false },
        ],
        impact: {
          scoreImpact: -10,
          timeline: "5-8 days until deadlines",
        },
      };

    case "score-improvement":
      return {
        analysis: `Your current compliance score of 78 can be improved by addressing outstanding issues. Our AI has identified quick wins that could boost your score by up to ${insight.title.replace("+", "").replace(" pts possible", "")} points within the next filing cycle.`,
        rootCause: "The score reduction is primarily driven by 1 non-compliant jurisdiction (Germany) and 2 at-risk jurisdictions (New York, UK). Each non-compliant status costs approximately 10 points, while at-risk status costs 5 points.",
        actions: [
          { text: "File overdue Germany VAT return (+10 points)", completed: false },
          { text: "Submit New York filing before deadline (+5 points)", completed: false },
          { text: "Complete UK VAT return on time (+5 points)", completed: false },
          { text: "Maintain all other jurisdictions in compliant status", completed: true },
        ],
        impact: {
          scoreImpact: parseInt(insight.title.replace("+", "").replace(" pts possible", "")),
          timeline: "Achievable within 2 weeks",
        },
      };

    case "performance":
      return {
        analysis: `Outstanding tax collection performance! Your ${insight.title} rate exceeds industry benchmarks by 8%. This indicates strong internal processes and effective customer payment terms. Keep up the excellent work.`,
        rootCause: "Your success is attributed to: automated invoice generation, 30-day payment terms, and proactive follow-up on outstanding receivables. These practices have resulted in minimal write-offs and consistent cash flow.",
        actions: [
          { text: "Continue current collection practices", completed: true },
          { text: "Document successful processes for team training", completed: true },
          { text: "Consider tightening payment terms for new customers", completed: false },
          { text: "Review quarterly for continued optimization", completed: false },
        ],
        impact: {
          scoreImpact: 5,
          timeline: "Ongoing positive trend",
        },
      };

    case "tip":
    default:
      return {
        analysis: `Setting up proactive reminders is one of the most effective ways to maintain compliance. Our AI recommends a 7-day advance notice for all filing deadlines, giving your team adequate time to prepare documentation and review submissions.`,
        rootCause: "Many compliance issues stem from last-minute rushes. Data shows that filings completed 3+ days before the deadline have 95% fewer errors than those submitted on the deadline day.",
        actions: [
          { text: "Configure 7-day deadline reminders", completed: false },
          { text: "Set up 3-day final review alerts", completed: false },
          { text: "Enable email notifications for team members", completed: false },
          { text: "Create filing preparation checklist", completed: false },
        ],
        impact: {
          scoreImpact: 3,
          timeline: "Preventive measure",
        },
      };
  }
};

const typeStyles = {
  critical: {
    bg: "bg-danger/10",
    border: "border-danger/30",
    text: "text-danger",
    badge: "bg-danger text-white",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    badge: "bg-warning text-black",
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/30",
    text: "text-info",
    badge: "bg-info text-white",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
    badge: "bg-success text-white",
  },
};

interface AIInsightDetailModalProps {
  insight: Insight;
  onClose: () => void;
  onAskAI: (question: string) => void;
  onViewJurisdiction?: (name: string) => void;
}

export function AIInsightDetailModal({
  insight,
  onClose,
  onAskAI,
  onViewJurisdiction,
}: AIInsightDetailModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [actionStates, setActionStates] = useState<boolean[]>([]);
  const details = getInsightDetails(insight);
  const styles = typeStyles[insight.type];
  const Icon = insight.icon;

  // Simulate AI analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setActionStates(details.actions.map((a) => a.completed));
    }, 800);
    return () => clearTimeout(timer);
  }, [details.actions]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const toggleAction = (index: number) => {
    setActionStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleAskAI = () => {
    const question = `Tell me more about ${insight.title.toLowerCase()} and what I should do about it.`;
    onAskAI(question);
    onClose();
  };

  const typeLabel = {
    critical: "Critical Alert",
    warning: "Warning",
    info: "Insight",
    success: "Achievement",
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
        <div className={cn("p-6 border-b border-border", styles.bg)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-xl border", styles.border, styles.bg)}>
                <Icon className={cn("w-6 h-6", styles.text)} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles.badge)}>
                    {typeLabel[insight.type]}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    AI Analysis
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-foreground">{insight.title}</h2>
                <p className="text-sm text-foreground-muted mt-0.5">{insight.description}</p>
              </div>
            </div>
            <button className="btn btn-ghost p-2" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-12 h-12 text-purple-400" />
              </motion.div>
              <p className="mt-4 text-foreground-muted">Analyzing compliance data...</p>
            </div>
          ) : (
            <>
              {/* AI Analysis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-foreground">AI Analysis</h3>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 border border-purple-500/20">
                  <p className="text-sm text-foreground leading-relaxed">{details.analysis}</p>
                </div>
              </div>

              {/* Root Cause */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-info" />
                  <h3 className="font-semibold text-foreground">Root Cause</h3>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">{details.rootCause}</p>
              </div>

              {/* Recommended Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <h3 className="font-semibold text-foreground">Recommended Actions</h3>
                </div>
                <div className="space-y-2">
                  {details.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => toggleAction(index)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                        actionStates[index]
                          ? "bg-success/10 border-success/30"
                          : "bg-surface border-border hover:border-primary/30"
                      )}
                    >
                      {actionStates[index] ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-foreground-muted flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          actionStates[index] ? "text-foreground-muted line-through" : "text-foreground"
                        )}
                      >
                        {action.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Assessment */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-warning" />
                  <h3 className="font-semibold text-foreground">Impact Assessment</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {details.impact.penalty && (
                    <div className="p-3 rounded-xl bg-danger/10 border border-danger/30">
                      <p className="text-xs text-foreground-muted mb-1">Est. Penalty</p>
                      <p className="text-lg font-bold text-danger">{details.impact.penalty}</p>
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-xl border",
                      details.impact.scoreImpact > 0
                        ? "bg-success/10 border-success/30"
                        : "bg-warning/10 border-warning/30"
                    )}
                  >
                    <p className="text-xs text-foreground-muted mb-1">Score Impact</p>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        details.impact.scoreImpact > 0 ? "text-success" : "text-warning"
                      )}
                    >
                      {details.impact.scoreImpact > 0 ? "+" : ""}
                      {details.impact.scoreImpact} pts
                    </p>
                  </div>
                  {details.impact.timeline && (
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <p className="text-xs text-foreground-muted mb-1">Timeline</p>
                      <p className="text-sm font-medium text-foreground">{details.impact.timeline}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface/50">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleAskAI}
              className="btn btn-ghost gap-2 text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI More
            </button>
            <div className="flex items-center gap-2">
              {details.relatedJurisdiction && onViewJurisdiction && (
                <button
                  onClick={() => {
                    onViewJurisdiction(details.relatedJurisdiction!);
                    onClose();
                  }}
                  className="btn btn-ghost gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View {details.relatedJurisdiction}
                </button>
              )}
              <button onClick={onClose} className="btn btn-primary">
                Got It
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
