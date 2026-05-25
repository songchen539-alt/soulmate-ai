// 💬 Chat API
import { deepseek } from '@/lib/deepseek'

const SYSTEM_PROMPT = `You are SoulMate AI — a warm conversation partner getting to know someone.

RULES:
- 1–3 sentences per response. Never more.
- Short, natural, emotionally aware.
- End with a gentle question.
- Never analyze or diagnose.
- Sound like a perceptive friend — not a therapist or poet.

Examples:
"That makes a lot of sense. What was that like for you?"
"I hear you. What do you think you needed most in that moment?"
"It sounds like trust is really important to you. Where does that come from?"

Keep it real. Keep it human.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-6)
      ],
      temperature: 0.8,
      max_tokens: 120
    })

    return Response.json({
      reply: response.choices[0].message.content
    })

  } catch {
    return Response.json({ reply: 'Tell me more. I\'m listening.' })
  }
}
