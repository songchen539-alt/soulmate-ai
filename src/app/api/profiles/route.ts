import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!supabase) {
      return Response.json({ error: 'DB not configured' })
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        nickname: body.nickname,
        bio: body.bio,
        looking_for: body.lookingFor,
        soul_type: body.soulType,
        dimensions: body.dimensions
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ profile: data })
  } catch (err: any) {
    return Response.json({ error: err.message })
  }
}

export async function GET(req: Request) {
  if (!supabase) return Response.json({ error: 'DB not configured' })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    return Response.json({ profile: data })
  }

  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50)
  return Response.json({ profiles: data || [] })
}
