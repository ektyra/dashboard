import { createCssVariablesTheme, createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";

/**
 * Syntax highlighting with Shiki. The theme is built from CSS variables
 * (`--shiki-token-*`, defined in styles.css), so the colors are our own OKLCH
 * tokens and need no hard-coded values here. The highlighter loads on first use.
 */
const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

export type CodeLanguage = "typescript" | "tsx" | "json" | "bash" | "css" | "html";

let highlighter: ReturnType<typeof createHighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [
      bundledLanguages.typescript,
      bundledLanguages.tsx,
      bundledLanguages.json,
      bundledLanguages.bash,
      bundledLanguages.css,
      bundledLanguages.html,
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** Returns HTML. Shiki escapes the code, so it is safe to render as HTML. */
export async function highlight(code: string, lang: CodeLanguage) {
  const instance = await getHighlighter();
  return instance.codeToHtml(code, { lang, theme: "css-variables" });
}
