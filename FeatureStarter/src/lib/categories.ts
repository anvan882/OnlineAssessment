import { MOCK_CATEGORIES } from './mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: string;
};

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered alphabetically by name.
 * Currently returns mock data.
 */
export async function fetchCategories(): Promise<Category[]> {
  return [...MOCK_CATEGORIES].sort((a, b) => a.name.localeCompare(b.name));
}
