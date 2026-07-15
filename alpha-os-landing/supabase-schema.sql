-- PredictBot Staking Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/hjcpstearytiwelhnnhy/sql

-- =====================================================
-- 1. STAKERS TABLE
-- Tracks each user's staking position
-- =====================================================
CREATE TABLE IF NOT EXISTS stakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  amount_staked BIGINT DEFAULT 0,
  stake_month TEXT NOT NULL, -- Format: '2025-01' (YYYY-MM)
  stake_timestamp TIMESTAMPTZ DEFAULT NOW(),
  unstake_requested_at TIMESTAMPTZ NULL,
  unstake_month TEXT NULL, -- Month when they can actually unstake
  total_rewards_claimed BIGINT DEFAULT 0,
  last_claimed_month TEXT NULL, -- Last month they claimed rewards for
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MONTHLY REWARDS TABLE
-- Admin deposits SOL each month for distribution
-- =====================================================
CREATE TABLE IF NOT EXISTS monthly_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT UNIQUE NOT NULL, -- Format: '2025-01' (YYYY-MM)
  total_sol_deposited BIGINT DEFAULT 0, -- In lamports (1 SOL = 1e9 lamports)
  total_eligible_stake BIGINT DEFAULT 0, -- Total staked tokens eligible for this month
  deposited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. REWARD CLAIMS TABLE
-- Tracks individual reward claims
-- =====================================================
CREATE TABLE IF NOT EXISTS reward_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  month TEXT NOT NULL, -- Which month's rewards they claimed
  amount_sol BIGINT NOT NULL, -- In lamports
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  tx_signature TEXT NULL,
  UNIQUE(wallet_address, month)
);

-- =====================================================
-- 4. POOL STATS TABLE
-- Aggregate view of staking pool
-- =====================================================
CREATE TABLE IF NOT EXISTS pool_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_staked BIGINT DEFAULT 0,
  total_stakers INTEGER DEFAULT 0,
  sol_rewards_pool BIGINT DEFAULT 0, -- Current unclaimed SOL in lamports
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize pool stats with single row
INSERT INTO pool_stats (total_staked, total_stakers, sol_rewards_pool)
VALUES (0, 0, 0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_stakers_wallet ON stakers(wallet_address);
CREATE INDEX IF NOT EXISTS idx_stakers_stake_month ON stakers(stake_month);
CREATE INDEX IF NOT EXISTS idx_monthly_rewards_month ON monthly_rewards(month);
CREATE INDEX IF NOT EXISTS idx_claims_wallet ON reward_claims(wallet_address);
CREATE INDEX IF NOT EXISTS idx_claims_month ON reward_claims(month);

-- =====================================================
-- 6. HELPER FUNCTIONS (Optional)
-- =====================================================

-- Function to increment staker count
CREATE OR REPLACE FUNCTION increment_staker_count()
RETURNS void AS $$
BEGIN
  UPDATE pool_stats
  SET total_stakers = total_stakers + 1,
      updated_at = NOW()
  WHERE id = (SELECT id FROM pool_stats LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Function to decrement staker count
CREATE OR REPLACE FUNCTION decrement_staker_count()
RETURNS void AS $$
BEGIN
  UPDATE pool_stats
  SET total_stakers = GREATEST(0, total_stakers - 1),
      updated_at = NOW()
  WHERE id = (SELECT id FROM pool_stats LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Function to update total staked amount
CREATE OR REPLACE FUNCTION update_total_staked(delta BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE pool_stats
  SET total_staked = GREATEST(0, total_staked + delta),
      updated_at = NOW()
  WHERE id = (SELECT id FROM pool_stats LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- Enable for production security
-- =====================================================

-- Enable RLS on tables
ALTER TABLE stakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read pool stats
CREATE POLICY "Public read access to pool_stats" ON pool_stats
  FOR SELECT USING (true);

-- Policy: Anyone can read monthly rewards
CREATE POLICY "Public read access to monthly_rewards" ON monthly_rewards
  FOR SELECT USING (true);

-- Policy: Public read access to stakers (leaderboard / balance display)
CREATE POLICY "Public read access to stakers" ON stakers
  FOR SELECT USING (true);

-- All stakers writes (insert/update/delete) now happen exclusively through
-- the service_role key inside api/stake.js, api/unstake-request.js and
-- api/unstake-execute.js, which independently verify the on-chain transfer
-- before writing. service_role bypasses RLS, so no anon/authenticated
-- write policy is defined here - anon INSERT/UPDATE/DELETE on stakers must
-- stay denied by default.
--
-- If policies named "Users can insert/update/delete own staker data"
-- already exist from a previous deploy, drop them:
-- DROP POLICY IF EXISTS "Users can insert own staker data" ON stakers;
-- DROP POLICY IF EXISTS "Users can update own staker data" ON stakers;
-- DROP POLICY IF EXISTS "Users can delete own staker data" ON stakers;

-- Policy: Users can read their own claims
CREATE POLICY "Users can read own claims" ON reward_claims
  FOR SELECT USING (true);

-- reward_claims writes also now go exclusively through service_role in
-- api/claim-rewards.js (amount/eligibility recomputed server-side, never
-- trusted from the client). No anon INSERT policy is defined here.
--
-- If a policy named "Users can insert own claims" already exists from a
-- previous deploy, drop it:
-- DROP POLICY IF EXISTS "Users can insert own claims" ON reward_claims;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready for the staking system.
--
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Start your frontend: npm run dev
-- 3. Connect wallet and test staking flow
-- 4. Admin: Deposit monthly rewards via monthly_rewards table
