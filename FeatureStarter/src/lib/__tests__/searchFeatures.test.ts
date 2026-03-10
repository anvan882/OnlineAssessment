import { searchFeatures, type FeatureWithVotes } from '../features';

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

describe('searchFeatures', () => {
  const features: FeatureWithVotes[] = [
    makeFeature({ id: 'a', title: 'Dark Mode', description: 'Add a dark theme' }),
    makeFeature({ id: 'b', title: 'Export CSV', description: 'Export data to spreadsheet' }),
    makeFeature({ id: 'c', title: 'Offline Support', description: 'Work without internet' }),
  ];

  it('returns all features when query is empty', () => {
    expect(searchFeatures(features, '')).toHaveLength(3);
  });

  it('returns all features when query is only whitespace', () => {
    expect(searchFeatures(features, '   ')).toHaveLength(3);
  });

  it('matches by title (case-insensitive)', () => {
    const result = searchFeatures(features, 'dark');
    expect(result.map((f) => f.id)).toEqual(['a']);
  });

  it('matches by description (case-insensitive)', () => {
    const result = searchFeatures(features, 'spreadsheet');
    expect(result.map((f) => f.id)).toEqual(['b']);
  });

  it('matches partial words', () => {
    const result = searchFeatures(features, 'off');
    expect(result.map((f) => f.id)).toEqual(['c']);
  });

  it('returns empty array when no match', () => {
    expect(searchFeatures(features, 'zzznomatch')).toEqual([]);
  });

  it('handles empty features array', () => {
    expect(searchFeatures([], 'dark')).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const copy = [...features];
    searchFeatures(features, 'dark');
    expect(features).toEqual(copy);
  });
});
