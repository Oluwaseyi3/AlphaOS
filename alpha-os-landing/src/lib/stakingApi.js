import { supabase } from './supabase'

// Helper: call one of the server-side staking API routes. Mutations to
// `stakers` / `reward_claims` go through these (service_role, on-chain
// verified where applicable) instead of writing with the anon key directly -
// the anon key only has read access to these tables now.
const callStakingApi = async (path, body) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `Request to ${path} failed`)
  }
  return data
}

// Helper: Get current month in YYYY-MM format
export const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Helper: Get next month in YYYY-MM format
export const getNextMonth = (monthStr = null) => {
  const date = monthStr
    ? new Date(`${monthStr}-01`)
    : new Date()
  date.setMonth(date.getMonth() + 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// Helper: Check if we're on the 1st of the month
export const isFirstOfMonth = () => {
  return new Date().getDate() === 1
}

// Helper: Get days until next reward period (30-day cycle)
export const getDaysUntilNextReward = () => {
  // Fixed 30-day reward cycle
  return 30
}

// Helper: Get days until next month (legacy)
export const getDaysUntilNextMonth = () => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const diffTime = nextMonth - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Fetch pool statistics - always calculate from stakers table for accuracy
export const getPoolStats = async () => {
  console.log('[POOL STATS] Calculating from stakers table...')
  const { data: stakers, error: stakersError } = await supabase
    .from('stakers')
    .select('amount_staked')
    .or('status.is.null,status.eq.active') // Only count active stakers

  if (stakersError) {
    console.error('[POOL STATS] Error fetching stakers:', stakersError)
    return {
      total_staked: 0,
      total_stakers: 0,
      sol_rewards_pool: 0
    }
  }

  console.log('[POOL STATS] Stakers data:', stakers)

  // Calculate totals from actual staker records
  const total_staked = stakers.reduce((sum, s) => sum + (s.amount_staked || 0), 0)
  const total_stakers = stakers.length

  console.log('[POOL STATS] Total staked:', total_staked, 'Total stakers:', total_stakers)

  // Get SOL rewards pool from pool_stats table if available
  let sol_rewards_pool = 0
  try {
    const { data: poolStats } = await supabase
      .from('pool_stats')
      .select('sol_rewards_pool')
      .single()
    if (poolStats) {
      sol_rewards_pool = poolStats.sol_rewards_pool || 0
    }
  } catch (e) {
    // pool_stats table might not exist
  }

  return {
    total_staked,
    total_stakers,
    sol_rewards_pool
  }
}

// Fetch user's staking position (only active stakes)
export const getUserStake = async (walletAddress) => {
  const { data, error } = await supabase
    .from('stakers')
    .select('*')
    .eq('wallet_address', walletAddress)
    .or('status.is.null,status.eq.active') // Only return active stakes
    .maybeSingle() // Returns null if no row found, instead of error

  if (error) throw error
  return data || null
}

// Fetch ALL user stakes including unstaked (for history/audit)
export const getAllUserStakes = async (walletAddress) => {
  const { data, error } = await supabase
    .from('stakers')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Record a new stake (called after the on-chain transfer). The server
// independently re-verifies the transfer on-chain before writing anything -
// see api/stake.js.
export const recordStake = async (walletAddress, amount, txSignature) => {
  return callStakingApi('/api/stake', { walletAddress, amount, txSignature })
}

// Request unstake
export const requestUnstake = async (walletAddress) => {
  return callStakingApi('/api/unstake-request', { walletAddress })
}

// Execute unstake (returns tokens to user)
export const executeUnstake = async (walletAddress) => {
  return callStakingApi('/api/unstake-execute', { walletAddress })
}

// Get claimable rewards for a user
export const getClaimableRewards = async (walletAddress) => {
  const currentMonth = getCurrentMonth()
  const staker = await getUserStake(walletAddress)

  if (!staker) return { eligible: false, amount: 0, month: null }

  // User is eligible if they staked before the current month
  const eligibleMonth = currentMonth
  if (staker.stake_month >= eligibleMonth) {
    return {
      eligible: false,
      amount: 0,
      month: null,
      reason: `You must stake before ${eligibleMonth} to claim this month's rewards`
    }
  }

  // Check if already claimed this month
  const { data: existingClaim } = await supabase
    .from('reward_claims')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('month', eligibleMonth)
    .single()

  if (existingClaim) {
    return {
      eligible: false,
      amount: 0,
      month: eligibleMonth,
      reason: 'Already claimed for this month',
      claimedAmount: existingClaim.amount_sol
    }
  }

  // Get this month's reward pool
  const { data: monthlyReward } = await supabase
    .from('monthly_rewards')
    .select('*')
    .eq('month', eligibleMonth)
    .single()

  if (!monthlyReward || monthlyReward.total_sol_deposited === 0) {
    return {
      eligible: false,
      amount: 0,
      month: eligibleMonth,
      reason: 'No rewards deposited for this month yet'
    }
  }

  // Calculate proportional share
  const userShare = staker.amount_staked / monthlyReward.total_eligible_stake
  const claimableAmount = Math.floor(userShare * monthlyReward.total_sol_deposited)

  return {
    eligible: true,
    amount: claimableAmount,
    month: eligibleMonth,
    userStake: staker.amount_staked,
    totalStake: monthlyReward.total_eligible_stake,
    sharePercent: (userShare * 100).toFixed(4)
  }
}

// Claim rewards. Eligibility and amount are recomputed server-side from the
// database - see api/claim-rewards.js - the client can't influence the payout.
export const claimRewards = async (walletAddress, txSignature) => {
  return callStakingApi('/api/claim-rewards', { walletAddress, txSignature })
}

// Get user's claim history
export const getUserClaimHistory = async (walletAddress) => {
  const { data, error } = await supabase
    .from('reward_claims')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('claimed_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Format lamports to SOL
export const lamportsToSol = (lamports) => {
  return (lamports / 1e9).toFixed(4)
}

// Format tokens with commas
export const formatTokens = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
