import { useEffect, useState } from "react";

/** Reads a CSS custom property from <html> and updates when light/dark or palette changes. */
export function useToken(name: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setValue(getComputedStyle(root).getPropertyValue(name).trim());
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-palette"] });
    return () => observer.disconnect();
  }, [name]);
  return value;
}
