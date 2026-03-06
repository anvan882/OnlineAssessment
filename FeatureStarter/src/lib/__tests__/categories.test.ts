import { fetchCategories } from '../categories';
import { supabase } from '../supabase';

// supabase is globally mocked via jest.setup.js
const mockFrom = supabase.from as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchCategories', () => {
  it('returns array of categories on success', async () => {
    const categoriesData = [
      { id: 'c1', name: 'AI Tools', description: 'AI stuff', icon: 'smart-toy', icon_color: '#10B981', created_at: '2026-01-01' },
      { id: 'c2', name: 'Music', description: 'Music stuff', icon: 'headphones', icon_color: '#EC4899', created_at: '2026-01-01' },
    ];

    const mockOrder = jest.fn().mockResolvedValue({ data: categoriesData, error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    mockFrom.mockImplementation(() => ({ select: mockSelect }));

    const result = await fetchCategories();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('AI Tools');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('name');
  });

  it('returns empty array when no categories exist', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    mockFrom.mockImplementation(() => ({ select: mockSelect }));

    const result = await fetchCategories();
    expect(result).toEqual([]);
  });

  it('returns empty array when data is null', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    mockFrom.mockImplementation(() => ({ select: mockSelect }));

    const result = await fetchCategories();
    expect(result).toEqual([]);
  });

  it('throws when query fails', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    mockFrom.mockImplementation(() => ({ select: mockSelect }));

    await expect(fetchCategories()).rejects.toEqual({ message: 'DB error' });
  });
});
