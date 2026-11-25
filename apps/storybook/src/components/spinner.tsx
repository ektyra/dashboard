import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../lib/cn";

export function Spinner({ className, ...props }: ComponentProps<typeof LoaderCircle>) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
