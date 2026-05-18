'use client'

import { useState, useCallback, useRef } from 'react'

export function useTTS(langCode = 'ko') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    stop()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langCode === 'ko' ? 'ko-KR' : langCode
    utterance.rate = 0.85
    utterance.pitch = 1

    // prefer a Korean voice if available
    const voices = window.speechSynthesis.getVoices()
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'))
    if (koreanVoice) utterance.voice = koreanVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [langCode, stop])

  return { speak, stop, isSpeaking }
}
