export interface PronunciationWord {
  korean: string
  romanization: string
  english: string
  tip?: string
}

export interface PronunciationQuest {
  id: string
  title: string
  emoji: string
  description: string
  xp: number
  words: PronunciationWord[]
}

export const pronunciationQuests: PronunciationQuest[] = [
  {
    id: 'vowel-sounds',
    title: 'Vowel Sounds',
    emoji: '🔤',
    description: 'Master the 10 core Korean vowel sounds',
    xp: 50,
    words: [
      { korean: '아', romanization: 'a', english: '"ah" sound', tip: 'Open wide like you\'re at the dentist' },
      { korean: '야', romanization: 'ya', english: '"ya" sound', tip: 'Like "yahoo" without the hoo' },
      { korean: '어', romanization: 'eo', english: '"uh" sound', tip: 'Like the "u" in "but"' },
      { korean: '오', romanization: 'o', english: '"oh" sound', tip: 'Round your lips' },
      { korean: '우', romanization: 'u', english: '"oo" sound', tip: 'Like "boo"' },
      { korean: '이', romanization: 'i', english: '"ee" sound', tip: 'Like "see"' },
      { korean: '으', romanization: 'eu', english: '"eu" sound', tip: 'No English equivalent — flatten tongue' },
    ],
  },
  {
    id: 'greetings',
    title: 'Greetings',
    emoji: '👋',
    description: 'Say hello the Korean way',
    xp: 75,
    words: [
      { korean: '안녕', romanization: 'an-nyeong', english: 'Hi (casual)', tip: 'First syllable is "an" — nasal n sound' },
      { korean: '안녕하세요', romanization: 'an-nyeong-ha-se-yo', english: 'Hello (polite)', tip: 'Flow it together, 5 syllables' },
      { korean: '감사합니다', romanization: 'gam-sa-ham-ni-da', english: 'Thank you', tip: '\'b\' in 합 becomes \'m\' before 니' },
      { korean: '죄송합니다', romanization: 'joe-song-ham-ni-da', english: 'I\'m sorry', tip: 'Joe-song — the oe vowel is like "we"' },
      { korean: '반갑습니다', romanization: 'ban-gap-seum-ni-da', english: 'Nice to meet you', tip: 'Formal greeting — 5 syllables' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers 1–5',
    emoji: '🔢',
    description: 'Count in Korean (native numbers)',
    xp: 60,
    words: [
      { korean: '하나', romanization: 'ha-na', english: 'One', tip: 'Ha-na — two even syllables' },
      { korean: '둘', romanization: 'dul', english: 'Two', tip: 'One syllable: dul' },
      { korean: '셋', romanization: 'set', english: 'Three', tip: 'Like "set" in English' },
      { korean: '넷', romanization: 'net', english: 'Four', tip: 'Like "net" in English' },
      { korean: '다섯', romanization: 'da-seot', english: 'Five', tip: 'da-SEOT — final t is unreleased' },
    ],
  },
  {
    id: 'food',
    title: 'Food & Drinks',
    emoji: '🍜',
    description: 'Order like a local',
    xp: 80,
    words: [
      { korean: '물', romanization: 'mul', english: 'Water', tip: 'One syllable — like "mool"' },
      { korean: '밥', romanization: 'bap', english: 'Rice / meal', tip: 'Final p is unreleased, not popped' },
      { korean: '김치', romanization: 'gim-chi', english: 'Kimchi', tip: 'g is softer than English g' },
      { korean: '삼겹살', romanization: 'sam-gyeop-sal', english: 'Korean BBQ pork', tip: 'sam-GYEOP-sal — 3 syllables' },
      { korean: '맛있어요', romanization: 'ma-si-sseo-yo', english: 'It\'s delicious', tip: 'The 있 + 어 merge: ma-SI-sseo-yo' },
    ],
  },
  {
    id: 'daily-phrases',
    title: 'Daily Phrases',
    emoji: '💬',
    description: 'Phrases you\'ll use every day',
    xp: 100,
    words: [
      { korean: '네', romanization: 'ne', english: 'Yes', tip: 'Short, like "neh"' },
      { korean: '아니요', romanization: 'a-ni-yo', english: 'No (polite)', tip: '3 smooth syllables' },
      { korean: '괜찮아요', romanization: 'gwaen-chan-a-yo', english: 'It\'s okay', tip: '괜 is one syllable: gwaen' },
      { korean: '모르겠어요', romanization: 'mo-reu-ge-sseo-yo', english: 'I don\'t know', tip: '5 syllables — practice slowly first' },
      { korean: '도와주세요', romanization: 'do-wa-ju-se-yo', english: 'Please help me', tip: 'Smooth 5-syllable flow' },
    ],
  },
]
