import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import './App.css'

function Docs() {
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
              <Link to="/docs" className="nav-link active">Docs</Link>
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
            <a href="#" target="_blank" rel="noopener noreferrer" className="buy-pbot-link">
              <button className="buy-pbot-button">Buy $PBOT</button>
            </a>
          </div>
        </div>
        <div className="tagline">Prediction Markets. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="tokenos-link">TokenOS</a>.</div>
      </header>

      {/* Documentation Section */}
      <section className="docs-page">
        <div className="docs-hero">
          <h1 className="docs-page-title">Documentation</h1>
          <p className="docs-page-subtitle">
            Learn how to use PredictBot and maximize your trading potential
          </p>
        </div>

        <div className="docs-grid">
          <div className="doc-card">
            <h3 className="doc-title">Getting Started</h3>
            <p className="doc-description">
              Open Telegram and start a private chat with @PredictBot. Your wallet is automatically created using AES-256-GCM encryption via HashiCorp Vault. No email or KYC required. Fund your wallet with SOL or USDC through the deposit flow. You maintain complete custody - we never access your private keys. Export your keys anytime via the settings menu. Start trading prediction markets immediately after funding.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Group Betting</h3>
            <p className="doc-description">
              Add @PredictBot to any Telegram group via bot settings. All group members can place bets publicly visible to the group. Real-time leaderboards track rankings, win rates, and P&L across daily, weekly, and monthly periods. Markets auto-post every 5 minutes with high liquidity options. Wallet details and balances are always sent via private DM for security. Group admins control notification settings and minimum bet amounts.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Market Creation</h3>
            <p className="doc-description">
              Use the /create command to launch custom prediction markets in 60 seconds. Choose USDC or SOL as collateral. Set initial liquidity between $1-$10,000. Configure market duration from 7-90 days. Define clear YES/NO outcomes for resolution. Markets deploy to PNP Protocol on Solana. Earn creator fees from all trades. Perfect for group-specific events, custom challenges, or private competitions.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Alpha Engine</h3>
            <p className="doc-description">
              Real-time market intelligence monitors millions of on-chain events. Whale alerts trigger for trades over $100 (small), $500 (medium), or $1,000 (large). Swarm detection identifies 20+ traders moving in the same direction within 60 seconds. Price swing alerts notify you of 15%+ market movements. New market alerts highlight fresh opportunities across crypto, sports, politics, and tech categories. Configure preferences via bot settings.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Leaderboards & Stats</h3>
            <p className="doc-description">
              Group leaderboards rank members by total P&L over daily, weekly, and monthly periods. Track detailed stats including win rate, total bets, average position size, and biggest wins/losses. Earn achievements for 5-win streaks, 100-bet milestones, and profitable months. Unlock reward bonuses for achievement completion. View category-specific performance across crypto, sports, and other market types. All stats update in real-time as positions resolve.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">$PBOT Staking</h3>
            <p className="doc-description">
              Stake $PBOT tokens to earn 60% of all platform trading commissions and revenue. Additionally receive 10% of creator fees from custom prediction markets. Rewards distribute automatically to stakers proportional to stake size. No lock-up periods or minimum stake requirements. Unstake anytime with instant withdrawal. Track cumulative rewards and APY in the staking dashboard. Compound earnings by restaking rewards for maximum yield.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Security & Privacy</h3>
            <p className="doc-description">
              All wallets encrypted using HashiCorp Vault with AES-256-GCM standard. Fully non-custodial - you control your private keys at all times. Private information including wallet addresses, balances, and transaction history never posted in public groups. All sensitive data sent exclusively via private DM. Redis caching ensures sub-second response times. PostgreSQL database maintains reliable position tracking. Regular security audits by third-party firms.
            </p>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Investors</h3>
            <p className="doc-description">
              Interested in partnering or investing in PredictBot? Reach out to discuss opportunities and platform growth.
            </p>
            <a href="mailto:investors@predictbot.net" className="doc-link">Contact Us →</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PredictBot. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="tokenos-link">TokenOS</a>. Built on Solana.</p>
      </footer>
    </div>
  )
}

export default Docs
