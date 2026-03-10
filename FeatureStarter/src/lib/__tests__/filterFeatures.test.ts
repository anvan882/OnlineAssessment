import { filterFeaturesByStatus, type FeatureWithVotes } from '../features';

function makeFeature(overrides: Partial<FeatureWithVotes>): FeatureWithVotes {
  return {
    id: 'f1',
    title: 'Test',
    description: 'Desc',
    rationale: '',
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

describe('filterFeaturesByStatus', () => {
  const features: FeatureWithVotes[] = [
    makeFeature({ id: 'a', status: 'requested' }),
    makeFeature({ id: 'b', status: 'in_progress' }),
    makeFeature({ id: 'c', status: 'shipped' }),
    makeFeature({ id: 'd', status: 'requested' }),
  ];

  it('returns all features when status is null', () => {
    const result = filterFeaturesByStatus(features, null);
    expect(result).toHaveLength(4);
  });

  it('filters by requested', () => {
    const result = filterFeaturesByStatus(features, 'requested');
    expect(result.map((f) => f.id)).toEqual(['a', 'd']);
  });

  it('filters by in_progress', () => {
    const result = filterFeaturesByStatus(features, 'in_progress');
    expect(result.map((f) => f.id)).toEqual(['b']);
  });

  it('filters by shipped', () => {
    const result = filterFeaturesByStatus(features, 'shipped');
    expect(result.map((f) => f.id)).toEqual(['c']);
  });

  it('returns empty array when no matches', () => {
    const onlyRequested = [makeFeature({ id: 'x', status: 'requested' })];
    expect(filterFeaturesByStatus(onlyRequested, 'shipped')).toEqual([]);
  });

  it('handles empty array', () => {
    expect(filterFeaturesByStatus([], 'requested')).toEqual([]);
  });
});
