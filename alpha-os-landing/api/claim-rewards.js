import { supabaseAdmin } from './lib/supabaseAdmin.js'
import { computeClaimable } from './lib/rewards.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { walletAddress, txSignature } = req.body || {}
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress is required' })

  try {
    // Amount and eligibility are always recomputed here, never trusted from the client.
    const claimable = await computeClaimable(walletAddress)
    if (!claimable.eligible) {
      return res.status(400).json({ error: claimable.reason || 'Not eligible for rewards' })
    }

    const { data, error } = await supabaseAdmin
      .from('reward_claims')
      .insert({
        wallet_address: walletAddress,
        month: claimable.month,
        amount_sol: claimable.amount,
        claimed_at: new Date().toISOString(),
        tx_signature: txSignature || null
      })
      .select()
      .single()
    if (error) throw error

    const { data: staker } = await supabaseAdmin
      .from('stakers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .or('status.is.null,status.eq.active')
      .maybeSingle()

    if (staker) {
      await supabaseAdmin
        .from('stakers')
        .update({
          total_rewards_claimed: (staker.total_rewards_claimed || 0) + claimable.amount,
          last_claimed_month: claimable.month,
          updated_at: new Date().toISOString()
        })
        .eq('id', staker.id)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('[api/claim-rewards] error:', error)
    return res.status(400).json({ error: error.message || 'Failed to claim rewards' })
  }
}
