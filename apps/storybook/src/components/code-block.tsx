import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlight } from "../lib/highlighter";
import type { CodeLanguage } from "../lib/highlighter";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";

type CodeBlockProps = Readonly<{
  code: string;
  language?: CodeLanguage;
  /** Shown in the header, for example "schema.ts". */
  filename?: string;
  className?: string;
}>;

/** A highlighted code sample with a copy button. Always a dark surface, in both themes. */
export function CodeBlock({ code, language = "typescript", filename, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void highlight(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-code text-code-foreground",
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-code-foreground/10 py-1 pr-1.5 pl-4 text-xs text-code-foreground/60">
        <span className="truncate">{filename ?? language}</span>
        <IconButton
          label={copied ? "Copied" : "Copy code"}
          onClick={copy}
          className="size-8 text-code-foreground/70 hover:bg-code-foreground/10 hover:text-code-foreground"
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </IconButton>
      </figcaption>
      {html ? (
        <div
          className="code-block overflow-x-auto p-4 text-[0.8125rem] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  );
}
