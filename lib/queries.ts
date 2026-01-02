import { supabase } from './supabase'

export async function getCharacterDetail(char: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('wordhead', char)
    .single()

  if (error) throw error
  return data
}
