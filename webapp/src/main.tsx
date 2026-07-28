/* ──────────────────────────────────────────────
   main.tsx — App Entry Point
   Wraps the entire app in BrowserRouter so that
   React Router can handle navigation between tabs.
────────────────────────────────────────────── */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter enables tab navigation via URL paths */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
