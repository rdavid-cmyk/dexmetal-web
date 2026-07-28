import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

interface ToolCTA {
  toolName: string;
  toolSlug: string;
  description: string;
}

function detectWorkflowIntent(message: string): ToolCTA | null {
  const msg = message.toLowerCase();

  if (/classify|what\s+is\s+(\w+\s+)?(y[\s-]?code|waste\s+code|basel\s+code)/.test(msg) || /\by\d{1,3}\b/.test(msg)) {
    return {
      toolName: "Basel Classification QuickScan",
      toolSlug: "basel-classification-quickscan",
      description: "Identify Y-codes and Basel Annex classifications for your waste stream",
    };
  }

  if (/eligible|can\s+i\s+ship|can\s+we\s+ship|\bexport\b/.test(msg)) {
    return {
      toolName: "Shipment Eligibility Checker",
      toolSlug: "shipment-eligibility-checker",
      description: "Check if your shipment qualifies for Basel transboundary movement",
    };
  }

  if (/\bpic\b|prior\s+informed|competent\s+authority/.test(msg)) {
    return {
      toolName: "PIC Status Checker",
      toolSlug: "pic-status-checker",
      description: "Look up competent authority contacts and PIC status by country",
    };
  }

  if (/ulab|lead\s+acid|\bbattery\b/.test(msg)) {
    return {
      toolName: "ULAB Export Calculator",
      toolSlug: "ulab-export-calculator",
      description: "Calculate ULAB export volumes and assess regulatory requirements",
    };
  }

  if (/notification|article\s+6|vcop/.test(msg)) {
    return {
      toolName: "Basel Navigator",
      toolSlug: "basel-navigator",
      description: "Complete your 21-block vCOP8 notification form step by step",
    };
  }

  if (/e.?waste|electronic|circuit board|pcb|computer|laptop|phone/.test(msg)) {
    return {
      toolName: "E-Waste Export Route Risk Mapper",
      toolSlug: "ewaste-route-mapper",
      description: "Map risk and routing requirements for e-waste export trade lanes",
    };
  }

  if (/api|developer|integrate|endpoint|rest|json/.test(msg)) {
    return {
      toolName: "Basel CA API",
      toolSlug: "../../developers",
      description: "Free API — verified CA contacts for 182 countries, instant access",
    };
  }

  return null;
}

const SYSTEM_PROMPT = `You are the DexMetal Agent — a Basel Convention compliance expert with 20+ years of Caribbean hazardous waste management experience. You speak operator-to-operator. Direct, precise, liability-aware. No warmth theatre.

You conduct multi-step compliance workflows. You remember what the user said earlier in this conversation and build on it. You ask one focused question at a time to gather what you need.

WORKFLOW PATTERN — when a user describes a shipment scenario:
1. Ask for material type if not provided
2. Ask for export country and destination country if not provided
3. Run classification (Y-codes, Basel Annex, Amber/Green list)
4. Check PIC/CA requirements for that trade lane
5. Identify notification obligations
6. Generate compliance summary
7. Recommend the appropriate DexMetal service

DEXMETAL TOOLS (all free, at dexmetal.com/tools):
- Basel Classification QuickScan — /tools/basel-classification-quickscan
- Shipment Eligibility Checker — /tools/shipment-eligibility-checker
- PIC Status Checker — /tools/pic-status-checker
- ULAB Export Calculator — /tools/ulab-export-calculator
- E-Waste Export Route Risk Mapper — /tools/ewaste-route-mapper
- E-Waste Material Recovery Estimator — /tools/ewaste-material-recovery
- Basel Navigator (21-block vCOP8 form) — /tools/basel-navigator

FREE RESOURCES (at dexmetal.com):
- Operator's Playbook — /playbook
- Compliance Checklist — /checklist
- Regulatory Radar — /regulatory-radar
- Knowledge Hub — /knowledge-hub
- Developer API Docs — /developers

BASEL CA API (free, at api.dexmetal.com):
- Verified Competent Authority contacts for 182 countries
- Free API key — register at api.dexmetal.com/register (instant, no credit card)
- Endpoint: GET /api/v1/ca?country={name} with X-API-Key header
- Also: POST /api/v1/classify for waste code classification
- Surface this when: user asks about CA contacts, building compliance tools, automating PIC lookups, or integrating Basel data into their systems

DEXMETAL PAID SERVICE:
- Basel Shipment Triage — $149, 48-hour turnaround — /services/shipment-compliance-review
  A document-completeness checklist against Basel requirements. NOT a certification
  or personal opinion on shipment approval — the competent authority makes that call.

SERVICE UPSELL TRIGGERS:
- User has an assembled notification file and wants it checked before submission → Basel Shipment Triage
- User is a developer or building a system → Basel CA API free key → Developer API Docs

Never invent regulatory details. If uncertain, say so and direct to dexmetal.com/contact.
Never refer to yourself as Vera, Basel Copilot, or Basil. You are the DexMetal Agent.
Keep responses under 150 words. Be direct. No bullet-point walls.`;

async function getOpenAIResponse(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message },
      ],
      max_tokens: 600,
    }),
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("OpenAI returned no content");
  }
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    if (!(await checkRateLimit(ip))) {
      return Response.json(
        { error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cta = detectWorkflowIntent(message);
    const answer = await getOpenAIResponse(message, history);

    return NextResponse.json({
      answer,
      source: "ai",
      cta: cta || undefined,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
