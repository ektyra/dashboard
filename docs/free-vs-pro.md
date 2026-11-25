# Free vs Pro

Status: **proposed**. Change anything here and the Storybook "Pro" page follows (it mirrors this file).

## The split

**Free** is everything a team needs to build a good-looking, accessible dashboard:

- Foundations: tokens, palettes, light and dark, icons
- All base components: actions, inputs and forms, feedback, overlays, layout, typography, media
- Navigation: navbar, sidebar, breadcrumbs, tabs, pagination, stepper
- Data display: table, DataGrid (sort, select, paginate), cards, badges, avatars, timeline
- Patterns: confirm dialog, search bar, filter bar, page header, login form
- Templates: dashboard, overview, detail, settings and the auth pages

**Pro** is the big, time-saving building blocks. Each is marked **(Pro)** in its Storybook group:

| Kind       | Items                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components | Advanced DataGrid, Kanban board, Calendar and scheduler, Chart suite, File manager, Rich text editor with comments, Activity feed and notification center |
| Layouts    | Horizontal menu, Detached sidebar, Landing page collection                                                                                                |
| Pages      | Analytics, CRM, Billing, Users and roles, Audit log, Onboarding wizard, Error and status pages                                                            |
| Apps       | Calendar, Kanban, Chat, E-commerce admin, Address book                                                                                                    |
| Features   | Live theme customizer                                                                                                                                     |

Rule of thumb: if it takes a team a week to build and test, it is Pro. If a designer can assemble it from Free parts in an afternoon, it is Free.

## How the license is checked

**Recommendation: the license is access to the package, not a runtime check.**

1. Pro code lives in a separate private package, `@ektyra/pro`, published to a private registry (GitHub Packages or a private npm scope).
2. A license gives a read token for that registry. No token, no install.
3. Nothing phones home at runtime. A license server that can break a customer's production dashboard is a risk we do not want.
4. `ektyra doctor` (the template CLI) can check that the token works and that the installed version matches the license term, for support and for renewals.
5. Free stays MIT or similar in `@ektyra/ui`; Pro has its own license file.

Why not a license key in the code: it can be copied, it adds a failure mode, and it needs a server. Registry access gives the same protection with less to maintain.

## Open questions for you

- Pricing model: per project, per seat, per agency (unlimited client projects)?
- Updates: are updates for one year, or forever for the version you bought?
- Do agencies get a "white label" license to ship Pro inside client projects?
