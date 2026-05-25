import { supabase } from '@/lib/supabase'

// Calculate compatibility between two profiles based on dimensions
function calcCompatibility(dims1: any, dims2: any): number {
  if (!dims1 || !dims2) return 50
  const keys = ['rationality', 'emotionalDepth', 'socialEnergy', 'adventureSpirit', 'sensitivity']
  let total = 0
  keys.forEach(k => {
    const diff = Math.abs((dims1[k] || 50) - (dims2[k] || 50))
    total += (100 - diff)
  })
  return Math.round(total / keys.length)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fromId, toId } = body

    if (!supabase) return Response.json({ error: 'DB not configured' })

    // Get both profiles
    const [fromRes, toRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', fromId).single(),
      supabase.from('profiles').select('*').eq('id', toId).single()
    ])

    if (fromRes.error || toRes.error) throw new Error('Profile not found')

    const score = calcCompatibility(fromRes.data.dimensions, toRes.data.dimensions)

    // Create match request
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        from_profile_id: fromId,
        to_profile_id: toId,
        compatibility_score: score,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ match: data, score })
  } catch (err: any) {
    return Response.json({ error: err.message })
  }
}

export async function GET(req: Request) {
  if (!supabase) return Response.json({ error: 'DB not configured' })

  const { searchParams } = new URL(req.url)
  const profileId = searchParams.get('profileId')

  if (profileId) {
    // Get matches for a profile
    const { data } = await supabase
      .from('matches')
      .select('*, from_profile:profiles!matches_from_profile_id_fkey(*), to_profile:profiles!matches_to_profile_id_fkey(*)')
      .or(`from_profile_id.eq.${profileId},to_profile_id.eq.${profileId}`)
      .order('created_at', { ascending: false })

    return Response.json({ matches: data || [] })
  }

  return Response.json({ matches: [] })
}
