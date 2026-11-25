import { storageKey } from "../../lib/storage-key";
import { animate } from "motion";
import { useSyncExternalStore } from "react";

/**
 * Sidebar collapse state, driven by the DOM instead of React state so the
 * right layout is there from first paint (no flash on reload):
 *
 * - `<html data-sidebar="collapsed">` is the resting state. CSS reads it for the
 *   width (`--sidebar-width`) and to hide labels. See `styles.css`.
 * - While the width animates, Motion drives `--sidebar-width` inline.
 * - On collapse the attribute is set only AFTER the animation finishes, so
 *   labels stay visible until the sidebar is narrow. On expand it is removed
 *   immediately, so labels are there while the sidebar grows.
 */

const sidebarKey = () => storageKey("sidebar");

const ATTRIBUTE = "data-sidebar";
const COLLAPSED_WIDTH = "4rem";
const EXPANDED_WIDTH = "16rem";
const DURATION = 0.3;

/** Inline script for <head>: restores the saved state before first paint. */
export const getSidebarInitScript = () =>
  `(function(){try{if(localStorage.getItem(${JSON.stringify(
    sidebarKey(),
  )})==="collapsed")document.documentElement.setAttribute(${JSON.stringify(
    ATTRIBUTE,
  )},"collapsed")}catch(e){}})();`;

// The intended state. It differs from the attribute while an animation runs.
let target: boolean | undefined;
let run = 0;
const listeners = new Set<() => void>();

const root = () => document.documentElement;
const readAttribute = () => root().getAttribute(ATTRIBUTE) === "collapsed";

function getTarget() {
  target ??= readAttribute();
  return target;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function toggleSidebar() {
  const collapsing = !getTarget();
  target = collapsing;
  const thisRun = ++run;

  try {
    localStorage.setItem(sidebarKey(), collapsing ? "collapsed" : "expanded");
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }

  // Freeze the current width so an interrupted animation continues from it.
  const from = getComputedStyle(root()).getPropertyValue("--sidebar-width").trim();
  const to = collapsing ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!collapsing) root().removeAttribute(ATTRIBUTE);
  root().style.setProperty("--sidebar-width", from);

  const finish = () => {
    if (thisRun !== run) return; // a newer toggle took over
    if (collapsing) root().setAttribute(ATTRIBUTE, "collapsed");
    root().style.removeProperty("--sidebar-width");
  };

  if (reduceMotion) {
    finish();
  } else {
    void animate(
      root(),
      { "--sidebar-width": [from, to] },
      { duration: DURATION, ease: [0.16, 1, 0.3, 1] },
    ).then(finish);
  }

  listeners.forEach((listener) => listener());
}

/** True when the sidebar is (or is becoming) collapsed. Safe to use for aria only. */
export function useSidebarCollapsed() {
  return useSyncExternalStore(subscribe, getTarget, () => false);
}

/** Collapse or expand the sidebar to a known state (it does nothing if it already is). */
export function setSidebarCollapsed(collapsed: boolean) {
  if (getTarget() !== collapsed) toggleSidebar();
}
