import { useState } from "react";
import type { ComponentProps } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../lib/cn";

type ImageProps = Omit<ComponentProps<"img">, "alt"> & {
  /** Required. Use an empty string only for purely decorative images. */
  alt: string;
  /** Reserves the space so the page does not jump while loading, e.g. "16/9". */
  aspectRatio?: string;
  fit?: "cover" | "contain";
  rounded?: boolean;
};

/**
 * An image with a reserved box, a quiet loading state and a fallback when it
 * fails to load. Always lazy by default.
 */
export function Image({
  alt,
  aspectRatio = "16/9",
  fit = "cover",
  rounded = true,
  className,
  onLoad,
  onError,
  loading = "lazy",
  ...props
}: ImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div
      className={cn("bg-muted relative overflow-hidden", rounded && "rounded-lg", className)}
      style={{ aspectRatio }}
    >
      {state === "error" ? (
        <div
          role="img"
          aria-label={alt || "Image could not be loaded"}
          className="text-muted-foreground absolute inset-0 grid place-items-center"
        >
          <ImageOff className="size-6" aria-hidden="true" />
        </div>
      ) : (
        <img
          alt={alt}
          loading={loading}
          onLoad={(e) => {
            setState("loaded");
            onLoad?.(e);
          }}
          onError={(e) => {
            setState("error");
            onError?.(e);
          }}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-300 motion-reduce:transition-none",
            fit === "cover" ? "object-cover" : "object-contain",
            state === "loaded" ? "opacity-100" : "opacity-0",
          )}
          {...props}
        />
      )}
    </div>
  );
}
