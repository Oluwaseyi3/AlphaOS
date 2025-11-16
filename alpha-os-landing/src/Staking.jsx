import { useState, useEffect, useCallback } from 'react'
import { MessageCircle, Wallet, TrendingUp, Clock, Shield, Zap, AlertTriangle, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import './App.css'
import {
  getCurrentMonth,
  getNextMonth,
  getDaysUntilNextMonth,
  getDaysUntilNextReward,
  getPoolStats,
  getUserStake,
  recordStake,
  requestUnstake,
  executeUnstake,
  getClaimableRewards,
  claimRewards,
  getUserClaimHistory,
  lamportsToSol,
  formatTokens
} from './lib/stakingApi'
import {
  getPbotBalance,
  transferToStakingPool,
  formatPbotAmount
} from './lib/solanaUtils'

function Staking() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [isStaking, setIsStaking] = useState(true)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [userBalance, setUserBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [balanceLoading, setBalanceLoading] = useState(false)

  // Real data from Supabase
  const [poolStats, setPoolStats] = useState(null)
  const [userStake, setUserStake] = useState(null)
  const [claimableRewards, setClaimableRewards] = useState(null)
  const [claimHistory, setClaimHistory] = useState([])
  const [error, setError] = useState(null)

  // Check if Phantom is installed
  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana
      if (provider?.isPhantom) {
        return provider
      }
    }
    return null
  }

  // Check if user is on mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Get Phantom deep link for mobile
  const getPhantomDeepLink = () => {
    const currentUrl = window.location.href
    const encodedUrl = encodeURIComponent(currentUrl)
    return `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodedUrl}`
  }

  // Fetch user's real $PBOT balance
  const fetchBalance = useCallback(async (wallet) => {
    if (!wallet) return
    setBalanceLoading(true)
    try {
      const balance = await getPbotBalance(wallet)
      setUserBalance(balance)
    } catch (err) {
      console.error('Error fetching balance:', err)
      setUserBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  // Fetch all data
  const fetchAllData = useCallback(async (wallet = walletAddress) => {
    setDataLoading(true)
    setError(null)
    try {
      // Fetch pool stats
      const stats = await getPoolStats()
      setPoolStats(stats)

      // Fetch user-specific data if wallet connected
      if (wallet) {
        const stake = await getUserStake(wallet)
        setUserStake(stake)

        const rewards = await getClaimableRewards(wallet)
        setClaimableRewards(rewards)

        const history = await getUserClaimHistory(wallet)
        setClaimHistory(history)

        // Fetch real $PBOT balance from blockchain
        await fetchBalance(wallet)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load staking data')
    } finally {
      setDataLoading(false)
    }
  }, [walletAddress, fetchBalance])

  // Connect wallet
  const connectWallet = async () => {
    const provider = getProvider()
    if (!provider) {
      // If on mobile and Phantom not detected, open deep link
      if (isMobile()) {
        window.location.href = getPhantomDeepLink()
      } else {
        window.open('https://phantom.app/', '_blank')
      }
      return
    }

    try {
      setIsLoading(true)
      const resp = await provider.connect()
      const address = resp.publicKey.toString()
      setWalletAddress(address)
      setWalletConnected(true)
      await fetchAllData(address)
    } catch (err) {
      console.error('Failed to connect wallet:', err)
      setError('Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    const provider = getProvider()
    if (provider) {
      await provider.disconnect()
      setWalletConnected(false)
      setWalletAddress('')
      setUserBalance(0)
      setUserStake(null)
      setClaimableRewards(null)
      setClaimHistory([])
    }
  }

  // Handle stake action - performs real on-chain transfer
  const handleStake = async () => {
    if (!walletConnected || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      return
    }

    const amount = parseFloat(stakeAmount)
    if (amount > userBalance) {
      setError('Insufficient balance')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const provider = getProvider()
      if (!provider) throw new Error('Phantom not found')

      // Perform actual on-chain token transfer to staking pool
      const transferResult = await transferToStakingPool(provider, amount)

      if (!transferResult.success) {
        throw new Error('Transfer failed')
      }

      // Record stake in database with real transaction signature
      await recordStake(walletAddress, transferResult.amount, transferResult.signature)

      // Refresh data (including new balance)
      await fetchAllData()
      setStakeAmount('')

      alert(`Successfully staked ${formatPbotAmount(amount)} $PBOT!\n\nTransaction: ${transferResult.signature.slice(0, 8)}...${transferResult.signature.slice(-8)}\n\nYou will be eligible for ${getNextMonth()} rewards.`)
    } catch (err) {
      console.error('Stake failed:', err)
      if (err.message?.includes('User rejected')) {
        setError('Transaction cancelled by user')
      } else if (err.message?.includes('insufficient')) {
        setError('Insufficient balance for transaction')
      } else {
        setError(err.message || 'Transaction failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle unstake request
  const handleRequestUnstake = async () => {
    if (!walletConnected || !userStake) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await requestUnstake(walletAddress)
      await fetchAllData()
      alert(`Unstake request submitted!\n\nYou can execute unstake on ${result.unstake_month}-01.\nYou will still receive rewards during cooldown.`)
    } catch (err) {
      console.error('Unstake request failed:', err)
      setError(err.message || 'Failed to request unstake')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle execute unstake
  const handleExecuteUnstake = async () => {
    if (!walletConnected || !userStake) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await executeUnstake(walletAddress)
      await fetchAllData()
      alert(`Successfully unstaked ${formatTokens(result.amount / 1e6)} $PBOT!\n\nTokens have been returned to your wallet.`)
    } catch (err) {
      console.error('Execute unstake failed:', err)
      setError(err.message || 'Failed to execute unstake')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle claim rewards
  const handleClaimRewards = async () => {
    if (!walletConnected || !claimableRewards?.eligible) return

    setIsLoading(true)
    setError(null)
    try {
      // Record the claim in database - this reserves the user's share
      // The treasury will automatically process SOL transfers for valid claims
      const result = await claimRewards(walletAddress, 'claimed')
      await fetchAllData()
      alert(`Successfully claimed ${lamportsToSol(result.amount_sol)} SOL for ${result.month}!\n\nYour rewards have been recorded. SOL will be transferred to your wallet within 24 hours.\n\nClaim ID: ${result.id.slice(0, 8)}`)
    } catch (err) {
      console.error('Claim failed:', err)
      setError(err.message || 'Failed to claim rewards')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-connect if previously connected
  useEffect(() => {
    const provider = getProvider()
    if (provider) {
      provider.connect({ onlyIfTrusted: true })
        .then(resp => {
          const address = resp.publicKey.toString()
          setWalletAddress(address)
          setWalletConnected(true)
          fetchAllData(address)
        })
        .catch(() => {
          fetchAllData()
        })
    } else {
      fetchAllData()
    }
  }, [])

  // Helper to format month string
  const formatMonth = (monthStr) => {
    if (!monthStr) return 'N/A'
    const [year, month] = monthStr.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Determine unstake button state
  const canExecuteUnstake = userStake?.unstake_month === getCurrentMonth()
  const hasUnstakeRequest = userStake?.unstake_requested_at

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/">
              <img src="https://res.cloudinary.com/seyi-codes/image/upload/v1762882667/PredictBot_-_WhiteText_transparent_lkn8a0.png" alt="PredictBot" className="logo-image" />
            </Link>
          </div>
          <div className="header-actions">
            <nav className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/stake" className="nav-link active">Stake</Link>
              <Link to="/docs" className="nav-link">Docs</Link>
            </nav>
            <div className="social-links">
              <a href="https://t.me/PredictBotSol" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram">
                <MessageCircle size={20} />
              </a>
              <a href="https://x.com/PredictBotSol" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <a href="https://jup.ag/tokens/8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump" target="_blank" rel="noopener noreferrer" className="buy-pbot-link">
              <button className="buy-pbot-button">Buy $PBOT</button>
            </a>
          </div>
        </div>
        <div className="tagline">Prediction Markets. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="tokenos-link">TokenOS</a>.</div>
      </header>

      {/* Staking Hero */}
      <section className="staking-hero">
        <h1 className="staking-title">Stake $PBOT</h1>
        <p className="staking-subtitle">
          Earn real SOL revenue from platform fees. Calendar month-based rewards.
        </p>
        <div className="current-month-info">
          <Calendar size={20} />
          <span>Current Cycle: {formatMonth(getCurrentMonth())} | {getDaysUntilNextReward()} days until next reward period</span>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Stats Overview */}
      <section className="staking-stats-section">
        <div className="staking-stats-grid">
          <div className="staking-stat-card">
            <div className="stat-icon">
              <Wallet size={24} />
            </div>
            <div className="stat-value">
              {dataLoading ? '...' : formatTokens(poolStats?.total_staked / 1e6 || 0)}
            </div>
            <div className="stat-label">Total $PBOT Staked</div>
          </div>
          <div className="staking-stat-card">
            <div className="stat-icon">
              <Zap size={24} />
            </div>
            <div className="stat-value">
              {dataLoading ? '...' : poolStats?.total_stakers || 0}
            </div>
            <div className="stat-label">Active Stakers</div>
          </div>
          <div className="staking-stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {dataLoading ? '...' : lamportsToSol(poolStats?.sol_rewards_pool || 0)} SOL
            </div>
            <div className="stat-label">Current Reward Pool</div>
          </div>
          <div className="staking-stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-value">{formatMonth(getNextMonth())}</div>
            <div className="stat-label">Next Eligible Month</div>
          </div>
        </div>
      </section>

      {/* Main Staking Interface */}
      <section className="staking-interface-section">
        <div className="staking-container">
          {/* Left: Staking Form */}
          <div className="staking-form-card">
            {!walletConnected ? (
              <>
                <h3 className="staking-form-title">Connect Your Wallet</h3>
                <p className="connect-description">
                  Connect your Phantom wallet to stake $PBOT tokens and start earning SOL rewards from platform fees.
                </p>

                <button
                  className="connect-wallet-button"
                  onClick={connectWallet}
                  disabled={isLoading}
                >
                  <Wallet size={20} />
                  {isLoading ? 'Connecting...' : 'Connect Phantom Wallet'}
                </button>

                <div className="staking-info-box">
                  <h4>How Calendar Month Staking Works:</h4>
                  <ul>
                    <li>Connect your Phantom wallet</li>
                    <li>Stake $PBOT tokens before the 1st of the month</li>
                    <li>Become eligible for that month's rewards</li>
                    <li>Claim proportional share of deposited SOL</li>
                    <li>Request unstake anytime (1 month cooldown)</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="wallet-connected-header">
                  <div className="wallet-status">
                    <div className="wallet-indicator"></div>
                    <span>Wallet Connected</span>
                  </div>
                  <button className="disconnect-button" onClick={disconnectWallet}>
                    Disconnect
                  </button>
                </div>

                <div className="wallet-address-display">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </div>

                <div className="staking-tabs">
                  <button
                    className={`staking-tab ${isStaking ? 'active' : ''}`}
                    onClick={() => setIsStaking(true)}
                  >
                    Stake
                  </button>
                  <button
                    className={`staking-tab ${!isStaking ? 'active' : ''}`}
                    onClick={() => setIsStaking(false)}
                  >
                    Unstake
                  </button>
                </div>

                {isStaking ? (
                  <>
                    <div className="staking-input-group">
                      <label className="staking-label">Amount to Stake</label>
                      <div className="staking-input-wrapper">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="staking-input"
                          disabled={isLoading}
                        />
                        <span className="staking-token">$PBOT</span>
                      </div>
                      <div className="staking-balance">
                        Balance: {balanceLoading ? '...' : formatPbotAmount(userBalance)} $PBOT
                        <button
                          className="refresh-balance-button"
                          onClick={() => fetchBalance(walletAddress)}
                          disabled={balanceLoading}
                          title="Refresh balance"
                        >
                          <RefreshCw size={14} className={balanceLoading ? 'spinning' : ''} />
                        </button>
                        <button
                          className="max-button"
                          onClick={() => setStakeAmount(userBalance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <button
                      className="staking-action-button"
                      onClick={handleStake}
                      disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    >
                      {isLoading ? 'Processing...' : 'Stake $PBOT'}
                    </button>

                    <div className="staking-warning">
                      <AlertTriangle size={20} />
                      <div>
                        <strong>Important:</strong> Stake before {formatMonth(getNextMonth())} to be eligible for that month's rewards. 2% staking fee applies.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {!userStake ? (
                      <div className="no-stake-message">
                        <XCircle size={24} />
                        <p>You don't have any staked tokens.</p>
                      </div>
                    ) : hasUnstakeRequest ? (
                      <div className="unstake-status">
                        <Clock size={24} />
                        <h4>Unstake Requested</h4>
                        <p>You can execute unstake on <strong>{formatMonth(userStake.unstake_month)}</strong></p>
                        <p className="cooldown-note">You'll still receive rewards during cooldown.</p>

                        <button
                          className="staking-action-button"
                          onClick={handleExecuteUnstake}
                          disabled={isLoading || !canExecuteUnstake}
                        >
                          {isLoading ? 'Processing...' : canExecuteUnstake ? 'Execute Unstake' : `Available ${userStake.unstake_month}-01`}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="current-stake-info">
                          <p>Your current stake: <strong>{formatTokens(userStake.amount_staked / 1e6)} $PBOT</strong></p>
                          <p>Staked since: <strong>{formatMonth(userStake.stake_month)}</strong></p>
                        </div>

                        <button
                          className="staking-action-button unstake"
                          onClick={handleRequestUnstake}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Request Unstake'}
                        </button>

                        <div className="staking-warning">
                          <AlertTriangle size={20} />
                          <div>
                            <strong>Cooldown Period:</strong> After requesting unstake, you must wait until the 1st of next month to withdraw. You'll continue earning rewards during this period.
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right: Your Position */}
          <div className="staking-position-card">
            <h3 className="position-title">Your Position</h3>

            <div className="position-stat">
              <span className="position-label">Your Staked</span>
              <span className="position-value">
                {dataLoading ? '...' : formatTokens((userStake?.amount_staked || 0) / 1e6)} $PBOT
              </span>
            </div>

            <div className="position-stat">
              <span className="position-label">Staked Since</span>
              <span className="position-value">
                {userStake ? formatMonth(userStake.stake_month) : 'Not Staking'}
              </span>
            </div>

            <div className="position-stat">
              <span className="position-label">Eligibility Status</span>
              <span className="position-value">
                {!userStake ? (
                  <span className="status-not-eligible">Not Staking</span>
                ) : userStake.stake_month < getCurrentMonth() ? (
                  <span className="status-eligible">
                    <CheckCircle size={16} /> Eligible for {formatMonth(getCurrentMonth())}
                  </span>
                ) : (
                  <span className="status-pending">
                    <Clock size={16} /> Eligible from {formatMonth(getNextMonth())}
                  </span>
                )}
              </span>
            </div>

            <div className="position-stat">
              <span className="position-label">Claimable Rewards</span>
              <span className="position-value rewards">
                {claimableRewards?.eligible
                  ? `${lamportsToSol(claimableRewards.amount)} SOL`
                  : '0.0000 SOL'
                }
              </span>
            </div>

            {claimableRewards?.eligible && (
              <div className="reward-breakdown">
                <small>Your share: {claimableRewards.sharePercent}% of {lamportsToSol(claimableRewards.amount / (parseFloat(claimableRewards.sharePercent) / 100))} SOL</small>
              </div>
            )}

            <button
              className="claim-button"
              onClick={handleClaimRewards}
              disabled={!walletConnected || !claimableRewards?.eligible || isLoading}
            >
              {isLoading ? 'Processing...' : claimableRewards?.eligible ? 'Claim Rewards' : 'No Rewards Available'}
            </button>

            {claimableRewards && !claimableRewards.eligible && claimableRewards.reason && (
              <div className="claim-reason">
                <small>{claimableRewards.reason}</small>
              </div>
            )}

            <div className="reward-info">
              <Clock size={16} />
              <span>Rewards distributed proportionally based on stake amount</span>
            </div>

            <div className="total-claimed">
              <span className="position-label">Total Claimed</span>
              <span className="position-value">
                {lamportsToSol(userStake?.total_rewards_claimed || 0)} SOL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Claim History */}
      {claimHistory.length > 0 && (
        <section className="claim-history-section">
          <h2 className="section-title">Your Claim History</h2>
          <div className="claim-history-table">
            <div className="history-header">
              <span>Month</span>
              <span>Amount</span>
              <span>Claimed At</span>
            </div>
            {claimHistory.slice(0, 5).map((claim) => (
              <div key={claim.id} className="history-row">
                <span>{formatMonth(claim.month)}</span>
                <span>{lamportsToSol(claim.amount_sol)} SOL</span>
                <span>{new Date(claim.claimed_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Revenue Distribution Info */}
      <section className="revenue-info-section">
        <h2 className="section-title">How Revenue is Distributed</h2>
        <p className="section-subtitle">
          Stakers receive a proportional share of all platform revenue each month
        </p>

        <div className="revenue-grid">
          <div className="revenue-card">
            <div className="revenue-percentage">60%</div>
            <h3 className="revenue-title">Trading Commissions</h3>
            <p className="revenue-description">
              60% of all trading fees from private and group chat trades go directly to $PBOT stakers
            </p>
          </div>

          <div className="revenue-card">
            <div className="revenue-percentage">10%</div>
            <h3 className="revenue-title">Creator Fees</h3>
            <p className="revenue-description">
              10% of fees from custom market creation distributed to stakers
            </p>
          </div>

          <div className="revenue-card highlight">
            <div className="revenue-percentage">Monthly</div>
            <h3 className="revenue-title">Calendar Distribution</h3>
            <p className="revenue-description">
              Rewards are calculated and distributed monthly. Stake before the month to be eligible.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="staking-benefits-section">
        <h2 className="section-title">Why Stake $PBOT?</h2>

        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <TrendingUp size={32} />
            </div>
            <h4 className="benefit-title">Passive Income</h4>
            <p className="benefit-text">Earn real SOL rewards from platform activity without active trading</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <Calendar size={32} />
            </div>
            <h4 className="benefit-title">Monthly Rewards</h4>
            <p className="benefit-text">Clear reward schedule with calendar month-based eligibility</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <Shield size={32} />
            </div>
            <h4 className="benefit-title">Fair Distribution</h4>
            <p className="benefit-text">Proportional rewards based on your share of total staked tokens</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <Clock size={32} />
            </div>
            <h4 className="benefit-title">Cooldown Protection</h4>
            <p className="benefit-text">Continue earning rewards even during unstake cooldown period</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="staking-cta-section">
        <h2 className="section-title">Don't Have $PBOT Yet?</h2>
        <p className="section-subtitle">
          Buy $PBOT on Jupiter and start earning platform revenue today
        </p>
        <a href="https://jup.ag/tokens/8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump" target="_blank" rel="noopener noreferrer">
          <button className="cta-button">Buy $PBOT on Jupiter</button>
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PredictBot. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="tokenos-link">TokenOS</a>. Built on Solana.</p>
      </footer>
    </div>
  )
}

export default Staking
