'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'

interface SoulReport {
  soulType?: string
  personalitySummary?: string
  emotionalPattern?: string
  communicationStyle?: string
  relationshipStrengths?: string[] | string
  relationshipRisks?: string[] | string
  idealPartner?: string
  poeticSummary?: string
}

function ReportContent() {
  const searchParams = useSearchParams()
  const dataStr = searchParams.get('data')
  const [copied, setCopied] = useState(false)

  if (!dataStr) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-zinc-500">Please complete the soul analysis first</p>
        <a href="/chat" className="text-zinc-300 underline mt-3 hover:text-white transition">Start analysis</a>
      </div>
    )
  }

  const raw = JSON.parse(decodeURIComponent(dataStr))
  const report: SoulReport = raw.report || raw

  if (!report.soulType) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex flex-col items-center justify-center px-6">
        <p className="text-zinc-500 mb-4">Could not generate report</p>
        <a href="/chat" className="text-zinc-300 underline">Try again</a>
      </div>
    )
  }

  const sections = [
    { key: 'personalitySummary', label: 'Personality', icon: null },
    { key: 'emotionalPattern', label: 'Emotional Pattern', icon: null },
    { key: 'communicationStyle', label: 'Communication Style', icon: null },
    { key: 'relationshipStrengths', label: 'Relationship Strengths', icon: null, isList: true, good: true },
    { key: 'relationshipRisks', label: 'Relationship Risks', icon: null, isList: true, good: false },
    { key: 'idealPartner', label: 'Ideal Partner', icon: null },
  ]

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareText = `My Soul Type is "${report.soulType}" - ${report.personalitySummary}`

  const renderValue = (section: typeof sections[0]) => {
    const val = (report as any)[section.key]
    if (!val) return null

    if (section.isList) {
      const items = Array.isArray(val) ? val : [val]
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.filter(Boolean).map((item: string, i: number) => (
            <span key={i}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                section.good
                  ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300'
                  : 'bg-zinc-800/30 border-zinc-800 text-zinc-500'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      )
    }

    return <p className="text-zinc-300 text-sm leading-relaxed mt-1">{val}</p>
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero section - Soul Type */}
      <div className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6">
              <span className="text-xl">&#x1F49C;</span>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4">Your Soul Type</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {report.soulType}
            </h1>
            {report.personalitySummary && (
              <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                {report.personalitySummary}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Report sections */}
      <div className="max-w-lg mx-auto px-6 pb-8 space-y-3">
        {sections.map((section, idx) => {
          const val = (report as any)[section.key]
          if (!val) return null
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08, duration: 0.5 }}
              className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 border border-zinc-800/50"
            >
              <h3 className="text-xs text-zinc-500 uppercase tracking-[0.15em] mb-2">{section.label}</h3>
              {renderValue(section)}
            </motion.div>
          )
        })}

        {/* Poetic Summary */}
        {report.poeticSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center pt-8 pb-4"
          >
            <div className="max-w-sm mx-auto">
              <p className="text-zinc-400 text-sm italic leading-relaxed">
                &ldquo;{report.poeticSummary}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="pt-6 space-y-3"
        >
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
              className="flex-1 px-4 py-3 bg-zinc-900 rounded-xl text-sm text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition"
            >
              Share on X
            </button>
            <button
              onClick={copyLink}
              className="flex-1 px-4 py-3 bg-zinc-900 rounded-xl text-sm text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="text-center">
            <a href="/chat"
              className="inline-block text-sm text-zinc-600 hover:text-zinc-400 transition mt-2"
            >
              Analyze again
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
}
