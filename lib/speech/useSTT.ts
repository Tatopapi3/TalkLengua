'use client'

import { useState, useRef, useCallback } from 'react'

const LANG_CODES: Record<string, string> = {
  ko: 'ko-KR',
  pt: 'pt-BR',
  ru: 'ru-RU',
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
}

export function useSTT(langCode = 'ko') {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) {
      setError('Speech recognition not supported. Use Chrome.')
      return
    }

    const recognition = new SR()
    recognition.lang = LANG_CODES[langCode] ?? langCode
    recognition.continuous = false
    recognition.interimResults = true
    transcriptRef.current = ''

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('')
      transcriptRef.current = result
      setTranscript(result)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error === 'not-allowed'
        ? 'Microphone access denied. Allow mic access and try again.'
        : 'Could not recognize speech. Try again.')
      setIsListening(false)
    }

    // Set transcript from ref first, then mark done — React 18 batches both
    recognition.onend = () => {
      setTranscript(transcriptRef.current)
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [langCode])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const clearTranscript = useCallback(() => {
    transcriptRef.current = ''
    setTranscript('')
  }, [])

  return { isListening, transcript, error, startListening, stopListening, clearTranscript }
}
