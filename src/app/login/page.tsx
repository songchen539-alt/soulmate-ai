'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/chat')
    })
  }, [router])

  const handleEmailAuth = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase!.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email to confirm!')
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/chat')
      }
    } catch (err: any) {
      setError(err.message || 'Auth failed')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{'💜'}</span>
          </div>
          <h1 className="text-xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {isSignUp ? 'Join SoulMate and discover your match' : 'Sign in to continue your journey'}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Email/Password */}
        <div className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" type="email"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm" />
          <input value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" type="password"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 outline-none focus:border-purple-500/50 text-sm" />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button onClick={handleEmailAuth} disabled={loading || !email || !password}
            className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition text-sm">
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </button>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-white hover:underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </main>
  )
}
