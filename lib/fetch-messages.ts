import { createClient } from '@/lib/supabase/client';

export async function fetchMessages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}
