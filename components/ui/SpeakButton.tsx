'use client'

import { useTTS } from '@/lib/speech/useTTS'

interface Props {
  text: string
  lang?: string
  size?: 'sm' | 'md'
}

export function SpeakButton({ text, lang = 'ko', size = 'md' }: Props) {
  const { speak, stop, isSpeaking } = useTTS(lang)

  const sizeClass = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-9 h-9 text-base'

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      title={isSpeaking ? 'Stop' : 'Listen'}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all
        ${isSpeaking
          ? 'bg-violet-600 text-white animate-pulse'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
        }`}
    >
      {isSpeaking ? '⏹' : '🔊'}
    </button>
  )
}
