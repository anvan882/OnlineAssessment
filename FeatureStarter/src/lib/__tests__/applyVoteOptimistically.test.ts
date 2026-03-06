import { applyVoteOptimistically, type FeatureWithVotes } from '../features';

function makeFeature(overrides: Partial<FeatureWithVotes> = {}): FeatureWithVotes {
  return {
    id: 'f1',
    title: 'Test Feature',
    description: 'A test',
    voter_id: 'v1',
    created_at: '2026-01-01T00:00:00Z',
    upvotes_count: 0,
    downvotes_count: 0,
    score: 0,
    my_vote: 0,
    ...overrides,
  };
}

describe('applyVoteOptimistically', () => {
  it('upvote from neutral', () => {
    const result = applyVoteOptimistically(makeFeature(), 1);
    expect(result.my_vote).toBe(1);
    expect(result.upvotes_count).toBe(1);
    expect(result.downvotes_count).toBe(0);
    expect(result.score).toBe(1);
  });

  it('downvote from neutral', () => {
    const result = applyVoteOptimistically(makeFeature(), -1);
    expect(result.my_vote).toBe(-1);
    expect(result.upvotes_count).toBe(0);
    expect(result.downvotes_count).toBe(1);
    expect(result.score).toBe(-1);
  });

  it('clear upvote (upvoted -> neutral)', () => {
    const feature = makeFeature({ my_vote: 1, upvotes_count: 3, score: 3 });
    const result = applyVoteOptimistically(feature, 0);
    expect(result.my_vote).toBe(0);
    expect(result.upvotes_count).toBe(2);
    expect(result.downvotes_count).toBe(0);
    expect(result.score).toBe(2);
  });

  it('clear downvote (downvoted -> neutral)', () => {
    const feature = makeFeature({ my_vote: -1, downvotes_count: 2, score: -2 });
    const result = applyVoteOptimistically(feature, 0);
    expect(result.my_vote).toBe(0);
    expect(result.upvotes_count).toBe(0);
    expect(result.downvotes_count).toBe(1);
    expect(result.score).toBe(-1);
  });

  it('switch from upvote to downvote', () => {
    const feature = makeFeature({ my_vote: 1, upvotes_count: 5, downvotes_count: 2, score: 3 });
    const result = applyVoteOptimistically(feature, -1);
    expect(result.my_vote).toBe(-1);
    expect(result.upvotes_count).toBe(4);
    expect(result.downvotes_count).toBe(3);
    expect(result.score).toBe(1);
  });

  it('switch from downvote to upvote', () => {
    const feature = makeFeature({ my_vote: -1, upvotes_count: 1, downvotes_count: 4, score: -3 });
    const result = applyVoteOptimistically(feature, 1);
    expect(result.my_vote).toBe(1);
    expect(result.upvotes_count).toBe(2);
    expect(result.downvotes_count).toBe(3);
    expect(result.score).toBe(-1);
  });

  it('does not mutate original feature', () => {
    const original = makeFeature({ my_vote: 0, upvotes_count: 1 });
    const frozen = { ...original };
    applyVoteOptimistically(original, 1);
    expect(original).toEqual(frozen);
  });

  it('handles zero counts correctly', () => {
    const feature = makeFeature({ upvotes_count: 0, downvotes_count: 0, score: 0, my_vote: 0 });
    const result = applyVoteOptimistically(feature, 1);
    expect(result.upvotes_count).toBe(1);
    expect(result.downvotes_count).toBe(0);
    expect(result.score).toBe(1);
  });
});
