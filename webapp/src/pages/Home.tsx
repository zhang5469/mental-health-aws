/* ──────────────────────────────────────────────
   Home.tsx — Home Tab
   The main landing page. Shows the hero heading
   and the Quote of the Day section.
────────────────────────────────────────────── */
import DailyQuote from "../components/Daily_Quote";
function Home() {
  return (
    /* ── Home page hero section ── */
    <section className="hero">

      {/* Main heading — "better way" is in Dancing Script cursive */}
      <h1 className="hero-heading">
        The <em>better way</em> for people<br />to find a Provider
      </h1>

      {/* Quote of the day block — DailyQuote rotates through the
          quotes list automatically, one per day */}
      <div className="quote-section">
        <h2 className="quote-title">Quote of the day</h2>
        <DailyQuote />
      </div>

    </section>
  )
}

export default Home
