'use client'

export interface QuizAttemptRecord {
  questionId: string
  lessonId: string
  languageCode: string
  grammarTopic: string
  isCorrect: boolean
  timestamp: number
}

export interface ProgressStore {
  xp: number
  completedLessons: string[]
  attempts: QuizAttemptRecord[]
}

const KEY = 'hyeotalk_progress'

function load(): ProgressStore {
  if (typeof window === 'undefined') return { xp: 0, completedLessons: [], attempts: [] }
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { xp: 0, completedLessons: [], attempts: [] }
  } catch {
    return { xp: 0, completedLessons: [], attempts: [] }
  }
}

function save(store: ProgressStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function recordAttempt(attempt: QuizAttemptRecord) {
  const store = load()
  store.attempts.push(attempt)
  store.xp += attempt.isCorrect ? 10 : 2
  save(store)
}

export function completeLesson(lessonId: string) {
  const store = load()
  if (!store.completedLessons.includes(lessonId)) {
    store.completedLessons.push(lessonId)
    store.xp += 50
  }
  save(store)
}

export function getProgress(): ProgressStore {
  return load()
}

export function getWeakTopics(): { topic: string; wrongCount: number }[] {
  const store = load()
  const counts: Record<string, { wrong: number; total: number }> = {}
  for (const a of store.attempts) {
    if (!counts[a.grammarTopic]) counts[a.grammarTopic] = { wrong: 0, total: 0 }
    counts[a.grammarTopic].total++
    if (!a.isCorrect) counts[a.grammarTopic].wrong++
  }
  return Object.entries(counts)
    .filter(([, v]) => v.wrong >= 1)
    .map(([topic, v]) => ({ topic, wrongCount: v.wrong }))
    .sort((a, b) => b.wrongCount - a.wrongCount)
}

export function getReviewQuestions(): { questionId: string; lessonId: string; grammarTopic: string }[] {
  const store = load()
  const wrongCounts: Record<string, { lessonId: string; grammarTopic: string; count: number }> = {}
  for (const a of store.attempts) {
    if (!a.isCorrect) {
      if (!wrongCounts[a.questionId]) {
        wrongCounts[a.questionId] = { lessonId: a.lessonId, grammarTopic: a.grammarTopic, count: 0 }
      }
      wrongCounts[a.questionId].count++
    }
  }
  return Object.entries(wrongCounts)
    .filter(([, v]) => v.count >= 2)
    .map(([questionId, v]) => ({ questionId, lessonId: v.lessonId, grammarTopic: v.grammarTopic }))
}

export function getAccuracy(): number {
  const store = load()
  if (store.attempts.length === 0) return 0
  const correct = store.attempts.filter(a => a.isCorrect).length
  return Math.round((correct / store.attempts.length) * 100)
}
