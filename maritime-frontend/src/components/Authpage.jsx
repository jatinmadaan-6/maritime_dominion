import { useState } from "react";
import { apiUrl } from "../api/client";
import "./Product.css";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const endpoint = apiUrl(mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/signup");

    const body = mode === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      onAuth({ id: data.id, name: data.name, email: data.email, role: data.role, token: data.token });
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="auth-page" style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'Sora', sans-serif",
      background: "#f7f5ef",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Sora:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* ── LEFT PANEL — Branding ── */}
      <div style={{
        flex: 1,
        background: "linear-gradient(160deg, #122949 0%, #1d4267 60%, #31677d 100%)",
        borderRight: "1px solid rgba(255,255,255,0.16)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(180,150,80,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,150,80,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "24px", height: "24px",
            border: "1.5px solid #a9d8d1",
            transform: "rotate(45deg)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ width: "8px", height: "8px", background: "#a9d8d1" }} />
          </div>
          <span style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "12px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>Maritime Dominion</span>
        </div>

        {/* Center quote */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: "40px", height: "1px", background: "#a9d8d1", marginBottom: "32px" }} />
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "48px",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "24px",
          }}>
            Those who command<br />
            <em style={{ color: "#a9d8d1", fontWeight: 600 }}>the sea</em>,<br />
            command the world.
          </h2>
          <p style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}>
            — Maritime Intelligence System
          </p>
        </div>

        {/* Bottom decoration */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", gap: "24px",
        }}>
          {["IMO Compliant", "Real-time Logs", "Fleet Management"].map(tag => (
            <span key={tag} style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              borderLeft: "1px solid rgba(180,150,80,0.3)",
              paddingLeft: "12px",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{
        width: "480px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 64px",
        background: "#fffdf8",
      }}>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          marginBottom: "48px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {["login", "signup"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "16px",
                background: "transparent",
                border: "none",
                borderBottom: mode === m ? "2px solid #122949" : "2px solid transparent",
                color: mode === m ? "#122949" : "#8a94a2",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "-1px",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "36px",
          fontWeight: 400,
          color: "#13233d",
          margin: 0,
          marginBottom: "8px",
        }}>
          {mode === "login" ? "Welcome back." : "Create account."}
        </h1>
        <p style={{
          fontSize: "13px",
          color: "#617087",
          marginBottom: "40px",
          letterSpacing: "0.5px",
        }}>
          {mode === "login"
            ? "Sign in to access your fleet dashboard."
            : "Join Maritime Dominion today."}
        </p>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <Field label="Full Name" name="name" value={form.name}
              onChange={handleChange} onKeyDown={handleKeyDown} />
          )}
          <Field label="Email" name="email" type="email" value={form.email}
            onChange={handleChange} onKeyDown={handleKeyDown} />
          <Field label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} onKeyDown={handleKeyDown} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "rgba(220, 60, 60, 0.1)",
            border: "1px solid rgba(220,60,60,0.3)",
            color: "#ff6b6b",
            fontSize: "12px",
            letterSpacing: "0.5px",
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: "32px",
            padding: "16px",
            background: loading ? "#aab8c4" : "#122949",
            border: "none",
            color: "#fffdf8",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Sora', sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => { if (!loading) e.target.style.background = "#254e78"; }}
          onMouseLeave={e => { if (!loading) e.target.style.background = "#122949"; }}
        >
          {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Footer note */}
        <p style={{
          marginTop: "32px",
          fontSize: "11px",
          color: "#7b8794",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ color: "#254e78", cursor: "pointer", fontWeight: 600 }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

// Reusable field component
function Field({ label, name, type = "text", value, onChange, onKeyDown }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "10px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: focused ? "#254e78" : "#617087",
        marginBottom: "8px",
        transition: "color 0.2s",
      }}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "14px 0",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "#254e78" : "#d8d3c9"}`,
          color: "#13233d",
          fontSize: "14px",
          fontFamily: "'Sora', sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
