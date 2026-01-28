export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatContext {
  jurisdictions: string[];
  complianceScore: number;
  totalLiability: number;
  upcomingFilings: number;
  recentAlerts: number;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}
