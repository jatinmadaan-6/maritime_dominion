export function PageHeader({ activeTab }) {
  const map = {
    vessels: ["THE FLEET", "Your vessels, held to a higher standard."],
    addVessel: ["FLEET REGISTER", "Welcome a vessel into the Dominion."],
    captains: ["THE CREW", "The people trusted with the horizon."],
    addCaptain: ["CREW REGISTER", "Record a new commander's story."],
    assignCaptain: ["COMMAND", "Place the right hand at the helm."],
    logs: ["THE LOGBOOK", "Every passage leaves a trace."],
    addLog: ["LOG A PASSAGE", "Keep the fleet's record precise."],
    violations: ["ATTENTION REQUIRED", "Protect the standard you represent."],
    users: ["ACCESS CONTROL", "Set the right authority for every member of the watch."],
  };
  const [eyebrow, title] = map[activeTab] || ["MARITIME DOMINION", "Fleet command centre."];
  return <header className="page-header"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></header>;
}

export function StatsRow({ vessels, logs, violations, captains }) {
  const rate = logs.length ? `${Math.round(((logs.length - violations.length) / logs.length) * 100)}%` : "—";
  return <div className="stat-grid">{[
    [String(vessels.length).padStart(2, "0"), "Vessels in command"],
    [String(captains.length).padStart(2, "0"), "Commanders aboard"],
    [String(violations.length).padStart(2, "0"), "Items requiring care"],
    [rate, "Compliance rhythm"],
  ].map(([value, label]) => <article className="stat-card" key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>;
}

export function Section({ title, children }) { return <section className="surface section"><p className="section-title">{title}</p>{children}</section>; }

export function InfoRow({ label, value, mono }) { return <div className="info-row"><span>{label}</span><strong className={mono ? "mono" : ""}>{value || "—"}</strong></div>; }

export function Table({ headers, rows }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function Form({ fields, values, onChange, onSubmit, message, submitLabel }) {
  return <section className="form-surface"><p className="form-intro">A considered record is a promise kept. Details marked here become part of your operational legacy.</p><div className="form-fields">{fields.map(field => <label className="field" key={field.key}><span>{field.label}</span>{field.type === "select" ? <select value={values[field.key]} onChange={e => onChange(field.key, e.target.value)}><option value="">Select an option</option>{field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : <input type={field.type || "text"} placeholder={field.placeholder} value={values[field.key]} onChange={e => onChange(field.key, e.target.value)} />}</label>)}</div>{message && <p className={`form-message ${message.startsWith("✓") ? "success" : "error"}`}>{message}</p>}<button className="primary-button" onClick={onSubmit}>{submitLabel} <span>→</span></button></section>;
}

export function Empty({ message, action, onAction }) { return <section className="empty-state"><div className="empty-mark">⌁</div><h2>A clear horizon.</h2><p>{message}</p><button className="primary-button" onClick={onAction}>{action} <span>→</span></button></section>; }

export function Loader() { return <div className="loader"><i /> Gathering your fleet's story</div>; }
