import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoKr = Noto_Sans_KR({ subsets: ['latin'], variable: '--font-noto-kr', weight: ['400', '500', '700'] })

export const metadata: Metadata = {
  title: 'HyeoTalk — Learn Korean with AI',
  description: 'Practice Korean conversations with an AI tutor, learn Hangul, and get instant grammar corrections. AI-powered language learning app.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoKr.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-gray-950 text-white antialiased transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
