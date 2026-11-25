import { useMemo } from "react";
import QRCode from "qrcode";
import { cn } from "../lib/cn";

/**
 * A QR code for some text, drawn as SVG. It is always black on white, even in dark
 * mode, because phone cameras read that most reliably. `label` describes what it
 * contains for screen readers; keep the secret itself out of it.
 */
export function QrCode({
  value,
  label,
  size = 176,
  className,
}: Readonly<{ value: string; label: string; size?: number; className?: string }>) {
  const { count, path } = useMemo(() => {
    const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
    const side = modules.size;
    // One path for all dark squares keeps the markup small.
    let commands = "";
    for (let y = 0; y < side; y += 1) {
      for (let x = 0; x < side; x += 1) {
        if (modules.get(x, y)) commands += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { count: side, path: commands };
  }, [value]);

  return (
    <div
      className={cn("shrink-0 rounded-xl bg-white p-3 shadow-sm ring-1 ring-border", className)}
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${count} ${count}`}
        shapeRendering="crispEdges"
        className="size-full"
      >
        <path d={path} fill="black" />
      </svg>
    </div>
  );
}
