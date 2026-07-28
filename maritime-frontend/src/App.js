import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import AuthPage from "./components/Authpage.jsx";
import Dashboard from "./components/Dashboard";
import MarketingPage from "./components/MarketingPage";
import "./App.css";

function getStoredUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, "=")));
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role, token };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState(() => window.location.pathname.slice(1) || "landing");
  const [user, setUser] = useState(getStoredUser);

  const handleAuth = (userData) => {
    setUser(userData);
    window.history.pushState({}, "", "/dashboard");
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.history.pushState({}, "", "/");
    setPage("landing");
  };
  const navigate = (next) => { window.history.pushState({}, "", next === "landing" ? "/" : `/${next}`); setPage(next); window.scrollTo(0, 0); };
  useEffect(() => { const onPopState = () => setPage(window.location.pathname.slice(1) || "landing"); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);

  return (
    <>
      {page === "landing"  && <LandingPage onGetStarted={() => navigate("auth")} onNavigate={navigate} />}
      {["features", "about", "contact"].includes(page) && <MarketingPage page={page} onBack={() => navigate("landing")} onGetStarted={() => navigate("auth")} />}
      {page === "auth"     && <AuthPage onAuth={handleAuth} />}
      {page === "dashboard"&& <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
}
