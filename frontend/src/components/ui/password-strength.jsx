"use client";

import { cn } from "@/lib/utils";

function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const levels = [
  { label: "Very weak", color: "bg-danger" },
  { label: "Weak", color: "bg-warning" },
  { label: "Fair", color: "bg-warning" },
  { label: "Strong", color: "bg-success" },
  { label: "Very strong", color: "bg-success" },
];

export function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = levels[score];

  return (
    <div className="mt-2 animate-fade-in">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full bg-white/[0.07] transition-colors duration-300",
              i < score && level.color
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11.5px] text-muted-foreground">{level.label}</p>
    </div>
  );
}
