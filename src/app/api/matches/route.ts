import { supabase } from '@/lib/supabase'

// Smart matching algorithm
// - Similar dimensions = higher compatibility (like attracts like)
// - Some complementary matching for specific traits
function calcCompatibility(dims1: any, dims2: any): { score: number, breakdown: any } {
  if (!dims1 || !dims2) return { score: 50, breakdown: {} }

  const dimensions = [
    { key: 'rationality', label: 'Rationality', weight: 1.0 },
    { key: 'emotionalDepth', label: 'Emotional Depth', weight: 1.5 },  // Extra weight
    { key: 'socialEnergy', label: 'Social Energy', weight: 1.0 },
    { key: 'adventureSpirit', label: 'Adventure', weight: 0.8 },
    { key: 'sensitivity', label: 'Sensitivity', weight: 1.2 },
  ]

  let totalScore = 0
  let totalWeight = 0
  const breakdown: any = {}

  dimensions.forEach(d => {
    const v1 = dims1[d.key] || 50
    const v2 = dims2[d.key] || 50
    const diff = Math.abs(v1 - v2)
    // Similarity score: 100 - diff, weighted
    const dimensionScore = Math.max(0, 100 - diff * 1.2)
    breakdown[d.label] = Math.round(dimensionScore)
    totalScore += dimensionScore * d.weight
    totalWeight += d.weight
  })

  const finalScore = Math.round(totalScore / totalWeight)
  return { score: Math.min(100, Math.max(0, finalScore)), breakdown }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fromId, toId } = body
    if (!supabase) return Response.json({ error: 'DB not configured' })

    const [fromRes, toRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', fromId).single(),
      supabase.from('profiles').select('*').eq('id', toId).single()
    ])
    if (fromRes.error || toRes.error) throw new Error('Profile not found')

    const { score, breakdown } = calcCompatibility(fromRes.data.dimensions, toRes.data.dimensions)

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
    return Response.json({ match: data, score, breakdown })
  } catch (err: any) {
    return Response.json({ error: err.message })
  }
}

export async function GET(req: Request) {
  if (!supabase) return Response.json({ error: 'DB not configured' })
  const { searchParams } = new URL(req.url)
  const profileId = searchParams.get('profileId')

  if (profileId) {
    const { data: matches } = await supabase
      .from('matches')
      .select('*, from_profile:profiles!matches_from_profile_id_fkey(*), to_profile:profiles!matches_to_profile_id_fkey(*)')
      .or(`from_profile_id.eq.${profileId},to_profile_id.eq.${profileId}`)
      .order('compatibility_score', { ascending: false })

    // Get all profiles for computing compatibility
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', profileId)

    const myProfile = (await supabase.from('profiles').select('*').eq('id', profileId).single()).data

    const recommendations = (allProfiles || []).map(p => ({
      ...p,
      compatibility: myProfile ? calcCompatibility(myProfile.dimensions, p.dimensions) : { score: 50, breakdown: {} }
    })).sort((a, b) => b.compatibility.score - a.compatibility.score)

    return Response.json({ matches: matches || [], recommendations })
  }

  return Response.json({ matches: [] })
}
