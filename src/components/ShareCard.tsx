'use client'

import { useRef } from 'react'

interface ShareCardProps {
  profile: {
    soulType?: string
    personalitySummary?: string
    emotionalPattern?: string
    communicationStyle?: string
    relationshipStrengths?: string[]
    poeticSummary?: string
    [key: string]: any
  }
}

export default function ShareCard({ profile }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied! Share it on TikTok, Instagram, or X 💜')
  }

  const downloadCard = async () => {
    // Try to use html2canvas for screenshot
    try {
      const html2canvas = (await import('html2canvas')).default
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true
        })
        const link = document.createElement('a')
        link.download = 'soul-type.png'
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch {
      // Fallback: copy link
      copyLink()
    }
  }

  // Extract fields with fallbacks
  const type = profile.soulType || 'SoulMate AI'
  const summary = profile.personalitySummary || ''
  const emotional = profile.emotionalPattern || ''
  const strengths = Array.isArray(profile.relationshipStrengths) 
    ? profile.relationshipStrengths.slice(0, 3) 
    : []
  const poetic = profile.poeticSummary || ''

  return (
    <div className="space-y-4">
      {/* Share Card - Screenshot ready */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 30%, #2d1b4e 60%, #1a0a2e 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm">💜</span>
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-widest">SoulMate AI</span>
          </div>

          {/* Soul Type */}
          <h2 className="text-3xl font-bold text-white mb-2">{type}</h2>
          
          {summary && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{summary}</p>
          )}

          {/* Divider */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mb-6" />

          {/* Emotional Pattern */}
          {emotional && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Emotional Pattern</p>
              <p className="text-gray-300 text-sm leading-relaxed">{emotional}</p>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Strengths</p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Poetic Summary */}
          {poetic && (
            <p className="text-gray-400 text-xs italic leading-relaxed border-t border-gray-800 pt-4 mt-2">
              "{poetic}"
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={downloadCard}
          className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-gray-200 transition"
        >
          📸 Save as Image
        </button>
        <button
          onClick={copyLink}
          className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium text-sm border border-gray-800 hover:bg-gray-800 transition"
        >
          🔗 Copy Link
        </button>
      </div>

      <p className="text-center text-xs text-gray-600">
        Share on TikTok, Instagram, or X 💜
      </p>
    </div>
  )
}
