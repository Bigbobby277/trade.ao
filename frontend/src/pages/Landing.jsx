import { Link } from "react-router-dom";
import SignalStrip from "../components/SignalStrip.jsx";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <header className="nav">
        <div className="container nav__inner">
          <div className="nav__logo">
            Trader<span>.ai</span>
          </div>
          <nav className="nav__links">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link to="/login">Sign in</Link>
          </nav>
          <Link to="/signup" className="btn btn-primary">
            Get Access
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="container hero__inner">
          <p className="eyebrow">AI market interpretation, not just data</p>
          <h1>
            The market moves on <em>interpretation</em>, not headlines.
          </h1>
          <p className="hero__sub">
            Trader.ai reads every market-moving headline the instant it drops and tells you what it
            actually means for price — bias, affected assets, and why — before the crowd finishes
            reading the tweet.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn btn-primary">
              Start Free Trial
            </Link>
            <a href="#how" className="btn btn-ghost">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <SignalStrip />

      <section className="split" id="how">
        <div className="container split__inner">
          <div className="split__col">
            <span className="eyebrow">Raw data</span>
            <h3>Headlines pile up faster than you can read them</h3>
            <p>
              Central bank statements, earnings, geopolitical flashpoints — dozens of items an hour,
              each one a maybe. Reading them all doesn't tell you which ones matter.
            </p>
          </div>
          <div className="split__arrow">→</div>
          <div className="split__col split__col--accent">
            <span className="eyebrow">Actionable insight</span>
            <h3>One line: what it means, and for what</h3>
            <p>
              Trader.ai's engine ranks impact, tags sentiment, and names the exact instruments in
              play — the moment the headline lands, not five minutes into your own research.
            </p>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="container">
          <h2>How the engine works</h2>
          <div className="how__grid">
            <div className="how__step">
              <span className="how__label">Ingest</span>
              <h4>Pulls live market news continuously</h4>
              <p>News, data releases, and central bank commentary are collected as they publish.</p>
            </div>
            <div className="how__step">
              <span className="how__label">Interpret</span>
              <h4>AI reads each item for market impact</h4>
              <p>Every headline is scored for impact and sentiment, and mapped to the assets it moves.</p>
            </div>
            <div className="how__step">
              <span className="how__label">Deliver</span>
              <h4>You get a tagged, ranked feed</h4>
              <p>No extra reading. Bias and reasoning arrive attached to the headline itself.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="compare">
        <div className="container compare__inner">
          <div className="compare__card">
            <h4>Signal services</h4>
            <ul>
              <li>Instructions with no reasoning</li>
              <li>Breaks when conditions shift</li>
              <li>Builds dependency, not skill</li>
            </ul>
          </div>
          <div className="compare__card compare__card--accent">
            <h4>Trader.ai</h4>
            <ul>
              <li>Explains why price is moving</li>
              <li>Works across changing conditions</li>
              <li>You keep the understanding</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="container pricing__inner">
          <h2>Start trading with clarity</h2>
          <div className="pricing__card">
            <div className="pricing__price">
              $39<span>/month</span>
            </div>
            <ul>
              <li>Live AI-tagged headline feed</li>
              <li>Bias &amp; sentiment per instrument</li>
              <li>Economic calendar with AI context</li>
              <li>Cancel anytime</li>
            </ul>
            <Link to="/signup" className="btn btn-primary">
              Get Access
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Trader.ai — AI-powered market interpretation. Not investment advice.</p>
        </div>
      </footer>
    </div>
  );
}
