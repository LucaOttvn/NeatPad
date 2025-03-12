import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzkmtpvegjxyzocdsttn.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
export let supabase = createClient(supabaseUrl, supabaseKey!)