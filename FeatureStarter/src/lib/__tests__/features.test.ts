import { fetchFeatures, createFeature, voteFeature } from '../features';
import { supabase } from '../supabase';

// supabase is globally mocked via jest.setup.js
const mockFrom = supabase.from as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchFeatures', () => {
  it('merges features with user votes', async () => {
    const featuresData = [
      { id: 'f1', title: 'A', description: 'desc', voter_id: 'v1', category_id: 'cat-1', created_at: '2026-01-01', upvotes_count: 2, downvotes_count: 1, score: 1 },
    ];
    const votesData = [{ feature_id: 'f1', vote_value: 1 }];

    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: featuresData, error: null });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: votesData, error: null });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    const result = await fetchFeatures('voter-1', 'cat-1');
    expect(result).toHaveLength(1);
    expect(result[0].my_vote).toBe(1);
    expect(result[0].upvotes_count).toBe(2);
  });

  it('defaults my_vote to 0 when user has no vote', async () => {
    const featuresData = [
      { id: 'f1', title: 'A', description: 'desc', voter_id: 'v1', category_id: 'cat-1', created_at: '2026-01-01', upvotes_count: 0, downvotes_count: 0, score: 0 },
    ];

    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: featuresData, error: null });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    const result = await fetchFeatures('voter-1', 'cat-1');
    expect(result[0].my_vote).toBe(0);
  });

  it('returns empty array when no features exist', async () => {
    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    const result = await fetchFeatures('voter-1', 'cat-1');
    expect(result).toEqual([]);
  });

  it('handles null counts gracefully', async () => {
    const featuresData = [
      { id: 'f1', title: 'A', description: 'desc', voter_id: 'v1', category_id: 'cat-1', created_at: '2026-01-01', upvotes_count: null, downvotes_count: null, score: null },
    ];

    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: featuresData, error: null });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    const result = await fetchFeatures('voter-1', 'cat-1');
    expect(result[0].upvotes_count).toBe(0);
    expect(result[0].downvotes_count).toBe(0);
    expect(result[0].score).toBe(0);
  });

  it('throws when features query fails', async () => {
    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    await expect(fetchFeatures('voter-1', 'cat-1')).rejects.toEqual({ message: 'DB error' });
  });

  it('throws when votes query fails', async () => {
    const mockFeaturesEq = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockFeaturesEq });
    const mockVotesEq = jest.fn().mockResolvedValue({ data: null, error: { message: 'Vote error' } });
    const mockVotesSelect = jest.fn().mockReturnValue({ eq: mockVotesEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'features_with_votes') return { select: mockSelect };
      if (table === 'votes') return { select: mockVotesSelect };
      return {};
    });

    await expect(fetchFeatures('voter-1', 'cat-1')).rejects.toEqual({ message: 'Vote error' });
  });
});

describe('voteFeature', () => {
  it('calls delete when voteValue is 0', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: null });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockDel = jest.fn().mockReturnValue({ eq: mockEq1 });

    mockFrom.mockImplementation(() => ({ delete: mockDel }));

    await voteFeature('f1', 'v1', 0);
    expect(mockEq1).toHaveBeenCalledWith('feature_id', 'f1');
    expect(mockEq2).toHaveBeenCalledWith('voter_id', 'v1');
  });

  it('calls upsert when voteValue is 1', async () => {
    const mockUpsertCall = jest.fn().mockResolvedValue({ error: null });

    mockFrom.mockImplementation(() => ({ upsert: mockUpsertCall }));

    await voteFeature('f1', 'v1', 1);
    expect(mockUpsertCall).toHaveBeenCalledWith(
      { feature_id: 'f1', voter_id: 'v1', vote_value: 1 },
      { onConflict: 'feature_id,voter_id' }
    );
  });

  it('calls upsert when voteValue is -1', async () => {
    const mockUpsertCall = jest.fn().mockResolvedValue({ error: null });

    mockFrom.mockImplementation(() => ({ upsert: mockUpsertCall }));

    await voteFeature('f1', 'v1', -1);
    expect(mockUpsertCall).toHaveBeenCalledWith(
      { feature_id: 'f1', voter_id: 'v1', vote_value: -1 },
      { onConflict: 'feature_id,voter_id' }
    );
  });

  it('throws when delete fails', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockDel = jest.fn().mockReturnValue({ eq: mockEq1 });

    mockFrom.mockImplementation(() => ({ delete: mockDel }));

    await expect(voteFeature('f1', 'v1', 0)).rejects.toEqual({ message: 'Delete failed' });
  });

  it('throws when upsert fails', async () => {
    const mockUpsertCall = jest.fn().mockResolvedValue({ error: { message: 'Upsert failed' } });

    mockFrom.mockImplementation(() => ({ upsert: mockUpsertCall }));

    await expect(voteFeature('f1', 'v1', 1)).rejects.toEqual({ message: 'Upsert failed' });
  });
});

describe('createFeature', () => {
  it('inserts and returns created feature', async () => {
    const created = { id: 'f1', title: 'New', description: 'Desc', voter_id: 'v1', created_at: '2026-01-01' };
    const mockSingleCall = jest.fn().mockResolvedValue({ data: created, error: null });
    const mockSelectCall = jest.fn().mockReturnValue({ single: mockSingleCall });
    const mockInsertCall = jest.fn().mockReturnValue({ select: mockSelectCall });

    mockFrom.mockImplementation(() => ({ insert: mockInsertCall }));

    const result = await createFeature({ title: 'New', description: 'Desc', voter_id: 'v1' });
    expect(result).toEqual(created);
    expect(mockInsertCall).toHaveBeenCalledWith({ title: 'New', description: 'Desc', voter_id: 'v1' });
  });

  it('throws when insert fails', async () => {
    const mockSingleCall = jest.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } });
    const mockSelectCall = jest.fn().mockReturnValue({ single: mockSingleCall });
    const mockInsertCall = jest.fn().mockReturnValue({ select: mockSelectCall });

    mockFrom.mockImplementation(() => ({ insert: mockInsertCall }));

    await expect(
      createFeature({ title: 'X', description: 'Y', voter_id: 'v1' })
    ).rejects.toEqual({ message: 'Insert failed' });
  });
});
