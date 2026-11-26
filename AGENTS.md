# Ektyra: agent guide

Rules for every AI agent working in this repository (Claude, Codex and others).

## Layout

| Path             | What                                                       |
| ---------------- | ---------------------------------------------------------- |
| `apps/dashboard` | TanStack Start dashboard, deployed to Cloudflare Workers   |
| `apps/storybook` | Storybook. Most React components and all stories live here |
| `packages/ui`    | `@ektyra/ui`, the shared component library (still small)   |
| `packages/utils` | `@ektyra/utils`, shared utilities                          |
| `docs`           | Product decisions, for example `free-vs-pro.md`            |
| `factory`        | Software factory scripts and config. Do not edit in a job  |

Some READMEs are older than the code. When they disagree, follow the code.

## Commands

Node version is in `.node-version`. Run from the repository root.

| Command                        | What                         |
| ------------------------------ | ---------------------------- |
| `vp install`                   | Install dependencies         |
| `vp check`                     | Format, lint and type check  |
| `vp check --fix`               | Fix format and lint problems |
| `vp run -r test`               | All tests                    |
| `vp run -r build`              | All builds                   |
| `vp run @ektyra/dashboard#dev` | Dashboard on port 3000       |
| `vp run @ektyra/storybook#dev` | Storybook on port 6006       |

CI runs `vp check`, tests and builds. All three must pass.

## Code

- TypeScript, ES modules. Match the style of the neighbouring files.
- Import tooling from `vite-plus`, not `vite` or `vitest`.
- Shared dependency versions come from the `catalog:` in `pnpm-workspace.yaml`.
- Do not add a dependency unless the task asks for it. Say so in the PR when you do.
- Make the smallest change that completes the task. No extras.
- Never edit generated files such as `routeTree.gen.ts`.

## Components and Storybook

- Components: `apps/storybook/src/components/<name>.tsx`.
- Stories: `apps/storybook/src/<group>/<name>.stories.tsx`, titled `<Group>/<Component>`.
  Groups are sorted in `apps/storybook/.storybook/preview.tsx`.
- Colours come from theme tokens (`apps/storybook/src/styles/theme.css`), for example
  `bg-primary` or `text-muted-foreground`. No hard-coded colours.
- Merge class names with `cn` from `src/lib/cn`. Variants use `cva`.
- A new or changed component needs a story showing its variants and states.
- It must work in light and dark, at 375px width, with the keyboard, and pass the a11y panel.
- Free versus Pro is defined in `docs/free-vs-pro.md`. Do not move items between them.

## Git

- Branch from `main`: `feat/...`, `fix/...`, `chore/...`, `docs/...`.
- Commits and PR titles follow Conventional Commits. A hook and CI check this.
- PRs are squash merged and close their issue with `Closes #<number>`.
- Never push to `main`. A human merges every PR.

## Issues

Issues are written to be small and easy to scan: **TL;DR**, **Start here**, **Size** and a
**Done when** checklist. If the work grows past the size, stop and propose a split.
