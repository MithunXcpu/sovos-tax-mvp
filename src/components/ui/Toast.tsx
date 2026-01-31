"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { Toast as ToastType, ToastType as ToastVariant } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const toastConfig: Record<
  ToastVariant,
  {
    icon: typeof CheckCircle;
    bgClass: string;
    iconClass: string;
    borderClass: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bgClass: "bg-gradient-to-r from-success/15 to-transparent",
    iconClass: "text-success",
    borderClass: "border-success/30",
  },
  error: {
    icon: XCircle,
    bgClass: "bg-gradient-to-r from-danger/15 to-transparent",
    iconClass: "text-danger",
    borderClass: "border-danger/30",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-gradient-to-r from-warning/15 to-transparent",
    iconClass: "text-warning",
    borderClass: "border-warning/30",
  },
  info: {
    icon: Info,
    bgClass: "bg-gradient-to-r from-info/15 to-transparent",
    iconClass: "text-info",
    borderClass: "border-info/30",
  },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm",
        "bg-background-elevated shadow-lg min-w-[320px] max-w-[400px]",
        config.bgClass,
        config.borderClass
      )}
    >
      <div className={cn("flex-shrink-0 mt-0.5", config.iconClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="flex-1 text-sm text-foreground leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
