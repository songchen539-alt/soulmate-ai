'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Profile {
  id: string
  nickname: string
  bio: string
  looking_for: string
  soul_type: string
  avatar_color: string
  compatibility?: { score: number }
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then(d => { setProfiles(d.profiles || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-black text-white pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Soul Gallery</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {profiles.length > 0
              ? `${profiles.length} souls waiting to connect`
              : 'Be the first soul'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mx-auto" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">No souls yet. Start your journey!</p>
            <Link href="/chat"
              className="inline-block px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:scale-105 transition">
              Start Soul Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {profiles.map(p => (
              <Link key={p.id} href={`/profile/${p.id}`}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900/80 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: p.avatar_color || '#8B5CF6' }}>
                    {p.nickname?.[0] || '?'}
                  </div>
                  {p.compatibility && (
                    <span className="text-xs text-purple-400 font-medium">
                      {p.compatibility.score}% match
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-sm text-white group-hover:text-purple-300 transition">
                  {p.nickname}
                </h3>
                <p className="text-xs text-purple-400/70 mt-0.5">{p.soul_type}</p>
                {p.bio && (
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">{p.bio}</p>
                )}
                {p.looking_for && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-500">
                    {p.looking_for}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
