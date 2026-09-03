"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

const LENGTH = 6;

export function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(LENGTH, " ").split("").slice(0, LENGTH);

  const setDigit = (index: number, digit: string) => {
    const clean = digit.replace(/[^0-9]/g, "");
    const next = digits.slice();
    next[index] = clean || " ";
    const joined = next.join("").trimEnd();
    onChange(joined);
    if (clean && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, LENGTH);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {digits.map((d, i) => (
        <Input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d.trim()}
          onChange={(e) => setDigit(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-10 text-center text-lg"
        />
      ))}
    </div>
  );
}
