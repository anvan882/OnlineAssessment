import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  icon_color: string;
  created_at: string;
};

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered alphabetically by name.
 */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data ?? [];
}
