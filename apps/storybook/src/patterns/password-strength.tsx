import { cn } from "../lib/cn";

const levels = [
  { label: "Too short", bar: "bg-destructive" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-warning" },
  { label: "Good", bar: "bg-info" },
  { label: "Strong", bar: "bg-success" },
] as const;

/** A rough score from 0 to 4: length, a number, upper and lower case, a symbol. Only a hint, not a rule. */
function score(password: string) {
  if (password.length < 8) return 0;
  let points = 1;
  if (/\d/.test(password)) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 14) points += 1;
  return points;
}

/** Four bars that fill as a password gets stronger, with the word for it. Hidden until you type. */
export function PasswordStrength({ password }: Readonly<{ password: string }>) {
  if (!password) return null;
  const level = score(password);
  const { label, bar } = levels[level] ?? levels[0];
  return (
    <div className="grid gap-1.5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted transition-colors",
              level >= step && bar,
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">Password strength: {label}</p>
    </div>
  );
}
