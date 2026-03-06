import { fetchFeatures, createFeature, voteFeature } from '../features';
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
