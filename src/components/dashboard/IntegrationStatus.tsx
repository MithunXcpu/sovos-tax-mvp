"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Database,
  RefreshCw,
  Zap,
  Server,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "syncing" | "error";
  lastSync: string;
  icon: typeof Database;
}

const integrations: Integration[] = [
  {
    id: "oracle-erp",
    name: "Oracle ERP",
    type: "Enterprise Resource Planning",
    status: "connected",
    lastSync: "2 min ago",
    icon: Database,
  },
  {
    id: "oracle-retek",
    name: "Oracle/Retek POS",
    type: "Point of Sale",
    status: "connected",
    lastSync: "Real-time",
    icon: ShoppingCart,
  },
  {
    id: "sovos-tax",
    name: "Sovos Tax Engine",
    type: "Tax Determination",
    status: "connected",
    lastSync: "Real-time",
    icon: Zap,
  },
];

const statusConfig = {
  connected: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    label: "Connected",
  },
  syncing: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    label: "Syncing",
  },
  error: {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    label: "Error",
  },
};

export function IntegrationStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">System Integrations</h3>
            <p className="text-xs text-foreground-muted">All systems connected</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/30">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">Live</span>
        </div>
      </div>

      {/* Integrations List */}
      <div className="p-4 space-y-3">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;
          const config = statusConfig[integration.status];

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", config.color)} />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{integration.name}</h4>
                  <p className="text-xs text-foreground-muted">{integration.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-muted">{integration.lastSync}</span>
                <CheckCircle2 className={cn("w-4 h-4", config.color)} />
              </div>
            </motion.div>
          );
        })}

        {/* Data Flow Indicator */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span>Data sync status</span>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Continuous sync enabled</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-1.5 rounded-full bg-success/30 overflow-hidden">
              <motion.div
                className="h-full bg-success"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
