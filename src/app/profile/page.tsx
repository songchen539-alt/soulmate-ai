'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CreateProfileForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataStr = searchParams.get('data')

  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [saving, setSaving] = useState(false)

  const reportData = dataStr ? JSON.parse(decodeURIComponent(dataStr)) : null
  const soulType = reportData?.report?.soulType || reportData?.soulType || 'Unknown'

  const save = async () => {
    if (!nickname) return
    setSaving(true)

    const dimensions = reportData?.report?.dimensions || {}
    
    await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        bio,
        lookingFor,
        soulType,
        dimensions
      })
    })

    router.push('/discover')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Create Your Profile</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Soul Type: <span className="text-purple-400">{soulType}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Nickname</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm"
              placeholder="How should others call you?" />
          </div>

          <div>
            <label className="text-xs text-zinc-500 mb-1 block">About You</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm resize-none"
              placeholder="Tell people a bit about yourself..." />
          </div>

          <div>
            <label className="text-xs text-zinc-500 mb-1 block">What are you looking for?</label>
            <select value={lookingFor} onChange={e => setLookingFor(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-purple-500/50 text-sm">
              <option value="">Select...</option>
              <option value="friendship">Friendship</option>
              <option value="dating">Dating</option>
              <option value="relationship">Meaningful Relationship</option>
              <option value="connection">Deep Connection</option>
            </select>
          </div>

          <button onClick={save} disabled={saving || !nickname}
            className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition mt-4">
            {saving ? 'Saving...' : 'Join Soul Gallery'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return <Suspense><CreateProfileForm /></Suspense>
}
