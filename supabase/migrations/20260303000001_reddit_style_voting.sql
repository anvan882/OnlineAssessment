-- Migration: Reddit-style voting schema
-- Adds vote_value to votes, makes description NOT NULL, rebuilds features_with_votes view
-- Idempotent — safe to re-run

-- 1) Drop old view so we can recreate it with new columns
DROP VIEW IF EXISTS public.features_with_votes;

-- 2) Add vote_value to votes
--    DEFAULT 1 lets us add it without failing on any existing rows, then we drop the default.
ALTER TABLE public.votes
  ADD COLUMN IF NOT EXISTS vote_value smallint NOT NULL DEFAULT 1
    CHECK (vote_value IN (1, -1));

ALTER TABLE public.votes
  ALTER COLUMN vote_value DROP DEFAULT;

-- 3) Make description NOT NULL on features
--    Backfill any existing NULLs first so the constraint doesn't fail.
UPDATE public.features SET description = '' WHERE description IS NULL;

ALTER TABLE public.features
  ALTER COLUMN description SET NOT NULL;

-- 4) Recreate view: upvotes_count, downvotes_count, score, sorted by score desc
CREATE OR REPLACE VIEW public.features_with_votes AS
SELECT
  f.id,
  f.title,
  f.description,
  f.voter_id,
  f.created_at,
  COALESCE(v.upvotes_count,   0) AS upvotes_count,
  COALESCE(v.downvotes_count, 0) AS downvotes_count,
  COALESCE(v.score,           0) AS score
FROM public.features f
LEFT JOIN (
  SELECT
    feature_id,
    COUNT(*) FILTER (WHERE vote_value =  1)  AS upvotes_count,
    COUNT(*) FILTER (WHERE vote_value = -1)  AS downvotes_count,
    SUM(vote_value)                           AS score
  FROM public.votes
  GROUP BY feature_id
) v ON v.feature_id = f.id
ORDER BY score DESC, f.created_at DESC;
