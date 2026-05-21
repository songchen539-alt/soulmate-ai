import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SoulMate AI | Find people who truly understand you',
  description: 'AI-powered relationship intelligence for the next generation of human connection.',
  openGraph: {
    title: 'SoulMate AI',
    description: 'Find people who truly understand you.',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
