'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async () => {
    if (!email) return
    setStatus('loading')
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error)
      }
    } catch {
      setStatus('error')
      setMessage('提交失败，请重试')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {status === 'success' ? (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <p className="text-green-600 font-medium">{message}</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="输入邮箱，第一时间获取上线通知"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 
                         focus:ring-2 focus:ring-purple-100 outline-none text-sm"
            />
            <button
              onClick={submit}
              disabled={status === 'loading'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                         rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all text-sm"
            >
              {status === 'loading' ? '...' : '排队'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-2">{message}</p>
          )}
        </>
      )}
    </div>
  )
}
