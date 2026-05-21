import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()

  if (!supabase) {
    return Response.json({ 
      data: null, 
      error: 'Database not configured. Please set up Supabase.' 
    })
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([
      {
        email: body.email,
        instagram: body.instagram,
        tiktok: body.tiktok,
      },
    ])

  return Response.json({ data, error })
}
