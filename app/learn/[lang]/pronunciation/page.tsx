'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { pronunciationQuests } from '@/content/korean/pronunciation'
import { useTTS } from '@/lib/speech/useTTS'
import { useSTT } from '@/lib/speech/useSTT'
import type { PronunciationQuest } from '@/content/korean/pronunciation'

// ── helpers ──────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s.trim().replace(/\s+/g, '')
}

function checkPronunciation(heard: string, expected: string): boolean {
  const h = normalize(heard)
  const e = normalize(expected)
  return h === e || h.includes(e) || e.includes(h)
}

// ── QuestCard (lobby) ─────────────────────────────────────────────────────────

function QuestCard({
  quest,
  completed,
  onStart,
}: {
  quest: PronunciationQuest
  completed: boolean
  onStart: () => void
}) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all
      ${completed
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{quest.emoji}</span>
          <div>
            <h3 className="font-bold text-sm">{quest.title}</h3>
            <p className="text-xs text-gray-400">{quest.description}</p>
          </div>
        </div>
        {completed && (
          <span className="text-emerald-400 text-lg">✓</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-violet-400 font-semibold">+{quest.xp} XP · {quest.words.length} words</span>
        <button
          onClick={onStart}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors
            ${completed
              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-violet-600 hover:bg-violet-500 text-white'
            }`}
        >
          {completed ? 'Retry' : 'Start Quest'}
        </button>
      </div>
    </div>
  )
}

// ── ActiveQuest ───────────────────────────────────────────────────────────────

function ActiveQuest({
  quest,
  lang,
  onFinish,
}: {
  quest: PronunciationQuest
  lang: string
  onFinish: (score: number) => void
}) {
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState<'idle' | 'listening' | 'correct' | 'wrong' | 'error'>('idle')
  const [heard, setHeard] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const { speak, isSpeaking } = useTTS(lang)
  const { isListening, transcript, error, startListening, stopListening, clearTranscript } = useSTT(lang)

  const word = quest.words[idx]
  const total = quest.words.length
  const isLast = idx === total - 1

  // fire when STT finishes
  useEffect(() => {
    if (!transcript || isListening) return
    const correct = checkPronunciation(transcript, word.korean)
    setHeard(transcript)
    setResult(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
    setStreak(s => correct ? s + 1 : 0)
    setAttempts(s => s + 1)
  }, [transcript, isListening, word.korean])

  useEffect(() => {
    if (error) setResult('error')
  }, [error])

  function handleListen() {
    clearTranscript()
    setHeard('')
    setResult('listening')
    startListening()
  }

  function handleNext() {
    clearTranscript()
    setHeard('')
    setResult('idle')
    if (isLast) {
      onFinish(score + (result === 'correct' ? 1 : 0))
    } else {
      setIdx(i => i + 1)
    }
  }

  function handleRetry() {
    clearTranscript()
    setHeard('')
    setResult('idle')
  }

  const progressPct = ((idx) / total) * 100

  return (
    <div className="max-w-lg mx-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{quest.emoji}</span>
          <span>{quest.title}</span>
        </div>
        <span className="text-xs text-gray-500">{idx + 1} / {total}</span>
      </div>

      {/* progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* streak badge */}
      {streak >= 2 && (
        <div className="text-center mb-4 animate-bounce">
          <span className="text-xs font-bold text-amber-400">🔥 {streak} streak!</span>
        </div>
      )}

      {/* word card */}
      <div className={`rounded-3xl border p-8 text-center mb-6 transition-all
        ${result === 'correct' ? 'border-emerald-500/40 bg-emerald-500/5' :
          result === 'wrong'   ? 'border-red-500/40 bg-red-500/5' :
          'border-white/10 bg-white/3'
        }`}>

        <p className="text-8xl font-bold mb-3 tracking-tight">{word.korean}</p>
        <p className="text-gray-400 text-sm mb-1">{word.romanization}</p>
        <p className="text-gray-500 text-xs mb-6">{word.english}</p>

        {word.tip && (
          <p className="text-xs text-violet-300/70 italic mb-6 max-w-xs mx-auto">
            💡 {word.tip}
          </p>
        )}

        {/* listen first */}
        <button
          onClick={() => speak(word.korean)}
          disabled={isSpeaking}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all mb-6 disabled:opacity-50"
        >
          {isSpeaking ? '🔊 Playing...' : '🔊 Hear it'}
        </button>

        {/* result feedback */}
        {result === 'correct' && (
          <div className="mb-4 space-y-1">
            <p className="text-emerald-400 font-bold text-lg">✓ Perfect!</p>
            <p className="text-xs text-gray-400">You said: <span className="text-white">{heard}</span></p>
          </div>
        )}
        {result === 'wrong' && (
          <div className="mb-4 space-y-1">
            <p className="text-red-400 font-bold">✗ Try again</p>
            <p className="text-xs text-gray-400">
              Heard: <span className="text-white">{heard || '(nothing)'}</span> · Expected: <span className="text-violet-300">{word.korean}</span>
            </p>
          </div>
        )}
        {result === 'error' && (
          <p className="text-red-400 text-xs mb-4">Mic error — check browser permissions and try again</p>
        )}
        {result === 'listening' && isListening && (
          <p className="text-red-400 text-sm animate-pulse mb-4">🎤 Listening... speak now</p>
        )}
      </div>

      {/* action buttons */}
      <div className="flex gap-3 justify-center">
        {(result === 'idle' || result === 'listening') && (
          <button
            onClick={isListening ? stopListening : handleListen}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all
              ${isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/20'
                : 'bg-violet-600 hover:bg-violet-500 text-white'
              }`}
          >
            {isListening ? '⏹ Stop' : '🎤 Speak'}
          </button>
        )}

        {result === 'wrong' && (
          <>
            <button
              onClick={handleRetry}
              className="px-5 py-3 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-2xl font-bold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-all"
            >
              Skip →
            </button>
          </>
        )}

        {result === 'correct' && (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
          >
            {isLast ? 'Finish Quest 🎉' : 'Next →'}
          </button>
        )}

        {result === 'error' && (
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────

function QuestResults({
  quest,
  score,
  onBack,
}: {
  quest: PronunciationQuest
  score: number
  onBack: () => void
}) {
  const total = quest.words.length
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 60

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
      <h2 className="text-2xl font-bold mb-1">{passed ? 'Quest Complete!' : 'Keep Practicing!'}</h2>
      <p className="text-gray-400 text-sm mb-8">{quest.title}</p>

      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-8">
        <p className="text-5xl font-bold mb-1" style={{ color: passed ? '#34d399' : '#f87171' }}>
          {score}/{total}
        </p>
        <p className="text-gray-400 text-sm">{pct}% correct</p>
        {passed && (
          <p className="text-violet-400 font-semibold mt-3">+{quest.xp} XP earned</p>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          ← All Quests
        </button>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PronunciationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const [activeQuest, setActiveQuest] = useState<PronunciationQuest | null>(null)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  function startQuest(quest: PronunciationQuest) {
    setActiveQuest(quest)
    setLastScore(null)
    setShowResults(false)
  }

  function finishQuest(score: number) {
    if (!activeQuest) return
    setLastScore(score)
    setShowResults(true)
    if (score / activeQuest.words.length >= 0.6) {
      setCompleted(prev => new Set([...prev, activeQuest.id]))
    }
  }

  function backToLobby() {
    setActiveQuest(null)
    setShowResults(false)
    setLastScore(null)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href={`/learn/${lang}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          ← Korean
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg">🎤</span>
          <span className="font-bold">Pronunciation Quests</span>
        </div>
        <div className="text-xs text-gray-500">{completed.size}/{pronunciationQuests.length} done</div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {!activeQuest ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Speak Korean 🎤</h1>
              <p className="text-gray-400 text-sm">
                Each quest gives you Korean words to say out loud. The app listens and checks your pronunciation. Use Chrome for best results.
              </p>
            </div>

            {/* overall progress */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4 mb-8 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Overall progress</span>
                  <span>{completed.size} / {pronunciationQuests.length} quests</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${(completed.size / pronunciationQuests.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-violet-400">
                  {[...completed].reduce((xp, id) => {
                    const q = pronunciationQuests.find(q => q.id === id)
                    return xp + (q?.xp ?? 0)
                  }, 0)}
                </p>
                <p className="text-xs text-gray-500">XP earned</p>
              </div>
            </div>

            <div className="grid gap-4">
              {pronunciationQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  completed={completed.has(quest.id)}
                  onStart={() => startQuest(quest)}
                />
              ))}
            </div>
          </>
        ) : showResults && lastScore !== null ? (
          <QuestResults
            quest={activeQuest}
            score={lastScore}
            onBack={backToLobby}
          />
        ) : (
          <ActiveQuest
            quest={activeQuest}
            lang={lang}
            onFinish={finishQuest}
          />
        )}
      </div>
    </main>
  )
}
