// 🧠 AI人格分析引擎
import { deepseek } from './deepseek'
import { SOUL_SYSTEM_PROMPT } from './prompts'

export interface SoulProfile {
  type: string
  code: string
  summary: string
  traits: string[]
  strengths: string[]
  growth: string[]
  loveStyle: string
  idealMatch: string
  vibe: string
  compatibility: string[]
}

// 从对话记录生成Soul Report
export async function generateSoulReport(conversation: string) {
  const response = await (deepseek as any).chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: SOUL_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: conversation,
      },
    ],
    temperature: 1.0,
  })

  return response.choices[0].message.content
}

// 从聊天记录分析人格（旧版，兼容）
export async function analyzeFromChat(messages: { role: string; content: string }[]) {
  const conversation = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
    .join('\n')

  const report = await generateSoulReport(conversation)
  
  try {
    return JSON.parse(report || '{}')
  } catch {
    return {
      type: '温柔探索者',
      code: 'ISFJ',
      summary: '温暖细腻的灵魂',
      traits: ['善解人意', '思维敏捷', '情感丰富'],
      strengths: ['共情能力强', '善于倾听', '创造力丰富'],
      growth: ['适当表达自己', '别太在意他人看法'],
      loveStyle: '你是一个用心去爱的人，注重精神共鸣和日常的温暖。',
      idealMatch: '一个懂你情绪、能给你安全感的灵魂伴侣。',
      vibe: '温暖治愈系',
      compatibility: ['多表达你的感受', '给对方足够的信任', '一起创造美好回忆']
    }
  }
}

// AI引导问题
export async function generateFollowUp(context: string): Promise<string> {
  const res = await (deepseek as any).chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是SoulMate AI，一个温暖的朋友。根据对话自然延续，问一个深入但不冒犯的问题。每次只问一个问题，15字内。中文。' },
      { role: 'user', content: `对话背景：${context}\n\n接下来问什么？` }
    ],
    temperature: 0.7
  })

  return res.choices[0].message.content || '能跟我聊聊你最近的想法吗？'
}
