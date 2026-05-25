'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const LOADING_MSGS = [
  'Analyzing emotional patterns...',
  'Understanding communication style...',
  'Building Soul Profile...',
  'Detecting relationship tendencies...',
]

const OPENING = "Hey :)\n\nHow's your day going?"

function loadMsgs(): Message[] {
  if (typeof window === 'undefined') return [{ role: 'assistant', content: OPENING }]
  try {
    const ver = localStorage.getItem('sm_ver')
    if (ver !== '4') { localStorage.clear(); localStorage.setItem('sm_ver', '4'); return [{ role: 'assistant', content: OPENING }] }
    const d = localStorage.getItem('sm_msgs')
    if (d) { const p = JSON.parse(d); if (p.length >= 2) return p }
  } catch {}
  return [{ role: 'assistant', content: OPENING }]
}

function saveMsgs(m: Message[]) {
  try { localStorage.setItem('sm_msgs', JSON.stringify(m)) } catch {}
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>(loadMsgs)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [reportReady, setReportReady] = useState(false)
  const [reflecting, setReflecting] = useState(false)
  const [showJourney, setShowJourney] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const analyzingRef = useRef(false)

  const userTurns = messages.filter(m => m.role === 'user').length
  const canGenerate = userTurns >= 20 && !analyzing && !loading

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (!loading && !analyzing) setTimeout(() => inputRef.current?.focus(), 100) }, [loading, analyzing])
  useEffect(() => { saveMsgs(messages) }, [messages])

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const generateReport = useCallback(async () => {
    if (analyzingRef.current) return
    analyzingRef.current = true
    setAnalyzing(true)
    setError('')
    await sleep(1500)

    let idx = 0
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MSGS[idx % LOADING_MSGS.length]); idx++
    }, 2000)
    setLoadingMsg(LOADING_MSGS[0])

    const conversation = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation })
      })
      const data = await res.json()
      clearInterval(interval)
      if (data.error || !data.report) { setError('Something interrupted the reflection. Try again.'); setAnalyzing(false); analyzingRef.current = false; return }
      setReportData(data); setReportReady(true); setAnalyzing(false); analyzingRef.current = false; setShowReport(true)
    } catch {
      clearInterval(interval)
      setError('Something interrupted the reflection. Try again.')
      setAnalyzing(false); analyzingRef.current = false
    }
  }, [messages])

  const closeReport = () => {
    setShowReport(false)
    setMessages(prev => [...prev, { role: 'assistant', content: "Now that I understand you a little better, I'm curious about something else. What's something you've been thinking about lately?" }])
  }

  const weeklyReflection = async () => {
    setReflecting(true)
    const conversation = messages.map(m => (m.role === 'user' ? 'User: ' : 'AI: ') + m.content).join('\n')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, mode: 'reflection' })
      })
      const data = await res.json()
      if (data.reflection) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reflection }])
        // Save to journey timeline
        try {
          const existing = JSON.parse(localStorage.getItem('sm_journey') || '[]')
          existing.push({ date: new Date().toISOString(), text: data.reflection })
          localStorage.setItem('sm_journey', JSON.stringify(existing))
        } catch {}
      }
    } catch {}
    setReflecting(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || analyzing) return
    setError('')
    const userMsg: Message = { role: 'user', content: input }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs); setInput('')
    await sleep(600 + Math.random() * 1000)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs })
      })
      const data = await res.json()
      if (!data.reply) throw new Error()
      await sleep(200)
      setMessages([...newMsgs, { role: 'assistant', content: data.reply }])
      setLoading(false)
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: "I didn't quite get that. Could you tell me more?" }])
      setLoading(false)
    }
  }

  const newChat = () => {
    try { localStorage.removeItem('sm_msgs') } catch {}
    setMessages([{ role: 'assistant', content: OPENING }])
    setReportData(null); setReportReady(false); setShowReport(false); setError(''); analyzingRef.current = false
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-zinc-800">
            <span className="text-xs">{'💜'}</span>
          </div>
          <span className="text-sm font-medium text-zinc-300">SoulMate</span>
        </div>
        <div className="flex items-center gap-2">
          {!analyzing && !reportReady && (
            <button onClick={generateReport}
              className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1 hover:text-zinc-200 hover:border-zinc-500 transition">
              {'✨ Reflection'}
            </button>
          )}
          {reportReady && !showReport && (
            <button onClick={() => setShowReport(true)}
              className="text-xs text-purple-400 border border-purple-900/50 rounded-full px-3 py-1 hover:text-purple-300 transition">
              {'✨ View'}
            </button>
          )}
          {userTurns > 0 && !analyzing && (
            <button onClick={newChat} className="text-xs text-zinc-600 hover:text-zinc-400 transition ml-1">New</button>
          )}
          <button onClick={async () => { try { const m = await import("@/lib/supabase"); if (m.supabase) await m.supabase.auth.signOut() } catch {}; window.location.href = "/login" }}
            className="text-xs text-zinc-700 hover:text-zinc-500 transition ml-2">Exit</button>
          {analyzing && <span className="text-xs text-zinc-500 animate-pulse">{loadingMsg}</span>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-br-md px-5 py-3' : 'text-zinc-300'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 px-2 py-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }} />
              ))}
            </div>
          </div>
        )}
        {analyzing && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl">{'💜'}</span></div>
            </div>
            <p className="text-sm text-zinc-500 animate-pulse">{loadingMsg}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={generateReport} className="px-4 py-2 bg-zinc-800 rounded-xl text-sm text-zinc-300 hover:bg-zinc-700">Try Again</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-2 focus-within:border-violet-500/30 transition-all duration-300">
            <input ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tell me honestly..."
              disabled={loading || analyzing}
              className="flex-1 px-4 py-2.5 bg-transparent text-zinc-100 placeholder-zinc-600 outline-none text-sm" />
            <button onClick={sendMessage}
              disabled={loading || analyzing || !input.trim()}
              className="px-4 py-2 bg-zinc-100 text-black rounded-xl text-sm font-medium hover:bg-white disabled:opacity-30 transition-all">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Soul Report Modal */}
      {showReport && reportData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={closeReport}>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 animate-fade-up" onClick={e => e.stopPropagation()}>
            <button onClick={closeReport} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm z-10">Close</button>

            {/* Soul Card */}
            <div className="text-center mb-6 p-6 rounded-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)'}}>
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-10 h-10 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <span className="text-sm">{'💜'}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{reportData.report.soulType || 'Soul Type'}</h2>
                <p className="text-zinc-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">{reportData.report.personalitySummary}</p>
                <p className="text-zinc-500 text-xs italic mt-4 leading-relaxed border-t border-white/5 pt-3 max-w-sm mx-auto">&ldquo;{reportData.report.poeticSummary}&rdquo;</p>
              </div>
            </div>

            {/* Detail sections */}
            <div className="space-y-4">
              {[
                { label: 'Emotional Pattern', key: 'emotionalPattern' },
                { label: 'Communication Style', key: 'communicationStyle' },
                { label: 'Relationship Strengths', key: 'relationshipStrengths', isList: true },
                { label: 'Relationship Risks', key: 'relationshipRisks', isList: true },
                { label: 'Ideal Partner', key: 'idealPartner' },
              ].map(s => {
                const val = reportData.report[s.key]
                if (!val) return null
                return (
                  <div key={s.key} className="border-t border-zinc-800 pt-3">
                    <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{s.label}</h3>
                    {s.isList ? (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(val) ? val : [val]).filter(Boolean).map((item: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm">{item}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-300 text-sm leading-relaxed">{val}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Share - Multi Platform */}
            <div className="mt-5 space-y-2">
              <p className="text-xs text-zinc-600 text-center">Share your Soul Type</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('My Soul Type: ' + (reportData?.report?.soulType || '')), '_blank')}
                  className="py-2.5 bg-zinc-800 rounded-xl text-xs text-zinc-300 hover:bg-zinc-700 transition">X</button>
                <button onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?quote=' + encodeURIComponent('My Soul Type: ' + (reportData?.report?.soulType || '')), '_blank')}
                  className="py-2.5 bg-zinc-800 rounded-xl text-xs text-zinc-300 hover:bg-zinc-700 transition">FB</button>
                <button onClick={() => { navigator.clipboard.writeText('My Soul Type: ' + (reportData?.report?.soulType || '')); alert('Link copied!') }}
                  className="py-2.5 bg-zinc-800 rounded-xl text-xs text-zinc-300 hover:bg-zinc-700 transition">Copy</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigator.clipboard.writeText('My Soul Type: ' + (reportData?.report?.soulType || '') + ' - Download card below'); window.open('https://www.tiktok.com/upload', '_blank') }}
                  className="py-2.5 bg-zinc-800 rounded-xl text-xs text-zinc-400 hover:bg-zinc-700 transition">TikTok</button>
                <button onClick={() => { navigator.clipboard.writeText('My Soul Type: ' + (reportData?.report?.soulType || '') + ' - Download card below'); window.open('https://www.instagram.com/', '_blank') }}
                  className="py-2.5 bg-zinc-800 rounded-xl text-xs text-zinc-400 hover:bg-zinc-700 transition">Instagram</button>
              </div>
              <p className="text-xs text-zinc-700 text-center pt-1">Scroll up to screenshot the Soul Card</p>
            </div>

            <button onClick={closeReport}
              className="w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition mt-3">
              Continue Chatting
            </button>
          </div>
        </div>
      )}

      {/* Journey Timeline Modal */}
      {showJourney && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowJourney(false)}>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 animate-fade-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowJourney(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm z-10">Close</button>
            <div className="text-center mb-6">
              <div className="w-10 h-10 mx-auto mb-2 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <span className="text-sm">{'\ud83d\udcc8'}</span>
              </div>
              <h2 className="text-lg font-bold text-white">Soul Journey</h2>
              <p className="text-xs text-zinc-500 mt-1">Your emotional growth over time</p>
            </div>
            {(() => {
              try {
                const entries = JSON.parse(localStorage.getItem('sm_journey') || '[]')
                if (entries.length === 0) return <p className="text-center text-zinc-600 text-sm py-8">No reflections yet. Generate your first weekly reflection to start your journey.</p>
                return entries.slice().reverse().map((e: any, i: number) => {
                  const d = new Date(e.date)
                  const month = d.toLocaleString('en', { month: 'long', year: 'numeric' })
                  return (
                    <div key={i} className="border-l-2 border-zinc-800 pl-4 pb-6 relative">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-zinc-700" />
                      <p className="text-xs text-zinc-500 mb-1">{month}</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{e.text}</p>
                    </div>
                  )
                })
              } catch { return <p className="text-center text-zinc-600 text-sm py-8">No entries yet.</p> }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
