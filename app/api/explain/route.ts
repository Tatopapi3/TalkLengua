import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

const client = new Anthropic()

const RequestSchema = z.object({
  questionId: z.string(),
  questionText: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string(),
  grammarTopic: z.string(),
  languageCode: z.string(),
  cefrLevel: z.string(),
})

const LANGUAGE_NAMES: Record<string, string> = {
  ko: 'Korean',
  pt: 'Portuguese',
  ru: 'Russian',
  es: 'Spanish',
  en: 'English',
  fr: 'French',
  de: 'German',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { questionId, questionText, correctAnswer, userAnswer, grammarTopic, languageCode, cefrLevel } = parsed.data
    const supabase = await createServiceClient()

    // Check cache first
    const { data: cached } = await supabase
      .from('explainer_cache')
      .select('explanation')
      .eq('language_code', languageCode)
      .eq('question_id', questionId)
      .eq('user_answer', userAnswer)
      .eq('cefr_level', cefrLevel)
      .single()

    if (cached) {
      return NextResponse.json({ explanation: cached.explanation, cached: true })
    }

    const languageName = LANGUAGE_NAMES[languageCode] ?? languageCode

    const systemPrompt = languageCode === 'ko'
      ? `You are an expert Korean language tutor. The learner is at CEFR level ${cefrLevel}.
Explain in 2–4 plain English sentences exactly why their answer was wrong and what the correct rule is.
Be specific to the grammar topic: ${grammarTopic}.
For Korean, address particles, speech levels, verb conjugation, and Hangul as relevant.
Do not be generic. Reference the exact words in the question.`
      : `You are an expert ${languageName} language tutor. The learner is at CEFR level ${cefrLevel}.
Explain in 2–4 plain English sentences exactly why their answer was wrong and what the correct rule is.
Be specific to the grammar topic: ${grammarTopic}.
Do not be generic. Reference the exact words in the question.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Question: "${questionText}"
Correct answer: "${correctAnswer}"
Learner answered: "${userAnswer}"

Why was the learner's answer wrong? What is the rule they missed?`,
        },
      ],
    })

    const explanation = message.content[0].type === 'text' ? message.content[0].text : ''

    // Cache the response
    await supabase.from('explainer_cache').insert({
      language_code: languageCode,
      question_id: questionId,
      user_answer: userAnswer,
      cefr_level: cefrLevel,
      explanation,
    }).select()

    return NextResponse.json({ explanation, cached: false })
  } catch (err) {
    console.error('[/api/explain]', err)
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 })
  }
}
