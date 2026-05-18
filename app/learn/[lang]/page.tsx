import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LANGUAGES } from '@/content/languages'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { hangulLessons } from '@/content/korean/hangul'
import { koreanGrammarUnits } from '@/content/korean/grammar'

export default async function LearnPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = LANGUAGES.find(l => l.code === lang)
  if (!language) notFound()

  const isKorean = lang === 'ko'

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="text-xl font-bold tracking-tight">TalkLengua</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>{language.flag} {language.name}</span>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{language.flag}</span>
            <div>
              <h1 className="text-3xl font-bold">{language.name}</h1>
              <p className="text-gray-400">{language.nativeName} · {language.cefr.join('–')}</p>
            </div>
          </div>
          {isKorean && (
            <p className="text-gray-400 mt-4 max-w-xl">
              Start with Hangul — you must complete the alphabet before grammar lessons unlock.
              Then work through grammar units in order, or jump to any completed lesson to review.
            </p>
          )}
        </div>

        {isKorean && (
          <>
            {/* Hangul Module */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  START HERE
                </div>
                <h2 className="text-xl font-bold">Hangul — Korean Alphabet</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Complete all three Hangul modules to unlock grammar lessons.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {hangulLessons.map((lesson, i) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/ko/hangul/${lesson.id}`}
                    className="bg-gray-900 hover:bg-gray-800 border border-white/10 hover:border-violet-500/50 rounded-2xl p-5 transition-all group"
                  >
                    <div className="text-2xl mb-3">
                      {i === 0 ? '🔤' : i === 1 ? '🔡' : '🧱'}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500">{lesson.description}</p>
                    <div className="mt-4 text-xs text-violet-400 font-medium">
                      {lesson.quiz.length} quiz questions →
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Grammar Units */}
            <section>
              <h2 className="text-xl font-bold mb-2">Grammar Units</h2>
              <p className="text-gray-400 text-sm mb-6">
                Explicit grammar instruction — rule first, then practice.
              </p>
              <div className="space-y-3">
                {koreanGrammarUnits.map((unit, i) => (
                  <Link
                    key={unit.id}
                    href={`/learn/ko/unit/${unit.id}`}
                    className="flex items-center gap-4 bg-gray-900 hover:bg-gray-800 border border-white/10 hover:border-violet-500/50 rounded-2xl p-5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 group-hover:bg-violet-900/50 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-violet-300 transition-all flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {unit.title}
                        </h3>
                        <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          {unit.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{unit.subtitle}</p>
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-violet-400 transition-colors flex-shrink-0">
                      {unit.lessons.reduce((acc, l) => acc + l.quiz.length, 0)} questions →
                    </div>
                  </Link>
                ))}

                {/* Locked placeholder units */}
                {Array.from({ length: 11 }, (_, i) => (
                  <div
                    key={`locked-${i}`}
                    className="flex items-center gap-4 bg-gray-900/50 border border-white/5 rounded-2xl p-5 opacity-50 cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                      {String(i + 6).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-800 rounded w-40" />
                        <span className="text-xs bg-gray-800 text-gray-600 px-2 py-0.5 rounded-full">
                          {i < 4 ? 'A2' : i < 8 ? 'B1' : 'B2'}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded w-56 mt-2" />
                    </div>
                    <span className="text-xs text-gray-700">🔒 Coming soon</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {!isKorean && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">{language.flag}</div>
            <h2 className="text-xl font-semibold mb-2">{language.name} — Coming Soon</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              {language.name} content is being built. Start with Korean for the full experience —
              it has the deepest content and both AI features available now.
            </p>
            <Link
              href="/learn/ko"
              className="inline-block mt-6 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              Start Korean instead →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
