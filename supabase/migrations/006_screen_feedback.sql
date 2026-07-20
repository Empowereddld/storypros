-- ============================================================
-- 006 · Screen-by-screen client feedback (/review page)
-- Pre-launch review tool: anyone with the link can read,
-- submit, and toggle status. Tighten policies before public
-- launch. Applied to the live Lovable Cloud DB on 2026-07-19.
-- ============================================================

CREATE TABLE IF NOT EXISTS screen_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_key text NOT NULL,
  screen_label text NOT NULL,
  category text NOT NULL,
  author text,
  content text NOT NULL CHECK (char_length(content) BETWEEN 3 AND 2000),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_screen_feedback_screen ON screen_feedback (screen_key, created_at);
ALTER TABLE screen_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads feedback" ON screen_feedback FOR SELECT USING (true);
CREATE POLICY "Anyone submits feedback" ON screen_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone toggles status" ON screen_feedback FOR UPDATE USING (true);
