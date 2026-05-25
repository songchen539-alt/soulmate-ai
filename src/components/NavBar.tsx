'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-900">
      <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm">💜</span>
          <span className="text-sm font-medium text-zinc-300">SoulMate</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="text-xs text-zinc-500 hover:text-zinc-300 transition">Discover</Link>
          <Link href="/chat" className="text-xs text-zinc-500 hover:text-zinc-300 transition">Chat</Link>
        </div>
      </div>
    </nav>
  )
}
