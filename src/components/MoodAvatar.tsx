import React from "react";
export type Mood = "happy" | "neutral" | "sad";
const map: Record<Mood, string> = { happy: "🙂", neutral: "😐", sad: "🙁" };
export const MoodAvatar: React.FC<{
  mood?: Mood;
  onChange?: (m: Mood) => void;
  size?: number;
}> = ({ mood = "neutral", onChange, size = 32 }) => {
  const cycle: Mood[] = ["neutral", "happy", "sad"];
  const next = () => {
    if (!onChange) return;
    const idx = cycle.indexOf(mood);
    onChange(cycle[(idx + 1) % cycle.length]);
  };
  return (
    <button
      aria-label={`Mood: ${mood}`}
      onClick={next}
      className="rounded-full bg-primary-400/10 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span aria-hidden style={{ fontSize: size * 0.6 }}>
        {map[mood]}
      </span>
    </button>
  );
};
