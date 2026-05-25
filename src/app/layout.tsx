import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SoulMate AI | Find people who truly understand you',
  description: 'AI-powered relationship intelligence for the next generation of human connection.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
