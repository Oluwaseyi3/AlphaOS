import { supabaseAdmin } from './lib/supabaseAdmin.js'
import { getCurrentMonth, getNextMonth } from './lib/dates.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { walletAddress } = req.body || {}
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress is required' })

  try {
    const currentMonth = getCurrentMonth()
    const unstakeMonth = getNextMonth()

    const { data: staker, error: fetchError } = await supabaseAdmin
      .from('stakers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .or('status.is.null,status.eq.active')
      .maybeSingle()
    if (fetchError) throw fetchError
    if (!staker) return res.status(404).json({ error: 'No stake found' })

    if (staker.stake_month === currentMonth && !staker.unstake_requested_at) {
      return res.status(400).json({ error: 'Cannot request unstake in the same month you staked' })
    }

    const { data, error } = await supabaseAdmin
      .from('stakers')
      .update({
        unstake_requested_at: new Date().toISOString(),
        unstake_month: unstakeMonth,
        updated_at: new Date().toISOString()
      })
      .eq('id', staker.id)
      .select()
      .single()
    if (error) throw error

    await supabaseAdmin.from('staking_history').insert({
      wallet_address: walletAddress,
      event_type: 'unstake_request',
      amount: staker.amount_staked,
      stake_month: staker.stake_month,
      unstake_month: unstakeMonth,
      metadata: { requested_at: new Date().toISOString() }
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('[api/unstake-request] error:', error)
    return res.status(400).json({ error: error.message || 'Failed to request unstake' })
  }
}
