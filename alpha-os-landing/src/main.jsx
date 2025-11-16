// Polyfill Buffer for Solana libraries
import { Buffer } from 'buffer'
window.Buffer = Buffer

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Docs from './Docs.jsx'
import Staking from './Staking.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stake" element={<Staking />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
