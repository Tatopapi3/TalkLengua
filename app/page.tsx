import Link from 'next/link'

const FEATURES = [
  {
    emoji: '🎙️',
    title: 'AI Conversation Practice',
    desc: 'Talk with an AI tutor in real scenarios — ordering food, making friends, workplace Korean. Get instant grammar corrections.',
    href: '/conversation',
    cta: 'Start Talking',
    color: 'from-violet-500/10 to-purple-500/5 border-violet-500/20',
    accent: '#a78bfa',
  },
  {
    emoji: '한',
    title: 'Learn Hangul & Grammar',
    desc: 'Master the Korean alphabet with interactive exercises, then build grammar skills unit by unit at your own pace.',
    href: '/learn/ko',
    cta: 'Start Learning',
    color: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20',
    accent: '#60a5fa',
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    desc: 'See your conversation history, lessons completed, and vocabulary growth over time. Every session counts.',
    href: '/progress',
    cta: 'View Progress',
    color: 'from-emerald-500/10 to-green-500/5 border-emerald-500/20',
    accent: '#34d399',
  },
]

const SCENARIOS = [
  { emoji: '👋', label: '자기소개', sub: 'Introduce Yourself' },
  { emoji: '🍜', label: '음식 주문', sub: 'Order Food' },
  { emoji: '🗺️', label: '길 묻기', sub: 'Ask Directions' },
  { emoji: '🤝', label: '친구 사귀기', sub: 'Make a Friend' },
  { emoji: '💼', label: '직장에서', sub: 'At Work' },
  { emoji: '💬', label: '자유 대화', sub: 'Free Chat' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-gray-950/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="text-xl font-bold tracking-tight">HyeoTalk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/learn/ko" className="text-sm text-gray-400 hover:text-white transition-colors">Learn</Link>
          <Link href="/conversation" className="text-sm text-gray-400 hover:text-white transition-colors">Practice</Link>
          <Link href="/progress" className="text-sm text-gray-400 hover:text-white transition-colors">Progress</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(167,139,250,0.15),transparent)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-powered language learning
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            Speak Korean.<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Fluently.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Practice real conversations with an AI tutor, learn Hangul from scratch, and get instant grammar corrections — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/conversation"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors">
              Start a Conversation →
            </Link>
            <Link href="/learn/ko"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors">
              Learn Korean
            </Link>
          </div>
        </div>
      </section>

      {/* Scenarios row */}
      <section className="px-6 py-8 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-500 text-center uppercase tracking-widest mb-6">Practice real-life scenarios</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {SCENARIOS.map(s => (
              <Link key={s.label} href="/conversation"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                <span className="text-[11px] font-medium text-white/70 text-center leading-tight">{s.label}</span>
                <span className="text-[9px] text-gray-500 text-center">{s.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-500 text-center uppercase tracking-widest mb-2">Everything you need</p>
          <h2 className="text-2xl font-bold text-center mb-10">One app. Total fluency.</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className={`rounded-2xl border p-6 bg-gradient-to-br ${f.color} flex flex-col`}>
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-5">{f.desc}</p>
                <Link href={f.href}
                  className="text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: f.accent }}>
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built-with badge */}
      <section className="px-6 py-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-500">Built with Claude Sonnet · OpenAI TTS · Supabase · Next.js</p>
          <p className="text-xs text-gray-600">© 2026 HyeoTalk · Juan Fernandez</p>
        </div>
      </section>
    </main>
  )
}
