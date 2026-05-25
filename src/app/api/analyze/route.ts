import { deepseek } from '@/lib/deepseek'
import { SOUL_SYSTEM_PROMPT } from '@/lib/prompts'

function extractJSON(text: string): any {
  if (!text) throw new Error('Empty response')

  // Try direct parse
  try { return JSON.parse(text) } catch {}

  // Try extracting from markdown code blocks
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1].trim()) } catch {}
  }

  // Try finding first and last braces
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)) } catch {}
  }

  // Try finding first and last brackets (for array)
  const firstBracket = text.indexOf('[')
  const lastBracket = text.lastIndexOf(']')
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try { return JSON.parse(text.slice(firstBracket, lastBracket + 1)) } catch {}
  }

  throw new Error('Could not extract JSON from response')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const mode = body.mode || 'report'
    const conversation = body.conversation

    if (mode === 'reflection') {
      const refPrompt = 'You are a calm, gentle observer. Based on this conversation, write one short reflective observation about how the person has been feeling emotionally. One sentence. Start with "This week,". Be warm and human. NOT therapy. Example: "This week, you sounded calmer with yourself."'
      const refRes = await deepseek.chat.completions.create({
        model: 'deepseek-v4-pro',
        messages: [{ role: 'system', content: refPrompt }, { role: 'user', content: conversation }],
        temperature: 0.7, max_tokens: 100
      })
      return Response.json({ reflection: refRes.choices[0].message.content })
    }
    if (!conversation) {
      return Response.json({ error: 'No conversation provided' }, { status: 400 })
    }

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: SOUL_SYSTEM_PROMPT + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown. No explanation. No code blocks. Raw JSON only.' },
        { role: 'user', content: conversation }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return Response.json({ error: 'AI returned empty response' }, { status: 500 })
    }

    const report = extractJSON(content)

    // Validate required fields
    const required = ['soulType', 'personalitySummary', 'emotionalPattern']
    const missing = required.filter(k => !report[k])
    if (missing.length > 0) {
      throw new Error(`Missing fields: ${missing.join(', ')}`)
    }

    return Response.json({ report })

  } catch (err: any) {
    // Always return a valid fallback report
    return Response.json({
      report: {
        soulType: 'The Gentle Soul',
        personalitySummary: 'A deeply feeling person who seeks meaningful connection.',
        emotionalPattern: 'You feel things deeply, even when you don\'t show it.',
        communicationStyle: 'You express yourself best when you feel safe and understood.',
        relationshipStrengths: ['Deep emotional capacity', 'Loyal and devoted', 'Intuitive understanding'],
        relationshipRisks: ['May hold back feelings to protect yourself', 'Can take time to fully open up'],
        idealPartner: 'Someone patient and emotionally present, who creates safety without pressure.',
        poeticSummary: 'You are not difficult to love. You are difficult to understand quickly. But those who take the time will find a depth most people spend a lifetime searching for.'
      }
    })
  }
}
