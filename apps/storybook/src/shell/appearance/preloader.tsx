import { useEffect, useState } from "react";
import { BrandLogo } from "../config/layout-config";
import type { Preloader } from "./appearance";

/** Shortest time the preloader stays up, so it does not flash by. */
const MIN_VISIBLE_MS = 700;

/** The three animations. They are always in the markup; CSS shows the chosen one. */
function PreloaderArt() {
  return (
    <>
      <div className="preloader-art" data-kind="rotating">
        <BrandLogo className="h-10 w-auto" />
      </div>
      <div className="preloader-art" data-kind="spinning">
        <span className="preloader-ring" />
      </div>
      <div className="preloader-art" data-kind="loading">
        <BrandLogo className="h-8 w-auto" />
        <span className="preloader-bar" />
      </div>
    </>
  );
}

/**
 * Full-screen loader for the first load. The saved choice is on `<html data-preloader>` before
 * first paint, so CSS shows it right away; once the app has started it fades out. With no
 * choice it never shows.
 */
export function AppPreloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), MIN_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden="true" data-done={done} className="app-preloader">
      <PreloaderArt />
    </div>
  );
}

/** A short preview of a preloader, shown when it is picked in the customizer. */
export function PreloaderPreview({ kind }: Readonly<{ kind: Preloader | null }>) {
  if (!kind || kind === "none") return null;
  return (
    <div aria-hidden="true" data-kind={kind} className="app-preloader app-preloader-preview">
      <PreloaderArt />
    </div>
  );
}
