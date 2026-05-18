'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProgress, getWeakTopics, getAccuracy } from '@/lib/progress/store'
import { koreanGrammarUnits } from '@/content/korean/grammar'
import { hangulLessons } from '@/content/korean/hangul'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const TOTAL_LESSONS = koreanGrammarUnits.length + hangulLessons.length

export default function ProgressPage() {
  const [xp, setXp] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [accuracy, setAccuracy] = useState(0)
  const [weakTopics, setWeakTopics] = useState<{ topic: string; wrongCount: number }[]>([])
  const [totalAttempts, setTotalAttempts] = useState(0)

  useEffect(() => {
    const progress = getProgress()
    setXp(progress.xp)
    setCompletedLessons(progress.completedLessons)
    setTotalAttempts(progress.attempts.length)
    setAccuracy(getAccuracy())
    setWeakTopics(getWeakTopics())
  }, [])

  const completedCount = completedLessons.length
  const completionPct = Math.round((completedCount / TOTAL_LESSONS) * 100)

  const completedHangul = hangulLessons.filter(l => completedLessons.includes(l.id))
  const completedGrammar = koreanGrammarUnits.filter(u =>
    u.lessons.some(l => completedLessons.includes(l.id))
  )

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
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-gray-400 mb-10">🇰🇷 Korean · A1</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'XP Earned', value: xp.toLocaleString(), icon: '⚡' },
            { label: 'Quiz Accuracy', value: `${accuracy}%`, icon: '🎯' },
            { label: 'Questions Answered', value: totalAttempts.toString(), icon: '📝' },
            { label: 'Lessons Done', value: `${completedCount}/${TOTAL_LESSONS}`, icon: '✅' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Course completion bar */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Course Completion</h2>
            <span className="text-violet-400 font-bold">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div
              className="bg-violet-500 h-3 rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Hangul modules: </span>
              <span className="text-white font-medium">{completedHangul.length}/{hangulLessons.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Grammar units: </span>
              <span className="text-white font-medium">{completedGrammar.length}/{koreanGrammarUnits.length}</span>
            </div>
          </div>
        </div>

        {/* Weak topics */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Topics to Review</h2>
            {weakTopics.length > 0 && (
              <Link href="/review" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Start review →
              </Link>
            )}
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {totalAttempts === 0
                ? 'Complete some lessons to see your weak spots here.'
                : '🎉 No weak topics yet — keep it up!'}
            </p>
          ) : (
            <div className="space-y-2">
              {weakTopics.slice(0, 6).map(t => (
                <div key={t.topic} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-gray-300">{t.topic}</span>
                  <span className="text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded-full">
                    {t.wrongCount} mistake{t.wrongCount > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed lessons */}
        {completedLessons.length > 0 && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Completed Lessons</h2>
            <div className="space-y-2">
              {completedHangul.map(l => (
                <Link
                  key={l.id}
                  href={`/learn/ko/hangul/${l.id}`}
                  className="flex items-center gap-3 py-2 hover:text-violet-300 transition-colors group"
                >
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm text-gray-300 group-hover:text-violet-300 transition-colors">Hangul: {l.title}</span>
                  <span className="text-xs text-gray-600 ml-auto">Replay →</span>
                </Link>
              ))}
              {completedGrammar.map(u => (
                <Link
                  key={u.id}
                  href={`/learn/ko/unit/${u.id}`}
                  className="flex items-center gap-3 py-2 hover:text-violet-300 transition-colors group"
                >
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm text-gray-300 group-hover:text-violet-300 transition-colors">{u.title}</span>
                  <span className="text-xs text-gray-600 ml-auto">Replay →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {completedLessons.length === 0 && totalAttempts === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🇰🇷</div>
            <h2 className="text-xl font-semibold mb-2">Ready to start?</h2>
            <p className="text-gray-400 mb-6 text-sm">Complete your first lesson to see your progress here.</p>
            <Link href="/learn/ko" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Start learning →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
