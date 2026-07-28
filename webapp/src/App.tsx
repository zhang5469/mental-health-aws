/* ──────────────────────────────────────────────
   App.tsx — Bloom App Shell
   Renders the shared layout (profile icon + navbar)
   and swaps the page content based on which tab
   the user is on, using React Router.
────────────────────────────────────────────── */

import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { UserCircle, Heart, AlertCircle } from 'lucide-react'

/* ── Page components — one per tab ── */
import Home               from './pages/Home'
import Screening          from './pages/Screening'
import Providers          from './pages/Providers'
import Resources          from './pages/Resources'
import AboutUs            from './pages/AboutUs'
import CrisisSupport      from './pages/CrisisSupport'
import Login              from './pages/Login'
import ScreeningQuestions from './pages/ScreeningQuestions.tsx'

import './App.css'

function App() {
  /* useLocation tells us the current URL path so we can highlight the active tab */
  const location = useLocation()

  return (
    /* ── Outer page wrapper — gradient background, holds all content ── */
    <div className="page">

      {/* ── Login icon — fixed to the bottom-left corner, navigates to /login ── */}
      <Link to="/login" className="login-icon">
        <UserCircle size={36} strokeWidth={1.5} />
      </Link>

      {/* ── Shared navbar — appears on every tab ── */}
      <nav className="navbar">

        {/* ── Centered group: brand + nav links sit together in the middle ── */}
        <div className="navbar-center">

          {/* Brand: heart icon + "Bloom." — clicking takes you home */}
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              <Heart size={16} fill="white" color="white" />
              <span className="brand-name">Bloom.</span>
            </Link>
          </div>

          {/* Navigation links — each Link navigates to its tab's route.
              The "active" class is added when the link matches the current URL. */}
          <ul className="navbar-links">

          {/* Home tab */}
          <li className="nav-item">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>

          {/* Screening tab */}
          <li className="nav-item">
            <Link to="/screening" className={location.pathname === '/screening' ? 'active' : ''}>
              Screening
            </Link>
          </li>

          {/* Providers tab */}
          <li className="nav-item">
            <Link to="/providers" className={location.pathname === '/providers' ? 'active' : ''}>
              Providers
            </Link>
          </li>

          {/* Resources tab */}
          <li className="nav-item">
            <Link to="/resources" className={location.pathname === '/resources' ? 'active' : ''}>
              Resources
            </Link>
          </li>

          {/* About Us tab */}
          <li className="nav-item">
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About Us
            </Link>
          </li>


        </ul>

        </div> {/* end .navbar-center */}

        {/* Crisis Support button — navigates to the /crisis page */}
        <Link to="/crisis" className="crisis-btn">
          <AlertCircle size={16} />
          Crisis Support
        </Link>

      </nav>

      {/* ── Page content — swaps based on the current tab ── */}
      <Routes>
        <Route path="/"          element={<Home />}      /> {/* Home tab */}
        <Route path="/screening" element={<Screening />} /> {/* Screening tab */}
        <Route 
          path="/screening/:screeningType"
          element={<ScreeningQuestions />}
        />
        <Route path="/providers" element={<Providers />} /> {/* Providers tab */}
        <Route path="/resources" element={<Resources />} /> {/* Resources tab */}
        <Route path="/about"     element={<AboutUs />}       /> {/* About Us tab */}
        <Route path="/crisis"    element={<CrisisSupport />} /> {/* Crisis Support tab */}
        <Route path="/login"     element={<Login />}         /> {/* Login tab */}
      </Routes>

    </div>
  )
}

export default App
