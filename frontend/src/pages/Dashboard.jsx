import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "./Dashboard.css";

export default function Dashboard() {
  const [headlines, setHeadlines] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    api
      .me()
      .then((d) => setUser(d.user))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
    api
      .news()
      .then((d) => setHeadlines(d.headlines))
      .catch((err) => setError(err.message));
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="dash">
      <header className="dash__nav">
        <div className="container dash__nav-inner">
          <Link to="/" className="nav__logo">
            Trader<span>.ai</span>
          </Link>
          <div className="dash__user">
            {user?.subscription?.status !== "active" && (
              <Link to="/pricing" className="btn btn-primary btn-sm">
                Upgrade
              </Link>
            )}
            <span className="dash__email">{user?.email}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container dash__main">
        <h1>Live feed</h1>
        {error && <p className="dash__error">Couldn't load the feed: {error}</p>}
        {!error && headlines.length === 0 && (
          <p className="dash__empty">
            No analyzed headlines yet — the backend refreshes every 5 minutes once it's running.
          </p>
        )}
        <div className="dash__list">
          {headlines.map((h) => (
            <div className="dash__item" key={h._id || h.sourceUrl}>
              <div className="dash__item-top">
                <span className={`tag tag-${h.analysis.sentiment}`}>{h.analysis.sentiment}</span>
                <span className="dash__impact">{h.analysis.impact} impact</span>
                <span className="dash__source">{h.source}</span>
              </div>
              <h4>{h.title}</h4>
              <p>{h.analysis.summary}</p>
              <div className="dash__assets">
                {h.analysis.affectedAssets?.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
