'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 light:bg-gray-100 light:hover:bg-gray-200 border border-white/10 transition-all text-base"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
