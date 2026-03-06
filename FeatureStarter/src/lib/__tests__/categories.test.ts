import { fetchCategories } from '../categories';
import { MOCK_CATEGORIES } from '../mockData';

describe('fetchCategories', () => {
  it('returns all mock categories', async () => {
    const result = await fetchCategories();
    expect(result).toHaveLength(MOCK_CATEGORIES.length);
  });

  it('returns categories sorted by name', async () => {
    const result = await fetchCategories();
    const names = result.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('each category has required fields', async () => {
    const result = await fetchCategories();
    for (const cat of result) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.image).toBeTruthy();
      expect(cat.created_at).toBeTruthy();
    }
  });

  it('returns new array references (not the original)', async () => {
    const a = await fetchCategories();
    const b = await fetchCategories();
    expect(a).not.toBe(b);
  });
});
