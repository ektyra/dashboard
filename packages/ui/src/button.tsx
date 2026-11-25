import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500",
  ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
} as const;

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
