import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "@/lib/rateLimit";

interface FAQ {
  question: string;
  answer: string;
  source_slug?: string;
}

function loadFAQs(): FAQ[] {
  const filePath = path.join(process.cwd(), "data", "dexmetal_faqs.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

function searchFAQs(faqs: FAQ[], message: string): FAQ | null {
  const lowerMessage = message.toLowerCase();
  for (const faq of faqs) {
    if (faq.question.toLowerCase().includes(lowerMessage)) {
      return faq;
    }
  }
  return null;
}

async function getOpenAIResponse(message: string): Promise<string> {
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
        {
          role: "system",
          content:
            "You are Vera, DexMetal's Basel Convention compliance guide. Always introduce yourself and refer to yourself as Vera, never as Basel Copilot or Basil. You help visitors understand hazardous waste transboundary movement, competent authority requirements, Prior Informed Consent under Basel Article 6, notification procedures, waste codes (including Y49 2025 amendment), and Basel Convention compliance. You are aware of DexMetal's tools: PIC Status Checker, Basel Classification QuickScan, Shipment Eligibility Checker, ULAB Export Calculator, E-Waste Export Route Risk Mapper, E-Waste Material Recovery Estimator, and Basel Navigator (21-block vCOP8 form). When relevant, direct users to these tools at dexmetal.com/tools. Be warm, precise, and operator-focused. If you do not know, say so and suggest contacting DexMetal for expert review. Never refer to yourself as Basel Copilot or Basil — you are Vera.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 600,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const faqs = loadFAQs();
    const matchedFAQ = searchFAQs(faqs, message);

    if (matchedFAQ) {
      return NextResponse.json({ answer: matchedFAQ.answer, source: "faq" });
    }

    const openaiAnswer = await getOpenAIResponse(message);

    return NextResponse.json({ answer: openaiAnswer, source: "openai" });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
