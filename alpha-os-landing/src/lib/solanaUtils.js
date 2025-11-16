import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token'

// Solana connection - using Helius RPC for reliable access
const SOLANA_RPC = import.meta.env.VITE_SOLANA_RPC_URL
if (!SOLANA_RPC) {
  console.error('VITE_SOLANA_RPC_URL environment variable is not set')
}
export const connection = new Connection(SOLANA_RPC || 'https://api.mainnet-beta.solana.com', 'confirmed')

// $PBOT token mint address
export const PBOT_MINT = new PublicKey('8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump')

// Staking pool address (where tokens are sent for staking)
export const STAKING_POOL_ADDRESS = new PublicKey('EYvYCMoMd4UPUbuFHXzyQJxengGih9szJsbNtvNQb86S')

// Fee recipient address (where staking fees are sent)
export const FEE_RECIPIENT = new PublicKey('8aXc4dTWsxESP4FQGcqkb6tTHG6DwwkDXbHtWqwEeeVY')

// Staking fee percentage
export const STAKING_FEE_PERCENT = 2

// Treasury wallet address (where SOL rewards are paid from)
// This should be the same wallet that deposits SOL for rewards
export const TREASURY_WALLET = new PublicKey('EYvYCMoMd4UPUbuFHXzyQJxengGih9szJsbNtvNQb86S')

// Token decimals (most SPL tokens use 6 or 9 decimals)
export const PBOT_DECIMALS = 6

// Get user's SOL balance
export const getSolBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Error fetching SOL balance:', error)
    return 0
  }
}

// Get user's $PBOT token balance
export const getPbotBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress)
    const tokenAccount = await getAssociatedTokenAddress(PBOT_MINT, publicKey)

    const accountInfo = await getAccount(connection, tokenAccount)
    // Convert from smallest unit to human readable
    return Number(accountInfo.amount) / Math.pow(10, PBOT_DECIMALS)
  } catch (error) {
    // Token account might not exist yet
    if (error.name === 'TokenAccountNotFoundError' || error.message?.includes('could not find account')) {
      return 0
    }
    console.error('Error fetching PBOT balance:', error)
    // Try alternative method using getParsedTokenAccountsByOwner
    try {
      const publicKey = new PublicKey(walletAddress)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: PBOT_MINT
      })
      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
        return balance || 0
      }
      return 0
    } catch (fallbackError) {
      console.error('Fallback balance fetch failed:', fallbackError)
      return 0
    }
  }
}

// Transfer $PBOT tokens to staking pool with 2% fee
export const transferToStakingPool = async (provider, amount) => {
  try {
    const userPublicKey = provider.publicKey

    // Get user's token account
    const userTokenAccount = await getAssociatedTokenAddress(PBOT_MINT, userPublicKey)

    // Get staking pool's token account
    const poolTokenAccount = await getAssociatedTokenAddress(PBOT_MINT, STAKING_POOL_ADDRESS)

    // Get fee recipient's token account
    const feeTokenAccount = await getAssociatedTokenAddress(PBOT_MINT, FEE_RECIPIENT)

    // Calculate fee and net amount
    const totalAmountInSmallestUnit = Math.floor(amount * Math.pow(10, PBOT_DECIMALS))
    const feeAmount = Math.floor(totalAmountInSmallestUnit * STAKING_FEE_PERCENT / 100)
    const netAmountToStake = totalAmountInSmallestUnit - feeAmount

    // Create transaction with two transfers
    const transaction = new Transaction()

    // Transfer net amount to staking pool
    const stakeInstruction = createTransferInstruction(
      userTokenAccount,
      poolTokenAccount,
      userPublicKey,
      netAmountToStake,
      [],
      TOKEN_PROGRAM_ID
    )
    transaction.add(stakeInstruction)

    // Transfer fee to fee recipient
    if (feeAmount > 0) {
      const feeInstruction = createTransferInstruction(
        userTokenAccount,
        feeTokenAccount,
        userPublicKey,
        feeAmount,
        [],
        TOKEN_PROGRAM_ID
      )
      transaction.add(feeInstruction)
    }

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = userPublicKey

    // Sign and send transaction via Phantom
    const signedTransaction = await provider.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    })

    return {
      success: true,
      signature,
      amount: netAmountToStake, // Return the net amount that was actually staked
      feeAmount: feeAmount
    }
  } catch (error) {
    console.error('Transfer failed:', error)
    throw error
  }
}

// Transfer $PBOT tokens from staking pool back to user (for unstaking)
// Note: This requires the pool to be set up as a program-controlled account
// For now, unstaking will be manual/admin-processed
export const requestUnstakeFromPool = async (walletAddress, amount) => {
  // This would typically involve:
  // 1. Creating an unstake request on-chain
  // 2. Admin or program processes the request
  // 3. Tokens are transferred back to user

  // For now, we'll record the request in Supabase
  // and admin will process the actual transfer
  return {
    success: true,
    message: 'Unstake request recorded. Admin will process the token return.',
    amount
  }
}

// Verify a transaction signature
export const verifyTransaction = async (signature) => {
  try {
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return {
      success: true,
      transaction
    }
  } catch (error) {
    console.error('Transaction verification failed:', error)
    throw error
  }
}

// Format token amount with proper decimals
export const formatPbotAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Check if connected wallet is the treasury wallet
export const isTreasuryWallet = (walletAddress) => {
  return walletAddress === TREASURY_WALLET.toBase58()
}

// Transfer SOL from treasury to user (for reward claims)
// This function is called when admin/treasury processes a claim
export const sendSolReward = async (provider, recipientAddress, amountInLamports) => {
  try {
    const treasuryPublicKey = provider.publicKey
    const recipientPublicKey = new PublicKey(recipientAddress)

    // Verify the connected wallet is the treasury
    if (treasuryPublicKey.toBase58() !== TREASURY_WALLET.toBase58()) {
      throw new Error('Only treasury wallet can send rewards')
    }

    // Create SOL transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: treasuryPublicKey,
      toPubkey: recipientPublicKey,
      lamports: amountInLamports
    })

    // Create transaction
    const transaction = new Transaction().add(transferInstruction)

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = treasuryPublicKey

    // Sign and send transaction via Phantom
    const signedTransaction = await provider.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    })

    return {
      success: true,
      signature,
      amount: amountInLamports
    }
  } catch (error) {
    console.error('SOL transfer failed:', error)
    throw error
  }
}

// Get treasury SOL balance to check if enough for payouts
export const getTreasurySolBalance = async () => {
  try {
    const balance = await connection.getBalance(TREASURY_WALLET)
    return balance // in lamports
  } catch (error) {
    console.error('Error fetching treasury balance:', error)
    return 0
  }
}
