import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json()
    
    if (!supabase) {
      return Response.json({ error: 'Database not configured' })
    }

    // Save conversation to database
    const { error } = await supabase
      .from('conversations')
      .insert(
        messages.map((m: any) => ({
          user_id: userId || 'anonymous',
          role: m.role,
          content: m.content,
          created_at: new Date().toISOString()
        }))
      )

    if (error) throw error
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message })
  }
}
