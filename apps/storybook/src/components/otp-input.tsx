import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "../lib/cn";

type OtpInputProps = Readonly<{
  /** The digits typed so far, as one string. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** Accessible name for the whole code, such as "Verification code". */
  label: string;
  id?: string;
}>;

/**
 * One box per digit. Typing moves to the next box, Backspace to the previous
 * one, arrow keys move around, and pasting a whole code fills every box.
 * Digits only.
 */
export function OtpInput({
  value,
  onChange,
  onBlur,
  length = 6,
  invalid,
  disabled,
  label,
  id,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusBox = (index: number) => {
    const box = refs.current[Math.min(Math.max(index, 0), length - 1)];
    box?.focus();
    box?.select();
  };

  const setAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  /** Put several digits into the boxes, starting at one box. Used for paste and autofill. */
  const fillFrom = (index: number, text: string) => {
    const next = digits.slice();
    const typed = text.slice(0, length - index);
    for (let offset = 0; offset < typed.length; offset += 1)
      next[index + offset] = typed[offset] ?? "";
    onChange(next.join("").slice(0, length));
    focusBox(index + typed.length);
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index]) {
      event.preventDefault();
      if (index > 0) {
        setAt(index - 1, "");
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    // A whole code always starts at the first box, whichever box you pasted into.
    fillFrom(pasted.length >= length ? 0 : index, pasted);
  };

  return (
    <div role="group" aria-label={label} id={id} className="flex w-full max-w-sm gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          inputMode="numeric"
          placeholder="·"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          disabled={disabled}
          aria-label={`${label}, digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          onFocus={(event) => event.target.select()}
          onBlur={index === length - 1 ? onBlur : undefined}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={(event) => onPaste(index, event)}
          onChange={(event) => {
            const typed = event.target.value.replace(/\D/g, "");
            if (!typed) {
              setAt(index, "");
              return;
            }
            // One digit: take it. Several at once (autofill, a code sent by SMS): spread them over the boxes.
            if (typed.length > 1) fillFrom(typed.length >= length ? 0 : index, typed);
            else {
              setAt(index, typed);
              focusBox(index + 1);
            }
          }}
          className={cn(
            length === 6 && index === 2 && "mr-3",
            "h-14 min-w-0 max-w-14 flex-1 basis-12 rounded-lg border border-input bg-card text-center text-2xl font-medium tabular-nums shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 not-placeholder-shown:border-primary/60",
          )}
        />
      ))}
    </div>
  );
}
