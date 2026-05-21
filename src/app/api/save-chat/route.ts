import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json()
    
    if (!supabase) {
      return Response.json({ error: 'Database not configured' })
    }

    // Save conversation to database
    const { error } = await supabase
      .from('conversations')
      .insert(
        messages.map((m: any) => ({
          session_id: sessionId || 'anonymous',
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
