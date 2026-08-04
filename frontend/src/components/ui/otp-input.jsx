"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function OtpInput({ value, onChange, length = 6, error }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const setDigit = (i, char) => {
    const next = digits.slice();
    next[i] = char;
    onChange(next.join(""));
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    setDigit(i, char);
    if (char && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length).trimEnd());
    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className={cn(
            "h-14 w-12 rounded-xl border bg-surface-sunken/60 text-center text-xl font-semibold text-foreground transition-all duration-150 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20",
            error ? "border-danger/60" : "border-border",
            d && "border-primary/40 bg-primary/5"
          )}
        />
      ))}
    </div>
  );
}
