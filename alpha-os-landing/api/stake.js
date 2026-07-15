import { supabaseAdmin } from './lib/supabaseAdmin.js'
import { verifyStakeTransfer } from './lib/solana.js'
import { getCurrentMonth } from './lib/dates.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { walletAddress, amount, txSignature } = req.body || {}
  if (!walletAddress || !amount || amount <= 0 || !txSignature) {
    return res.status(400).json({ error: 'walletAddress, amount, and txSignature are required' })
  }

  try {
    // A given on-chain transfer can only ever be recorded as a stake once.
    const { data: existingEvent } = await supabaseAdmin
      .from('staking_history')
      .select('id')
      .eq('tx_signature', txSignature)
      .maybeSingle()
    if (existingEvent) {
      return res.status(409).json({ error: 'Transaction already recorded' })
    }

    await verifyStakeTransfer(txSignature, walletAddress, amount)

    const currentMonth = getCurrentMonth()
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('stakers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .or('status.is.null,status.eq.active')
      .maybeSingle()
    if (fetchError) throw fetchError

    let data
    if (existing) {
      const { data: updated, error } = await supabaseAdmin
        .from('stakers')
        .update({ amount_staked: existing.amount_staked + amount, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      data = updated
    } else {
      const { data: created, error } = await supabaseAdmin
        .from('stakers')
        .insert({
          wallet_address: walletAddress,
          amount_staked: amount,
          stake_month: currentMonth,
          stake_timestamp: new Date().toISOString()
        })
        .select()
        .single()
      if (error) throw error
      data = created
    }

    await supabaseAdmin.from('staking_history').insert({
      wallet_address: walletAddress,
      event_type: 'stake',
      amount,
      stake_month: currentMonth,
      tx_signature: txSignature,
      metadata: existing
        ? { type: 'add_to_existing', previous_amount: existing.amount_staked }
        : { type: 'new_stake' }
    })

    try {
      if (existing) {
        await supabaseAdmin.rpc('update_total_staked', { delta: amount })
      } else {
        await supabaseAdmin.rpc('increment_staker_count')
        await supabaseAdmin.rpc('update_total_staked', { delta: amount })
      }
    } catch {
      // pool_stats is recalculated from the stakers table anyway
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('[api/stake] error:', error)
    return res.status(400).json({ error: error.message || 'Failed to record stake' })
  }
}
