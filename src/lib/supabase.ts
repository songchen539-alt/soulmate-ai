import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl?.startsWith('http')
  ? createClient(supabaseUrl, supabaseKey)
  : null

export { createClient as createBrowserClient } from '@/utils/supabase/client'
export { createClient as createServerClient } from '@/utils/supabase/server'
