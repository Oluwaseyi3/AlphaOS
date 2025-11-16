import { useState, useEffect } from 'react'
import { Send, TrendingUp, AlertCircle, Bell, Zap, ChevronLeft, MessageCircle, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import './App.css'
import profitImage from './assets/GreenMeme.png'
import lossImage from './assets/Gemini_Generated_Image_wltnkbwltnkbwltn.png'

function App() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const messages = [
    { type: 'user', text: 'hi' },
    { type: 'bot', text: 'Welcome to PredictBot. Browse 503+ live markets!' },
    { type: 'category', text: 'Choose a category: Politics • Crypto • Sports • Tech' },
    { type: 'selection', text: 'Crypto' },
    { type: 'market', text: 'Will SOL hit $400 in 2025?\nYES @ $0.68 • NO @ $0.32' },
    { type: 'bet', text: 'Trade YES - $25' },
    { type: 'confirmation', text: 'Position Opened • $25 on YES @ $0.68' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

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
              <Link to="/" className="nav-link active">Home</Link>
              <Link to="/stake" className="nav-link">Stake</Link>
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

      {/* Hero Section */}
      <section className="hero">
        <div className="built-on-badge">
          <span className="solana-badge">Built on Solana</span>
        </div>
        <h1 className="hero-title">
          Prediction Markets. In Your Pocket.
        </h1>
        <p className="hero-subtitle">
          A fully-featured Telegram bot that brings the power of Prediction markets to your fingertips.
          Trade on real-world events, track positions, and get instant alerts when smart money moves—all without leaving Telegram.
        </p>
        <a href="https://t.me/Predict_Sol_Bot" target="_blank" rel="noopener noreferrer">
          <button className="cta-button">Start Trading on Telegram</button>
        </a>

        {/* iPhone Mockup */}
        <div className="phone-mockup">
          <div className="phone-notch"></div>
          <div className="phone-frame">
            <div className="status-bar">
              <div className="status-left">
                <span className="time">9:41</span>
              </div>
              <div className="status-right">
                <div className="signal-icon"></div>
                <div className="wifi-icon"></div>
                <div className="battery-icon">
                  <div className="battery-level"></div>
                </div>
              </div>
            </div>

            <div className="phone-content">
              <div className="chat-header">
                <ChevronLeft className="back-icon" />
                <div className="bot-info">
                  <div className="bot-avatar"></div>
                  <span className="bot-name">PredictBot</span>
                </div>
                <div className="header-spacer"></div>
              </div>

              <div className="chat-messages">
                {messages.slice(0, currentMessage + 1).map((msg, idx) => (
                  <div key={idx} className={`message ${msg.type}`}>
                    {msg.type === 'user' && <div className="message-bubble user-message">{msg.text}</div>}
                    {msg.type === 'bot' && <div className="message-bubble bot-message">{msg.text}</div>}
                    {msg.type === 'category' && <div className="message-bubble bot-message">{msg.text}</div>}
                    {msg.type === 'selection' && (
                      <div className="selection-bubble">
                        <div className="selection-title">{msg.text}</div>
                      </div>
                    )}
                    {msg.type === 'market' && (
                      <div className="market-bubble">
                        <div className="market-text">{msg.text}</div>
                      </div>
                    )}
                    {msg.type === 'bet' && (
                      <div className="bet-button">{msg.text}</div>
                    )}
                    {msg.type === 'confirmation' && (
                      <div className="confirmation-bubble">
                        <div className="check-mark"></div>
                        <div>{msg.text}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <div className="input-wrapper">
                  <input type="text" placeholder="Message" />
                </div>
                <button className="send-button">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="phone-home-indicator"></div>
        </div>

        {/* Token Info Section */}
        <div className="token-info">
          <div className="token-ca">
            <span className="token-label">$PBOT CA:</span>
            <span className="token-address">8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump</span>
          </div>
          <div className="token-links">
            <a href="https://dexscreener.com/solana/9scxsknudrqe9magejtsvsuxxjprq6kmsptm9pgpwhzc" className="token-link" target="_blank" rel="noopener noreferrer">
              DexScreener
            </a>
            <span className="token-separator">•</span>
            <a href="https://www.dextools.io/app/en/solana/pair-explorer/8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump" className="token-link" target="_blank" rel="noopener noreferrer">
              DexTools
            </a>
            <span className="token-separator">•</span>
            <a href="https://gmgn.ai/sol/token/8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump" className="token-link" target="_blank" rel="noopener noreferrer">
              GMGN
            </a>
          </div>
        </div>
      </section>

      {/* Group Betting Feature Highlight */}
      <section className="group-betting-section">
        <div className="group-betting-content">
          <h2 className="section-title">Bet Against Your Friends</h2>
          <p className="section-subtitle">
            Transform any Telegram group into a competitive prediction market. See who's the best at calling the market.
          </p>
          <p className="fee-notice">1% fee on private chat trades • 2% fee on group chat trades</p>

          <div className="group-features-grid">
            <div className="group-feature">
              <h3 className="group-feature-title">Live Group Leaderboards</h3>
              <p className="group-feature-text">
                Track rankings, win rates, and P&L for your entire group. Daily, weekly, and monthly leaderboards show who's on top. Compete for bragging rights and climb the ranks with every winning prediction.
              </p>
            </div>

            <div className="group-feature">
              <h3 className="group-feature-title">Public Bets</h3>
              <p className="group-feature-text">
                Everyone sees the bets in the group chat. Your wallet and balance Always sent via private DM. Perfect balance of social competition and personal security.
              </p>
            </div>

            <div className="group-feature">
              <h3 className="group-feature-title">Auto-Posted Markets</h3>
              <p className="group-feature-text">
                Hot markets automatically posted every 5 minutes. High liquidity, active trading, interesting odds - the bot finds the best opportunities and brings them to your group.
              </p>
            </div>

            <div className="group-feature">
              <h3 className="group-feature-title">Achievements & Streaks</h3>
              <p className="group-feature-text">
                Unlock achievements for win streaks, big wins, milestones, and more. Get rewards and bonuses for hitting targets. Everyone in the group sees your accomplishments.
              </p>
            </div>
          </div>

          <div className="group-cta">
            <a href="https://t.me/Predict_Sol_Bot" target="_blank" rel="noopener noreferrer">
              <button className="cta-button">Add to Your Group</button>
            </a>
          </div>
        </div>
      </section>

      {/* We Watch the Noise Section */}
      <section className="noise-section">
        <h2 className="section-title">Alpha Engine - Real-Time Market Intelligence</h2>
        <p className="section-subtitle">
          Our Alpha Engine parses millions of on-chain events in real-time. Never miss a big move—whale alerts, swarm detection, and price swings delivered instantly to Telegram.
        </p>

        <div className="noise-grid">
          <div className="noise-column">
            <h3 className="column-header">Live Solana Activity</h3>
            <div className="column-label">Streaming</div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-wallet">tx: 4f...aK2</span>
                <span className="activity-action">swap: $150</span>
              </div>
              <div className="activity-item">
                <span className="activity-wallet">tx: 8z...6QZ</span>
                <span className="activity-action">bet: $50 (YES)</span>
              </div>
              <div className="activity-item">
                <span className="activity-wallet">tx: vf...7Dy</span>
                <span className="activity-action">program.call</span>
              </div>
              <div className="activity-item">
                <span className="activity-wallet">tx: fk...1z9</span>
                <span className="activity-action">bet: $25 (NO)</span>
              </div>
              <div className="activity-item highlight">
                <span className="activity-wallet">tx: 9n...wK4</span>
                <span className="activity-action">$100,000 (YES)</span>
              </div>
              <div className="activity-item">
                <span className="activity-wallet">tx: 2m...2n8</span>
                <span className="activity-action">stake: 1,300 SOL</span>
              </div>
            </div>
          </div>

          <div className="noise-column">
            <h3 className="column-header">AlphaOs Engine</h3>
            <div className="column-label">Filtering</div>
            <div className="engine-visual">
              <div className="filter-bar"></div>
            </div>
          </div>

          <div className="noise-column">
            <h3 className="column-header">Your PredictBot Alerts</h3>
            <div className="column-label">Real-time</div>
            <div className="alerts-list">
              <div className="alert-item">
                <TrendingUp className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">LARGE WHALE</div>
                  <div className="alert-text">$1,500 "YES" bet on SOL &gt; $400 market</div>
                </div>
              </div>
              <div className="alert-item">
                <AlertCircle className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">SWARM DETECTED</div>
                  <div className="alert-text">23 traders betting YES in 60 seconds</div>
                </div>
              </div>
              <div className="alert-item">
                <Bell className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">NEW MARKET</div>
                  <div className="alert-text">"Will Trump win 2024?" just launched</div>
                </div>
              </div>
              <div className="alert-item">
                <TrendingUp className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">PRICE SWING</div>
                  <div className="alert-text">BTC $100k market moved +18% in 5 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="engine-section">
        <h2 className="section-title">Everything You Need. In Telegram.</h2>
        <p className="section-subtitle">
          Trade 503+ markets, manage positions, and create your own prediction markets—all from your pocket.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Whale Alerts</h3>
            <div className="feature-badge">Live</div>
            <p className="feature-description">
              $100+ Small Whale - $500+ Medium Whale - $1,000+ Large Whale. Track big money moves in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <AlertCircle size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Swarm Detection</h3>
            <div className="feature-badge">Real-time</div>
            <p className="feature-description">
              20+ traders betting the same direction in 60 seconds? Crowd sentiment and momentum tracking at your fingertips.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Bell size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">New Market Discovery</h3>
            <div className="feature-badge">Fresh</div>
            <p className="feature-description">
              Be first to trade on trending topics. Instant alerts for fresh prediction markets across politics, crypto, sports, and tech.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Price Swing Alerts</h3>
            <div className="feature-badge">15%+</div>
            <p className="feature-description">
              Know when market sentiment shifts dramatically. 15%+ price movements detected and delivered instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Portfolio Management</h3>
            <div className="feature-badge">One-Click</div>
            <p className="feature-description">
              Track all positions, see active YES/NO bets, exit positions instantly, and review automatic PnL calculations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Send size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Market Creation</h3>
            <div className="feature-badge">60 sec</div>
            <p className="feature-description">
              Launch custom prediction markets in 60 seconds. Choose USDC or SOL, set liquidity ($1-$10k), earn creator fees.
            </p>
          </div>
        </div>
      </section>

      {/* PnL Cards Section */}
      <section className="pnl-section">
        <h2 className="section-title">Track Your PnL. Share Your Wins.</h2>
        <p className="section-subtitle">
          Beautiful, branded PnL cards for every trade. Perfect for sharing on Twitter, Discord, and Telegram.
        </p>

        <div className="pnl-cards">
          <div className="pnl-card profit">
            <div className="pnl-visual profit-visual">
              <img src={profitImage} alt="Profit Meme" className="pnl-image" />
            </div>
            <div className="pnl-amount">+$152.50 (+85%)</div>
            <div className="pnl-caption">Professional profit cards with PredictBot branding. Share your wins anywhere.</div>
          </div>

          <div className="pnl-card loss">
            <div className="pnl-visual loss-visual">
              <img src={lossImage} alt="Loss Meme" className="pnl-image" />
            </div>
            <div className="pnl-amount loss-amount">-$75.00 (-50%)</div>
            <div className="pnl-caption">Meme-ready loss cards. Perfect for social sharing (16:9 ratio).</div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="pricing-section">
        <h2 className="section-title">Bank-Level Security. Non-Custodial.</h2>
        <p className="section-subtitle">
          Your keys, your funds. Military-grade encryption with full control.
        </p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-title">Encrypted Wallets</h3>
            <p className="pricing-description">
              HashiCorp Vault AES-256-GCM encryption. Your private keys are fully encrypted and secure.
            </p>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-title">Lightning-Fast Performance</h3>
            <p className="pricing-description">
              Redis caching and PostgreSQL database. Reliable position tracking with sub-second response times.
            </p>
          </div>
        </div>
      </section>

      {/* PBOT Revenue Share Section */}
      <section className="pbot-section">
        <h2 className="section-title">Stake $PBOT. Earn Real Revenue.</h2>
        <p className="section-subtitle">
          $PBOT stakers receive a direct share of PredictBot's revenue streams. Passive income from platform growth.
        </p>

        <div className="pbot-grid">
          <div className="pbot-card">
            <div className="pbot-percentage">60%</div>
            <h3 className="pbot-title">Commissions & Revenue</h3>
            <p className="pbot-description">
              60% of all platform commissions and revenue distributed directly to $PBOT stakers.
            </p>
          </div>

          <div className="pbot-card">
            <div className="pbot-percentage">10%</div>
            <h3 className="pbot-title">Creator Fees</h3>
            <p className="pbot-description">
              10% of all creator fees from custom prediction markets goes to $PBOT stakers.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <h2 className="section-title">Powered By</h2>
        <p className="section-subtitle">
          Built on industry-leading infrastructure and protocols.
        </p>

        <div className="partners-grid">
          <div className="partner-card">
            <div className="partner-logo">PNP Protocol</div>
            <p className="partner-description">Decentralized prediction markets infrastructure</p>
          </div>

          <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="partner-card-link">
            <div className="partner-card">
              <div className="partner-logo">TokenOS</div>
              <p className="partner-description">Token operations and management platform</p>
            </div>
          </a>

          <div className="partner-card">
            <div className="partner-logo">Pyth Network</div>
            <p className="partner-description">Real-time oracle price feeds</p>
          </div>

          <div className="partner-card">
            <div className="partner-logo">Telegram</div>
            <p className="partner-description">Seamless bot integration platform</p>
          </div>

          <div className="partner-card">
            <div className="partner-logo">Solana</div>
            <p className="partner-description">High-performance blockchain infrastructure</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Everything you need to know about PredictBot
        </p>

        <div className="faq-container">
          {[
            {
              question: 'What is PredictBot?',
              answer: 'PredictBot is a fully-featured Telegram bot that brings PNP Protocol prediction markets to your fingertips. Trade on real-world events across politics, crypto, sports, and tech—all without leaving Telegram.'
            },
            {
              question: 'How do I start trading?',
              answer: 'Simply open the bot on Telegram, browse 503+ live markets, choose YES or NO, and place your trade. It takes less than 30 seconds. No sign-ups, no credit cards, no complex apps required.'
            },
            {
              question: 'What is the Alpha Engine?',
              answer: 'Our Alpha Engine is a real-time market intelligence system that monitors millions of on-chain events. It sends you instant alerts for whale trades ($100+), swarm activity (20+ traders moving together), new markets, and 15%+ price swings—giving you the edge before the crowd moves.'
            },
            {
              question: 'Is my wallet secure?',
              answer: 'Absolutely. PredictBot uses HashiCorp Vault with AES-256-GCM encryption for all wallets. Your private keys are fully encrypted and you maintain complete control. It\'s non-custodial—we never have access to your funds.'
            },
            {
              question: 'Can I create my own markets?',
              answer: 'Yes! Launch custom prediction markets in 60 seconds. Choose USDC or SOL as collateral, set initial liquidity ($1-$10,000), customize duration (7-90 days), and earn creator fees when others trade your market.'
            },
            {
              question: 'What is $PBOT and how do I earn?',
              answer: '$PBOT is the protocol token. Stake your $PBOT to earn 60% of all platform commissions and revenue, plus 10% of creator fees. It\'s passive income from platform growth—no active trading required.'
            },
            {
              question: 'What markets can I trade?',
              answer: 'Browse 503+ live markets across politics (elections, policy decisions), crypto (price predictions, token launches), sports (game outcomes, championships), and tech (product releases, company milestones). New markets added daily.'
            },
            {
              question: 'How do I track my positions?',
              answer: 'View all active positions directly in Telegram with one click. See your YES/NO bets, current PnL, and exit positions instantly. Plus, get beautiful shareable PnL cards for Twitter, Discord, and Telegram.'
            },
            {
              question: 'Where does the liquidity come from?',
              answer: 'Markets on PredictBot have liquidity from two sources: (1) Market creators who provide initial liquidity when launching a market, and (2) Other traders who add liquidity by placing opposing bets. All markets are powered by PNP Protocol\'s decentralized prediction market infrastructure on Solana.'
            },
            {
              question: 'What protocols does PredictBot support?',
              answer: 'PredictBot is currently built on PNP Protocol (Parimutuel Network Protocol) on Solana. We have plans to expand to BetDex (Monaco Protocol) in the near future, giving you access to even more prediction markets and deeper liquidity across multiple protocols.'
            },
            {
              question: 'What are the trading fees?',
              answer: 'PredictBot charges a 1% fee on trades made in private chats and a 2% fee on trades made in group chats. These fees support platform development and contribute to the revenue share distributed to $PBOT stakers.'
            }
          ].map((faq, index) => (
            <div key={index} className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}>
              <div className="faq-question-wrapper">
                <h3 className="faq-question">{faq.question}</h3>
                <ChevronDown className={`faq-chevron ${openFaqIndex === index ? 'open' : ''}`} size={20} />
              </div>
              {openFaqIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <h2 className="section-title">Start Trading in 30 Seconds.</h2>
        <p className="section-subtitle">
          No sign-ups. No credit cards. No complex apps. Just your Telegram. 503+ markets waiting.
        </p>
        <a href="https://t.me/Predict_Sol_Bot" target="_blank" rel="noopener noreferrer">
          <button className="cta-button">Launch PredictBot</button>
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PredictBot. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer" className="tokenos-link">TokenOS</a>. Built on Solana.</p>
      </footer>
    </div>
  )
}

export default App
