import { useState, useEffect, useRef } from 'react'
import {
  Send, TrendingUp, AlertCircle, Bell, Zap, ChevronLeft, MessageCircle, ChevronDown,
  Menu, X, ArrowRight, ShieldCheck, Trophy, Users, Wallet, Copy, Check, Flame, Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './landing.css'
import profitImage from './assets/GreenMeme.png'
import lossImage from './assets/Gemini_Generated_Image_wltnkbwltnkbwltn.png'

const BOT_URL = 'https://t.me/Predict_Sol_Bot'
const PBOT_CA = '8aamVxABfTTTYNwhCi6PwJRUdxtixf8gPKkpt3Jmpump'
const PBOT_BUY_URL = `https://jup.ag/tokens/${PBOT_CA}`
const LOGO_URL = 'https://res.cloudinary.com/seyi-codes/image/upload/v1762882667/PredictBot_-_WhiteText_transparent_lkn8a0.png'

const CHAT = [
  { type: 'user', text: 'hi' },
  { type: 'bot', text: 'Welcome to PredictBot. Browse 503+ live markets!' },
  { type: 'category', text: 'Choose a category: Politics • Crypto • Sports • Tech' },
  { type: 'selection', text: 'Crypto' },
  { type: 'market', text: 'Will SOL hit $400 in 2025?\nYES @ $0.68 • NO @ $0.32' },
  { type: 'bet', text: 'Trade YES - $25' },
  { type: 'confirmation', text: 'Position Opened • $25 on YES @ $0.68' },
]

const SAMPLE_MARKETS = [
  { cat: 'Crypto', q: 'Will SOL hit $400 in 2025?', yes: 68, trend: [38, 44, 41, 52, 49, 58, 63, 68] },
  { cat: 'Politics', q: 'Will the incumbent win re-election?', yes: 54, trend: [60, 57, 58, 52, 55, 51, 53, 54] },
  { cat: 'Sports', q: 'Will the home team win the final?', yes: 41, trend: [30, 33, 38, 36, 44, 40, 43, 41] },
]

const TICKER = [
  { icon: TrendingUp, tag: 'Whale', text: '$1,500 YES on "SOL > $400"' },
  { icon: Users, tag: 'Swarm', text: '23 traders on YES in 60 seconds' },
  { icon: Bell, tag: 'New market', text: '"Will Trump win 2024?" just launched' },
  { icon: Zap, tag: 'Price swing', text: 'BTC $100k market +18% in 5 min' },
  { icon: Flame, tag: 'Hot', text: 'Top market auto-posted to groups every 5 min' },
]

const STEPS = [
  { n: '01', icon: Send, title: 'Open the bot', text: 'Start PredictBot in Telegram. No sign-up form, no credit card, no app to install.' },
  { n: '02', icon: Sparkles, title: 'Pick a market', text: 'Browse 503+ live markets across politics, crypto, sports and tech. Choose YES or NO.' },
  { n: '03', icon: TrendingUp, title: 'Trade & track', text: 'Open a position in seconds, follow your PnL, and exit with one click when you are ready.' },
]

const CATEGORIES = ['Politics', 'Crypto', 'Sports', 'Tech']

const FEATURES = [
  { icon: TrendingUp, badge: 'Live', title: 'Whale Alerts', text: '$100+ Small Whale - $500+ Medium Whale - $1,000+ Large Whale. Track big money moves in real-time.' },
  { icon: AlertCircle, badge: 'Real-time', title: 'Swarm Detection', text: '20+ traders betting the same direction in 60 seconds? Crowd sentiment and momentum tracking at your fingertips.' },
  { icon: Bell, badge: 'Fresh', title: 'New Market Discovery', text: 'Be first to trade on trending topics. Instant alerts for fresh prediction markets across politics, crypto, sports, and tech.' },
  { icon: Zap, badge: '15%+', title: 'Price Swing Alerts', text: 'Know when market sentiment shifts dramatically. 15%+ price movements detected and delivered instantly.' },
  { icon: Wallet, badge: 'One-Click', title: 'Portfolio Management', text: 'Track all positions, see active YES/NO bets, exit positions instantly, and review automatic PnL calculations.' },
  { icon: Send, badge: '60 sec', title: 'Market Creation', text: 'Launch custom prediction markets in 60 seconds. Choose USDC or SOL, set liquidity ($1-$10k), earn creator fees.' },
]

const GROUP_FEATURES = [
  { title: 'Live Group Leaderboards', text: 'Track rankings, win rates, and P&L for your entire group. Daily, weekly, and monthly boards show who is on top.' },
  { title: 'Public Bets', text: 'Everyone sees the bets in the group chat. Your wallet and balance are always sent via private DM.' },
  { title: 'Auto-Posted Markets', text: 'Hot markets are posted automatically every 5 minutes. High liquidity, active trading, interesting odds.' },
  { title: 'Achievements & Streaks', text: 'Unlock achievements for win streaks, big wins, and milestones. Everyone in the group sees your accomplishments.' },
]

const LEADERBOARD = [
  { rank: 1, name: 'alpha_whale', pnl: '+$4,210', rate: '78%' },
  { rank: 2, name: 'sol_oracle', pnl: '+$2,985', rate: '71%' },
  { rank: 3, name: 'degen_dan', pnl: '+$1,640', rate: '64%' },
  { rank: 4, name: 'you?', pnl: '—', rate: '—' },
]

const PARTNERS = [
  { name: 'PNP Protocol', text: 'Decentralized prediction markets infrastructure' },
  { name: 'TokenOS', text: 'Token operations and management platform', href: 'https://tokenos.ai/' },
  { name: 'Pyth Network', text: 'Real-time oracle price feeds' },
  { name: 'Telegram', text: 'Seamless bot integration platform' },
  { name: 'Solana', text: 'High-performance blockchain infrastructure' },
]

const FAQS = [
  { question: 'What is PredictBot?', answer: 'PredictBot is a fully-featured Telegram bot that brings PNP Protocol prediction markets to your fingertips. Trade on real-world events across politics, crypto, sports, and tech—all without leaving Telegram.' },
  { question: 'How do I start trading?', answer: 'Simply open the bot on Telegram, browse 503+ live markets, choose YES or NO, and place your trade. It takes less than 30 seconds. No sign-ups, no credit cards, no complex apps required.' },
  { question: 'What is the Alpha Engine?', answer: 'Our Alpha Engine is a real-time market intelligence system that monitors millions of on-chain events. It sends you instant alerts for whale trades ($100+), swarm activity (20+ traders moving together), new markets, and 15%+ price swings—giving you the edge before the crowd moves.' },
  { question: 'Is my wallet secure?', answer: 'PredictBot uses HashiCorp Vault with AES-256-GCM encryption for all wallets. Your private keys are fully encrypted and you maintain complete control. It\'s non-custodial—we never have access to your funds.' },
  { question: 'Can I create my own markets?', answer: 'Yes! Launch custom prediction markets in 60 seconds. Choose USDC or SOL as collateral, set initial liquidity ($1-$10,000), customize duration (7-90 days), and earn creator fees when others trade your market.' },
  { question: 'What is $PBOT and how do I earn?', answer: '$PBOT is the protocol token. Stake your $PBOT to earn 60% of all platform commissions and revenue, plus 10% of creator fees. It\'s passive income from platform growth—no active trading required.' },
  { question: 'What markets can I trade?', answer: 'Browse 503+ live markets across politics (elections, policy decisions), crypto (price predictions, token launches), sports (game outcomes, championships), and tech (product releases, company milestones). New markets added daily.' },
  { question: 'How do I track my positions?', answer: 'View all active positions directly in Telegram with one click. See your YES/NO bets, current PnL, and exit positions instantly. Plus, get beautiful shareable PnL cards for Twitter, Discord, and Telegram.' },
  { question: 'Where does the liquidity come from?', answer: 'Markets on PredictBot have liquidity from two sources: (1) Market creators who provide initial liquidity when launching a market, and (2) Other traders who add liquidity by placing opposing bets. All markets are powered by PNP Protocol\'s decentralized prediction market infrastructure on Solana.' },
  { question: 'What protocols does PredictBot support?', answer: 'PredictBot is currently built on PNP Protocol (Parimutuel Network Protocol) on Solana. We have plans to expand to BetDex (Monaco Protocol) in the near future, giving you access to even more prediction markets and deeper liquidity across multiple protocols.' },
  { question: 'What are the trading fees?', answer: 'PredictBot charges a 1% fee on trades made in private chats and a 2% fee on trades made in group chats. These fees support platform development and contribute to the revenue share distributed to $PBOT stakers.' },
]

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function Sparkline({ points }) {
  const w = 120
  const h = 36
  const max = Math.max(...points)
  const min = Math.min(...points)
  const step = w / (points.length - 1)
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - ((p - min) / (max - min || 1)) * (h - 4) - 2).toFixed(1)}`)
    .join(' ')
  return (
    <svg className="lp-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Fades sections in as they scroll into view; no-ops for reduced-motion users
function Reveal({ as = 'div', className = '', children, ...rest }) {
  const Tag = as
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        io.disconnect()
      }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`lp-reveal ${shown ? 'is-in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <div className="lp-head">
      {eyebrow && <span className="lp-eyebrow">{eyebrow}</span>}
      <h2 className="lp-h2">{title}</h2>
      {subtitle && <p className="lp-sub">{subtitle}</p>}
    </div>
  )
}

function App() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeCat, setActiveCat] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % CHAT.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copyCa = async () => {
    try {
      await navigator.clipboard.writeText(PBOT_CA)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked; address stays selectable on the page
    }
  }

  const closeMenu = () => setMenuOpen(false)
  const visibleMarkets = activeCat ? SAMPLE_MARKETS.filter((m) => m.cat === activeCat) : SAMPLE_MARKETS

  return (
    <div className="lp">
      {/* Nav */}
      <header className={`lp-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo" onClick={closeMenu}>
            <img src={LOGO_URL} alt="PredictBot" />
          </Link>

          <nav className={`lp-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary">
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#alpha" onClick={closeMenu}>Alpha Engine</a>
            <a href="#groups" onClick={closeMenu}>Leaderboards</a>
            <a href="#pbot" onClick={closeMenu}>$PBOT</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
            <Link to="/stake" onClick={closeMenu}>Stake</Link>
            <Link to="/docs" onClick={closeMenu}>Docs</Link>
            <div className="lp-links-cta">
              <a href={PBOT_BUY_URL} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-ghost">Buy $PBOT</a>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-primary">Open in Telegram</a>
            </div>
          </nav>

          <div className="lp-nav-right">
            <a href="https://x.com/PredictBotSol" target="_blank" rel="noopener noreferrer" className="lp-icon-btn" aria-label="X (Twitter)"><XIcon /></a>
            <a href="https://t.me/PredictBotSol" target="_blank" rel="noopener noreferrer" className="lp-icon-btn" aria-label="Telegram"><MessageCircle size={18} /></a>
            <button className="lp-icon-btn lp-burger" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-glow lp-glow-a" aria-hidden="true" />
          <div className="lp-glow lp-glow-b" aria-hidden="true" />
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-copy">
              <span className="lp-pill"><span className="lp-dot" /> Built on Solana · Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer">TokenOS</a></span>
              <h1 className="lp-h1">Trade the future.<br /><span className="lp-grad">Right inside Telegram.</span></h1>
              <p className="lp-lead">
                Bet YES or NO on 503+ real-world markets, track every position, and get instant alerts when smart money moves. No sign-ups, no apps, no credit card.
              </p>
              <div className="lp-cta-row">
                <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-primary lp-btn-lg">
                  Start Trading on Telegram <ArrowRight size={18} />
                </a>
                <a href="#how" className="lp-btn lp-btn-outline lp-btn-lg">See how it works</a>
              </div>
              <ul className="lp-trust">
                <li><ShieldCheck size={16} /> Non-custodial</li>
                <li><Zap size={16} /> Trade in 30 seconds</li>
                <li><Users size={16} /> 1% fee in DMs</li>
              </ul>
            </div>

            <div className="lp-hero-visual">
              <div className="lp-phone" aria-label="PredictBot chat preview">
                <div className="lp-phone-bar"><span>9:41</span><span className="lp-phone-notch" /></div>
                <div className="lp-chat-head">
                  <ChevronLeft size={20} className="lp-chat-back" />
                  <span className="lp-avatar" />
                  <span className="lp-chat-name">PredictBot <small>bot</small></span>
                </div>
                <div className="lp-chat">
                  {CHAT.slice(0, currentMessage + 1).map((msg, idx) => (
                    <div key={idx} className="lp-msg">
                      {msg.type === 'user' && <div className="lp-bubble lp-bubble-user">{msg.text}</div>}
                      {(msg.type === 'bot' || msg.type === 'category') && <div className="lp-bubble lp-bubble-bot">{msg.text}</div>}
                      {msg.type === 'selection' && <div className="lp-bubble lp-bubble-select">{msg.text}</div>}
                      {msg.type === 'market' && <div className="lp-bubble lp-bubble-bot lp-bubble-market">{msg.text}</div>}
                      {msg.type === 'bet' && <div className="lp-bet">{msg.text}</div>}
                      {msg.type === 'confirmation' && (
                        <div className="lp-bubble lp-bubble-ok"><Check size={16} /> {msg.text}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="lp-chat-input"><span>Message</span><span className="lp-send"><Send size={16} /></span></div>
              </div>

              <div className="lp-float lp-float-a">
                <span className="lp-float-tag">Whale alert</span>
                <strong>$1,500 YES</strong>
                <small>SOL &gt; $400</small>
              </div>
              <div className="lp-float lp-float-b">
                <span className="lp-float-tag lp-up">Position opened</span>
                <strong>+85%</strong>
                <small>PnL card ready to share</small>
              </div>
            </div>
          </div>

          {/* Alert ticker */}
          <div className="lp-ticker" aria-label="Sample alert feed">
            <div className="lp-ticker-track">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span className="lp-ticker-item" key={i}>
                  <t.icon size={14} /> <b>{t.tag}</b> {t.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats band */}
        <Reveal as="section" className="lp-stats">
          <div className="lp-container lp-stats-grid">
            <div><strong>503+</strong><span>Live markets</span></div>
            <div><strong>&lt;30s</strong><span>To your first trade</span></div>
            <div><strong>1%</strong><span>Private chat fee</span></div>
            <div><strong>60%</strong><span>Revenue to stakers</span></div>
          </div>
        </Reveal>

        {/* How it works */}
        <section className="lp-section" id="how">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="New to prediction markets?"
                title="Turn your opinion into a position."
                subtitle="A prediction market lets you trade on what you think will happen. If you're right, you profit. Here's how it works on PredictBot."
              />
            </Reveal>
            <div className="lp-steps">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} className="lp-card lp-step" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="lp-step-n">{s.n}</span>
                  <span className="lp-ico"><s.icon size={22} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Markets preview */}
        <section className="lp-section lp-section-tint">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="Markets"
                title="Politics. Crypto. Sports. Tech."
                subtitle="Browse 503+ live markets, with new ones added daily. Example markets shown below for illustration."
              />
              <div className="lp-cats" role="tablist" aria-label="Market categories">
                <button className={`lp-chip ${activeCat === null ? 'is-on' : ''}`} onClick={() => setActiveCat(null)}>All</button>
                {CATEGORIES.map((c) => (
                  <button key={c} className={`lp-chip ${activeCat === c ? 'is-on' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
                ))}
              </div>
            </Reveal>
            <div className="lp-markets">
              {visibleMarkets.length === 0 && (
                <p className="lp-empty">Plenty of {activeCat} markets live in the bot. <a href={BOT_URL} target="_blank" rel="noopener noreferrer">Open Telegram to browse.</a></p>
              )}
              {visibleMarkets.map((m) => (
                <a key={m.q} href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-card lp-market">
                  <div className="lp-market-top">
                    <span className="lp-tag">{m.cat}</span>
                    <Sparkline points={m.trend} />
                  </div>
                  <h3>{m.q}</h3>
                  <div className="lp-odds">
                    <span className="lp-yes">YES <b>{m.yes}¢</b></span>
                    <span className="lp-no">NO <b>{100 - m.yes}¢</b></span>
                  </div>
                  <div className="lp-bar"><i style={{ width: `${m.yes}%` }} /></div>
                </a>
              ))}
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-card lp-market lp-market-more">
                <span className="lp-ico"><ArrowRight size={22} /></span>
                <h3>Browse all 503+ markets</h3>
                <p>Open the bot and pick a side.</p>
              </a>
            </div>
          </div>
        </section>

        {/* Alpha Engine */}
        <section className="lp-section" id="alpha">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="Alpha Engine"
                title="We watch the noise. You get the signal."
                subtitle="Our Alpha Engine parses millions of on-chain events in real-time. Whale alerts, swarm detection, and price swings delivered instantly to Telegram."
              />
            </Reveal>

            <Reveal className="lp-flow">
              <div className="lp-card lp-flow-col">
                <h3>Live Solana Activity <em>Streaming</em></h3>
                <ul className="lp-feed">
                  <li><code>tx: 4f...aK2</code><span>swap: $150</span></li>
                  <li><code>tx: 8z...6QZ</code><span>bet: $50 (YES)</span></li>
                  <li><code>tx: vf...7Dy</code><span>program.call</span></li>
                  <li><code>tx: fk...1z9</code><span>bet: $25 (NO)</span></li>
                  <li className="is-hot"><code>tx: 9n...wK4</code><span>$100,000 (YES)</span></li>
                  <li><code>tx: 2m...2n8</code><span>stake: 1,300 SOL</span></li>
                </ul>
              </div>
              <div className="lp-flow-mid" aria-hidden="true">
                <span className="lp-flow-line" />
                <span className="lp-flow-core"><Zap size={22} /></span>
                <span className="lp-flow-line" />
                <small>Filtering</small>
              </div>
              <div className="lp-card lp-flow-col">
                <h3>Your PredictBot Alerts <em>Real-time</em></h3>
                <ul className="lp-alerts">
                  <li><TrendingUp size={18} /><div><b>Large whale</b><span>$1,500 "YES" bet on SOL &gt; $400 market</span></div></li>
                  <li><AlertCircle size={18} /><div><b>Swarm detected</b><span>23 traders betting YES in 60 seconds</span></div></li>
                  <li><Bell size={18} /><div><b>New market</b><span>"Will Trump win 2024?" just launched</span></div></li>
                  <li><Zap size={18} /><div><b>Price swing</b><span>BTC $100k market moved +18% in 5 min</span></div></li>
                </ul>
              </div>
            </Reveal>

            <div className="lp-grid-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} className="lp-card lp-feature" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                  <div className="lp-feature-top">
                    <span className="lp-ico"><f.icon size={22} /></span>
                    <span className="lp-tag">{f.badge}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Groups & leaderboards */}
        <section className="lp-section lp-section-tint" id="groups">
          <div className="lp-container lp-split">
            <Reveal className="lp-split-copy">
              <span className="lp-eyebrow">Leaderboards</span>
              <h2 className="lp-h2 lp-left">Bet against your friends.</h2>
              <p className="lp-sub lp-left">
                Turn any Telegram group into a competitive prediction market and see who is best at calling it.
              </p>
              <ul className="lp-checks">
                {GROUP_FEATURES.map((g) => (
                  <li key={g.title}>
                    <span className="lp-check"><Check size={14} /></span>
                    <div><b>{g.title}</b><span>{g.text}</span></div>
                  </li>
                ))}
              </ul>
              <p className="lp-fine">1% fee on private chat trades • 2% fee on group chat trades</p>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-primary lp-btn-lg">Add to Your Group <ArrowRight size={18} /></a>
            </Reveal>

            <Reveal className="lp-card lp-board">
              <div className="lp-board-head">
                <span><Trophy size={18} /> Group leaderboard</span>
                <small>Weekly · example</small>
              </div>
              <ol>
                {LEADERBOARD.map((r) => (
                  <li key={r.rank} className={r.name === 'you?' ? 'is-you' : ''}>
                    <span className="lp-rank">{r.rank}</span>
                    <span className="lp-user">{r.name}</span>
                    <span className="lp-rate">{r.rate}</span>
                    <span className={`lp-pnl ${r.pnl.startsWith('+') ? 'is-up' : ''}`}>{r.pnl}</span>
                  </li>
                ))}
              </ol>
              <div className="lp-board-foot"><span>Rank</span><span>Trader</span><span>Win rate</span><span>PnL</span></div>
            </Reveal>
          </div>
        </section>

        {/* PnL cards */}
        <section className="lp-section">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="Share your calls"
                title="Track your PnL. Share your wins."
                subtitle="Beautiful, branded PnL cards for every trade. Perfect for sharing on Twitter, Discord, and Telegram."
              />
            </Reveal>
            <div className="lp-pnl-grid">
              <Reveal className="lp-card lp-pnl-card">
                <img src={profitImage} alt="Example profit PnL card" loading="lazy" />
                <div className="lp-pnl-meta">
                  <strong className="is-up">+$152.50 (+85%)</strong>
                  <span>Professional profit cards with PredictBot branding. Share your wins anywhere.</span>
                </div>
              </Reveal>
              <Reveal className="lp-card lp-pnl-card" style={{ transitionDelay: '80ms' }}>
                <img src={lossImage} alt="Example loss PnL card" loading="lazy" />
                <div className="lp-pnl-meta">
                  <strong className="is-down">-$75.00 (-50%)</strong>
                  <span>Meme-ready loss cards. Perfect for social sharing (16:9 ratio).</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="lp-section lp-section-tint">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="Security"
                title="Non-custodial. Your keys, your funds."
                subtitle="Industry-standard encryption with full control in your hands."
              />
            </Reveal>
            <div className="lp-grid-2">
              <Reveal className="lp-card lp-feature">
                <span className="lp-ico"><ShieldCheck size={22} /></span>
                <h3>Encrypted Wallets</h3>
                <p>HashiCorp Vault AES-256-GCM encryption. Your private keys are fully encrypted and secure.</p>
              </Reveal>
              <Reveal className="lp-card lp-feature" style={{ transitionDelay: '80ms' }}>
                <span className="lp-ico"><Zap size={22} /></span>
                <h3>Lightning-Fast Performance</h3>
                <p>Redis caching and PostgreSQL database. Reliable position tracking with sub-second response times.</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* $PBOT */}
        <section className="lp-section" id="pbot">
          <div className="lp-container">
            <Reveal>
              <SectionHead
                eyebrow="$PBOT"
                title="Stake $PBOT. Earn real revenue."
                subtitle="$PBOT stakers receive a direct share of PredictBot's revenue streams. Passive income from platform growth."
              />
            </Reveal>
            <div className="lp-grid-2">
              <Reveal className="lp-card lp-pbot">
                <div className="lp-big">60%</div>
                <h3>Commissions &amp; Revenue</h3>
                <p>60% of all platform commissions and revenue distributed directly to $PBOT stakers.</p>
              </Reveal>
              <Reveal className="lp-card lp-pbot" style={{ transitionDelay: '80ms' }}>
                <div className="lp-big">10%</div>
                <h3>Creator Fees</h3>
                <p>10% of all creator fees from custom prediction markets goes to $PBOT stakers.</p>
              </Reveal>
            </div>

            <Reveal className="lp-card lp-ca">
              <div className="lp-ca-main">
                <span className="lp-ca-label">$PBOT CA</span>
                <code className="lp-ca-addr">{PBOT_CA}</code>
                <button className="lp-icon-btn" onClick={copyCa} aria-label="Copy contract address">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="lp-ca-links">
                <a href="https://dexscreener.com/solana/9scxsknudrqe9magejtsvsuxxjprq6kmsptm9pgpwhzc" target="_blank" rel="noopener noreferrer">DexScreener</a>
                <a href={`https://www.dextools.io/app/en/solana/pair-explorer/${PBOT_CA}`} target="_blank" rel="noopener noreferrer">DexTools</a>
                <a href={`https://gmgn.ai/sol/token/${PBOT_CA}`} target="_blank" rel="noopener noreferrer">GMGN</a>
                <Link to="/stake" className="lp-btn lp-btn-primary">Stake $PBOT</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Partners */}
        <section className="lp-section lp-partners">
          <div className="lp-container">
            <Reveal>
              <p className="lp-partners-label">Built on industry-leading infrastructure</p>
              <div className="lp-partner-row">
                {PARTNERS.map((p) => {
                  const inner = (<><b>{p.name}</b><span>{p.text}</span></>)
                  return p.href
                    ? <a key={p.name} className="lp-partner" href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                    : <div key={p.name} className="lp-partner">{inner}</div>
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section" id="faq">
          <div className="lp-container lp-narrow">
            <Reveal>
              <SectionHead eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything you need to know about PredictBot." />
            </Reveal>
            <div className="lp-faq">
              {FAQS.map((faq, index) => {
                const open = openFaqIndex === index
                return (
                  <div key={faq.question} className={`lp-faq-item ${open ? 'is-open' : ''}`}>
                    <button
                      className="lp-faq-q"
                      onClick={() => setOpenFaqIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`faq-${index}`}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={20} />
                    </button>
                    <div className="lp-faq-a" id={`faq-${index}`} role="region">
                      <div><p>{faq.answer}</p></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="lp-section">
          <div className="lp-container">
            <Reveal className="lp-final">
              <div className="lp-glow lp-glow-c" aria-hidden="true" />
              <h2 className="lp-h2">Start trading in 30 seconds.</h2>
              <p className="lp-sub">No sign-ups. No credit cards. No complex apps. Just your Telegram. 503+ markets waiting.</p>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-primary lp-btn-lg">Launch PredictBot <ArrowRight size={18} /></a>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <img src={LOGO_URL} alt="PredictBot" />
              <p>Prediction markets in your pocket. Powered by <a href="https://tokenos.ai/" target="_blank" rel="noopener noreferrer">TokenOS</a>. Built on Solana.</p>
              <div className="lp-footer-social">
                <a href="https://x.com/PredictBotSol" target="_blank" rel="noopener noreferrer" className="lp-icon-btn" aria-label="X (Twitter)"><XIcon /></a>
                <a href="https://t.me/PredictBotSol" target="_blank" rel="noopener noreferrer" className="lp-icon-btn" aria-label="Telegram"><MessageCircle size={18} /></a>
              </div>
            </div>
            <div>
              <h4>Product</h4>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer">Open the bot</a>
              <a href="#how">How it works</a>
              <a href="#alpha">Alpha Engine</a>
              <a href="#groups">Leaderboards</a>
            </div>
            <div>
              <h4>$PBOT</h4>
              <Link to="/stake">Stake</Link>
              <a href={PBOT_BUY_URL} target="_blank" rel="noopener noreferrer">Buy $PBOT</a>
              <a href="#pbot">Revenue share</a>
            </div>
            <div>
              <h4>Resources</h4>
              <Link to="/docs">Docs</Link>
              <a href="#faq">FAQ</a>
              <a href="https://t.me/PredictBotSol" target="_blank" rel="noopener noreferrer">Community</a>
            </div>
          </div>
          <p className="lp-risk">
            Prediction markets involve risk, including the loss of funds. Only trade with money you can afford to lose. PredictBot does not provide financial advice, and past performance is not indicative of future results.
          </p>
          <p className="lp-copy">© {new Date().getFullYear()} PredictBot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
