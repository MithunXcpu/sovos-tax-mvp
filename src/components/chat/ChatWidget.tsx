"use client";

import { useState } from "react";
import { MessageSquare, X, Minimize2 } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Chat Panel */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-24 right-6 z-50 animate-fadeIn">
          <div className="bg-background-elevated border border-border rounded-xl shadow-lg w-[400px] h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sovi</h3>
                  <p className="text-xs text-muted">Tax Compliance AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="btn btn-ghost p-1.5"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  className="btn btn-ghost p-1.5"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <ChatPanel />
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div
          className="fixed bottom-24 right-6 z-50 animate-fadeIn cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="bg-surface border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 hover:border-primary transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <p className="text-sm font-medium">Sovi</p>
              <p className="text-xs text-muted">Click to expand</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center transition-all duration-300",
          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          isOpen ? "bg-surface border border-border" : "bg-primary"
        )}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            setIsMinimized(false);
          } else {
            setIsOpen(true);
            setIsMinimized(false);
          }
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
}
