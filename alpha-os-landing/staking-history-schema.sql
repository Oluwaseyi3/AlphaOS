-- =====================================================
-- STAKING HISTORY TABLE
-- Audit trail for all staking events
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS staking_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('stake', 'unstake_request', 'unstake_execute')),
  amount BIGINT NOT NULL DEFAULT 0,
  stake_month TEXT NULL,
  unstake_month TEXT NULL,
  tx_signature TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by wallet
CREATE INDEX IF NOT EXISTS idx_staking_history_wallet ON staking_history(wallet_address);

-- Index for filtering by event type
CREATE INDEX IF NOT EXISTS idx_staking_history_event_type ON staking_history(event_type);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_staking_history_created_at ON staking_history(created_at);

-- Enable RLS
ALTER TABLE staking_history ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read history (for transparency)
CREATE POLICY "Public read access to staking_history" ON staking_history
  FOR SELECT USING (true);

-- Policy: System can insert history records
CREATE POLICY "System can insert staking_history" ON staking_history
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- USAGE EXAMPLES:
-- =====================================================
--
-- Find all events for a specific wallet:
-- SELECT * FROM staking_history 
-- WHERE wallet_address = '4gFquwXXegyphybR2FDzPEPknSZkbf2LHwn8rEpbvo5m'
-- ORDER BY created_at DESC;
--
-- Find all unstake executions:
-- SELECT * FROM staking_history 
-- WHERE event_type = 'unstake_execute'
-- ORDER BY created_at DESC;
--

-- =====================================================
-- ADD NEW COLUMNS TO STAKERS TABLE
-- These columns allow keeping records instead of deleting
-- =====================================================

ALTER TABLE stakers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE stakers ADD COLUMN IF NOT EXISTS unstake_executed_at TIMESTAMPTZ NULL;

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_stakers_status ON stakers(status);

-- =====================================================
-- QUERY EXAMPLES FOR STAKERS:
-- =====================================================
--
-- Get all active stakers:
-- SELECT wallet_address, amount_staked FROM stakers WHERE status = 'active';
--
-- Get unstaked records:
-- SELECT wallet_address, amount_staked, unstake_executed_at FROM stakers WHERE status = 'unstaked';
--
