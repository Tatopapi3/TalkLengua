import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audio = formData.get('audio') as File
    const lang = (formData.get('lang') as string) || 'ko'

    if (!audio) return NextResponse.json({ error: 'No audio' }, { status: 400 })

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audio,
      language: lang,
    })

    return NextResponse.json({ transcript: transcription.text })
  } catch (err) {
    console.error('[/api/transcribe]', err)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
