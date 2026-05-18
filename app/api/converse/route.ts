import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { GrammarCorrection } from '@/types'

const client = new Anthropic()

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const RequestSchema = z.object({
  languageCode: z.string().default('ko'),
  scenario: z.string(),
  formality: z.enum(['casual', 'polite', 'formal']),
  cefrLevel: z.string(),
  history: z.array(MessageSchema),
  userMessage: z.string(),
})

const SCENARIO_LABELS: Record<string, string> = {
  introduce_yourself: 'Introduce Yourself',
  order_food: 'Order Food at a Restaurant',
  ask_directions: 'Ask for Directions',
  make_a_friend: 'Make a New Friend',
  at_work: 'Professional / Work Conversation',
  free_chat: 'Free Conversation',
}

const KOREAN_FORMALITY: Record<string, string> = {
  casual: '반말 (banmal) — informal speech used with close friends or younger people',
  polite: '요체 (yo-che) — polite speech used in most everyday adult situations',
  formal: '합쇼체 (hapshyo-che) — formal speech used in professional or high-respect contexts',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { languageCode, scenario, formality, cefrLevel, history, userMessage } = parsed.data

    const scenarioLabel = SCENARIO_LABELS[scenario] ?? scenario
    const formalityDesc = languageCode === 'ko' ? KOREAN_FORMALITY[formality] : formality

    const systemPrompt = languageCode === 'ko'
      ? `You are a friendly Korean conversation partner. The learner is at CEFR level ${cefrLevel}.

Scenario: ${scenarioLabel}
Formality level: ${formalityDesc}

Rules:
1. Respond naturally in Korean, strictly matching the formality level above.
2. Keep responses to 1–3 sentences — this is a conversation, not a lecture.
3. After your Korean response, return a JSON block with this exact format:

\`\`\`json
{
  "corrections": [
    {
      "original": "the learner's exact phrase that was wrong",
      "corrected": "the correct Korean phrase",
      "explanation": "one English sentence explaining the rule"
    }
  ]
}
\`\`\`

4. If the learner's message had no errors, return \`"corrections": []\`.
5. Never break character in the Korean response. Put all English in the corrections JSON only.
6. If the learner writes in romanization, accept it and respond in Hangul.`
      : `You are a conversation partner. Respond in the target language in 1–3 sentences. Then return a JSON block:
\`\`\`json
{"corrections": [{"original": "...", "corrected": "...", "explanation": "..."}]}\`\`\`
Return "corrections": [] if no errors.`

    const claudeMessages: Anthropic.MessageParam[] = [
      ...history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.role === 'assistant'
          ? m.content.replace(/```json[\s\S]*?```/g, '').trim()
          : m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const rawContent = response.content[0].type === 'text' ? response.content[0].text : ''

    let corrections: GrammarCorrection[] = []
    let conversationalResponse = rawContent

    const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1])
        corrections = parsed.corrections ?? []
      } catch {}
      conversationalResponse = rawContent.replace(/```json[\s\S]*?```/g, '').trim()
    }

    return NextResponse.json({ response: conversationalResponse, corrections })
  } catch (err) {
    console.error('[/api/converse]', err)
    return NextResponse.json({ error: 'Failed to get conversation response' }, { status: 500 })
  }
}
