import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getMint } from '@solana/spl-token'
import {
  PBOT_MINT_ADDRESS,
  STAKING_POOL_ADDRESS_STR
} from '../../src/lib/stakingConstants.js'

const RPC_URL = process.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
export const connection = new Connection(RPC_URL, 'confirmed')

export const PBOT_MINT = new PublicKey(PBOT_MINT_ADDRESS)
export const STAKING_POOL_ADDRESS = new PublicKey(STAKING_POOL_ADDRESS_STR)

async function detectTokenProgram() {
  try {
    await getMint(connection, PBOT_MINT, 'confirmed', TOKEN_2022_PROGRAM_ID)
    return TOKEN_2022_PROGRAM_ID
  } catch {
    return TOKEN_PROGRAM_ID
  }
}

// Confirms, on-chain, that `signature` is a successful transfer of exactly
// `expectedRawAmount` (raw token units, same units the client already sends
// to recordStake) of PBOT from `walletAddress`'s token account into the
// staking pool's token account. Throws if anything doesn't match.
export async function verifyStakeTransfer(signature, walletAddress, expectedRawAmount) {
  const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0 })
  if (!tx) throw new Error('Transaction not found or not yet confirmed')
  if (tx.meta?.err) throw new Error('Transaction failed on-chain')

  const programId = await detectTokenProgram()
  const userPublicKey = new PublicKey(walletAddress)
  const userTokenAccount = await getAssociatedTokenAddress(PBOT_MINT, userPublicKey, false, programId)
  const poolTokenAccount = await getAssociatedTokenAddress(PBOT_MINT, STAKING_POOL_ADDRESS, false, programId)

  const instructions = tx.transaction.message.instructions
  const matched = instructions.some((ix) => {
    const parsed = ix.parsed
    if (!parsed || (parsed.type !== 'transfer' && parsed.type !== 'transferChecked')) return false
    const info = parsed.info
    const rawAmount = info.tokenAmount ? Number(info.tokenAmount.amount) : Number(info.amount)
    return (
      info.source === userTokenAccount.toBase58() &&
      info.destination === poolTokenAccount.toBase58() &&
      rawAmount === expectedRawAmount
    )
  })

  if (!matched) {
    throw new Error('On-chain transaction does not match the claimed stake amount/destination')
  }
}
