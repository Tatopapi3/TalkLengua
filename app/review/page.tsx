'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getReviewQuestions } from '@/lib/progress/store'
import { koreanGrammarUnits } from '@/content/korean/grammar'
import { hangulLessons } from '@/content/korean/hangul'
import { checkAnswer } from '@/lib/quiz/engine'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { MicButton } from '@/components/ui/MicButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { QuizQuestion } from '@/types'

export default function ReviewPage() {
  const [reviewItems, setReviewItems] = useState<QuizQuestion[]>([])
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [fillInput, setFillInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const toReview = getReviewQuestions()
    const allQuestions: QuizQuestion[] = [
      ...hangulLessons.flatMap(l => l.quiz as QuizQuestion[]),
      ...koreanGrammarUnits.flatMap(u => u.lessons.flatMap(l => l.quiz as QuizQuestion[])),
    ]
    const matched = toReview
      .map(r => allQuestions.find(q => q.id === r.questionId))
      .filter((q): q is QuizQuestion => q !== undefined)
    setReviewItems(matched)
    setLoaded(true)
  }, [])

  const currentQ = reviewItems[index]

  function submitAnswer(answer: string) {
    if (isCorrect !== null) return
    const correct = checkAnswer(currentQ, answer)
    setIsCorrect(correct)
    if (correct) setScore(s => s + 1)
  }

  function handleNext() {
    if (index + 1 >= reviewItems.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setFillInput('')
      setIsCorrect(null)
    }
  }

  if (!loaded) return null

  if (reviewItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Nothing to review yet</h1>
          <p className="text-gray-400 mb-6 text-sm">
            Questions you get wrong 2+ times will appear here. Complete some lessons first.
          </p>
          <Link href="/learn/ko" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Go to lessons →
          </Link>
        </div>
      </main>
    )
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">{score === reviewItems.length ? '🎉' : '📖'}</div>
          <h1 className="text-2xl font-bold mb-2">Review Complete</h1>
          <p className="text-gray-400 mb-2">{score} / {reviewItems.length} correct</p>
          <div className="text-4xl font-bold text-violet-400 mb-8">
            {Math.round((score / reviewItems.length) * 100)}%
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/learn/ko" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Back to lessons
            </Link>
            <Link href="/progress" className="border border-white/20 hover:border-white/40 text-gray-300 font-medium px-6 py-3 rounded-xl transition-colors">
              View progress
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/progress" className="text-gray-400 hover:text-white transition-colors text-sm">
          ← Progress
        </Link>
        <span className="text-sm font-medium">Review Queue</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{index + 1} / {reviewItems.length}</span>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-amber-900/40 border border-amber-700/50 text-amber-400 text-xs px-3 py-1 rounded-full font-medium">
            📋 Review Queue — questions you've missed 2+ times
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-10">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(index / reviewItems.length) * 100}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{currentQ.grammarTopic}</p>
        <div className="flex items-start gap-3 mb-8">
          <h2 className="text-xl font-bold font-korean flex-1">{currentQ.prompt}</h2>
          <SpeakButton text={currentQ.prompt} lang="ko" size="sm" />
        </div>

        {/* Multiple choice */}
        {currentQ.type === 'multiple_choice' && (
          <div className="grid gap-3 mb-6">
            {currentQ.options?.map(option => {
              let style = 'bg-gray-900 border border-white/10 hover:border-violet-500/50 hover:bg-gray-800 cursor-pointer'
              if (selected !== null) {
                if (option === currentQ.correctAnswer) style = 'bg-green-900/40 border border-green-500'
                else if (option === selected) style = 'bg-red-900/40 border border-red-500'
                else style = 'bg-gray-900 border border-white/10 opacity-40'
              }
              return (
                <button
                  key={option}
                  onClick={() => {
                    if (selected) return
                    setSelected(option)
                    submitAnswer(option)
                  }}
                  className={`${style} rounded-xl px-5 py-4 text-left font-medium font-korean transition-all`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* Fill in blank / sentence reorder */}
        {(currentQ.type === 'fill_blank' || currentQ.type === 'sentence_reorder') && (
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={fillInput}
                onChange={e => setFillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitAnswer(fillInput)}
                disabled={isCorrect !== null}
                placeholder="Type your answer..."
                className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white font-korean focus:outline-none focus:border-violet-500 disabled:opacity-60"
              />
              <MicButton lang="ko" onResult={text => setFillInput(text)} disabled={isCorrect !== null} />
              <button
                onClick={() => submitAnswer(fillInput)}
                disabled={isCorrect !== null || !fillInput.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                Check
              </button>
            </div>
          </div>
        )}

        {/* Script ID (same as multiple choice) */}
        {currentQ.type === 'script_id' && (
          <div className="grid gap-3 mb-6">
            {currentQ.options?.map(option => {
              let style = 'bg-gray-900 border border-white/10 hover:border-violet-500/50 hover:bg-gray-800 cursor-pointer'
              if (selected !== null) {
                if (option === currentQ.correctAnswer) style = 'bg-green-900/40 border border-green-500'
                else if (option === selected) style = 'bg-red-900/40 border border-red-500'
                else style = 'bg-gray-900 border border-white/10 opacity-40'
              }
              return (
                <button key={option} onClick={() => { if (!selected) { setSelected(option); submitAnswer(option) } }}
                  className={`${style} rounded-xl px-5 py-4 text-left font-medium transition-all`}>
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* Feedback */}
        {isCorrect !== null && (
          <div className={`rounded-xl p-5 mb-6 ${isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
            <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Not quite'}</p>
            {!isCorrect && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-300">
                  Correct: <span className="font-korean font-bold text-white">{currentQ.correctAnswer}</span>
                </p>
                <SpeakButton text={currentQ.correctAnswer} lang="ko" size="sm" />
              </div>
            )}
          </div>
        )}

        {isCorrect !== null && (
          <button
            onClick={handleNext}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {index + 1 >= reviewItems.length ? 'See results' : 'Next →'}
          </button>
        )}
      </div>
    </main>
  )
}
