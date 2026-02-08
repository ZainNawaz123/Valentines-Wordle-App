"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProgress, setProgress } from "@/lib/progress";

export default function Add10Page() {
  const router = useRouter();
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const p = getProgress();
    if (!p.solvedWordle) router.replace("/");
  }, [router]);

  function submit() {
    const cleaned = val.trim();
    if (cleaned === "18") {
      setProgress({ solvedAdd10: true });
      router.push("/valentine");
    } else {
      setMsg("Closeeee 😭 try again");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: 520, maxWidth: "95vw", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, marginBottom: 10 }}>Okay… now add 10.</h1>
        <p style={{ fontSize: 18, opacity: 0.85, marginTop: 0 }}>
          What do you get? 👀
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type your answer…"
            style={{
              width: 220,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 16,
              textAlign: "center",
            }}
          />
          <button
            onClick={submit}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Submit
          </button>
        </div>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </main>
  );
}
