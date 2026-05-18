'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, use } from 'react'
import { hangulLessons } from '@/content/korean/hangul'
import { checkAnswer } from '@/lib/quiz/engine'
import { recordAttempt, completeLesson } from '@/lib/progress/store'
import { SpeakButton } from '@/components/ui/SpeakButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { playCorrect, playWrong } from '@/lib/sounds'
import type { QuizQuestion } from '@/types'

export default function HangulLessonPage({ params }: { params: Promise<{ lang: string; lessonId: string }> }) {
  const { lang, lessonId } = use(params)
  const lesson = hangulLessons.find(l => l.id === lessonId)
  if (!lesson) notFound()

  const [phase, setPhase] = useState<'learn' | 'quiz'>('learn')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  const questions: QuizQuestion[] = lesson.quiz as QuizQuestion[]
  const currentQ = questions[questionIndex]

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

  function handleSelect(option: string) {
    if (selected !== null) return
    setSelected(option)
    const correct = checkAnswer(currentQ, option)
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      playCorrect()
    } else {
      setStreak(0)
      playWrong()
      fetchExplanation(currentQ, option)
    }
    recordAttempt({
      questionId: currentQ.id,
      lessonId: lessonId,
      languageCode: lang,
      grammarTopic: currentQ.grammarTopic,
      isCorrect: correct,
      timestamp: Date.now(),
    })
  }

  function handleNext() {
    if (questionIndex + 1 >= questions.length) {
      completeLesson(lessonId)
      setDone(true)
    } else {
      setQuestionIndex(i => i + 1)
      setSelected(null)
      setIsCorrect(null)
      setExplanation(null)
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">{score === questions.length ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-bold mb-2">
            {score === questions.length ? 'Perfect!' : 'Lesson Complete'}
          </h1>
          <p className="text-gray-400 mb-2">
            You got {score} of {questions.length} correct
          </p>
          <div className="text-4xl font-bold text-violet-400 mb-8">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <div className="flex flex-col gap-3">
            <Link href={`/learn/${lang}`} className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Back to lessons
            </Link>
          </div>
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
        <span className="text-sm font-medium">{lesson.title}</span>
        <div className="flex items-center gap-3">
          {phase === 'quiz' && (
            <span className="text-sm text-gray-400">{questionIndex + 1} / {questions.length}</span>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {phase === 'learn' ? (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-400 mb-10">{lesson.description}</p>

          {'characters' in lesson && lesson.characters.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-10">
              {lesson.characters.map(char => (
                <div key={char.character} className="bg-gray-900 border border-white/10 rounded-xl p-4 text-center group relative">
                  <div className="text-3xl font-korean font-bold mb-1">{char.character}</div>
                  <div className="text-xs text-gray-400 mb-2">{char.romanization}</div>
                  <div className="flex justify-center">
                    <SpeakButton text={char.character} lang={lang} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {'syllableExamples' in lesson && lesson.syllableExamples && (
            <div className="space-y-4 mb-10">
              {lesson.syllableExamples.map(ex => (
                <div key={ex.result} className="bg-gray-900 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                  <div className="text-3xl font-korean font-bold text-violet-400">{ex.result}</div>
                  <div className="text-gray-400 flex-1">
                    <span className="text-white">{ex.components.join(' + ')}</span>
                    {' = '}
                    <span className="font-korean">{ex.result}</span>
                    {' · '}
                    {ex.romanization}
                    {' · '}
                    <span className="text-gray-500 italic">{ex.meaning}</span>
                  </div>
                  <SpeakButton text={ex.result} lang={lang} size="sm" />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setPhase('quiz')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Start Quiz ({questions.length} questions) →
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-52">
          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${((questionIndex) / questions.length) * 100}%` }}
            />
          </div>

          {streak >= 3 && (
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold px-4 py-1.5 rounded-full">
                🔥 {streak} in a row!
              </span>
            </div>
          )}

          <p className="text-xs text-gray-500 uppercase tracking-widest mt-8 mb-2">{currentQ.grammarTopic}</p>
          <p className="text-lg font-semibold text-gray-300 mb-6">Choose the correct answer</p>
          <div className="flex items-center gap-4 mb-12">
            <span className="text-5xl font-korean font-bold">{currentQ.prompt}</span>
            <SpeakButton text={currentQ.prompt} lang={lang} size="sm" />
          </div>

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
        </div>
      )}

      {/* Fixed bottom feedback panel */}
      {phase === 'quiz' && selected !== null && (
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
                  <p className="text-sm text-gray-300 mt-0.5">
                    Answer: <span className="font-korean font-bold text-white">{currentQ.correctAnswer}</span>
                  </p>
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
