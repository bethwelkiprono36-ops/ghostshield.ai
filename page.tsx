"use client";

import { useState } from "react";

type Finding = { title: string; detail: string; severity: "high" | "medium" | "low" };
type Analysis = {
  score: number;
  level: "high" | "medium" | "low";
  summary: string;
  findings: Finding[];
  actions: string[];
  mode: "rules" | "ai";
  disclaimer: string;
};

const examples = [
  {
    label: "Fake job offer",
    text: "Congratulations! You have been selected for a job. Pay a registration fee immediately to secure your position."
  },
  {
    label: "Urgent account warning",
    text: "Your account will be blocked in 10 minutes. Click this link and enter your PIN to verify your account."
  },
  {
    label: "Ordinary appointment",
    text: "Hello, your appointment is confirmed for tomorrow at 10 AM. Please reply if you need to reschedule."
  }
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function scan(value = message) {
    if (!value.trim()) {
      setError("Paste a message or URL first.");
      return;
    }
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed. Please try again.");
      setAnalysis(data as Analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not analyze this message.");
    } finally {
      setLoading(false);
    }
  }

  const scoreClass = analysis?.level ?? "low";

  return (
    <main className="shell">
      <nav className="topbar">
        <a className="brand" href="#" aria-label="GhostShield home">
          <span className="brand-mark"><ShieldIcon /></span>
          <span>GHOST<span className="accent">SHIELD</span><small>THREAT INTELLIGENCE</small></span>
        </a>
        <div className="top-status"><span className="pulse" /> SYSTEM READY <span className="version">BETA 01</span></div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> DIGITAL SAFETY, CLARIFIED</div>
        <h1>Trust less.<br /><span>Verify everything.</span></h1>
        <p className="hero-copy">Inspect suspicious messages and links. Understand the warning signs before you take action.</p>
        <div className="trust-row">
          <span><CheckIcon /> Explainable findings</span>
          <span><CheckIcon /> Practical next steps</span>
          <span><CheckIcon /> Privacy-minded</span>
        </div>
      </section>

      <section className="workspace">
        <div className="scanner-panel panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">01 / INPUT</span><h2>Threat scanner</h2></div>
            <span className="icon-chip"><ScanIcon /></span>
          </div>
          <p className="panel-copy">Paste the message or URL you want to inspect. Remove private details first.</p>
          <div className="sample-row">
            <span className="field-label">TRY AN EXAMPLE</span>
            {examples.map((item) => (
              <button className="sample-button" key={item.label} onClick={() => { setMessage(item.text); setAnalysis(null); setError(""); }}>
                {item.label}
              </button>
            ))}
          </div>
          <label className="field-label" htmlFor="message">MESSAGE / URL</label>
          <textarea id="message" value={message} onChange={(e) => { setMessage(e.target.value); setAnalysis(null); }} maxLength={5000} placeholder="Paste suspicious SMS, a job offer, payment request, or web address..." />
          <div className="input-footer"><span>{message.length}/5000 characters</span><span>Do not paste passwords, PINs, or one-time codes.</span></div>
          <button className="scan-button" onClick={() => scan()} disabled={loading || !message.trim()}>
            {loading ? <><span className="spinner" /> ANALYZING SIGNAL...</> : <>ANALYZE MESSAGE <ArrowIcon /></>}
          </button>
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="privacy-note"><LockIcon /><span>Your input is processed for this scan. This starter does not save scan history.</span></div>
        </div>

        <div className="results-panel panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">02 / INTELLIGENCE</span><h2>Analysis report</h2></div>
            <span className="live-label"><span className="pulse" /> LIVE</span>
          </div>
          {!analysis && !loading && (
            <div className="empty-state">
              <div className="radar"><div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-core"><ShieldIcon /></div><div className="radar-sweep" /></div>
              <h3>Awaiting input</h3>
              <p>Submit a message to generate a risk assessment, supporting evidence, and safety recommendations.</p>
              <div className="empty-metrics"><span><b>01</b> SCAN INPUT</span><span><b>02</b> REVIEW EVIDENCE</span><span><b>03</b> TAKE ACTION</span></div>
            </div>
          )}
          {loading && <div className="loading-state"><div className="loader-ring" /><h3>Examining message patterns</h3><p>Checking urgency, requests, links, and other warning signs...</p></div>}
          {analysis && (
            <div className="report">
              <div className={`risk-card ${scoreClass}`}>
                <div><span className="field-label">INDICATIVE RISK LEVEL</span><h3>{analysis.level === "high" ? "High caution" : analysis.level === "medium" ? "Review carefully" : "Lower observed risk"}</h3><p>{analysis.summary}</p></div>
                <div className="score-circle"><strong>{analysis.score}</strong><span>/100</span></div>
              </div>
              <div className="report-meta"><span><span className="tiny-dot" /> {analysis.mode === "ai" ? "AI + RULES ANALYSIS" : "RULE-BASED ANALYSIS"}</span><span>{analysis.findings.length} FINDINGS</span></div>
              <h4 className="section-label">SIGNALS IDENTIFIED</h4>
              <div className="findings">
                {analysis.findings.length === 0 && <div className="finding"><span className="finding-icon safe"><CheckIcon /></span><div><b>No obvious warning pattern found</b><p>This limited scan did not identify common warning signs. That is not proof of legitimacy.</p></div></div>}
                {analysis.findings.map((finding, index) => (
                  <div className="finding" key={`${finding.title}-${index}`}>
                    <span className={`finding-icon ${finding.severity}`}><AlertIcon /></span>
                    <div><b>{finding.title}</b><p>{finding.detail}</p></div>
                  </div>
                ))}
              </div>
              <h4 className="section-label">RECOMMENDED ACTIONS</h4>
              <ul className="actions">{analysis.actions.map((action, index) => <li key={action}><span>{String(index + 1).padStart(2, "0")}</span>{action}</li>)}</ul>
              <p className="disclaimer">{analysis.disclaimer}</p>
              <button className="reset-button" onClick={() => { setAnalysis(null); setMessage(""); setError(""); }}>NEW SCAN <ArrowIcon /></button>
            </div>
          )}
        </div>
      </section>

      <section className="bottom-grid">
        <div className="bottom-card"><span className="bottom-icon"><RadarIcon /></span><div><h3>Evidence over panic</h3><p>Every alert should explain which pattern triggered it. A score is a guide, not a verdict.</p></div></div>
        <div className="bottom-card"><span className="bottom-icon"><LockIcon /></span><div><h3>Privacy first</h3><p>Do not submit sensitive credentials. Scan history and accounts are not enabled in this starter.</p></div></div>
        <div className="bottom-card"><span className="bottom-icon"><GlobeIcon /></span><div><h3>Built for real life</h3><p>Designed for suspicious job offers, impersonation, urgent payment demands, and phishing attempts.</p></div></div>
      </section>
      <footer><a className="footer-brand" href="#">GHOSTSHIELD <span>AI</span></a><span>INDEPENDENT SAFETY TOOL · BETA</span><span>© {new Date().getFullYear()} GHOSTSHIELD</span></footer>
    </main>
  );
}

function ShieldIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 20 6v5.4c0 4.6-3.2 7.9-8 9.6-4.8-1.7-8-5-8-9.6V6l8-3Z" stroke="currentColor" strokeWidth="1.7"/><path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function CheckIcon() { return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ScanIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function LockIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function AlertIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 22 21H2L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 9v5m0 3h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function RadarIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12 18 6M12 12h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function GlobeIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="1.4"/></svg>; }
