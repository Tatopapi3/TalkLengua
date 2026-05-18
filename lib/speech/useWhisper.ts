'use client'

import { useState, useRef, useCallback } from 'react'

export function useWhisper(langCode = 'ko') {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setTranscript('')
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        setIsTranscribing(true)

        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
          const form = new FormData()
          form.append('audio', file)
          form.append('lang', langCode)

          const res = await fetch('/api/transcribe', { method: 'POST', body: form })
          const data = await res.json()
          setTranscript(data.transcript ?? '')
        } catch {
          setError('Transcription failed. Try again.')
        } finally {
          setIsTranscribing(false)
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (err: any) {
      setError(err.name === 'NotAllowedError'
        ? 'Microphone access denied. Click the 🔒 in the address bar and allow microphone.'
        : 'Could not access microphone.')
    }
  }, [langCode])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
  }, [])

  const clearTranscript = useCallback(() => setTranscript(''), [])

  return { isRecording, isTranscribing, transcript, error, startRecording, stopRecording, clearTranscript }
}
