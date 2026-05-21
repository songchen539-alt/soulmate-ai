'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-500">Loading...</p>
    </div>
  )

  const sessions = data?.sessions || {}
  const sessionKeys = Object.keys(sessions)

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-xl font-bold mb-6">SoulMate Admin</h1>
      
      {!data || data.error ? (
        <div className="text-zinc-500">
          <p>No data available. {data?.error}</p>
          <p className="text-xs mt-2">Make sure Supabase is configured and the conversations table exists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Session list */}
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-400 mb-3">
              Sessions ({sessionKeys.length})
            </h2>
            <div className="space-y-1 max-h-[80vh] overflow-y-auto">
              {sessionKeys.map(sid => (
                <button key={sid}
                  onClick={() => setSelectedSession(sid)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
                    selectedSession === sid ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="block truncate">{sid.slice(0, 20)}...</span>
                  <span className="text-zinc-600">{sessions[sid].length} messages</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            {selectedSession ? (
              <>
                <h2 className="text-sm font-medium text-zinc-400 mb-3">
                  Session: {selectedSession.slice(0, 30)}...
                </h2>
                <div className="space-y-3 max-h-[80vh] overflow-y-auto">
                  {sessions[selectedSession].map((msg: any, i: number) => (
                    <div key={i} className={`p-3 rounded-xl ${
                      msg.role === 'user' ? 'bg-zinc-800 ml-8' : 'bg-zinc-800/50 mr-8'
                    }`}>
                      <p className="text-xs text-zinc-500 mb-1">
                        {msg.role === 'user' ? 'User' : 'AI'} · {new Date(msg.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-12">
                Select a session to view messages
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
