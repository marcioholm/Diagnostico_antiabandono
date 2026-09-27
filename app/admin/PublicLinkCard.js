"use client";

import { useEffect, useState } from "react";

export default function PublicLinkCard() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin + "/");
    }
  }, []);

  function handleCopy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      className="login-card"
      style={{ maxWidth: "none", margin: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}
    >
      <div>
        <div className="label" style={{ marginBottom: "6px" }}>
          <span className="dot" />
          Link público do diagnóstico
        </div>
        <div style={{ fontWeight: 600, fontSize: "14.5px", wordBreak: "break-all" }}>
          {url || "carregando..."}
        </div>
      </div>
      <button className="btn small" onClick={handleCopy} disabled={!url}>
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
