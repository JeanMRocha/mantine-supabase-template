import { supabase } from '../supabase/supabaseClient';

export async function getAnalisesSupabase() {
  const { data, error } = await supabase.from('analises_solo').select('*');
  if (error) throw error;
  return data;
}
