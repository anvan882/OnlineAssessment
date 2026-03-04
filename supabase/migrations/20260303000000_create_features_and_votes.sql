-- Migration: Feature Voting System schema
-- Idempotent — safe to re-run

-- 1) Features table
CREATE TABLE IF NOT EXISTS public.features (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description text CHECK (description IS NULL OR char_length(description) <= 500),
  voter_id   uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index: list features newest-first
CREATE INDEX IF NOT EXISTS idx_features_created_at
  ON public.features (created_at DESC);

-- 2) Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  voter_id   uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_votes_feature_voter UNIQUE (feature_id, voter_id)
);

-- Index: fast vote counting per feature
CREATE INDEX IF NOT EXISTS idx_votes_feature_id
  ON public.votes (feature_id);

-- 3) View: features with vote_count
CREATE OR REPLACE VIEW public.features_with_votes AS
SELECT
  f.id,
  f.title,
  f.description,
  f.voter_id,
  f.created_at,
  COALESCE(v.vote_count, 0) AS vote_count
FROM public.features f
LEFT JOIN (
  SELECT feature_id, COUNT(*) AS vote_count
  FROM public.votes
  GROUP BY feature_id
) v ON v.feature_id = f.id;
