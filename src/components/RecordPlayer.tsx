"use client";

import { useEffect, useRef, useState } from "react";

export default function RecordPlayer({
  src,
  autoPlay = false,
  onPlayChange,
}: {
  src: string;
  autoPlay?: boolean;
  onPlayChange?: (playing: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  async function play() {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
      onPlayChange?.(true);
    } catch {
      // Autoplay may be blocked; user can tap record to start
      setPlaying(false);
      onPlayChange?.(false);
    }
  }

  function pause() {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setPlaying(false);
    onPlayChange?.(false);
  }

  function toggle() {
    playing ? pause() : play();
  }

  useEffect(() => {
    if (!autoPlay) return;
    // Attempt autoplay on mount
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Record */}
      <button
        onClick={toggle}
        className="btn"
        style={{
          width: 230,
          height: 230,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.18)",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(0,0,0,0.85) 60%)," +
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), rgba(0,0,0,0.92) 70%)",
          position: "relative",
          overflow: "hidden",
          padding: 0,
          cursor: "pointer",
          transform: "translateZ(0)",
        }}
        aria-label={playing ? "Pause" : "Play"}
        title={playing ? "Tap to pause" : "Tap to play"}
      >
        {/* grooves */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 999,
            background:
              "repeating-radial-gradient(circle at center, rgba(255,255,255,0.08) 0 1px, rgba(0,0,0,0) 1px 6px)",
            opacity: 0.35,
          }}
        />

        {/* label */}
        <div
          style={{
            position: "absolute",
            inset: 70,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(255,77,141,0.65))",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "grid",
            placeItems: "center",
            fontWeight: 950,
            letterSpacing: -0.5,
          }}
        >
          18
        </div>

        {/* spindle hole */}
<div
  style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 12,
    height: 12,
    borderRadius: 999,
    transform: "translate(-50%,-50%)",
    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.15) 60%, rgba(0,0,0,0.35))",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "0 0 12px rgba(255,255,255,0.10)",
  }}
        />

        {/* tonearm (optional vibe) */}
        <div
          style={{
            position: "absolute",
            right: 18,
            top: 24,
            width: 80,
            height: 8,
            borderRadius: 999,
            background: "rgba(255,255,255,0.25)",
            transform: playing ? "rotate(18deg)" : "rotate(0deg)",
            transformOrigin: "90% 50%",
            transition: "transform .35s ease",
            filter: "blur(0.1px)",
          }}
        />

        {/* spin */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            animation: playing ? "spin 1.6s linear infinite" : "none",
          }}
        />
      </button>

      <div style={{ color: "var(--muted)", fontSize: 14 }}>
        {playing ? "playing… (tap to pause)" : "tap the record to play"}
      </div>

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}
