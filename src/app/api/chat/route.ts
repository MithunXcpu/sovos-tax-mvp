import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ComplianceContext {
  complianceScore: number;
  totalLiability: number;
  upcomingFilings: number;
  jurisdictions: Array<{
    name: string;
    code: string;
    status: string;
    liability: number;
    nextFiling: Date;
  }>;
  alerts: Array<{
    title: string;
    severity: string;
    jurisdiction: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = (await request.json()) as {
      messages: Message[];
      context: ComplianceContext;
    };

    // If no API key, return a mock response
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        getMockResponse(messages[messages.length - 1]?.content || "", context),
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    const systemPrompt = `You are Sovi, an AI tax compliance assistant for Sovos Tax Compliance Cloud. You help users understand their tax compliance status, upcoming filings, and answer questions about their tax obligations.

Current compliance data:
- Overall Compliance Score: ${context.complianceScore}/100
- Total Tax Liability: $${context.totalLiability.toLocaleString()}
- Upcoming Filings: ${context.upcomingFilings} in the next 30 days

Jurisdictions:
${context.jurisdictions.map((j) => `- ${j.name} (${j.code}): ${j.status}, Liability: $${j.liability.toLocaleString()}`).join("\n")}

Active Alerts:
${context.alerts.map((a) => `- ${a.severity.toUpperCase()}: ${a.title} (${a.jurisdiction})`).join("\n")}

Guidelines:
- Be concise and professional
- Reference specific data from the user's account when relevant
- Provide actionable recommendations
- If asked about something outside tax compliance, politely redirect
- Format currency values consistently
- Highlight urgent items that need attention`;

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }
}

function getMockResponse(query: string, context: ComplianceContext): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("compliance") || lowerQuery.includes("status")) {
    return `Based on your current data, your overall compliance score is ${context.complianceScore}/100.

Here's the breakdown:
- ${context.jurisdictions.filter((j) => j.status === "compliant").length} jurisdictions are fully compliant
- ${context.jurisdictions.filter((j) => j.status === "at_risk").length} jurisdictions are at risk
- ${context.jurisdictions.filter((j) => j.status === "non_compliant").length} jurisdiction needs immediate attention

I recommend focusing on the non-compliant jurisdiction first to avoid penalties.`;
  }

  if (lowerQuery.includes("filing") || lowerQuery.includes("due") || lowerQuery.includes("deadline")) {
    return `You have ${context.upcomingFilings} filings coming up in the next 30 days.

Urgent attention needed:
${context.alerts
  .filter((a) => a.severity === "critical" || a.severity === "warning")
  .map((a) => `- ${a.jurisdiction}: ${a.title}`)
  .join("\n")}

I recommend preparing your documentation for these filings as soon as possible to ensure timely submission.`;
  }

  if (lowerQuery.includes("liability") || lowerQuery.includes("owe") || lowerQuery.includes("tax")) {
    return `Your total current tax liability is $${context.totalLiability.toLocaleString()}.

Breakdown by jurisdiction:
${context.jurisdictions.map((j) => `- ${j.name}: $${j.liability.toLocaleString()}`).join("\n")}

Remember to ensure adequate cash flow to meet these obligations when filings are due.`;
  }

  if (lowerQuery.includes("risk") || lowerQuery.includes("alert") || lowerQuery.includes("warning")) {
    const criticalAlerts = context.alerts.filter((a) => a.severity === "critical");
    const warningAlerts = context.alerts.filter((a) => a.severity === "warning");

    return `Current risk assessment:

${criticalAlerts.length > 0 ? `Critical Issues (${criticalAlerts.length}):
${criticalAlerts.map((a) => `- ${a.jurisdiction}: ${a.title}`).join("\n")}` : "No critical issues."}

${warningAlerts.length > 0 ? `\nWarnings (${warningAlerts.length}):
${warningAlerts.map((a) => `- ${a.jurisdiction}: ${a.title}`).join("\n")}` : ""}

I recommend addressing critical issues immediately to maintain compliance and avoid penalties.`;
  }

  return `I understand you're asking about "${query}".

Based on your current compliance data, your score is ${context.complianceScore}/100 with a total liability of $${context.totalLiability.toLocaleString()} across ${context.jurisdictions.length} jurisdictions.

How can I help you specifically? I can provide details about:
- Your compliance status by jurisdiction
- Upcoming filing deadlines
- Current tax liabilities
- Risk areas that need attention`;
}
