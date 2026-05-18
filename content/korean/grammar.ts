import type { GrammarUnit } from '@/types'

export const koreanGrammarUnits: GrammarUnit[] = [
  {
    id: 'ko-g-01',
    language: 'ko',
    level: 'A1',
    order: 1,
    title: 'SOV Word Order',
    subtitle: 'Subject → Object → Verb',
    explanation: `Korean sentences follow Subject-Object-Verb (SOV) order — the opposite of English.
In English: "I eat rice." In Korean: "I rice eat." (저는 밥을 먹어요.)
The verb always comes last. This is the single most important structural rule in Korean.
Adjectives also come before nouns, but predicates (descriptive verbs) come at the end.`,
    examples: [
      { target: '저는 밥을 먹어요.', english: 'I eat rice. (lit: I rice eat)' },
      { target: '그는 한국어를 공부해요.', english: 'He studies Korean. (lit: He Korean studies)' },
      { target: '저는 물을 마셔요.', english: 'I drink water. (lit: I water drink)' },
    ],
    lessons: [
      {
        id: 'ko-g-01-l-01',
        unitId: 'ko-g-01',
        order: 1,
        title: 'Understanding SOV',
        content: `Korean puts the verb at the END of every sentence. Think of it as "I [subject] rice [object] eat [verb]."
This applies no matter how long or complex the sentence gets. The verb is always the final piece.`,
        quiz: [
          {
            id: 'ko-q-sov-1',
            type: 'sentence_reorder',
            prompt: 'Arrange into correct Korean order: 먹어요 / 저는 / 밥을',
            correctAnswer: '저는 밥을 먹어요',
            grammarTopic: 'SOV word order',
            level: 'A1',
          },
          {
            id: 'ko-q-sov-2',
            type: 'multiple_choice',
            prompt: 'Which sentence has correct Korean word order?',
            options: [
              '먹어요 저는 밥을',
              '저는 먹어요 밥을',
              '저는 밥을 먹어요',
              '밥을 먹어요 저는',
            ],
            correctAnswer: '저는 밥을 먹어요',
            grammarTopic: 'SOV word order',
            level: 'A1',
          },
        ],
      },
    ],
  },
  {
    id: 'ko-g-02',
    language: 'ko',
    level: 'A1',
    order: 2,
    title: 'Topic Particles — 은/는',
    subtitle: 'Marking what the sentence is about',
    explanation: `Korean uses particles (조사) attached to nouns to show their role in a sentence.
은/는 marks the TOPIC — what the sentence is about. Think of it as "As for ___..."
Use 은 after a consonant-ending noun: 학생은 (student-topic).
Use 는 after a vowel-ending noun: 저는 (I-topic).
Topic ≠ Subject. 은/는 marks what you're commenting on, not necessarily who's doing the action.`,
    examples: [
      { target: '저는 학생이에요.', english: 'As for me, I am a student.' },
      { target: '한국은 아름다워요.', english: 'As for Korea, it is beautiful.' },
      { target: '이것은 책이에요.', english: 'As for this, it is a book.' },
    ],
    lessons: [
      {
        id: 'ko-g-02-l-01',
        unitId: 'ko-g-02',
        order: 1,
        title: '은 vs 는 — Which to use?',
        content: `Rule: look at the last sound of the noun.
- Ends in a CONSONANT → add 은 (e.g., 학생 → 학생은)
- Ends in a VOWEL → add 는 (e.g., 저 → 저는, 나 → 나는)`,
        quiz: [
          {
            id: 'ko-q-topic-1',
            type: 'fill_blank',
            prompt: '저___ 학생이에요. (I am a student.)',
            correctAnswer: '는',
            grammarTopic: 'Topic particle 은/는',
            level: 'A1',
          },
          {
            id: 'ko-q-topic-2',
            type: 'fill_blank',
            prompt: '학생___ 공부해요. (The student studies.)',
            correctAnswer: '은',
            grammarTopic: 'Topic particle 은/는',
            level: 'A1',
          },
          {
            id: 'ko-q-topic-3',
            type: 'multiple_choice',
            prompt: 'Fill in: "저___ 학생이에요" — I am a student.',
            options: ['이/가', '은/는', '을/를', '에서'],
            correctAnswer: '은/는',
            promptTranslation: 'I ___ student am.',
            grammarTopic: 'Topic particle 은/는',
            level: 'A1',
          },
        ],
      },
    ],
  },
  {
    id: 'ko-g-03',
    language: 'ko',
    level: 'A1',
    order: 3,
    title: 'Subject Particles — 이/가',
    subtitle: 'Marking who performs the action',
    explanation: `이/가 marks the SUBJECT — the one performing the action or being described.
Use 이 after consonant-ending nouns: 학생이 (the student [subject]).
Use 가 after vowel-ending nouns: 저가 → 제가 (I [subject]).
Key difference from 은/는: 이/가 highlights NEW information or a specific identity.
"저는 학생이에요" = "As for me, I'm a student" (general statement)
"제가 학생이에요" = "It is I who am the student" (emphasizing which person)`,
    examples: [
      { target: '누가 왔어요?', english: 'Who came? (asking about the subject)' },
      { target: '제가 왔어요.', english: 'I came. (It is I who came — answering the question)' },
      { target: '고양이가 자요.', english: 'The cat sleeps. (cat is doing the action)' },
    ],
    lessons: [
      {
        id: 'ko-g-03-l-01',
        unitId: 'ko-g-03',
        order: 1,
        title: '이/가 vs 은/는 — the key distinction',
        content: `은/는 = topic marker ("as for X...")
이/가 = subject marker ("it is X who...")
When in doubt in everyday speech, 은/는 is more common for general statements about yourself.
이/가 appears when answering "who?" questions or emphasizing identity.`,
        quiz: [
          {
            id: 'ko-q-subj-1',
            type: 'multiple_choice',
            prompt: 'Someone asks "누가 선생님이에요?" (Who is the teacher?). The best answer is:',
            options: ['저는 선생님이에요.', '제가 선생님이에요.', '저를 선생님이에요.', '저에 선생님이에요.'],
            correctAnswer: '제가 선생님이에요.',
            grammarTopic: 'Subject particle 이/가',
            level: 'A1',
          },
          {
            id: 'ko-q-subj-2',
            type: 'fill_blank',
            prompt: '고양___  자요. (The cat sleeps.) — cat = 고양이',
            correctAnswer: '이가',
            grammarTopic: 'Subject particle 이/가',
            level: 'A1',
          },
        ],
      },
    ],
  },
  {
    id: 'ko-g-04',
    language: 'ko',
    level: 'A1',
    order: 4,
    title: 'Object Particles — 을/를',
    subtitle: 'Marking the direct object',
    explanation: `을/를 marks the direct object — what the action is done TO.
Use 을 after consonant-ending nouns: 밥을 (rice-object).
Use 를 after vowel-ending nouns: 물을 → 물을 still uses 을; 커피를 (coffee-object).
Rule: ends in consonant → 을 | ends in vowel → 를
Example: 저는 한국어를 공부해요. (I study Korean. — Korean is the object being studied.)`,
    examples: [
      { target: '저는 밥을 먹어요.', english: 'I eat rice. (rice = object)' },
      { target: '저는 커피를 마셔요.', english: 'I drink coffee. (coffee = object)' },
      { target: '저는 한국어를 공부해요.', english: 'I study Korean. (Korean = object)' },
    ],
    lessons: [
      {
        id: 'ko-g-04-l-01',
        unitId: 'ko-g-04',
        order: 1,
        title: '을 vs 를',
        content: `The object particle tells you WHAT receives the action.
을 after consonant endings (밥 → 밥을, 책 → 책을)
를 after vowel endings (커피 → 커피를, 나라 → 나라를)`,
        quiz: [
          {
            id: 'ko-q-obj-1',
            type: 'fill_blank',
            prompt: '저는 책___ 읽어요. (I read a book.)',
            correctAnswer: '을',
            grammarTopic: 'Object particle 을/를',
            level: 'A1',
          },
          {
            id: 'ko-q-obj-2',
            type: 'fill_blank',
            prompt: '저는 커피___ 마셔요. (I drink coffee.)',
            correctAnswer: '를',
            grammarTopic: 'Object particle 을/를',
            level: 'A1',
          },
        ],
      },
    ],
  },
  {
    id: 'ko-g-05',
    language: 'ko',
    level: 'A1',
    order: 5,
    title: 'Speech Levels — 존댓말 vs 반말',
    subtitle: 'Formality is not optional in Korean',
    explanation: `Korean has distinct speech levels that change how EVERY verb is conjugated.
This is one of the most socially critical features of Korean — using the wrong level is a real faux pas.

존댓말 (jondaemal) = polite/formal speech. Used with strangers, elders, and in professional settings.
  - 요체 (polite): 먹어요, 가요, 해요 — the most common everyday polite form
  - 합쇼체 (formal): 먹습니다, 갑니다, 합니다 — used in news, speeches, official contexts

반말 (banmal) = informal speech. Used with close friends, younger people, children.
  - Remove 요 from 요체: 먹어요 → 먹어, 가요 → 가, 해요 → 해

As a learner, always default to 요체 (polite -요 form) until you know someone well.`,
    examples: [
      { target: '먹어요 / 먹어 / 먹습니다', english: 'eat (polite / casual / formal)' },
      { target: '안녕하세요 / 안녕 / 안녕하십니까', english: 'hello (polite / casual / formal)' },
      { target: '고마워요 / 고마워 / 감사합니다', english: 'thank you (polite / casual / formal)' },
    ],
    lessons: [
      {
        id: 'ko-g-05-l-01',
        unitId: 'ko-g-05',
        order: 1,
        title: 'The -요 polite ending',
        content: `The -요 ending is the most important thing to learn first. It makes any verb polite.
가다 (to go) → 가요 (polite) → 가 (casual)
먹다 (to eat) → 먹어요 (polite) → 먹어 (casual)
하다 (to do) → 해요 (polite) → 해 (casual)`,
        quiz: [
          {
            id: 'ko-q-speech-1',
            type: 'multiple_choice',
            prompt: 'You meet someone for the first time. Which form do you use?',
            options: ['반말 (casual)', '요체 (polite -요)', '합쇼체 (formal)', 'Either casual or formal'],
            correctAnswer: '요체 (polite -요)',
            grammarTopic: 'Speech levels',
            level: 'A1',
          },
          {
            id: 'ko-q-speech-2',
            type: 'multiple_choice',
            prompt: 'What is the polite (요체) form of 먹다 (to eat)?',
            options: ['먹다요', '먹습니다', '먹어요', '먹어'],
            correctAnswer: '먹어요',
            grammarTopic: 'Speech levels',
            level: 'A1',
          },
          {
            id: 'ko-q-speech-3',
            type: 'multiple_choice',
            prompt: 'What is the casual (반말) form of 가요 (to go, polite)?',
            options: ['가요', '갑니다', '가', '가서'],
            correctAnswer: '가',
            grammarTopic: 'Speech levels',
            level: 'A1',
          },
        ],
      },
    ],
  },
]
