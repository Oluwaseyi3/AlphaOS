import { supabaseAdmin } from './lib/supabaseAdmin.js'
import { getCurrentMonth } from './lib/dates.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { walletAddress } = req.body || {}
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress is required' })

  try {
    const currentMonth = getCurrentMonth()

    const { data: staker, error: fetchError } = await supabaseAdmin
      .from('stakers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .or('status.is.null,status.eq.active')
      .maybeSingle()
    if (fetchError) throw fetchError
    if (!staker) return res.status(404).json({ error: 'No stake found' })
    if (!staker.unstake_requested_at) return res.status(400).json({ error: 'No unstake request found' })
    if (staker.unstake_month !== currentMonth) {
      return res.status(400).json({ error: `Cannot unstake until ${staker.unstake_month}` })
    }

    const amountToReturn = staker.amount_staked

    await supabaseAdmin.from('staking_history').insert({
      wallet_address: walletAddress,
      event_type: 'unstake_execute',
      amount: amountToReturn,
      stake_month: staker.stake_month,
      unstake_month: staker.unstake_month,
      metadata: {
        unstake_requested_at: staker.unstake_requested_at,
        total_rewards_claimed: staker.total_rewards_claimed,
        last_claimed_month: staker.last_claimed_month,
        original_stake_timestamp: staker.stake_timestamp
      }
    })

    const { error } = await supabaseAdmin
      .from('stakers')
      .update({
        unstake_executed_at: new Date().toISOString(),
        status: 'unstaked',
        updated_at: new Date().toISOString()
      })
      .eq('id', staker.id)
    if (error) throw error

    try {
      await supabaseAdmin.rpc('decrement_staker_count')
      await supabaseAdmin.rpc('update_total_staked', { delta: -amountToReturn })
    } catch {
      // pool_stats is recalculated from the stakers table anyway
    }

    return res.status(200).json({ amount: amountToReturn })
  } catch (error) {
    console.error('[api/unstake-execute] error:', error)
    return res.status(400).json({ error: error.message || 'Failed to execute unstake' })
  }
}
