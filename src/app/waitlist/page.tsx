'use client'

import { useRouter } from 'next/navigation'
import WaitlistForm from '@/components/WaitlistForm'

export default function WaitlistPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 mb-8 inline-block">
          ← 返回首页
        </button>

        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SoulMate AI 即将上线</h1>
        <p className="text-gray-500 mb-8">留下邮箱，第一时间获取上线通知</p>

        <WaitlistForm />

        <div className="mt-12 space-y-4 text-left">
          <h2 className="font-medium text-gray-700">✨ 上线后你将获得：</h2>
          <ul className="space-y-3">
            {[
              'AI人格深度分析',
              '专属Soul Report',
              '灵魂匹配功能',
              '前1000名免费永久使用'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                <span className="text-purple-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
