"use client";

import { useState } from "react";
import {
  Shield,
  Bell,
  Settings,
  User,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { ComplianceScoreCard } from "@/components/dashboard/ComplianceScoreCard";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { JurisdictionGrid } from "@/components/dashboard/JurisdictionGrid";
import { JurisdictionModal } from "@/components/dashboard/JurisdictionModal";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { FilingCalendar } from "@/components/dashboard/FilingCalendar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { dashboardData } from "@/lib/mock-data";
import { Jurisdiction } from "@/types/compliance";

export default function Dashboard() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  const { overview, jurisdictions, alerts, filingEvents } = dashboardData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background-elevated/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Sovos</h1>
                <p className="text-xs text-muted">Tax Compliance Cloud</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button className="btn btn-ghost px-4 py-2 text-primary bg-primary/10">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button className="btn btn-ghost px-4 py-2">
                <Bell className="w-4 h-4" />
                Alerts
                {alerts.filter((a) => !a.isRead).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-danger rounded-full text-white">
                    {alerts.filter((a) => !a.isRead).length}
                  </span>
                )}
              </button>
              <button className="btn btn-ghost px-4 py-2">
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost p-2">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ComplianceScoreCard
              score={overview.score}
              trend={overview.trend}
              compliantCount={overview.compliantCount}
              totalJurisdictions={overview.totalJurisdictions}
            />
          </div>
          <div className="lg:col-span-2">
            <MetricsRow
              totalLiability={overview.totalLiability}
              ytdCollected={overview.ytdCollected}
              upcomingFilings={overview.upcomingFilings}
            />
          </div>
        </div>

        {/* Jurisdictions Grid */}
        <div className="mb-8">
          <JurisdictionGrid
            jurisdictions={jurisdictions}
            onSelectJurisdiction={setSelectedJurisdiction}
          />
        </div>

        {/* Bottom Section: Calendar and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FilingCalendar filingEvents={filingEvents} />
          <AlertsList alerts={alerts} />
        </div>
      </main>

      {/* Jurisdiction Modal */}
      {selectedJurisdiction && (
        <JurisdictionModal
          jurisdiction={selectedJurisdiction}
          onClose={() => setSelectedJurisdiction(null)}
        />
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
