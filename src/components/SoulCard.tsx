'use client'

import { motion } from 'framer-motion'

interface SoulProfile {
  soulType?: string
  personalitySummary?: string
  emotionalPattern?: string
  communicationStyle?: string
  relationshipStrengths?: string[]
  relationshipRisks?: string[]
  idealPartner?: string
  poeticSummary?: string
  [key: string]: any
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
}

export default function SoulCard({ profile }: { profile: SoulProfile }) {
  const sections = [
    { key: 'soulType', label: 'Soul Type', icon: '💜', render: (v: string) => (
      <p className="text-2xl font-bold text-white glow-text">{v}</p>
    )},
    { key: 'personalitySummary', label: 'Personality Summary', icon: '📝', render: (v: string) => (
      <p className="text-gray-300 leading-relaxed text-sm">{v}</p>
    )},
    { key: 'emotionalPattern', label: 'Emotional Pattern', icon: '🌊', render: (v: string) => (
      <p className="text-gray-300 leading-relaxed text-sm">{v}</p>
    )},
    { key: 'communicationStyle', label: 'Communication Style', icon: '💬', render: (v: string) => (
      <p className="text-gray-300 leading-relaxed text-sm">{v}</p>
    )},
    { key: 'relationshipStrengths', label: 'Relationship Strengths', icon: '✨', render: (v: string | string[]) => (
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(v) ? v : [v]).filter(Boolean).map((item, i) => (
          <span key={i} className="px-3 py-1.5 bg-zinc-800 text-gray-200 rounded-lg text-sm">{item}</span>
        ))}
      </div>
    )},
    { key: 'relationshipRisks', label: 'Relationship Risks', icon: '⚠️', render: (v: string | string[]) => (
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(v) ? v : [v]).filter(Boolean).map((item, i) => (
          <span key={i} className="px-3 py-1.5 bg-zinc-800 text-gray-400 rounded-lg text-sm">{item}</span>
        ))}
      </div>
    )},
    { key: 'idealPartner', label: 'Ideal Compatible Partner', icon: '💫', render: (v: string) => (
      <p className="text-gray-300 leading-relaxed text-sm">{v}</p>
    )},
    { key: 'poeticSummary', label: 'Poetic Summary', icon: '🌙', render: (v: string) => (
      <p className="text-gray-400 italic leading-relaxed text-sm border-t border-zinc-800 pt-4">"{v}"</p>
    )},
  ]

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const value = profile[section.key]
        if (!value) return null

        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{section.icon}</span>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{section.label}</h3>
            </div>
            {section.render(value)}
          </motion.div>
        )
      })}
    </div>
  )
}
