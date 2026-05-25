import OpenAI from 'openai'

const _apiKey = process.env.DEEPSEEK_API_KEY || ''
const _baseURL = 'https://api.deepseek.com'
export const deepseek = _apiKey ? new OpenAI({apiKey: _apiKey, baseURL: _baseURL}) : null

export async function callDeepSeek(
  messages: { role: string; content: string }[],
  model: string = 'deepseek-v4-pro',
  temperature: number = 0.7
) {
  if (!deepseek) {
    return { choices: [{ message: { content: 'AI service not configured' } }] }
  }
  const res = await (deepseek as any).chat.completions.create({
    model,
    messages: messages as any,
    temperature,
    max_tokens: 2000
  })
  return res
}
