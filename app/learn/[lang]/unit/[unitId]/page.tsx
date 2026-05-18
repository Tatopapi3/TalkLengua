'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, use } from 'react'
import { koreanGrammarUnits } from '@/content/korean/grammar'
import { checkAnswer } from '@/lib/quiz/engine'
import { recordAttempt, completeLesson } from '@/lib/progress/store'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { MicButton } from '@/components/ui/MicButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { playCorrect, playWrong } from '@/lib/sounds'
import type { QuizQuestion } from '@/types'

export default function UnitPage({ params }: { params: Promise<{ lang: string; unitId: string }> }) {
  const { lang, unitId } = use(params)
  const unit = koreanGrammarUnits.find(u => u.id === unitId)
  if (!unit) notFound()

  const allQuestions: QuizQuestion[] = unit.lessons.flatMap(l => l.quiz as QuizQuestion[])

  const [phase, setPhase] = useState<'learn' | 'quiz'>('learn')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [fillInput, setFillInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  const currentQ = allQuestions[questionIndex]

  async function fetchExplanation(q: QuizQuestion, userAnswer: string) {
    setLoadingExplanation(true)
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: q.id,
          questionText: q.prompt,
          correctAnswer: q.correctAnswer,
          userAnswer,
          grammarTopic: q.grammarTopic,
          languageCode: lang,
          cefrLevel: q.level,
        }),
      })
      const data = await res.json()
      setExplanation(data.explanation ?? null)
    } catch {
      setExplanation(null)
    } finally {
      setLoadingExplanation(false)
    }
  }

  function submitAnswer(answer: string) {
    if (isCorrect !== null) return
    const correct = checkAnswer(currentQ, answer)
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      playCorrect()
    } else {
      setStreak(0)
      playWrong()
      fetchExplanation(currentQ, answer)
    }
    recordAttempt({
      questionId: currentQ.id,
      lessonId: unit!.lessons.find(l => l.quiz.some(q => q.id === currentQ.id))?.id ?? unitId,
      languageCode: lang,
      grammarTopic: currentQ.grammarTopic,
      isCorrect: correct,
      timestamp: Date.now(),
    })
  }

  function handleSelect(option: string) {
    if (selected !== null) return
    setSelected(option)
    submitAnswer(option)
  }

  function handleFillSubmit() {
    if (isCorrect !== null) return
    submitAnswer(fillInput)
  }

  function handleNext() {
    if (questionIndex + 1 >= allQuestions.length) {
      unit!.lessons.forEach(l => completeLesson(l.id))
      setDone(true)
    } else {
      setQuestionIndex(i => i + 1)
      setSelected(null)
      setFillInput('')
      setIsCorrect(null)
      setExplanation(null)
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">{score === allQuestions.length ? '🎉' : '📖'}</div>
          <h1 className="text-3xl font-bold mb-2">Unit Complete</h1>
          <p className="text-gray-400 mb-2">{score} / {allQuestions.length} correct</p>
          <div className="text-4xl font-bold text-violet-400 mb-8">
            {Math.round((score / allQuestions.length) * 100)}%
          </div>
          <Link href={`/learn/${lang}`} className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Back to lessons
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href={`/learn/${lang}`} className="text-gray-400 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <span className="text-sm font-medium">{unit.title}</span>
        <div className="flex items-center gap-3">
          {phase === 'quiz' && (
            <span className="text-sm text-gray-400">{questionIndex + 1} / {allQuestions.length}</span>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {phase === 'learn' ? (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{unit.level}</span>
            <span className="text-xs text-gray-600">Unit {unit.order}</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">{unit.title}</h1>
          <p className="text-violet-400 font-medium mb-8">{unit.subtitle}</p>

          {/* Grammar explanation */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest text-gray-400">Grammar Rule</h2>
            <div className="text-gray-200 leading-relaxed whitespace-pre-line">{unit.explanation}</div>
          </div>

          {/* Examples */}
          <div className="mb-10">
            <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-widest mb-4">Examples</h2>
            <div className="space-y-3">
              {unit.examples.map((ex, i) => (
                <div key={i} className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-korean text-xl font-medium text-white mb-1">{ex.target}</p>
                    <p className="text-gray-400 text-sm">{ex.english}</p>
                  </div>
                  <SpeakButton text={ex.target} lang={lang} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPhase('quiz')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Start Quiz ({allQuestions.length} questions) →
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-52">
          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${(questionIndex / allQuestions.length) * 100}%` }}
            />
          </div>

          {streak >= 3 && (
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold px-4 py-1.5 rounded-full">
                🔥 {streak} in a row!
              </span>
            </div>
          )}

          <p className="text-xs text-gray-500 uppercase tracking-widest mt-8 mb-3">{currentQ.grammarTopic}</p>
          <div className="flex items-start gap-3 mb-1">
            <h2 className="text-2xl font-bold font-korean flex-1">{currentQ.prompt}</h2>
            <SpeakButton text={currentQ.prompt} lang={lang} size="sm" />
          </div>
          {currentQ.promptTranslation && (
            <p className="text-gray-400 text-sm mb-10 italic">{currentQ.promptTranslation}</p>
          )}
          {!currentQ.promptTranslation && <div className="mb-10" />}

          {/* Multiple choice — 2-column tiles */}
          {currentQ.type === 'multiple_choice' && (
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options?.map(option => {
                let cls = 'bg-gray-900 border-2 border-white/20 hover:border-violet-500 hover:bg-gray-800 cursor-pointer text-white'
                if (selected !== null) {
                  if (option === currentQ.correctAnswer) cls = 'bg-violet-900/40 border-2 border-violet-500 text-violet-300 cursor-default'
                  else if (option === selected) cls = 'bg-red-900/40 border-2 border-red-500 text-red-300 cursor-default'
                  else cls = 'bg-gray-900 border-2 border-white/10 text-gray-600 cursor-default opacity-50'
                }
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`${cls} rounded-2xl px-5 py-6 text-center font-semibold text-lg font-korean transition-all`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fill in the blank */}
          {currentQ.type === 'fill_blank' && (
            <div className="flex gap-3">
              <input
                type="text"
                value={fillInput}
                onChange={e => setFillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
                disabled={isCorrect !== null}
                placeholder="Type your answer..."
                className="flex-1 bg-gray-900 border-2 border-white/20 rounded-2xl px-4 py-4 text-white font-korean text-lg focus:outline-none focus:border-violet-500 disabled:opacity-60"
              />
              <MicButton lang={lang} onResult={text => setFillInput(text)} disabled={isCorrect !== null} />
              <button
                onClick={handleFillSubmit}
                disabled={isCorrect !== null || !fillInput.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold px-6 py-4 rounded-2xl transition-colors"
              >
                Check
              </button>
            </div>
          )}

          {/* Sentence reorder */}
          {currentQ.type === 'sentence_reorder' && (
            <div className="flex gap-3">
              <input
                type="text"
                value={fillInput}
                onChange={e => setFillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
                disabled={isCorrect !== null}
                placeholder="Type the correct sentence..."
                className="flex-1 bg-gray-900 border-2 border-white/20 rounded-2xl px-4 py-4 text-white font-korean text-lg focus:outline-none focus:border-violet-500 disabled:opacity-60"
              />
              <MicButton lang={lang} onResult={text => setFillInput(text)} disabled={isCorrect !== null} />
              <button
                onClick={handleFillSubmit}
                disabled={isCorrect !== null || !fillInput.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold px-6 py-4 rounded-2xl transition-colors"
              >
                Check
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fixed bottom feedback panel */}
      {phase === 'quiz' && isCorrect !== null && (
        <div className={`fixed bottom-0 left-0 right-0 border-t px-6 py-5 backdrop-blur-sm ${
          isCorrect ? 'bg-violet-950/95 border-violet-800' : 'bg-red-950/95 border-red-800'
        }`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                isCorrect ? 'bg-violet-500' : 'bg-red-500'
              }`}>
                {isCorrect ? '✓' : '✗'}
              </div>
              <div className="min-w-0">
                <p className={`font-bold text-xl ${isCorrect ? 'text-violet-300' : 'text-red-400'}`}>
                  {isCorrect ? 'Excellent!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-gray-300">
                      Answer: <span className="font-korean font-bold text-white">{currentQ.correctAnswer}</span>
                    </p>
                    <SpeakButton text={currentQ.correctAnswer} lang={lang} size="sm" />
                  </div>
                )}
                {loadingExplanation && <p className="text-sm text-gray-400 italic mt-1">Getting explanation…</p>}
                {explanation && <p className="text-sm text-gray-300 mt-1 leading-relaxed">{explanation}</p>}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`flex-shrink-0 px-8 py-4 rounded-2xl font-bold text-white uppercase tracking-wide transition-colors ${
                isCorrect ? 'bg-violet-600 hover:bg-violet-500' : 'bg-red-500 hover:bg-red-400'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
