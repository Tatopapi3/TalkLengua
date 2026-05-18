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
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const SR = window.SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) {
      setError('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SR()
    recognition.lang = LANG_CODES[langCode] ?? langCode
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('')
      setTranscript(result)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error === 'not-allowed'
        ? 'Microphone access denied. Please allow mic access and try again.'
        : 'Could not recognize speech. Try again.')
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [langCode])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const clearTranscript = useCallback(() => setTranscript(''), [])

  return { isListening, transcript, error, startListening, stopListening, clearTranscript }
}
