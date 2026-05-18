'use client'

import { useEffect } from 'react'
import { useSTT } from '@/lib/speech/useSTT'

interface Props {
  lang?: string
  onResult: (text: string) => void
  disabled?: boolean
}

export function MicButton({ lang = 'ko', onResult, disabled = false }: Props) {
  const { isListening, transcript, error, startListening, stopListening } = useSTT(lang)

  useEffect(() => {
    if (transcript && !isListening) {
      onResult(transcript)
    }
  }, [transcript, isListening, onResult])

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => isListening ? stopListening() : startListening()}
        disabled={disabled}
        title={isListening ? 'Stop recording' : 'Speak your answer'}
        className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all
          ${isListening
            ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        {isListening ? '⏹' : '🎤'}
      </button>
      {isListening && (
        <span className="text-xs text-red-400 animate-pulse">Listening...</span>
      )}
      {error && (
        <span className="text-xs text-red-400 max-w-32 text-center">{error}</span>
      )}
    </div>
  )
}
