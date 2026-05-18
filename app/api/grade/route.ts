import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { heard, korean, romanization, english } = await req.json()

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `You are grading a Korean pronunciation attempt from a beginner learner.

Target word: ${korean} (${romanization}) — meaning: "${english}"
What the speech recognition heard: "${heard}"

The learner may have said the Korean word, the English romanization, or something close to it.
Be generous — this is for beginners. If what was heard sounds phonetically similar or is a reasonable approximation, mark it correct.

Reply with ONLY valid JSON: {"correct": true/false, "score": 0-100, "feedback": "one short encouraging sentence"}`
      }]
    })

    const text = (msg.content[0] as any).text.trim()
    const result = JSON.parse(text)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/grade]', err)
    return NextResponse.json({ correct: false, score: 0, feedback: 'Could not grade — try again.' }, { status: 500 })
  }
}
