import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('session')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message })

  // Group by session
  const grouped: any = {}
  data?.forEach((msg: any) => {
    const sid = msg.user_id || 'unknown'
    if (!grouped[sid]) grouped[sid] = []
    grouped[sid].unshift(msg)
  })

  return NextResponse.json({ sessions: grouped, total: data?.length || 0 })
}
