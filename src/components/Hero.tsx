'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <>
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-medium text-white">SoulMate AI</Link>
        <Link href="/login" className="text-sm text-white/60 transition hover:text-white">Sign in</Link>
      </header>
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-6xl font-bold leading-tight"
        >
          Find people who truly understand you.
        </motion.h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          AI-powered relationship intelligence for the next generation of human connection.
        </p>

        <Link href="/chat" className="mt-10 rounded-full bg-white px-8 py-4 text-black transition hover:scale-105">
          Start Soul Analysis
        </Link>
      </section>
    </>
  )
}
