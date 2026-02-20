import React, { useState } from "react";

export default function ProfilePreview({ data }) {
  const [open, setOpen] = useState({ exp: true, edu: true, skills: true });

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
      <h2 style={{ margin: 0 }}>{data.name || "—"}</h2>
      <p style={{ margin: "6px 0" }}><b>Headline:</b> {data.headline || "—"}</p>
      <p style={{ margin: "6px 0" }}><b>Location:</b> {data.location || "—"}</p>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ marginBottom: 6 }}>About</h3>
        <p style={{ whiteSpace: "pre-wrap", marginTop: 0 }}>{data.about || "—"}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ cursor: "pointer" }} onClick={() => setOpen(s => ({...s, skills: !s.skills}))}>
          Skills {open.skills ? "▾" : "▸"}
        </h3>
        {open.skills && (
          data.skills?.length ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {data.skills.map((s, i) => (
                <span key={i} style={{ border: "1px solid #ccc", padding: "4px 8px", borderRadius: 999 }}>
                  {s}
                </span>
              ))}
            </div>
          ) : <p>—</p>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ cursor: "pointer" }} onClick={() => setOpen(s => ({...s, exp: !s.exp}))}>
          Experience {open.exp ? "▾" : "▸"}
        </h3>
        {open.exp && (
          data.experience?.length ? data.experience.map((x, i) => (
            <div key={i} style={{ padding: 10, border: "1px solid #eee", borderRadius: 8, marginBottom: 8 }}>
              <div><b>{x.title}</b> — {x.company || ""}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {x.start || ""} {x.end ? `- ${x.end}` : ""} {x.location ? `• ${x.location}` : ""}
              </div>
              {x.description ? <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{x.description}</div> : null}
            </div>
          )) : <p>—</p>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ cursor: "pointer" }} onClick={() => setOpen(s => ({...s, edu: !s.edu}))}>
          Education {open.edu ? "▾" : "▸"}
        </h3>
        {open.edu && (
          data.education?.length ? data.education.map((x, i) => (
            <div key={i} style={{ padding: 10, border: "1px solid #eee", borderRadius: 8, marginBottom: 8 }}>
              <div><b>{x.school}</b></div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {[x.degree, x.field].filter(Boolean).join(" • ")}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {x.start || ""} {x.end ? `- ${x.end}` : ""}
              </div>
            </div>
          )) : <p>—</p>
        )}
      </div>
    </div>
  );
}