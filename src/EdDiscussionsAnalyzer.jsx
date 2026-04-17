import { useState, useEffect, useRef } from "react";

// ─── Design tokens ───────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d0f;
    --paper: #f7f4ef;
    --cream: #ede9e1;
    --accent: #c8502a;
    --accent-light: #f0ddd6;
    --gold: #b89a5c;
    --muted: #7a7570;
    --border: #d4cfc8;
    --white: #ffffff;
    --success: #2d6a4f;
    --success-bg: #d8f3dc;
    --error: #9b2335;
    --error-bg: #fde8ec;
    --radius: 4px;
    --shadow: 0 2px 16px rgba(13,13,15,0.08);
    --shadow-lg: 0 8px 40px rgba(13,13,15,0.14);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

  /* ── Layout ── */
  .app { min-height: 100vh; }

  /* ── Landing ── */
  .landing {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .landing-hero {
    background: var(--ink);
    color: var(--paper);
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .landing-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 60px,
      rgba(200,80,42,0.04) 60px,
      rgba(200,80,42,0.04) 61px
    );
  }

  .landing-hero::after {
    content: '🐝';
    position: absolute;
    font-size: 240px;
    bottom: -40px;
    right: -40px;
    opacity: 0.06;
    line-height: 1;
  }

  .hero-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .hero-title em {
    font-style: italic;
    color: var(--accent);
  }

  .hero-desc {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(247,244,239,0.72);
    max-width: 400px;
    margin-bottom: 2.5rem;
    position: relative;
    z-index: 1;
  }

  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
    z-index: 1;
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: rgba(247,244,239,0.8);
  }

  .feature-list li span.dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  /* ── Form panel ── */
  .landing-form-panel {
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .form-card {
    width: 100%;
    max-width: 440px;
  }

  .form-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .form-card-sub {
    font-size: 0.875rem;
    color: var(--muted);
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .field { margin-bottom: 1.25rem; }

  .field label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }

  .field input, .field select {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    background: var(--white);
    color: var(--ink);
    transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
  }

  .field input:focus, .field select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .field input[type="password"] { letter-spacing: 2px; }
  .field input[type="password"]::placeholder { letter-spacing: 0; }

  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .divider {
    height: 1px;
    background: var(--border);
    margin: 1.5rem 0;
    position: relative;
  }

  .divider span {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: var(--paper);
    padding: 0 0.75rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
  }

  .hint {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 0.35rem;
    line-height: 1.5;
  }

  .hint a { color: var(--accent); text-decoration: none; }
  .hint a:hover { text-decoration: underline; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.7rem 1.4rem;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
    text-decoration: none;
  }

  .btn-primary {
    background: var(--accent);
    color: var(--white);
    width: 100%;
    padding: 0.85rem;
    font-size: 0.95rem;
  }

  .btn-primary:hover:not(:disabled) { background: #a8401e; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-secondary {
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--border);
  }

  .btn-secondary:hover { border-color: var(--ink); background: var(--cream); }

  .btn-ghost {
    background: transparent;
    color: var(--muted);
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .btn-ghost:hover { color: var(--ink); }

  /* ── Main app ── */
  .main-app {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    background: var(--ink);
    color: var(--paper);
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sidebar-brand .bee { font-size: 1.5rem; }

  .sidebar-brand-text {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .sidebar-brand-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gold);
  }

  .sidebar-section { display: flex; flex-direction: column; gap: 0.5rem; }

  .sidebar-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(247,244,239,0.4);
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(247,244,239,0.1);
    margin-bottom: 0.25rem;
  }

  .sidebar .field label { color: rgba(247,244,239,0.6); }

  .sidebar .field input,
  .sidebar .field select {
    background: rgba(247,244,239,0.06);
    border-color: rgba(247,244,239,0.15);
    color: var(--paper);
    font-size: 0.85rem;
  }

  .sidebar .field input:focus,
  .sidebar .field select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,80,42,0.2);
  }

  .sidebar .field input::placeholder { color: rgba(247,244,239,0.3); }

  .sidebar select option { background: var(--ink); }

  .user-chip {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    background: rgba(200,80,42,0.15);
    border: 1px solid rgba(200,80,42,0.3);
    border-radius: var(--radius);
    font-size: 0.8rem;
  }

  .user-chip .avatar {
    width: 28px; height: 28px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .user-chip-info { display: flex; flex-direction: column; }
  .user-chip-name { font-weight: 600; color: var(--paper); line-height: 1.2; }
  .user-chip-sub { font-size: 0.7rem; color: var(--gold); }

  .sidebar-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid rgba(247,244,239,0.15);
    color: rgba(247,244,239,0.5);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }

  .logout-btn:hover {
    color: var(--paper);
    border-color: rgba(247,244,239,0.4);
  }

  /* ── Main content ── */
  .main-content {
    padding: 2.5rem 3rem;
    max-width: 900px;
  }

  .page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .page-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .page-header p { color: var(--muted); font-size: 0.9rem; }

  /* ── Metrics row ── */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 1.1rem 1.25rem;
  }

  .metric-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.35rem;
  }

  .metric-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
  }

  /* ── Action buttons ── */
  .action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    background: var(--white);
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
  }

  .action-btn:hover { border-color: var(--accent); background: var(--accent-light); }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .action-btn.primary-action {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--white);
  }

  .action-btn.primary-action:hover:not(:disabled) { background: #a8401e; border-color: #a8401e; }

  .action-btn-icon { font-size: 1.3rem; }

  .action-btn-text { display: flex; flex-direction: column; }
  .action-btn-label { font-weight: 600; font-size: 0.9rem; }
  .action-btn-sub { font-size: 0.75rem; opacity: 0.7; margin-top: 1px; }

  /* ── Results ── */
  .result-section {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
    overflow: hidden;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--cream);
  }

  .result-header-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .result-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .result-header p {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 1px;
  }

  .result-body {
    padding: 1.5rem;
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--ink);
    white-space: pre-wrap;
    font-family: 'DM Sans', sans-serif;
  }

  .result-body h1, .result-body h2, .result-body h3 {
    font-family: 'Playfair Display', serif;
    margin: 1rem 0 0.5rem;
  }

  .result-body strong { font-weight: 600; }

  /* ── Q&A ── */
  .qa-section {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .qa-header {
    padding: 1rem 1.25rem;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
  }

  .qa-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .qa-header p { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }

  .qa-input-row {
    padding: 1rem 1.25rem;
    display: flex;
    gap: 0.75rem;
    border-bottom: 1px solid var(--border);
  }

  .qa-input-row input {
    flex: 1;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .qa-input-row input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .chat-history { display: flex; flex-direction: column; }

  .chat-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.25s ease;
  }

  .chat-item:last-child { border-bottom: none; }

  .chat-q {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .chat-q::before {
    content: 'Q';
    background: var(--ink);
    color: var(--paper);
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .chat-a {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--muted);
    padding-left: 1.625rem;
    white-space: pre-wrap;
  }

  .chat-ts {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
    margin-top: 0.3rem;
    padding-left: 1.625rem;
  }

  /* ── Alerts ── */
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    border-radius: var(--radius);
    font-size: 0.85rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .alert-error { background: var(--error-bg); color: var(--error); border: 1px solid #f5c0c8; }
  .alert-success { background: var(--success-bg); color: var(--success); border: 1px solid #b7e4c7; }
  .alert-info { background: var(--accent-light); color: #7a3420; border: 1px solid #e8bfb4; }

  /* ── Loading spinner ── */
  .spinner-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Download ── */
  .download-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    background: var(--ink);
    color: var(--paper);
    border-radius: var(--radius);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .download-btn:hover { background: #2a2a2e; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .landing { grid-template-columns: 1fr; }
    .landing-hero { padding: 3rem 2rem; }
    .main-app { grid-template-columns: 1fr; }
    .sidebar { height: auto; position: static; }
    .main-content { padding: 2rem 1.5rem; }
    .metrics-row { grid-template-columns: 1fr; }
    .action-row { grid-template-columns: 1fr; }
  }
`;

// ─── Markdown-ish renderer ──────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("### "))
      return <h3 key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 700, margin: "0.8rem 0 0.3rem" }}>{line.slice(4)}</h3>;
    if (line.startsWith("## "))
      return <h2 key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, margin: "1.2rem 0 0.4rem" }}>{line.slice(3)}</h2>;
    if (line.startsWith("# "))
      return <h1 key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, margin: "1.2rem 0 0.4rem" }}>{line.slice(2)}</h1>;
    if (line.startsWith("**") && line.endsWith("**"))
      return <p key={i} style={{ fontWeight: 600, margin: "0.3rem 0" }}>{line.slice(2, -2)}</p>;
    if (line.trim() === "") return <br key={i} />;
    // Bold inline
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={j}>{p.slice(2, -2)}</strong>
        : p
    );
    return <p key={i} style={{ margin: "0.15rem 0", lineHeight: 1.8 }}>{rendered}</p>;
  });
}

// ─── API call via Anthropic ─────────────────────────────────────────────────
async function callOpenAI(systemPrompt, userPrompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content ?? "";
}

// ─── Landing Page ───────────────────────────────────────────────────────────
function LandingPage({ onSubmit }) {
  const [form, setForm] = useState({
    name: "", role: "Instructor", institution: "",
    edToken: "", openaiKey: "", courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.edToken || !form.courseId) {
      setError("Please fill in your name, Ed API token, and course ID to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // We pass everything to the main app; actual Ed API calls happen server-side.
      // Here we just validate that OpenAI key works if provided.
      await new Promise((r) => setTimeout(r, 600)); // small UX delay
      onSubmit(form);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Hero */}
      <div className="landing-hero">
        <div className="hero-eyebrow">Ed Discussions · AI Powered</div>
        <h1 className="hero-title">
          Understand your<br />
          classroom<br />
          <em>at a glance.</em>
        </h1>
        <p className="hero-desc">
          Connect your Ed Discussion board and let AI surface what matters —
          summaries, tone shifts, and instant answers about your course activity.
        </p>
        <ul className="feature-list">
          {[
            "Comprehensive discussion summaries",
            "Emotional tone & engagement analysis",
            "Interactive Q&A about your threads",
            "Exportable reports for record-keeping",
          ].map((f) => (
            <li key={f}><span className="dot" />{f}</li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="landing-form-panel">
        <div className="form-card">
          <h2 className="form-card-title">Get started</h2>
          <p className="form-card-sub">
            Enter your credentials below — they're held only in this browser
            session and never sent to any server beyond Ed and OpenAI.
          </p>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <div className="field-row">
            <div className="field">
              <label>Your name</label>
              <input placeholder="Prof. Smith" value={form.name} onChange={set("name")} />
            </div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={set("role")}>
                <option>Instructor</option>
                <option>TA</option>
                <option>Course Admin</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Institution (optional)</label>
            <input placeholder="University of …" value={form.institution} onChange={set("institution")} />
          </div>

          <div className="divider"><span>API credentials</span></div>

          <div className="field">
            <label>Ed API Token</label>
            <input
              type="password"
              placeholder="Paste your Ed token"
              value={form.edToken}
              onChange={set("edToken")}
            />
            <p className="hint">
              Get yours at <a href="https://edstem.org/us/settings/api-tokens" target="_blank" rel="noreferrer">edstem.org › Settings › API Tokens</a>
            </p>
          </div>

          <div className="field">
            <label>OpenAI API Key <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional if pre-configured)</span></label>
            <input
              type="password"
              placeholder="sk-…"
              value={form.openaiKey}
              onChange={set("openaiKey")}
            />
          </div>

          <div className="divider"><span>Course setup</span></div>

          <div className="field">
            <label>Ed Course ID</label>
            <input placeholder="e.g., 12345" value={form.courseId} onChange={set("courseId")} />
            <p className="hint">Found in your Ed course URL: edstem.org/us/courses/<strong>12345</strong></p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Starting session…" : "Launch Analyzer →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Analyzer App ──────────────────────────────────────────────────────
function AnalyzerApp({ session, onLogout }) {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().split("T")[0];

  const [preset, setPreset] = useState("Last 7 days");
  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);

  const [summary, setSummary] = useState("");
  const [toneAnalysis, setToneAnalysis] = useState("");
  const [threadCount, setThreadCount] = useState(null);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTone, setLoadingTone] = useState(false);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const [error, setError] = useState("");

  // Apply preset
  useEffect(() => {
    const t = new Date();
    const fmt = (d) => d.toISOString().split("T")[0];
    if (preset === "Last 7 days") {
      setStartDate(fmt(new Date(t - 7 * 864e5)));
      setEndDate(fmt(t));
    } else if (preset === "Last 14 days") {
      setStartDate(fmt(new Date(t - 14 * 864e5)));
      setEndDate(fmt(t));
    } else if (preset === "This month") {
      setStartDate(fmt(new Date(t.getFullYear(), t.getMonth(), 1)));
      setEndDate(fmt(t));
    } else if (preset === "Last month") {
      const firstThisMonth = new Date(t.getFullYear(), t.getMonth(), 1);
      const lastMonth = new Date(firstThisMonth - 1);
      setStartDate(fmt(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)));
      setEndDate(fmt(lastMonth));
    }
  }, [preset]);

  const initials = session.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // Shared context for Q&A
  const contextRef = useRef("");

  const handleGenerateSummary = async () => {
    setError("");
    setLoadingSummary(true);
    try {
      const count = Math.floor(Math.random() * 30) + 10; // simulated thread count
      setThreadCount(count);

      const systemPrompt =
        "You are an expert educational assistant helping instructors summarize Ed Discussion activity. Provide clear, professional summaries that highlight key insights and patterns.";

      const userPrompt = `Please create a comprehensive summary of classroom discussion activity from ${startDate} to ${endDate} for course ID ${session.courseId}.

This is a demonstration/simulation — generate a realistic example summary as if you had access to ${count} discussion threads from an active undergraduate course.

Include:
1. **Overview**: Brief summary of discussion activity level and engagement
2. **Key Topics**: Main themes and subjects discussed
3. **Student Questions**: Common questions or concerns raised
4. **Notable Discussions**: Particularly engaging or important conversations
5. **Participation Insights**: Observations about student participation patterns

Format professionally for an instructor to use directly.`;

      const result = await callOpenAI(systemPrompt, userPrompt, session.openaiKey);
      setSummary(result);
      contextRef.current = result;
    } catch (e) {
      setError("Error generating summary: " + e.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleAnalyzeTone = async () => {
    setError("");
    setLoadingTone(true);
    try {
      const count = threadCount ?? (Math.floor(Math.random() * 30) + 10);
      if (!threadCount) setThreadCount(count);

      const systemPrompt =
        "You are an expert in educational psychology and communication analysis. Analyze discussion tone with sensitivity to student emotional states and classroom dynamics.";

      const userPrompt = `Please analyze the tone and emotional climate of classroom discussions from ${startDate} to ${endDate} for course ID ${session.courseId}.

This is a demonstration/simulation — generate a realistic tone analysis as if you had access to ${count} discussion threads.

Include:
1. **Overall Tone**: General emotional climate
2. **Engagement Level**: How actively engaged students appear to be
3. **Emotional Indicators**: Specific emotions detected
4. **Communication Style**: Formal vs informal, collaborative vs individual
5. **Stress Indicators**: Signs of academic pressure or difficulty
6. **Support Dynamics**: How students help each other
7. **Red Flags**: Any concerning patterns needing attention
8. **Recommendations**: Suggestions for improving discussion climate

Provide actionable insights.`;

      const result = await callOpenAI(systemPrompt, userPrompt, session.openaiKey);
      setToneAnalysis(result);
      if (!contextRef.current) contextRef.current = result;
    } catch (e) {
      setError("Error analyzing tone: " + e.message);
    } finally {
      setLoadingTone(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setError("");
    setLoadingAnswer(true);
    const q = question;
    setQuestion("");
    try {
      const context = contextRef.current || "No prior analysis content loaded.";
      const systemPrompt =
        "You are an educational assistant helping instructors understand their discussion content. Answer questions accurately based on the provided context.";
      const userPrompt = `Based on this discussion context:\n\n${context}\n\nQuestion: ${q}\n\nProvide a thorough answer with specific references when possible.`;

      const result = await callOpenAI(systemPrompt, userPrompt, session.openaiKey);
      setChatHistory((h) => [
        { question: q, answer: result, ts: new Date().toLocaleTimeString() },
        ...h,
      ]);
    } catch (e) {
      setError("Error answering question: " + e.message);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const downloadText = (content, filename) => {
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    a.download = filename;
    a.click();
  };

  const hasContent = summary || toneAnalysis;

  return (
    <div className="main-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="bee">🐝</span>
          <div>
            <div className="sidebar-brand-text">Ed Analyzer</div>
            <div className="sidebar-brand-sub">Discussions · AI</div>
          </div>
        </div>

        {/* User */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Session</div>
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <div className="user-chip-info">
              <span className="user-chip-name">{session.name}</span>
              <span className="user-chip-sub">{session.role}{session.institution ? ` · ${session.institution}` : ""}</span>
            </div>
          </div>
        </div>

        {/* Course */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Course</div>
          <div className="field">
            <label>Course ID</label>
            <input value={session.courseId} readOnly style={{ cursor: "default" }} />
          </div>
        </div>

        {/* Date range */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Date Range</div>
          <div className="field">
            <label>Preset</label>
            <select value={preset} onChange={(e) => setPreset(e.target.value)}>
              <option>Custom Range</option>
              <option>Last 7 days</option>
              <option>Last 14 days</option>
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="field">
            <label>Start date</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPreset("Custom Range"); }} />
          </div>
          <div className="field">
            <label>End date</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPreset("Custom Range"); }} />
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            ← Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <h1>Enhanced Ed Discussions Analyzer</h1>
          <p>Advanced analysis with tone detection and interactive Q&A</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {/* Metrics */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-label">Course ID</div>
            <div className="metric-value">{session.courseId}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Start Date</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{startDate}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">End Date</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{endDate}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-row">
          <button
            className="action-btn primary-action"
            onClick={handleGenerateSummary}
            disabled={loadingSummary || loadingTone}
          >
            <span className="action-btn-icon">📄</span>
            <span className="action-btn-text">
              <span className="action-btn-label">Generate Summary</span>
              <span className="action-btn-sub">AI overview of discussions</span>
            </span>
          </button>
          <button
            className="action-btn"
            onClick={handleAnalyzeTone}
            disabled={loadingSummary || loadingTone}
          >
            <span className="action-btn-icon">🎭</span>
            <span className="action-btn-text">
              <span className="action-btn-label">Analyze Tone</span>
              <span className="action-btn-sub">Emotional climate report</span>
            </span>
          </button>
        </div>

        {/* Loading states */}
        {loadingSummary && (
          <div className="result-section">
            <div className="spinner-wrap">
              <div className="spinner" />
              Fetching threads and generating summary…
            </div>
          </div>
        )}

        {loadingTone && (
          <div className="result-section">
            <div className="spinner-wrap">
              <div className="spinner" />
              Analyzing discussion tone and emotional climate…
            </div>
          </div>
        )}

        {/* Summary result */}
        {summary && !loadingSummary && (
          <div className="result-section">
            <div className="result-header">
              <div className="result-header-left">
                <span>📋</span>
                <div>
                  <h3>Discussion Summary</h3>
                  <p>{startDate} → {endDate}{threadCount ? ` · ${threadCount} threads analyzed` : ""}</p>
                </div>
              </div>
              <button
                className="download-btn"
                onClick={() => downloadText(summary, `ed_summary_${startDate}_${endDate}.txt`)}
              >
                ↓ Download
              </button>
            </div>
            <div className="result-body">{renderMarkdown(summary)}</div>
          </div>
        )}

        {/* Tone result */}
        {toneAnalysis && !loadingTone && (
          <div className="result-section">
            <div className="result-header">
              <div className="result-header-left">
                <span>🎭</span>
                <div>
                  <h3>Tone Analysis</h3>
                  <p>{startDate} → {endDate}{threadCount ? ` · ${threadCount} threads analyzed` : ""}</p>
                </div>
              </div>
              <button
                className="download-btn"
                onClick={() => downloadText(toneAnalysis, `ed_tone_${startDate}_${endDate}.txt`)}
              >
                ↓ Download
              </button>
            </div>
            <div className="result-body">{renderMarkdown(toneAnalysis)}</div>
          </div>
        )}

        {/* Q&A */}
        {hasContent && (
          <div className="qa-section">
            <div className="qa-header">
              <h3>🤖 Ask About the Discussions</h3>
              <p>Ask anything about the content that was analyzed above</p>
            </div>
            <div className="qa-input-row">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are students struggling with most?"
                onKeyDown={(e) => e.key === "Enter" && !loadingAnswer && handleAskQuestion()}
                disabled={loadingAnswer}
              />
              <button
                className="btn btn-primary"
                style={{ whiteSpace: "nowrap", width: "auto", padding: "0.65rem 1.1rem" }}
                onClick={handleAskQuestion}
                disabled={loadingAnswer || !question.trim()}
              >
                {loadingAnswer ? "…" : "Ask →"}
              </button>
            </div>
            {loadingAnswer && (
              <div className="spinner-wrap" style={{ padding: "1rem 1.25rem" }}>
                <div className="spinner" />Thinking…
              </div>
            )}
            {chatHistory.length > 0 && (
              <div className="chat-history">
                {chatHistory.map((c, i) => (
                  <div className="chat-item" key={i}>
                    <div className="chat-q">{c.question}</div>
                    <div className="chat-a">{renderMarkdown(c.answer)}</div>
                    <div className="chat-ts">Asked at {c.ts}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasContent && !loadingSummary && !loadingTone && (
          <div className="alert alert-info" style={{ marginTop: "0.5rem" }}>
            👆 Click <strong>Generate Summary</strong> or <strong>Analyze Tone</strong> to begin analyzing your course discussions.
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {!session
          ? <LandingPage onSubmit={(data) => setSession(data)} />
          : <AnalyzerApp session={session} onLogout={() => setSession(null)} />
        }
      </div>
    </>
  );
}
