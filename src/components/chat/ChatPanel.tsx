"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Shield, Calendar, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { ChatMessage, SuggestedPrompt } from "@/types/chat";
import { cn } from "@/lib/utils";
import { suggestedPrompts, complianceOverview, jurisdictions, alerts } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Calendar,
  DollarSign,
  AlertTriangle,
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Sovi, your AI tax compliance assistant. I can help you understand your compliance status, upcoming filings, and answer questions about your tax obligations. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            complianceScore: complianceOverview.score,
            totalLiability: complianceOverview.totalLiability,
            upcomingFilings: complianceOverview.upcomingFilings,
            jurisdictions: jurisdictions.map((j) => ({
              name: j.name,
              code: j.code,
              status: j.status,
              liability: j.currentLiability,
              nextFiling: j.nextFilingDate,
            })),
            alerts: alerts.map((a) => ({
              title: a.title,
              severity: a.severity,
              jurisdiction: a.jurisdictionName,
            })),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + chunk }
                : m
            )
          );
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: SuggestedPrompt) => {
    setInput(prompt.prompt);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                message.role === "assistant"
                  ? "bg-surface text-foreground"
                  : "bg-primary text-white"
              )}
            >
              {message.content}
              {message.isStreaming && (
                <span className="inline-block w-1 h-4 ml-1 bg-foreground animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => {
              const Icon = iconMap[prompt.icon] || Shield;
              return (
                <button
                  key={prompt.id}
                  className="btn btn-secondary text-xs py-1.5 px-3"
                  onClick={() => handleSuggestedPrompt(prompt)}
                >
                  <Icon className="w-3 h-3" />
                  {prompt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your tax compliance..."
            className="input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary px-3"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
