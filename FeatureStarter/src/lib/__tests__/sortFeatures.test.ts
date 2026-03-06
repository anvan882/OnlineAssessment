import { sortFeatures, type FeatureWithVotes } from '../features';

function makeFeature(overrides: Partial<FeatureWithVotes>): FeatureWithVotes {
  return {
    id: 'f1',
    title: 'Test',
    description: 'Desc',
    status: 'requested',
    voter_id: 'v1',
    category_id: 'cat-1',
    created_at: '2026-01-15T00:00:00Z',
    upvotes_count: 0,
    downvotes_count: 0,
    score: 0,
    my_vote: 0,
    ...overrides,
  };
}

describe('sortFeatures', () => {
  const features: FeatureWithVotes[] = [
    makeFeature({ id: 'a', score: 5, created_at: '2026-01-01T00:00:00Z', upvotes_count: 5, downvotes_count: 0 }),
    makeFeature({ id: 'b', score: 10, created_at: '2026-01-03T00:00:00Z', upvotes_count: 12, downvotes_count: 2 }),
    makeFeature({ id: 'c', score: 3, created_at: '2026-01-02T00:00:00Z', upvotes_count: 8, downvotes_count: 5 }),
  ];

  it('sorts by most_voted (highest score first)', () => {
    const result = sortFeatures(features, 'most_voted');
    expect(result.map((f) => f.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by newest (latest created_at first)', () => {
    const result = sortFeatures(features, 'newest');
    expect(result.map((f) => f.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by trending (highest total engagement first)', () => {
    const result = sortFeatures(features, 'trending');
    // b: 14 total, c: 13 total, a: 5 total
    expect(result.map((f) => f.id)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the original array', () => {
    const original = [...features];
    sortFeatures(features, 'most_voted');
    expect(features).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortFeatures([], 'most_voted')).toEqual([]);
  });

  it('handles single item', () => {
    const single = [makeFeature({ id: 'x', score: 1 })];
    expect(sortFeatures(single, 'most_voted')).toHaveLength(1);
  });
});
