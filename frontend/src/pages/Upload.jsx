import React, { useState } from "react";
import { api } from "../api";
import ProfilePreview from "../components/ProfilePreview";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setError("");
    setResult(null);

    if (!file) return setError("Please select a PDF file.");

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);
      const res = await api.post("/linkedin/extract", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>LinkedIn PDF Extractor</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Extracting..." : "Extract"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16, color: "crimson" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          <ProfilePreview data={result} />
        </div>
      )}
    </div>
  );
}