"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import HeartField from "@/components/HeartField";
import RecordPlayer from "@/components/RecordPlayer";
import { getProgress } from "@/lib/progress";

export default function ValentinePage() {
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Runaway "no" button state
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);

  const noTexts = ["no", "are you sure?", "really?", "wrong choice", "try again 😭"];
  const [noIndex, setNoIndex] = useState(0);

  useEffect(() => {
    const p = getProgress();
    if (!p.solvedAdd10) router.replace("/");
  }, [router]);

  function moveNoButton() {
    const x = Math.random() * 140 - 70;
    const y = Math.random() * 60 - 30;

    setNoPos({ x, y });
    setNoIndex((prev) => (prev + 1) % noTexts.length);
    setYesScale((s) => Math.min(s + 0.05, 1.3));
  }

  function megaConfetti() {
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 } });
    setTimeout(() => confetti({ particleCount: 90, spread: 120, origin: { y: 0.4 } }), 250);
    setTimeout(() => confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } }), 550);
  }

  function onYes() {
    setAccepted(true);
    megaConfetti();
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <HeartField active={started || accepted} />

      <div style={{ width: 900, maxWidth: "95vw", display: "grid", gap: 16 }}>
        {/* Top card: record + vibe */}
        <div className="card" style={{ padding: 22, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 10 }}>
            okay… you got it. now enjoy the moment.
          </div>

          <RecordPlayer src="/18.mp3" autoPlay onPlayChange={(p) => setStarted(p)} />
        </div>

        {/* Ask card: reveals after started */}
        <div
          className="card"
          style={{
            padding: 22,
            textAlign: "center",
            transform: started ? "translateY(0)" : "translateY(10px)",
            opacity: started ? 1 : 0,
            transition: "all .7s ease",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 950, letterSpacing: -0.7 }}>
            Will you be my Valentine?
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btnPrimary"
              onClick={onYes}
              style={{ transform: `scale(${yesScale})`, transition: "transform 0.2s" }}
            >
              YES 💞
            </button>

            <button
              className="btn"
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              style={{
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                transition: "transform 0.25s ease",
                position: "relative",
              }}
            >
              {noTexts[noIndex]}
            </button>
          </div>

          <div style={{ marginTop: 12, color: "var(--muted)" }}>
            (i think there’s a right answer here…)
          </div>
        </div>
      </div>

      {/* YES ending overlay */}
      {accepted && <YesOverlay onClose={() => setAccepted(false)} />}
    </main>
  );
}

function YesOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        padding: 20,
        animation: "fadeIn .25s ease",
        zIndex: 50,
      }}
    >
      <div
        className="card"
        style={{
          width: 700,
          maxWidth: "95vw",
          padding: 26,
          textAlign: "center",
          animation: "pop .35s cubic-bezier(.2,1.2,.2,1)",
        }}
      >
        <div style={{ fontSize: 14, color: "var(--muted)" }}>✅ CONFIRMED</div>

        <div style={{ fontSize: 40, fontWeight: 1000, letterSpacing: -0.8, marginTop: 8 }}>
          Date secured 💘
        </div>

        <div style={{ marginTop: 10, fontSize: 18, color: "var(--muted)" }}>
          Screenshot this and send it to me so I can brag.
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: 18,
            border: "1px dashed rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.06)",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontWeight: 900 }}>VALENTINE TICKET</div>
          <div style={{ color: "var(--muted)" }}>Admits: 2</div>
          <div style={{ color: "var(--muted)" }}>Song: 18 🎶</div>
          <div style={{ color: "var(--muted)" }}>Plan: Arcade + Demetres + Dinner</div>
        </div>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btnPrimary" onClick={onClose}>
            okayyy 💗
          </button>
          <button className="btn" onClick={() => window.location.reload()}>
            replay from start
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity: 0} to {opacity: 1} }
        @keyframes pop {
          0% { transform: translateY(12px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
