"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setProgress } from "@/lib/progress";

const ANSWER = "EIGHT";
const MAX_GUESSES = 6;

function scoreGuess(guess: string, answer: string) {
  // returns array of: "correct" | "present" | "absent"
  const g = guess.split("");
  const a = answer.split("");

  const result = Array(5).fill("absent") as ("correct" | "present" | "absent")[];
  const used = Array(5).fill(false);

  // correct pass
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }
  // present pass
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const idx = a.findIndex((ch, j) => ch === g[i] && !used[j]);
    if (idx !== -1) {
      result[i] = "present";
      used[idx] = true;
    }
  }
  return result;
}

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const rows = useMemo(() => {
    return Array.from({ length: MAX_GUESSES }, (_, i) => guesses[i] || "");
  }, [guesses]);

  const scored = useMemo(() => {
    return guesses.map((g) => scoreGuess(g, ANSWER));
  }, [guesses]);

  const solved = guesses.some((g) => g === ANSWER);

  function submit() {
    const g = input.trim().toUpperCase();
    if (g.length !== 5) return setMessage("Type a 5-letter word 🙂");
    if (!/^[A-Z]{5}$/.test(g)) return setMessage("Letters only!");
    if (guesses.length >= MAX_GUESSES || solved) return;

    const next = [...guesses, g];
    setGuesses(next);
    setInput("");
    setMessage("");

    if (g === ANSWER) {
      setProgress({ solvedWordle: true });
      setTimeout(() => router.push("/add10"), 600);
    } else if (next.length === MAX_GUESSES) {
      setMessage("One more try? Refresh for a redo 😭");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: 420, maxWidth: "95vw" }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Mini Wordle</h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>Solve it to unlock the next page 👀</p>

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {rows.map((g, r) => (
            <div key={r} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {Array.from({ length: 5 }, (_, c) => {
                const ch = (g[c] || "").toUpperCase();
                const status = scored[r]?.[c];

                const bg =
                  status === "correct" ? "#22c55e" : status === "present" ? "#eab308" : status ? "#64748b" : "#111827";
                const border = status ? "transparent" : "1px solid rgba(255,255,255,0.15)";

                return (
                  <div
                    key={c}
                    style={{
                      height: 56,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 24,
                      fontWeight: 700,
                      borderRadius: 12,
                      background: bg,
                      border,
                      color: "white",
                      userSelect: "none",
                    }}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type guess…"
            maxLength={5}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 16,
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
            Enter
          </button>
        </div>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
        {solved && <p style={{ marginTop: 12 }}>✅ Solved. Loading the next page…</p>}
      </div>
    </main>
  );
}
