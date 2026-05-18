import type { HangulCharacter } from '@/types'

export const basicConsonants: HangulCharacter[] = [
  { character: 'ㄱ', romanization: 'g/k', type: 'consonant' },
  { character: 'ㄴ', romanization: 'n', type: 'consonant' },
  { character: 'ㄷ', romanization: 'd/t', type: 'consonant' },
  { character: 'ㄹ', romanization: 'r/l', type: 'consonant' },
  { character: 'ㅁ', romanization: 'm', type: 'consonant' },
  { character: 'ㅂ', romanization: 'b/p', type: 'consonant' },
  { character: 'ㅅ', romanization: 's', type: 'consonant' },
  { character: 'ㅇ', romanization: 'ng/silent', type: 'consonant' },
  { character: 'ㅈ', romanization: 'j', type: 'consonant' },
  { character: 'ㅊ', romanization: 'ch', type: 'consonant' },
  { character: 'ㅋ', romanization: 'k', type: 'consonant' },
  { character: 'ㅌ', romanization: 't', type: 'consonant' },
  { character: 'ㅍ', romanization: 'p', type: 'consonant' },
  { character: 'ㅎ', romanization: 'h', type: 'consonant' },
]

export const tenseConsonants: HangulCharacter[] = [
  { character: 'ㄲ', romanization: 'kk', type: 'tense_consonant' },
  { character: 'ㄸ', romanization: 'tt', type: 'tense_consonant' },
  { character: 'ㅃ', romanization: 'pp', type: 'tense_consonant' },
  { character: 'ㅆ', romanization: 'ss', type: 'tense_consonant' },
  { character: 'ㅉ', romanization: 'jj', type: 'tense_consonant' },
]

export const basicVowels: HangulCharacter[] = [
  { character: 'ㅏ', romanization: 'a', type: 'vowel' },
  { character: 'ㅑ', romanization: 'ya', type: 'vowel' },
  { character: 'ㅓ', romanization: 'eo', type: 'vowel' },
  { character: 'ㅕ', romanization: 'yeo', type: 'vowel' },
  { character: 'ㅗ', romanization: 'o', type: 'vowel' },
  { character: 'ㅛ', romanization: 'yo', type: 'vowel' },
  { character: 'ㅜ', romanization: 'u', type: 'vowel' },
  { character: 'ㅠ', romanization: 'yu', type: 'vowel' },
  { character: 'ㅡ', romanization: 'eu', type: 'vowel' },
  { character: 'ㅣ', romanization: 'i', type: 'vowel' },
]

export const compoundVowels: HangulCharacter[] = [
  { character: 'ㅐ', romanization: 'ae', type: 'compound_vowel' },
  { character: 'ㅒ', romanization: 'yae', type: 'compound_vowel' },
  { character: 'ㅔ', romanization: 'e', type: 'compound_vowel' },
  { character: 'ㅖ', romanization: 'ye', type: 'compound_vowel' },
  { character: 'ㅘ', romanization: 'wa', type: 'compound_vowel' },
  { character: 'ㅙ', romanization: 'wae', type: 'compound_vowel' },
  { character: 'ㅚ', romanization: 'oe', type: 'compound_vowel' },
  { character: 'ㅝ', romanization: 'wo', type: 'compound_vowel' },
  { character: 'ㅞ', romanization: 'we', type: 'compound_vowel' },
  { character: 'ㅟ', romanization: 'wi', type: 'compound_vowel' },
  { character: 'ㅢ', romanization: 'ui', type: 'compound_vowel' },
]

export const syllableExamples = [
  { components: ['ㄱ', 'ㅏ'], result: '가', romanization: 'ga', meaning: 'go (verb stem)' },
  { components: ['ㄴ', 'ㅏ', 'ㄴ'], result: '난', romanization: 'nan', meaning: 'I (casual)' },
  { components: ['ㅎ', 'ㅏ', 'ㄴ'], result: '한', romanization: 'han', meaning: 'Korean (as in 한국)' },
  { components: ['ㅅ', 'ㅏ', 'ㄹ'], result: '살', romanization: 'sal', meaning: 'years old / flesh' },
  { components: ['ㅁ', 'ㅓ', 'ㄱ'], result: '먹', romanization: 'meok', meaning: 'eat (verb stem)' },
]

export const hangulLessons = [
  {
    id: 'hangul-vowels',
    title: 'Basic Vowels',
    description: 'Learn the 10 fundamental Korean vowel sounds',
    characters: basicVowels,
    quiz: [
      {
        id: 'hq-v-1',
        type: 'script_id' as const,
        prompt: 'ㅏ',
        options: ['a', 'ya', 'eo', 'o'],
        correctAnswer: 'a',
        grammarTopic: 'Hangul vowels',
        level: 'A1' as const,
      },
      {
        id: 'hq-v-2',
        type: 'script_id' as const,
        prompt: 'ㅓ',
        options: ['a', 'o', 'eo', 'eu'],
        correctAnswer: 'eo',
        grammarTopic: 'Hangul vowels',
        level: 'A1' as const,
      },
      {
        id: 'hq-v-3',
        type: 'script_id' as const,
        prompt: 'ㅜ',
        options: ['yu', 'u', 'o', 'yo'],
        correctAnswer: 'u',
        grammarTopic: 'Hangul vowels',
        level: 'A1' as const,
      },
    ],
  },
  {
    id: 'hangul-consonants',
    title: 'Basic Consonants',
    description: 'Learn the 14 fundamental Korean consonant sounds',
    characters: basicConsonants,
    quiz: [
      {
        id: 'hq-c-1',
        type: 'script_id' as const,
        prompt: 'ㄴ',
        options: ['g/k', 'n', 'd/t', 'm'],
        correctAnswer: 'n',
        grammarTopic: 'Hangul consonants',
        level: 'A1' as const,
      },
      {
        id: 'hq-c-2',
        type: 'script_id' as const,
        prompt: 'ㅎ',
        options: ['p', 'k', 'h', 's'],
        correctAnswer: 'h',
        grammarTopic: 'Hangul consonants',
        level: 'A1' as const,
      },
    ],
  },
  {
    id: 'hangul-syllables',
    title: 'Syllable Blocks',
    description: 'How Korean letters combine into syllable blocks',
    characters: [],
    syllableExamples,
    quiz: [
      {
        id: 'hq-s-1',
        type: 'multiple_choice' as const,
        prompt: 'How do you write the syllable "ga" in Hangul?',
        options: ['나', '가', '다', '사'],
        correctAnswer: '가',
        grammarTopic: 'Hangul syllable blocks',
        level: 'A1' as const,
      },
      {
        id: 'hq-s-2',
        type: 'multiple_choice' as const,
        prompt: 'What does the syllable 먹 (meok) consist of?',
        options: ['ㅁ + ㅓ only', 'ㅁ + ㅓ + ㄱ', 'ㅁ + ㅣ + ㄱ', 'ㄴ + ㅓ + ㄱ'],
        correctAnswer: 'ㅁ + ㅓ + ㄱ',
        grammarTopic: 'Hangul syllable blocks',
        level: 'A1' as const,
      },
    ],
  },
]
