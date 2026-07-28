/* ──────────────────────────────────────────────
   Screening.tsx — Screening Tab
   This page will hold mental health screening
   tools and assessments
────────────────────────────────────────────── */
import { Link } from "react-router-dom";
import "./Screening.css";

function Screening() {
  return (
    /* ── Screening tab ── */
    <section className = "screening">
      <h1 className="coming-soon-heading">SCREENING</h1>
      <p className="coming-soon-label">
        Choose one of the screenings below to better understand your current mental well-being.
      </p>
      <div className="screening-cards">
        <Link to="/screening/anxiety" className="screening-card">
          <h2 className="screening-title">Anxiety Test</h2>
          <div className="screening-overlay">
            <p className="screening-description">
              Evaluate common symptoms of anxiety and gain insight into how they may
              be affecting your daily life. Estimated time: 5 to 10 minutes
            </p>
            
          </div>
        </Link>
        <Link to="/screening/depression" className="screening-card">
          <h2 className="screening-title">Depression Test</h2>
          <div className="screening-overlay">
            <p className="screening-description">
              Evaluate signs of depression and understand 
              whether your symptoms may benefit from further attention.
              Estimated time: 5 to 10 minutes
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default Screening
