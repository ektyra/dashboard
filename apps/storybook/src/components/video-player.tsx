import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Caption = { src: string; srcLang: string; label: string; default?: boolean };

type VideoPlayerProps = Omit<ComponentProps<"video">, "controls" | "children"> & {
  /** Reserves the space, e.g. "16/9". */
  aspectRatio?: string;
  /** Subtitle or caption tracks (WebVTT). Provide them for spoken content. */
  captions?: Caption[];
  /** A short description for people who cannot see the video. */
  description?: string;
};

/**
 * A video with the browser's own controls, which are keyboard and screen-reader
 * accessible. Adds a reserved box, a poster and caption tracks.
 */
export function VideoPlayer({
  aspectRatio = "16/9",
  captions = [],
  description,
  className,
  preload = "metadata",
  ...props
}: VideoPlayerProps) {
  return (
    <video
      controls
      preload={preload}
      playsInline
      aria-label={description}
      className={cn("bg-code w-full rounded-lg", className)}
      style={{ aspectRatio }}
      {...props}
    >
      {captions.map((c) => (
        <track
          key={c.srcLang}
          kind="captions"
          src={c.src}
          srcLang={c.srcLang}
          label={c.label}
          default={c.default}
        />
      ))}
      Your browser does not support video.
    </video>
  );
}
