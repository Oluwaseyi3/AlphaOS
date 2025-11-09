import { useState, useEffect } from 'react'
import { Send, TrendingUp, AlertCircle, Bell, Zap, ChevronLeft } from 'lucide-react'
import './App.css'
import profitImage from './assets/GreenMeme.png'
import lossImage from './assets/Gemini_Generated_Image_wltnkbwltnkbwltn.png'

function App() {
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    { type: 'user', text: 'hi' },
    { type: 'bot', text: 'Welcome to AlphaOs. What would you like to trade?' },
    { type: 'category', text: 'Choose a category: eSports • Crypto • Politics' },
    { type: 'selection', text: 'eSports' },
    { type: 'market', text: 'CS:GO - Navi vs G2. YES @\n$85 • NO @ 2.10' },
    { type: 'bet', text: 'Bid YES' },
    { type: 'confirmation', text: 'Bet Placed • 25 USDT on YES @ $85' }
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
        <div className="logo">AlphaOs</div>
        <div className="tagline">The Operating System for Alpha</div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          The Future of Prediction Markets. In Your Pocket.
        </h1>
        <p className="hero-subtitle">
          Trade on sports, politics, and crypto instantly. No apps. No hidden fees. Just alpha.
        </p>
        <button className="cta-button">Start Trading on Telegram</button>

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
                  <span className="bot-name">AlphaOs Bot</span>
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
      </section>

      {/* We Watch the Noise Section */}
      <section className="noise-section">
        <h2 className="section-title">We Watch the Noise. You Get the Signal.</h2>
        <p className="section-subtitle">
          Our "Alpha Engine" parses millions of on-chain events in real-time. When a whale moves, you're the first to know.
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
            <h3 className="column-header">Your AlphaOs Alerts</h3>
            <div className="column-label">Real-time</div>
            <div className="alerts-list">
              <div className="alert-item">
                <AlertCircle className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">OMEN</div>
                  <div className="alert-text">Trader="07" market just moved +18%...</div>
                </div>
              </div>
              <div className="alert-item">
                <Bell className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">New MKT</div>
                  <div className="alert-text">"Will $AVI hit $5?" is now live.</div>
                </div>
              </div>
              <div className="alert-item">
                <TrendingUp className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">WHALE ALERT</div>
                  <div className="alert-text">$100,000 "YES" bet just placed on the SOL &gt; $400 market.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alpha Engine Section */}
      <section className="engine-section">
        <h2 className="section-title">Your New Alpha Engine. Built-in.</h2>
        <p className="section-subtitle">
          Signals that move fast markets—delivered where you already are.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Whale Alerts</h3>
            <div className="feature-badge">Live</div>
            <p className="feature-description">
              Track large on-chain flows and high-stakes bets as they happen. Get the jump on momentum.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">Odds Shift Alerts</h3>
            <div className="feature-badge">Real-time</div>
            <p className="feature-description">
              Be first to know when probabilities move. Enter or hedge before the crowd.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Bell size={48} className="feature-icon-svg" />
            </div>
            <h3 className="feature-title">New Market Alerts</h3>
            <div className="feature-badge">Fresh</div>
            <p className="feature-description">
              Fresh markets across crypto, eSports, and politics—straight to your Telegram.
            </p>
          </div>
        </div>
      </section>

      {/* PnL Cards Section */}
      <section className="pnl-section">
        <h2 className="section-title">Track Your PnL. Share Your Memes.</h2>
        <p className="section-subtitle">
          Clean profit cards when you win, meme-ready losses when you don't.
        </p>

        <div className="pnl-cards">
          <div className="pnl-card profit">
            <div className="pnl-visual profit-visual">
              <img src={profitImage} alt="Profit Meme" className="pnl-image" />
            </div>
            <div className="pnl-amount">+$152.50 (+85%)</div>
            <div className="pnl-caption">Dynamically-generated profit cards when you win.</div>
          </div>

          <div className="pnl-card loss">
            <div className="pnl-visual loss-visual">
              <img src={lossImage} alt="Loss Meme" className="pnl-image" />
            </div>
            <div className="pnl-amount loss-amount">-$75.00 (-50%)</div>
            <div className="pnl-caption">And meme-ready loss cards. Because it happens.</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-title">Radically Transparent. Verifiably Cheaper.</h2>
        <p className="section-subtitle">
          No hidden markups. Clear pricing. On-chain proofs.
        </p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-title">Zero Added Fees. Ever.</h3>
            <p className="pricing-description">
              We never add hidden spreads or take secret cuts. What you see is what you pay.
            </p>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-title">5% Cheaper. Guaranteed.</h3>
            <p className="pricing-description">
              Our routing and rebates keep execution costs at least 5% lower than alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <h2 className="section-title">Trusted Partners</h2>
        <p className="section-subtitle">
          Partnering with industry leaders to bring you the best trading experience.
        </p>

        <div className="partners-grid">
          <div className="partner-card">
            <div className="partner-logo">Drift</div>
            <p className="partner-description">Leading decentralized perpetuals exchange on Solana</p>
          </div>

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

      {/* Final CTA Section */}
      <section className="final-cta">
        <h2 className="section-title">Start Trading in 30 Seconds.</h2>
        <p className="section-subtitle">
          No sign-ups. No credit cards. No complex apps. Just your Telegram.
        </p>
        <button className="cta-button">Launch AlphaOs</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 AlphaOs.  All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
