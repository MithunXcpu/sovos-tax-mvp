"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  LayoutDashboard,
  Download,
  Mail,
  LogOut,
} from "lucide-react";
import { ComplianceScoreCard } from "@/components/dashboard/ComplianceScoreCard";
import { MetricsRow, MetricType } from "@/components/dashboard/MetricsRow";
import { JurisdictionGrid } from "@/components/dashboard/JurisdictionGrid";
import { JurisdictionModal } from "@/components/dashboard/JurisdictionModal";
import { FilingCalendar } from "@/components/dashboard/FilingCalendar";
import { FilingDetailModal } from "@/components/dashboard/FilingDetailModal";
import { MetricDetailModal } from "@/components/dashboard/MetricDetailModal";
import { ComplianceDetailModal } from "@/components/dashboard/ComplianceDetailModal";
import { ExportReportModal } from "@/components/dashboard/ExportReportModal";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { TaxRateLookup } from "@/components/dashboard/TaxRateLookup";
import { CertificateTracker } from "@/components/dashboard/CertificateTracker";
import { IntegrationStatus } from "@/components/dashboard/IntegrationStatus";
import { ReconciliationCard } from "@/components/dashboard/ReconciliationCard";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { LoginPage } from "@/components/auth/LoginPage";
import { SovosLogo } from "@/components/ui/SovosLogo";
import { dashboardData } from "@/lib/mock-data";
import { Jurisdiction, FilingEvent } from "@/types/compliance";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  const [selectedFilingDay, setSelectedFilingDay] = useState<{ date: Date; events: FilingEvent[] } | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [showComplianceDetail, setShowComplianceDetail] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const { overview, jurisdictions, alerts, filingEvents } = dashboardData;
  const { addToast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Filing day click handler
  const handleDayClick = (date: Date, events: FilingEvent[]) => {
    setSelectedFilingDay({ date, events });
  };

  // View jurisdiction from modal
  const handleViewJurisdictionFromModal = (jurisdiction: Jurisdiction) => {
    setSelectedFilingDay(null);
    setShowComplianceDetail(false);
    setSelectedJurisdiction(jurisdiction);
  };

  // Export complete handler
  const handleExportComplete = (filename: string) => {
    addToast("success", `Successfully exported ${filename}`);
  };

  // Open chat widget (placeholder - ChatWidget manages its own state)
  const handleOpenChat = () => {
    // ChatWidget is self-contained, this could be enhanced with a ref
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    addToast("info", "Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background-elevated/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <SovosLogo size="md" />

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button className="btn btn-ghost px-4 py-2 text-primary bg-primary/10">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <a
                href="mailto:cmithun97@gmail.com?subject=Sovos Tax MVP - Help Request"
                className="btn btn-ghost px-4 py-2"
              >
                <Mail className="w-4 h-4" />
                Help
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                className="btn btn-ghost p-2"
                onClick={() => setShowExportModal(true)}
                title="Export Report"
              >
                <Download className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost p-2">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="hidden sm:block text-sm text-foreground-muted">{user}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost p-2 text-foreground-muted hover:text-danger"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Compliance Dashboard
          </h2>
          <p className="text-muted">
            Monitor your tax compliance status across all jurisdictions
          </p>
        </div>

        {/* Top Section: Score Card and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <ComplianceScoreCard
              score={overview.score}
              trend={overview.trend}
              compliantCount={overview.compliantCount}
              totalJurisdictions={overview.totalJurisdictions}
              atRiskCount={overview.atRiskCount}
              nonCompliantCount={overview.nonCompliantCount}
              onClick={() => setShowComplianceDetail(true)}
            />
          </div>
          <div className="lg:col-span-2">
            <MetricsRow
              totalLiability={overview.totalLiability}
              ytdCollected={overview.ytdCollected}
              upcomingFilings={overview.upcomingFilings}
              onMetricClick={setSelectedMetric}
            />
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="mb-6">
          <AIInsightsCard
            overview={overview}
            jurisdictions={jurisdictions}
            alerts={alerts}
            onOpenChat={handleOpenChat}
          />
        </div>

        {/* Integration & Reconciliation Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <IntegrationStatus />
          <ReconciliationCard />
        </div>

        {/* Tools Row: Tax Rate Lookup + Certificate Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TaxRateLookup />
          <CertificateTracker />
        </div>

        {/* Jurisdictions Grid */}
        <div className="mb-6">
          <JurisdictionGrid
            jurisdictions={jurisdictions}
            onSelectJurisdiction={setSelectedJurisdiction}
          />
        </div>

        {/* Filing Calendar */}
        <FilingCalendar
          filingEvents={filingEvents}
          onDayClick={handleDayClick}
        />
      </main>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {/* Jurisdiction Modal */}
        {selectedJurisdiction && (
          <JurisdictionModal
            key="jurisdiction-modal"
            jurisdiction={selectedJurisdiction}
            onClose={() => setSelectedJurisdiction(null)}
          />
        )}

        {/* Filing Detail Modal */}
        {selectedFilingDay && (
          <FilingDetailModal
            key="filing-modal"
            date={selectedFilingDay.date}
            events={selectedFilingDay.events}
            onClose={() => setSelectedFilingDay(null)}
            onViewJurisdiction={(jurisdictionId) => {
              const jurisdiction = jurisdictions.find(j => j.id === jurisdictionId);
              if (jurisdiction) {
                handleViewJurisdictionFromModal(jurisdiction);
              }
            }}
          />
        )}

        {/* Metric Detail Modal */}
        {selectedMetric && (
          <MetricDetailModal
            key="metric-modal"
            metric={selectedMetric}
            jurisdictions={jurisdictions}
            filingEvents={filingEvents}
            onClose={() => setSelectedMetric(null)}
            onViewJurisdiction={handleViewJurisdictionFromModal}
          />
        )}

        {/* Compliance Detail Modal */}
        {showComplianceDetail && (
          <ComplianceDetailModal
            key="compliance-modal"
            overview={overview}
            jurisdictions={jurisdictions}
            onClose={() => setShowComplianceDetail(false)}
            onViewJurisdiction={handleViewJurisdictionFromModal}
          />
        )}

        {/* Export Report Modal */}
        {showExportModal && (
          <ExportReportModal
            key="export-modal"
            overview={overview}
            jurisdictions={jurisdictions}
            alerts={alerts}
            filingEvents={filingEvents}
            onClose={() => setShowExportModal(false)}
            onExportComplete={handleExportComplete}
          />
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
