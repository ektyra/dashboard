# Storybook

Run: `vp run @ektyra/storybook#dev` (port 6006). Build: `vp run @ektyra/storybook#build`.

## Add a story

1. Put it next to the component: `packages/ui/src/components/<name>.stories.tsx`.
2. Use the title `<Group>/<Component>`, e.g. `Actions/Button`. Groups are sorted in `.storybook/preview.tsx`.
3. Show every variant and state. Check light **and** dark (toolbar toggle) and the a11y panel.

Docs-only pages go in `apps/storybook/stories/*.mdx`.

## What is set up

- Tokens and fonts come from `@ektyra/ui/styles.css`.
- Light/dark toggle in the toolbar. Storybook's own UI follows it (`.storybook/theme.ts`).
- Every story has a memory router, tooltip provider and toaster (`.storybook/providers.tsx`).
- Viewports: Mobile 375, Tablet 768, Desktop 1280. Autodocs on for all stories.
