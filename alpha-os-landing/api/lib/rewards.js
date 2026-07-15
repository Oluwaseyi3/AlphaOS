import { supabaseAdmin } from './supabaseAdmin.js'
import { getCurrentMonth } from './dates.js'

// Recomputes claim eligibility from the database - never trust a
// client-supplied amount for the actual reward_claims insert.
export async function computeClaimable(walletAddress) {
  const currentMonth = getCurrentMonth()

  const { data: staker, error: stakerError } = await supabaseAdmin
    .from('stakers')
    .select('*')
    .eq('wallet_address', walletAddress)
    .or('status.is.null,status.eq.active')
    .maybeSingle()
  if (stakerError) throw stakerError
  if (!staker) return { eligible: false, amount: 0, month: null }

  const eligibleMonth = currentMonth
  if (staker.stake_month >= eligibleMonth) {
    return {
      eligible: false,
      amount: 0,
      month: null,
      reason: `You must stake before ${eligibleMonth} to claim this month's rewards`
    }
  }

  const { data: existingClaim } = await supabaseAdmin
    .from('reward_claims')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('month', eligibleMonth)
    .maybeSingle()
  if (existingClaim) {
    return {
      eligible: false,
      amount: 0,
      month: eligibleMonth,
      reason: 'Already claimed for this month',
      claimedAmount: existingClaim.amount_sol
    }
  }

  const { data: monthlyReward } = await supabaseAdmin
    .from('monthly_rewards')
    .select('*')
    .eq('month', eligibleMonth)
    .maybeSingle()
  if (!monthlyReward || monthlyReward.total_sol_deposited === 0) {
    return {
      eligible: false,
      amount: 0,
      month: eligibleMonth,
      reason: 'No rewards deposited for this month yet'
    }
  }

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
