// Auth API - using Supabase REST API directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'login'

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return Response.json({ error: 'Auth not configured' })
    }

    const endpoint = type === 'signup'
      ? `${SUPABASE_URL}/auth/v1/signup`
      : `${SUPABASE_URL}/auth/v1/token?grant_type=password`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify(type === 'signup' ? { email, password } : { email, password })
    })

    const data = await res.json()

    if (data.error) {
      return Response.json({ error: data.error_description || data.msg || 'Auth failed' })
    }

    return Response.json({
      user: {
        id: data.user?.id || data.id,
        email: data.user?.email || email
      }
    })
  } catch (err: any) {
    return Response.json({ error: err.message })
  }
}
