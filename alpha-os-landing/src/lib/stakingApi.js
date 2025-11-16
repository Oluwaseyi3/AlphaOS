import { supabase } from './supabase'

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

// Fetch user's staking position
export const getUserStake = async (walletAddress) => {
  const { data, error } = await supabase
    .from('stakers')
    .select('*')
    .eq('wallet_address', walletAddress)
    .maybeSingle() // Returns null if no row found, instead of error

  if (error) throw error
  return data || null
}

// Record a new stake (called after verifying on-chain transfer)
export const recordStake = async (walletAddress, amount, txSignature) => {
  console.log('[RECORD STAKE] Wallet:', walletAddress, 'Amount:', amount, 'Tx:', txSignature)
  const currentMonth = getCurrentMonth()

  // Check if user already has a stake
  const existing = await getUserStake(walletAddress)
  console.log('[RECORD STAKE] Existing stake:', existing)

  if (existing) {
    // Add to existing stake
    const { data, error } = await supabase
      .from('stakers')
      .update({
        amount_staked: existing.amount_staked + amount,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (error) throw error

    // Try to update pool stats (optional - we calculate from stakers table anyway)
    try {
      await supabase.rpc('update_total_staked', { delta: amount })
    } catch (e) {
      console.log('RPC not available, stats will be calculated from stakers table')
    }

    return data
  } else {
    // Create new staker record
    const { data, error } = await supabase
      .from('stakers')
      .insert({
        wallet_address: walletAddress,
        amount_staked: amount,
        stake_month: currentMonth,
        stake_timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[RECORD STAKE] Error creating stake:', error)
      throw error
    }

    console.log('[RECORD STAKE] Successfully created stake:', data)

    // Try to update pool stats (optional - we calculate from stakers table anyway)
    try {
      await supabase.rpc('increment_staker_count')
      await supabase.rpc('update_total_staked', { delta: amount })
    } catch (e) {
      console.log('[RECORD STAKE] RPC not available, stats will be calculated from stakers table')
    }

    return data
  }
}

// Request unstake
export const requestUnstake = async (walletAddress) => {
  const currentMonth = getCurrentMonth()
  const unstakeMonth = getNextMonth() // Can unstake next month

  const staker = await getUserStake(walletAddress)
  if (!staker) throw new Error('No stake found')

  // Check if they staked in the current month (can't unstake same month)
  if (staker.stake_month === currentMonth && !staker.unstake_requested_at) {
    throw new Error('Cannot request unstake in the same month you staked')
  }

  const { data, error } = await supabase
    .from('stakers')
    .update({
      unstake_requested_at: new Date().toISOString(),
      unstake_month: unstakeMonth,
      updated_at: new Date().toISOString()
    })
    .eq('wallet_address', walletAddress)
    .select()
    .single()

  if (error) throw error
  return data
}

// Execute unstake (returns tokens to user)
export const executeUnstake = async (walletAddress) => {
  const currentMonth = getCurrentMonth()
  const staker = await getUserStake(walletAddress)

  if (!staker) throw new Error('No stake found')
  if (!staker.unstake_requested_at) throw new Error('No unstake request found')
  if (staker.unstake_month !== currentMonth) {
    throw new Error(`Cannot unstake until ${staker.unstake_month}`)
  }

  const amountToReturn = staker.amount_staked

  // Delete the staker record
  const { error } = await supabase
    .from('stakers')
    .delete()
    .eq('wallet_address', walletAddress)

  if (error) throw error

  // Try to update pool stats (optional - we calculate from stakers table anyway)
  try {
    await supabase.rpc('decrement_staker_count')
    await supabase.rpc('update_total_staked', { delta: -amountToReturn })
  } catch (e) {
    console.log('RPC not available, stats will be calculated from stakers table')
  }

  return { amount: amountToReturn }
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

// Claim rewards
export const claimRewards = async (walletAddress, txSignature) => {
  const claimable = await getClaimableRewards(walletAddress)

  if (!claimable.eligible) {
    throw new Error(claimable.reason || 'Not eligible for rewards')
  }

  // Record the claim
  const { data, error } = await supabase
    .from('reward_claims')
    .insert({
      wallet_address: walletAddress,
      month: claimable.month,
      amount_sol: claimable.amount,
      claimed_at: new Date().toISOString(),
      tx_signature: txSignature
    })
    .select()
    .single()

  if (error) throw error

  // Update user's total claimed
  const staker = await getUserStake(walletAddress)
  await supabase
    .from('stakers')
    .update({
      total_rewards_claimed: (staker.total_rewards_claimed || 0) + claimable.amount,
      last_claimed_month: claimable.month,
      updated_at: new Date().toISOString()
    })
    .eq('wallet_address', walletAddress)

  return data
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
