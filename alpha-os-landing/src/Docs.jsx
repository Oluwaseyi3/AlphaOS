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
              Start a private chat with @PredictBot on Telegram. Create your encrypted wallet in seconds. No email, no KYC - just start trading. Your wallet uses military-grade AES-256-GCM encryption and you maintain full control of your private keys.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Group Betting</h3>
            <p className="doc-description">
              Add PredictBot to any Telegram group to compete with friends. See real-time bets, track group leaderboards, and compete for the top spot. Auto-posted markets every 5 minutes keep the action flowing. Private info always sent via DM.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Market Creation</h3>
            <p className="doc-description">
              Launch custom prediction markets in 60 seconds. Choose USDC or SOL collateral, set liquidity from $1-$10k, customize duration 7-90 days. Earn creator fees when others trade your market. Perfect for group-specific events.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Alpha Engine</h3>
            <p className="doc-description">
              Real-time alerts for whale trades ($100+), swarm activity (20+ traders), new markets, and 15%+ price swings. Configure your alert preferences to stay ahead of market movements and never miss a big move.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Leaderboards & Stats</h3>
            <p className="doc-description">
              Compete on group leaderboards with daily, weekly, and monthly rankings. Track win rates, P&L, biggest wins, and achievements. Unlock rewards for streaks, milestones, and challenge victories. See who's the best predictor.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">$PBOT Staking</h3>
            <p className="doc-description">
              Stake $PBOT tokens to earn 60% of all platform commissions and revenue, plus 10% of creator fees. Passive income distributed automatically. Track your staking rewards and compound your earnings over time.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
          </div>

          <div className="doc-card">
            <h3 className="doc-title">Security & Privacy</h3>
            <p className="doc-description">
              HashiCorp Vault AES-256-GCM encryption. Non-custodial design means you control your keys. Private info never posted in groups - always sent via DM. Redis caching and PostgreSQL for reliable, fast performance.
            </p>
            <span className="doc-link-disabled">Coming Soon</span>
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
