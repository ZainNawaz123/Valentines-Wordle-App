"use client";

import { useEffect, useMemo, useState } from "react";

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export default function HeartField({ active }: { active: boolean }) {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 18,
      duration: 6 + Math.random() * 7,
      delay: Math.random() * 4,
      opacity: 0.25 + Math.random() * 0.35,
    }));
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: active ? 1 : 0,
        transition: "opacity .6s ease",
      }}
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: `-10%`,
            fontSize: h.size,
            opacity: h.opacity,
            filter: "blur(0.2px)",
            transform: "translateZ(0)",
            animation: `floatUp ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          💗
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.9) rotate(-6deg); }
          50%  { transform: translateY(-60vh) scale(1.05) rotate(6deg); }
          100% { transform: translateY(-120vh) scale(0.95) rotate(-6deg); }
        }
      `}</style>
    </div>
  );
}
