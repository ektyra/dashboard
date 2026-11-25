# Ektyra

Vite+ monorepo.

| Path             | What                       |
| ---------------- | -------------------------- |
| `apps/dashboard` | TanStack Start dashboard   |
| `apps/storybook` | Storybook for `@ektyra/ui` |
| `packages/ui`    | React component library    |
| `packages/utils` | Shared utilities           |

## Commands

- `vp install` install deps
- ``vp run @ektyra/dashboard#dev`/`vp run @ektyra/storybook#dev` run apps
- `vp check` format + lint + typecheck
- `vp run -r test` / `vp run -r build`

## Workflow

GitHub flow: branch off `main` (`feat/...`, `fix/...`), open PR, squash-merge.
Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org). Enforced by commitlint hook and CI.
