import type { QuizQuestion, QuizAttempt } from '@/types'

export function checkAnswer(question: QuizQuestion, userAnswer: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalize(userAnswer) === normalize(question.correctAnswer)
}

export function shuffleOptions(options: string[]): string[] {
  return [...options].sort(() => Math.random() - 0.5)
}

export function scoreSession(attempts: QuizAttempt[]): {
  total: number
  correct: number
  accuracy: number
  wrongTopics: string[]
} {
  const total = attempts.length
  const correct = attempts.filter(a => a.isCorrect).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const wrongTopics = [...new Set(
    attempts.filter(a => !a.isCorrect).map(a => {
      // questionId not directly linked to topic here, so we use the stored topic if available
      return a.correctAnswer // placeholder — real impl joins with question data
    })
  )]
  return { total, correct, accuracy, wrongTopics }
}

export function buildReviewQueue(
  attempts: QuizAttempt[],
  questions: QuizQuestion[]
): QuizQuestion[] {
  const wrongCounts: Record<string, number> = {}
  for (const attempt of attempts) {
    if (!attempt.isCorrect) {
      wrongCounts[attempt.questionId] = (wrongCounts[attempt.questionId] ?? 0) + 1
    }
  }
  // Surface questions wrong 2+ times
  return questions.filter(q => (wrongCounts[q.id] ?? 0) >= 2)
}

export function calculateXP(attempts: QuizAttempt[]): number {
  return attempts.reduce((xp, a) => xp + (a.isCorrect ? 10 : 2), 0)
}
