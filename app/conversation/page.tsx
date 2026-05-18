'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { MicButton } from '@/components/ui/MicButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { GrammarCorrection, ConversationScenario, Formality } from '@/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  corrections?: GrammarCorrection[]
}

const SCENARIOS: { id: ConversationScenario; label: string; emoji: string; description: string }[] = [
  { id: 'introduce_yourself', label: 'Introduce Yourself', emoji: '👋', description: '자기소개 — tell Claude who you are' },
  { id: 'order_food', label: 'Order Food', emoji: '🍜', description: '음식 주문 — practice at a Korean restaurant' },
  { id: 'ask_directions', label: 'Ask Directions', emoji: '🗺️', description: '길 묻기 — navigate around the city' },
  { id: 'make_a_friend', label: 'Make a Friend', emoji: '🤝', description: '친구 사귀기 — casual small talk' },
  { id: 'at_work', label: 'At Work', emoji: '💼', description: '직장에서 — professional Korean conversation' },
  { id: 'free_chat', label: 'Free Chat', emoji: '💬', description: '자유 대화 — talk about anything' },
]

const FORMALITY_OPTIONS: { id: Formality; label: string; korean: string; description: string }[] = [
  { id: 'casual', label: 'Casual', korean: '반말', description: 'Close friends, younger people' },
  { id: 'polite', label: 'Polite', korean: '요체', description: 'Everyday adult situations — recommended' },
  { id: 'formal', label: 'Formal', korean: '합쇼체', description: 'Professional, high-respect contexts' },
]

export default function ConversationPage() {
  const [scenario, setScenario] = useState<ConversationScenario | null>(null)
  const [formality, setFormality] = useState<Formality>('polite')
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedCorrections, setExpandedCorrections] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || loading || !scenario) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/converse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languageCode: 'ko',
          scenario,
          formality,
          cefrLevel: 'A1',
          history: messages.map(m => ({ role: m.role, content: m.content })),
          userMessage: text.trim(),
        }),
      })
      const data = await res.json()
      setMessages([...updatedHistory, {
        role: 'assistant',
        content: data.response,
        corrections: data.corrections ?? [],
      }])
    } catch {
      setMessages([...updatedHistory, {
        role: 'assistant',
        content: '죄송해요, 오류가 발생했어요. 다시 시도해주세요.',
        corrections: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleStart() {
    if (!scenario) return
    setStarted(true)
    setMessages([])
  }

  function handleReset() {
    setStarted(false)
    setMessages([])
    setScenario(null)
    setInput('')
  }

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className="text-xl font-bold tracking-tight">TalkLengua</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/learn/ko" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to lessons
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-900/40 border border-violet-700/50 rounded-full px-3 py-1 text-xs text-violet-300 mb-4">
              🤖 Powered by Claude AI
            </div>
            <h1 className="text-3xl font-bold mb-2">AI Conversation Partner</h1>
            <p className="text-gray-400">
              Have a real Korean conversation with Claude. Choose a scenario and formality level — Claude will respond in Korean and correct your grammar inline.
            </p>
          </div>

          {/* Scenario picker */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Choose a scenario</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`text-left rounded-2xl p-5 border transition-all ${
                    scenario === s.id
                      ? 'bg-violet-900/40 border-violet-500'
                      : 'bg-gray-900 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <div className="font-semibold text-white mb-1">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Formality picker */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Speech formality level</h2>
            <div className="grid grid-cols-3 gap-3">
              {FORMALITY_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormality(f.id)}
                  className={`text-left rounded-2xl p-4 border transition-all ${
                    formality === f.id
                      ? 'bg-violet-900/40 border-violet-500'
                      : 'bg-gray-900 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="font-korean font-bold text-lg text-white mb-1">{f.korean}</div>
                  <div className="font-semibold text-sm text-gray-300 mb-1">{f.label}</div>
                  <div className="text-xs text-gray-500">{f.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!scenario}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors text-lg"
          >
            {scenario ? `Start conversation →` : 'Select a scenario to begin'}
          </button>
        </div>
      </main>
    )
  }

  // ── Chat screen ────────────────────────────────────────────────────────────
  const selectedScenario = SCENARIOS.find(s => s.id === scenario)!
  const selectedFormality = FORMALITY_OPTIONS.find(f => f.id === formality)!

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">{selectedScenario.emoji}</span>
          <div>
            <div className="font-semibold text-sm">{selectedScenario.label}</div>
            <div className="text-xs text-gray-500">
              <span className="font-korean">{selectedFormality.korean}</span> · {selectedFormality.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← New conversation
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-2xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">{selectedScenario.emoji}</div>
            <p className="text-gray-400 text-sm">
              Start the conversation — type or speak in Korean, or use romanization if you're just starting out.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              {/* Bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-sm'
                  : 'bg-gray-800 text-white rounded-bl-sm'
              }`}>
                <p className="font-korean leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <div className="mt-2 flex justify-end">
                    <SpeakButton text={msg.content} lang="ko" size="sm" />
                  </div>
                )}
              </div>

              {/* Corrections */}
              {msg.role === 'assistant' && msg.corrections && msg.corrections.length > 0 && (
                <div className="w-full">
                  <button
                    onClick={() => setExpandedCorrections(expandedCorrections === i ? null : i)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    ✏️ {msg.corrections.length} correction{msg.corrections.length > 1 ? 's' : ''}
                    {expandedCorrections === i ? ' ▲' : ' ▼'}
                  </button>
                  {expandedCorrections === i && (
                    <div className="mt-2 space-y-2">
                      {msg.corrections.map((c, ci) => (
                        <div key={ci} className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-3 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-korean text-red-400 line-through">{c.original}</span>
                            <span className="text-gray-500">→</span>
                            <span className="font-korean text-green-400 font-semibold">{c.corrected}</span>
                            <SpeakButton text={c.corrected} lang="ko" size="sm" />
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed">{c.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 px-4 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <MicButton lang="ko" onResult={text => setInput(text)} disabled={loading} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            disabled={loading}
            placeholder="한국어로 입력하세요... (Type in Korean or romanization)"
            rows={1}
            className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white font-korean placeholder:text-gray-600 focus:outline-none focus:border-violet-500 resize-none disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-5 py-3 rounded-xl transition-colors flex-shrink-0"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-gray-700 mt-2">Enter to send · Shift+Enter for new line · 🎤 to speak</p>
      </div>
    </main>
  )
}
