export { basicConsonants, basicVowels, compoundVowels, tenseConsonants, hangulLessons, syllableExamples } from './hangul'
export { koreanGrammarUnits } from './grammar'

export const KOREAN_META = {
  code: 'ko' as const,
  name: 'Korean',
  nativeName: '한국어',
  flag: '🇰🇷',
  cefr: ['A1', 'A2', 'B1', 'B2'] as const,
  hasConversationPartner: true,
  hasScript: true,
  scriptName: 'Hangul',
  scriptRequired: true, // must complete hangul before grammar unlocks
  grammarUnitCount: 16,
  tagline: 'From Hangul to fluency — the deepest Korean course available.',
}
