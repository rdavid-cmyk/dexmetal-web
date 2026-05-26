import crypto from 'crypto'
import type { MediaStudioPlan } from './types'

const DEXMETAL_POSITIONING =
  'DexMetal turns Basel compliance expertise into practical movement infrastructure for circular economy and right-to-repair operators.'

function cleanWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function sentenceCase(value: string) {
  const clean = cleanWhitespace(value)
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : clean
}

function splitSentences(text: string) {
  return cleanWhitespace(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24)
}

function extractKeyLines(text: string) {
  const sentences = splitSentences(text)
  const priority = sentences.filter((sentence) =>
    /(basel|pic|consent|shipment|export|e-waste|waste|right to repair|circular|authority|notification|compliance|risk|illegal|document)/i.test(
      sentence,
    ),
  )

  return [...priority, ...sentences].slice(0, 8)
}

function compactScript(lines: string[], seconds: number) {
  const body = lines.slice(0, seconds <= 30 ? 3 : 5)

  return [
    'Most shipment problems do not start at the port. They start when the paperwork is treated like an afterthought.',
    ...body,
    'The practical question is simple: what consent is required, who gives it, and what evidence proves it before material moves?',
  ].join(' ')
}

export function extractReadableTextFromHtml(html: string) {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i)
  const scoped = articleMatch?.[0] || html

  return cleanWhitespace(
    scoped
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#8217;|&rsquo;/g, "'")
      .replace(/&#8220;|&ldquo;/g, '"')
      .replace(/&#8221;|&rdquo;/g, '"'),
  )
}

export function extractTitleFromHtml(html: string) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  const title = h1 || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''
  return cleanWhitespace(title.replace(/<[^>]+>/g, '').replace(/\s+\|\s+DexMetal$/i, ''))
}

export function buildMediaStudioPlan(input: {
  sourceUrl?: string
  sourceTitle?: string
  sourceText: string
}): MediaStudioPlan {
  const sourceTitle = sentenceCase(input.sourceTitle || 'DexMetal Basel compliance explainer')
  const keyLines = extractKeyLines(input.sourceText)
  const mainRisk = keyLines[0] || 'Basel compliance is the difference between a legal circular shipment and a blocked movement.'
  const proofLine =
    keyLines[1] || 'Prior Informed Consent is not a formality; it is the legal evidence trail for transboundary waste movement.'

  const shortScript = compactScript(keyLines, 30)
  const longScript = compactScript(keyLines, 75)

  const trafficGoal = `Move viewers from a short practical compliance insight to the full guide at ${
    input.sourceUrl || 'dexmetal.com'
  }.`

  const thumbnailBase =
    'Cinematic compliance thumbnail for DexMetal, dark industrial background, green compliance signal, orange risk accent, high contrast, documentary lighting'

  return {
    id: crypto.randomUUID(),
    sourceUrl: input.sourceUrl,
    sourceTitle,
    trafficGoal,
    positioning: DEXMETAL_POSITIONING,
    clips: [
      {
        title: `${sourceTitle}: 60-second explainer`,
        hook: 'The expensive mistake is assuming a shipment is legal because the material has value.',
        script: longScript,
        cta: 'Read the full DexMetal guide and check your route before you ship.',
        format: 'youtube',
        seconds: 75,
      },
      {
        title: `${sourceTitle}: compliance risk short`,
        hook: 'One missing consent can turn recoverable material into a stopped shipment.',
        script: shortScript,
        cta: 'Run the DexMetal Basel tools before the container moves.',
        format: 'short',
        seconds: 30,
      },
      {
        title: `${sourceTitle}: LinkedIn founder note`,
        hook: 'Circular trade only works when the legal trail is defensible.',
        script: `${proofLine} ${mainRisk} DexMetal exists to make that movement easier to understand before money, time, and containers are at risk.`,
        cta: 'Read the guide on dexmetal.com.',
        format: 'linkedin',
        seconds: 45,
      },
    ],
    thumbnailPrompts: [
      `${thumbnailBase}, headline text area: "STOPPED AT PORT?", visual: container ship, e-waste pallets, official stamp, realistic editorial style`,
      `${thumbnailBase}, headline text area: "PIC REQUIRED?", visual: customs desk, consent document, green check against orange warning`,
      `${thumbnailBase}, headline text area: "LEGAL OR BLOCKED?", visual: split-screen legal shipment route versus blocked container`,
      `${thumbnailBase}, headline text area: "BASEL CHECK", visual: global route map with compliance checkpoints, serious expert tone`,
    ],
    falJobs: [
      {
        label: 'Hero thumbnail concept',
        model: 'fal-ai/flux/dev',
        input: {
          prompt: `${thumbnailBase}, YouTube thumbnail composition for "${sourceTitle}", no small text, strong foreground subject`,
          image_size: 'landscape_16_9',
          num_images: 1,
        },
      },
      {
        label: 'Reference image-to-video clip',
        model: 'fal-ai/minimax-video/image-to-video',
        input: {
          prompt:
            'Slow cinematic push-in across Basel compliance documents, shipping route lines, and recovered electronics, professional documentary tone.',
        },
      },
    ],
    remotionBrief:
      'Create a reusable DexMetal overlay composition with hook text, three compliance checkpoints, source URL lower third, and final dexmetal.com CTA. Keep it data-driven so future blog posts can reuse the same component.',
    hyperframesBrief:
      'Create a high-motion HTML/GSAP promo: document stamp enters, route line animates across a map, risk warning flips to green consent signal, then dexmetal.com CTA lands. Use DexMetal green #1D9E75, orange #FF5C00, dark canvas #1C1B18.',
    createdAt: new Date().toISOString(),
  }
}

