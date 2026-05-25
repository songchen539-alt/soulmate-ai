'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ProfileViewPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [matched, setMatched] = useState(false)

  useEffect(() => {
    fetch(`/api/profiles?id=${id}`)
      .then(r => r.json())
      .then(d => { setProfile(d.profile); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const sendMatch = async () => {
    // For MVP, just use a placeholder from_profile_id
    await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId: 'anonymous', toId: id })
    })
    setMatched(true)
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-500">Soul not found</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Avatar */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ backgroundColor: profile.avatar_color || '#8B5CF6' }}>
            {profile.nickname?.[0] || '?'}
          </div>
          <h1 className="text-xl font-bold">{profile.nickname}</h1>
          <p className="text-purple-400 text-sm">{profile.soul_type}</p>
          {profile.looking_for && (
            <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
              Looking for: {profile.looking_for}
            </span>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 mb-4">
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">About</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Dimensions */}
        {profile.dimensions && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 mb-6">
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Soul Dimensions</h3>
            {Object.entries(profile.dimensions).map(([key, val]: [string, any]) => (
              <div key={key} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-zinc-500">{val}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Match button */}
        <button onClick={sendMatch} disabled={matched}
          className={`w-full py-3 rounded-xl font-medium text-sm transition ${
            matched
              ? 'bg-zinc-800 text-zinc-500'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}>
          {matched ? 'Request Sent! 💜' : 'Send Soul Request'}
        </button>
      </div>
    </main>
  )
}
