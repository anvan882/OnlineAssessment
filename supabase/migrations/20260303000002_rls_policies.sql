-- Migration: RLS policies for anonymous voter_id auth
-- Since we skip Supabase Auth and use client-generated voter_id,
-- we allow all operations via the anon key.

-- ─── features ────────────────────────────────────────────────────────────────

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read features"
  ON public.features FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert features"
  ON public.features FOR INSERT
  WITH CHECK (true);

-- ─── votes ───────────────────────────────────────────────────────────────────

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON public.votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update votes"
  ON public.votes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete votes"
  ON public.votes FOR DELETE
  USING (true);
