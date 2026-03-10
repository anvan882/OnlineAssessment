import { fetchFeatures, createFeature, voteFeature, fetchFeatureById, fetchTrendingFeatures } from '../features';
import { MOCK_FEATURES } from '../mockData';

describe('fetchFeatures', () => {
  it('returns features for a known category', async () => {
    const result = await fetchFeatures('voter-1', 'cat-1');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].category_id).toBe('cat-1');
  });

  it('returns empty array for unknown category', async () => {
    const result = await fetchFeatures('voter-1', 'unknown');
    expect(result).toEqual([]);
  });

  it('returns new object references (not originals)', async () => {
    const a = await fetchFeatures('voter-1', 'cat-1');
    const b = await fetchFeatures('voter-1', 'cat-1');
    expect(a).not.toBe(b);
    expect(a[0]).not.toBe(b[0]);
  });

  it('each feature has required vote fields', async () => {
    const result = await fetchFeatures('voter-1', 'cat-1');
    for (const f of result) {
      expect(typeof f.upvotes_count).toBe('number');
      expect(typeof f.downvotes_count).toBe('number');
      expect(typeof f.score).toBe('number');
      expect(typeof f.my_vote).toBe('number');
    }
  });

  it('each feature has a rationale field', async () => {
    const result = await fetchFeatures('voter-1', 'cat-1');
    for (const f of result) {
      expect(typeof f.rationale).toBe('string');
    }
  });

  it('each feature has a valid status field', async () => {
    const result = await fetchFeatures('voter-1', 'cat-1');
    const validStatuses = ['requested', 'in_progress', 'shipped'];
    for (const f of result) {
      expect(validStatuses).toContain(f.status);
    }
  });

  it('returns features for every mock category', async () => {
    for (const catId of Object.keys(MOCK_FEATURES)) {
      const result = await fetchFeatures('voter-1', catId);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});

describe('voteFeature', () => {
  it('resolves without error', async () => {
    await expect(voteFeature('f1', 'v1', 1)).resolves.toBeUndefined();
  });

  it('resolves for clear vote', async () => {
    await expect(voteFeature('f1', 'v1', 0)).resolves.toBeUndefined();
  });

  it('resolves for downvote', async () => {
    await expect(voteFeature('f1', 'v1', -1)).resolves.toBeUndefined();
  });

  it('persists upvote in MOCK_FEATURES', async () => {
    const before = await fetchFeatureById('v1', 'f1-1');
    const originalUp = before!.upvotes_count;
    const originalVote = before!.my_vote;

    await voteFeature('f1-1', 'v1', 1);

    const after = await fetchFeatureById('v1', 'f1-1');
    expect(after!.upvotes_count).toBe(originalUp + 1);
    expect(after!.my_vote).toBe(1);

    // Clean up: revert the vote
    await voteFeature('f1-1', 'v1', originalVote);
  });
});

describe('fetchTrendingFeatures', () => {
  it('returns at most the requested limit', async () => {
    const result = await fetchTrendingFeatures('v1', 5);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('returns fewer items when limit exceeds total features', async () => {
    const result = await fetchTrendingFeatures('v1', 9999);
    expect(result.length).toBeGreaterThan(0);
  });

  it('results are sorted by engagement descending', async () => {
    const result = await fetchTrendingFeatures('v1', 10);
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1].upvotes_count + result[i - 1].downvotes_count;
      const curr = result[i].upvotes_count + result[i].downvotes_count;
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('returns new object references', async () => {
    const a = await fetchTrendingFeatures('v1', 3);
    const b = await fetchTrendingFeatures('v1', 3);
    expect(a[0]).not.toBe(b[0]);
  });

  it('returns 0 items when limit is 0', async () => {
    const result = await fetchTrendingFeatures('v1', 0);
    expect(result).toEqual([]);
  });
});

describe('fetchFeatureById', () => {
  it('returns a feature when id exists', async () => {
    const result = await fetchFeatureById('voter-1', 'f1-1');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('f1-1');
  });

  it('returns null for unknown id', async () => {
    const result = await fetchFeatureById('voter-1', 'does-not-exist');
    expect(result).toBeNull();
  });

  it('returns a new object reference (not original)', async () => {
    const a = await fetchFeatureById('voter-1', 'f1-1');
    const b = await fetchFeatureById('voter-1', 'f1-1');
    expect(a).not.toBe(b);
  });

  it('returned feature has all required fields', async () => {
    const result = await fetchFeatureById('voter-1', 'f2-3');
    expect(result).not.toBeNull();
    if (!result) return;
    expect(typeof result.title).toBe('string');
    expect(typeof result.description).toBe('string');
    expect(typeof result.score).toBe('number');
    expect(typeof result.upvotes_count).toBe('number');
    expect(typeof result.downvotes_count).toBe('number');
    expect(['requested', 'in_progress', 'shipped']).toContain(result.status);
  });
});

describe('createFeature', () => {
  it('returns a feature with the provided input', async () => {
    const result = await createFeature({
      title: 'New Feature',
      description: 'A description',
      voter_id: 'v1',
      category_id: 'cat-1',
    });
    expect(result.title).toBe('New Feature');
    expect(result.description).toBe('A description');
    expect(result.voter_id).toBe('v1');
    expect(result.category_id).toBe('cat-1');
    expect(result.id).toBeTruthy();
    expect(result.created_at).toBeTruthy();
    expect(result.status).toBe('requested');
  });

  it('returns unique ids for each call', async () => {
    const a = await createFeature({ title: 'A', description: 'A', voter_id: 'v1', category_id: 'cat-1' });
    const b = await createFeature({ title: 'B', description: 'B', voter_id: 'v1', category_id: 'cat-1' });
    expect(a.id).not.toBe(b.id);
  });
});
