import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// Replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
DATABASE SCHEMA - Run this in Supabase SQL Editor:

-- Stakers table: tracks each user's staking position
CREATE TABLE stakers (
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

-- Monthly rewards: admin deposits SOL each month
CREATE TABLE monthly_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT UNIQUE NOT NULL, -- Format: '2025-01' (YYYY-MM)
  total_sol_deposited BIGINT DEFAULT 0, -- In lamports (1 SOL = 1e9 lamports)
  total_eligible_stake BIGINT DEFAULT 0, -- Total staked tokens eligible for this month
  deposited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims: track individual claims
CREATE TABLE reward_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  month TEXT NOT NULL, -- Which month's rewards they claimed
  amount_sol BIGINT NOT NULL, -- In lamports
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  tx_signature TEXT NULL,
  UNIQUE(wallet_address, month)
);

-- Pool stats: aggregate view
CREATE TABLE pool_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_staked BIGINT DEFAULT 0,
  total_stakers INTEGER DEFAULT 0,
  sol_rewards_pool BIGINT DEFAULT 0, -- Current unclaimed SOL in lamports
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize pool stats with single row
INSERT INTO pool_stats (total_staked, total_stakers, sol_rewards_pool)
VALUES (0, 0, 0);

-- Indexes for performance
CREATE INDEX idx_stakers_wallet ON stakers(wallet_address);
CREATE INDEX idx_stakers_stake_month ON stakers(stake_month);
CREATE INDEX idx_monthly_rewards_month ON monthly_rewards(month);
CREATE INDEX idx_claims_wallet ON reward_claims(wallet_address);
*/
