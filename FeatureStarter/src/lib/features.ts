import { MOCK_FEATURES } from './mockData';

let nextId = 1;

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoteValue = 1 | -1 | 0;
export type SortOption = 'most_voted' | 'newest' | 'trending';

export type FeatureStatus = 'requested' | 'in_progress' | 'shipped';

export type Feature = {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  voter_id: string;
  category_id: string;
  created_at: string;
};

export type FeatureWithVotes = Feature & {
  upvotes_count: number;
  downvotes_count: number;
  score: number;
  my_vote: VoteValue;
};

export type CreateFeatureInput = {
  title: string;
  description: string;
  voter_id: string;
  category_id: string;
};

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Fetch all features for a category with vote counts.
 * Currently returns mock data.
 */
export async function fetchFeatures(voterId: string, categoryId: string): Promise<FeatureWithVotes[]> {
  const features = MOCK_FEATURES[categoryId] ?? [];
  return features.map((f) => ({ ...f }));
}

/**
 * Insert a new feature row. Returns the created record.
 * Currently a no-op with mock data.
 */
export async function createFeature(input: CreateFeatureInput): Promise<Feature> {
  return {
    id: `f-${Date.now()}-${nextId++}`,
    title: input.title,
    description: input.description,
    status: 'requested',
    voter_id: input.voter_id,
    category_id: input.category_id,
    created_at: new Date().toISOString(),
  };
}

/**
 * Cast or clear a vote. Currently a no-op (optimistic UI handles display).
 */
export async function voteFeature(
  _featureId: string,
  _voterId: string,
  _voteValue: VoteValue
): Promise<void> {
  // No-op — optimistic update handles the UI
}

/**
 * Sort features by the given option. Returns a new array.
 */
export function sortFeatures(features: FeatureWithVotes[], sort: SortOption): FeatureWithVotes[] {
  const copy = [...features];
  switch (sort) {
    case 'most_voted':
      return copy.sort((a, b) => b.score - a.score);
    case 'newest':
      return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'trending':
      // Trending = highest total engagement (upvotes + downvotes)
      return copy.sort((a, b) => (b.upvotes_count + b.downvotes_count) - (a.upvotes_count + a.downvotes_count));
  }
}

/**
 * Filter features by status. If status is null, return all.
 */
export function filterFeaturesByStatus(
  features: FeatureWithVotes[],
  status: FeatureStatus | null,
): FeatureWithVotes[] {
  if (!status) return features;
  return features.filter((f) => f.status === status);
}

/**
 * Compute the optimistic next state for a feature after a vote.
 */
export function applyVoteOptimistically(
  feature: FeatureWithVotes,
  nextVote: VoteValue
): FeatureWithVotes {
  const prev = feature.my_vote;
  let up = feature.upvotes_count;
  let down = feature.downvotes_count;

  if (prev === 1) up -= 1;
  if (prev === -1) down -= 1;

  if (nextVote === 1) up += 1;
  if (nextVote === -1) down += 1;

  return {
    ...feature,
    my_vote: nextVote,
    upvotes_count: up,
    downvotes_count: down,
    score: up - down,
  };
}
