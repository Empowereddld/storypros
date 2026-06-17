-- ============================================================
-- 004 · Per-completion score history + collectible ownership
-- story_completions: append-only, one row per playthrough
--   (Jinean's decision: keep both scores on replay, don't replace)
-- owned_collectibles: shop purchases + auto-awarded badges
-- Applied to the live Lovable Cloud DB on 2026-06-11.
-- ============================================================

CREATE TABLE IF NOT EXISTS story_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children ON DELETE CASCADE,
  story_id text NOT NULL REFERENCES stories ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  first_attempt_accuracy float NOT NULL DEFAULT 0,
  replay_count int NOT NULL DEFAULT 0,
  domain_scores jsonb NOT NULL DEFAULT '{}',
  overall_score float NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_completions_child ON story_completions (child_id, completed_at);
ALTER TABLE story_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents see child completions" ON story_completions FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));
CREATE POLICY "Parents write child completions" ON story_completions FOR INSERT
  WITH CHECK (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));
CREATE POLICY "SLPs see caseload completions" ON story_completions FOR SELECT
  USING (child_id IN (SELECT child_id FROM slp_caseload WHERE slp_id = auth.uid()));

CREATE TABLE IF NOT EXISTS owned_collectibles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children ON DELETE CASCADE,
  collectible_id text NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, collectible_id)
);
ALTER TABLE owned_collectibles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents see child collectibles" ON owned_collectibles FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));
CREATE POLICY "Parents write child collectibles" ON owned_collectibles FOR INSERT
  WITH CHECK (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));
