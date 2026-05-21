import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 未配置Supabase时不初始化
export const supabase = supabaseUrl?.startsWith('http')
  ? createClient(supabaseUrl, supabaseKey || '')
  : null
