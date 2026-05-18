-- ─────────────────────────────────────────────
-- 003 · Subscription tables
-- Per-child premium subscription management.
-- Mock-first: the app uses localStorage today,
-- but this schema is ready for Stripe webhooks.
-- ─────────────────────────────────────────────

-- Plan tiers
CREATE TYPE plan_tier AS ENUM ('free', 'premium');

-- One row per child subscription
CREATE TABLE IF NOT EXISTS child_subscriptions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  tier          plan_tier NOT NULL DEFAULT 'free',

  -- Billing period
  subscribed_at       TIMESTAMPTZ,
  current_period_end  TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Stripe integration (populated by webhook)
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(child_id)
);

-- ── RLS ──

ALTER TABLE child_subscriptions ENABLE ROW LEVEL SECURITY;

-- Parents can read their own children's subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON child_subscriptions FOR SELECT
  USING (account_id = auth.uid());

-- Only backend/webhooks should update subscriptions,
-- but for mock mode allow the user to manage their own
CREATE POLICY "Users can manage own subscriptions"
  ON child_subscriptions FOR ALL
  USING (account_id = auth.uid())
  WITH CHECK (account_id = auth.uid());

-- ── Helper functions ──

-- Check if a child has active premium
CREATE OR REPLACE FUNCTION is_child_premium(p_child_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_sub child_subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO v_sub
  FROM child_subscriptions
  WHERE child_id = p_child_id
    AND tier = 'premium'
  LIMIT 1;

  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Check expiration
  IF v_sub.current_period_end IS NOT NULL
     AND v_sub.current_period_end < NOW() THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Expire cancelled subscriptions past their period end
CREATE OR REPLACE FUNCTION process_expired_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE child_subscriptions
  SET tier = 'free',
      updated_at = NOW()
  WHERE tier = 'premium'
    AND cancel_at_period_end = TRUE
    AND current_period_end < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_child_subscriptions_child
  ON child_subscriptions(child_id);

CREATE INDEX IF NOT EXISTS idx_child_subscriptions_stripe
  ON child_subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
