import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "./Landing.css";
import "./Pricing.css";

export default function Pricing() {
  const [plan, setPlan] = useState("monthly");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleCheckout() {
    if (!localStorage.getItem("token")) {
      navigate("/signup");
      return;
    }
    try {
      const { url } = await api.checkout(plan);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="landing">
      <header className="nav">
        <div className="container nav__inner">
          <Link to="/" className="nav__logo">
            Trader<span>.ai</span>
          </Link>
          <div />
          <Link to="/dashboard" className="btn btn-ghost">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="pricing">
        <div className="container pricing__inner">
          <h2>Choose your plan</h2>
          <div className="plan-toggle">
            <button
              className={plan === "monthly" ? "active" : ""}
              onClick={() => setPlan("monthly")}
            >
              Monthly
            </button>
            <button className={plan === "annual" ? "active" : ""} onClick={() => setPlan("annual")}>
              Annual — save 17%
            </button>
          </div>
          <div className="pricing__card">
            <div className="pricing__price">
              {plan === "monthly" ? "$39" : "$32.50"}
              <span>/month</span>
            </div>
            {error && <div className="auth__error">{error}</div>}
            <ul>
              <li>Live AI-tagged headline feed</li>
              <li>Bias &amp; sentiment per instrument</li>
              <li>Economic calendar with AI context</li>
              <li>Cancel anytime</li>
            </ul>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Continue to checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
