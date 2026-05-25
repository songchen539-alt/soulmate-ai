'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/chat')
    })
  }, [router])

  const handleSubmit = async () => {
    if (!email || !password) return
    setError('')
    if (isSignUp && password !== confirmPassword) { setError('Passwords do not match'); return }
    if (isSignUp && password.length < 6) { setError('Password too short'); return }
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase!.auth.signUp({ email, password })
        if (error) throw error
        router.push('/chat')
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/chat')
      }
    } catch (err: any) { setError(err.message) }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{'💜'}</span>
          </div>
          <h1 className="text-xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" type="email" required
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm" />
          <div className="relative">
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" type={showPwd ? 'text' : 'password'} required
              className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm">
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>
          {isSignUp && (
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password" type={showPwd ? 'text' : 'password'} required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm" />
          )}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition text-sm">
            {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have one?"}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="text-white hover:underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </main>
  )
}
