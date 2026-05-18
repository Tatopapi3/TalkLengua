import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// nova = warm female voice, works well for Korean
const VOICE = 'nova'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const response = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: VOICE,
      input: text,
      speed: 0.9,
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // cache audio for 24h
      },
    })
  } catch (err) {
    console.error('[/api/tts]', err)
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
