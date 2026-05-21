import OpenAI from 'openai'

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})

export async function callDeepSeek(
  messages: { role: string; content: string }[],
  model: string = 'deepseek-chat',
  temperature: number = 0.7
) {
  const res = await deepseek.chat.completions.create({
    model,
    messages: messages as any,
    temperature,
    max_tokens: 2000
  })
  return res
}
