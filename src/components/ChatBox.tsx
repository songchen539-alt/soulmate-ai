'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from './logout-button'

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
const initialMessages: Message[] = [{ role: 'assistant', content: OPENING }]

export default function ChatBox() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [hydrated, setHydrated] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const analyzingRef = useRef(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('sm_msgs')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length >= 2) setMessages(parsed)
      }
    } catch {}
    setHydrated(true)
  }, [])

  // Save messages after hydration
  useEffect(() => {
    if (hydrated) {
      try { window.localStorage.setItem('sm_msgs', JSON.stringify(messages)) } catch {}
    }
  }, [hydrated, messages])

  const userTurns = messages.filter(m => m.role === 'user').length
  const showReportBtn = messages.length >= 18 && !analyzing && !loading && hydrated

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!loading && !analyzing) setTimeout(() => inputRef.current?.focus(), 100)
  }, [loading, analyzing])

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
      setAnalyzing(false); analyzingRef.current = false
      try { window.localStorage.removeItem('sm_msgs') } catch {}
      router.push(`/report?data=${encodeURIComponent(JSON.stringify(data))}`)
    } catch {
      clearInterval(interval)
      setError('Something interrupted the reflection. Try again.')
      setAnalyzing(false); analyzingRef.current = false
    }
  }, [messages, router])

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
    try { window.localStorage.removeItem('sm_msgs') } catch {}
    setMessages([{ role: 'assistant', content: OPENING }])
    setAnalyzing(false); setLoading(false); setError(''); analyzingRef.current = false
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-black" />
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
        <div className="flex items-center gap-3">
          {!analyzing && userTurns >= 16 && !loading && (
            <button onClick={generateReport}
              className={`text-xs rounded-full px-3 py-1 border transition ${
                userTurns >= 16 ? 'text-zinc-300 border-zinc-600 hover:text-white hover:border-zinc-400' : 'text-zinc-700 border-zinc-800 cursor-not-allowed'
              }`}
              disabled={userTurns < 16}>
              {'✨ Reflection'}
            </button>
          )}
          {userTurns > 0 && !analyzing && (
            <button onClick={newChat} className="text-xs text-zinc-600 hover:text-zinc-400 transition">New</button>
          )}
          {analyzing && <span className="text-xs text-zinc-500 animate-pulse">{loadingMsg}</span>}
          <LogoutButton />
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
    </div>
  )
}
