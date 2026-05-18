export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2'

export type LanguageCode = 'ko' | 'pt' | 'ru' | 'es' | 'en' | 'fr' | 'de'

export type Formality = 'casual' | 'polite' | 'formal'

export type QuizType = 'multiple_choice' | 'fill_blank' | 'sentence_reorder' | 'script_id'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  cefr: CEFRLevel[]
  hasConversationPartner: boolean
  hasScript: boolean
  scriptName?: string
}

export interface HangulCharacter {
  character: string
  romanization: string
  type: 'consonant' | 'vowel' | 'compound_vowel' | 'tense_consonant'
  audioUrl?: string
}

export interface GrammarUnit {
  id: string
  language: LanguageCode
  level: CEFRLevel
  order: number
  title: string
  subtitle: string
  explanation: string
  examples: { target: string; english: string }[]
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  unitId: string
  order: number
  title: string
  content: string
  quiz: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  type: QuizType
  prompt: string
  promptTranslation?: string
  options?: string[]
  correctAnswer: string
  grammarTopic: string
  level: CEFRLevel
}

export interface QuizAttempt {
  questionId: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timestamp: string
  explanation?: string
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  corrections?: GrammarCorrection[]
  timestamp: string
}

export interface GrammarCorrection {
  original: string
  corrected: string
  explanation: string
}

export interface ConversationSession {
  id: string
  userId: string
  language: LanguageCode
  scenario: ConversationScenario
  formality: Formality
  messages: ConversationMessage[]
  createdAt: string
  updatedAt: string
}

export type ConversationScenario =
  | 'introduce_yourself'
  | 'order_food'
  | 'ask_directions'
  | 'make_a_friend'
  | 'at_work'
  | 'free_chat'

export interface UserProgress {
  userId: string
  language: LanguageCode
  level: CEFRLevel
  xp: number
  completedLessons: string[]
  quizAccuracy: Record<string, number>
  weakTopics: string[]
}
