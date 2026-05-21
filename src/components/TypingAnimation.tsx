'use client'

import { useEffect, useState } from 'react'

export default function TypingAnimation({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, idx + 1))
        setIdx(idx + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [idx, text, speed])

  return <p className="text-sm leading-relaxed">{displayed}</p>
}
