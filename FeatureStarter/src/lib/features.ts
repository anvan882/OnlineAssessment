import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoteValue = 1 | -1 | 0;

export type Feature = {
  id: string;
  title: string;
  description: string;
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
 * Fetch all features with vote counts, plus the calling voter's current vote.
 * Two parallel queries are merged client-side to avoid complex view joins.
 */
export async function fetchFeatures(voterId: string, categoryId: string): Promise<FeatureWithVotes[]> {
  const [featuresRes, votesRes] = await Promise.all([
    supabase.from('features_with_votes').select('*').eq('category_id', categoryId),
    supabase
      .from('votes')
      .select('feature_id, vote_value')
      .eq('voter_id', voterId),
  ]);

  if (featuresRes.error) throw featuresRes.error;
  if (votesRes.error) throw votesRes.error;

  const myVotesMap = new Map<string, VoteValue>(
    (votesRes.data ?? []).map((v) => [v.feature_id, v.vote_value as VoteValue])
  );

  return (featuresRes.data ?? []).map((f) => ({
    ...f,
    upvotes_count: f.upvotes_count ?? 0,
    downvotes_count: f.downvotes_count ?? 0,
    score: f.score ?? 0,
    my_vote: myVotesMap.get(f.id) ?? 0,
  }));
}

/**
 * Insert a new feature row. Returns the created record.
 */
export async function createFeature(input: CreateFeatureInput): Promise<Feature> {
  const { data, error } = await supabase
    .from('features')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cast or clear a vote.
 *  voteValue  1 → upvote   (upsert)
 *  voteValue -1 → downvote (upsert)
 *  voteValue  0 → clear    (delete)
 */
export async function voteFeature(
  featureId: string,
  voterId: string,
  voteValue: VoteValue
): Promise<void> {
  if (voteValue === 0) {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('feature_id', featureId)
      .eq('voter_id', voterId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('votes')
      .upsert(
        { feature_id: featureId, voter_id: voterId, vote_value: voteValue },
        { onConflict: 'feature_id,voter_id' }
      );

    if (error) throw error;
  }
}

/**
 * Compute the optimistic next state for a feature after a vote.
 * Call this before the API round-trip so the UI updates instantly.
 * Revert by restoring the previous snapshot if the API call fails.
 */
export function applyVoteOptimistically(
  feature: FeatureWithVotes,
  nextVote: VoteValue
): FeatureWithVotes {
  const prev = feature.my_vote;
  let up = feature.upvotes_count;
  let down = feature.downvotes_count;

  // Undo the previous vote
  if (prev === 1) up -= 1;
  if (prev === -1) down -= 1;

  // Apply the new vote
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
