import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FAQ {
  question: string;
  answer: string;
  source_slug?: string;
}

function loadFAQs(): FAQ[] {
  const filePath = path.join(process.cwd(), 'data', 'dexmetal_faqs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
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

async function getGroqResponse(message: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are Basel Copilot, an expert assistant for DexMetal — a Basel Convention compliance platform. Answer questions about hazardous waste transboundary movement, competent authority requirements, notification procedures, and Basel Convention compliance. Be concise and precise. If you don\'t know, say so.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const faqs = loadFAQs();
    const matchedFAQ = searchFAQs(faqs, message);

    if (matchedFAQ) {
      return NextResponse.json({
        answer: matchedFAQ.answer,
        source: 'faq'
      });
    }

    const groqAnswer = await getGroqResponse(message);

    return NextResponse.json({
      answer: groqAnswer,
      source: 'groq'
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
