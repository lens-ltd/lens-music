## Goal

Replicate the RealWear web app design system (`/Users/nishimweprince/Documents/Basis/Apps/realwear/apps/web`) onto the Lens music client (`client/`) consistently and exactly — tokens, typography, inputs, tables, TanStack charts, sidebar, auth pages, toasts, and remaining surfaces — in one complete swap.

## Success Criteria

- Lens client renders as a light-only DM Sans interface matching RealWear values exactly: ink `#173b57` on field `#f6f9fb`, paper `#ffffff`, signal `#3f7ca6`, slate `#667987`, rule `#d7e1e8`, muted `#eaf2f7`, danger `#a54b4b`, control border `#b8c8d3`, popover border `#c7d5de`; body `0.875rem`/400 with tabular numerals; controls 13px; help/legend 11px; `equipment-label` 11px/500/uppercase; panel radius `0.5rem`, cards `rounded-lg`, controls `rounded-md`.
- Every surface in scope uses the replica: global tokens, buttons, text inputs, textarea, select, combobox, date picker, checkbox/switch, file input, tables + pagination + toolbar, charts, sidebar + navbar, all six auth pages, toasts, dialogs/popovers, loading/error/empty states.
- `recharts` is fully removed from `client/`; all charts render via `@tanstack/charts` following the RealWear `activity-chart.tsx` pattern (legend + chart + accessible data table + empty state).
- Inputs are the highest-bar item: single shared control/label/help implementation, identical height, border, placeholder, focus, disabled, and error behavior on every form.
- Responsive behavior matches source: 320px minimum, stacked-to-row toolbar breakpoints, auth card `max-w-[400px]`, flow shell `max-w-[880px]` two-column at `md:`, sidebar collapse on mobile.
- `npm run lint` and the production build pass; no dark-mode branches or Poppins/Libre references remain in `client/src`.

## Context And Current Facts

### Frontend-design evaluation of the source (per `client/.agents/skills/frontend-design/SKILL.md`)

- The source takes one restrained, opinionated direction — an industrial/utilitarian instrument panel — and executes it with discipline rather than decoration, which is what the skill asks for: single family (DM Sans) across every role, one signal blue (`#3f7ca6`) plus slate text, tabular numerals for identifiers/counts, uppercase 11px micro-labels (`.equipment-label`, `.panel-label`) as the structural device, quiet `#f6f9fb` field vs. white panels, and a single orchestrated moment (staggered `rail-enter` on the auth rail, `prefers-reduced-motion` respected). Signature element: the dark `#173b57` security rail on auth flows.
- Consistency is its strength: `control.ts` exports one `controlClass` / `labelClass` / `helpClass` consumed by `fields.tsx`, phone field, and select; `button.tsx` fixes four variants and two control heights; `data-table.tsx` repeats the same panel + toolbar + search + column-menu + state-panel composition on every list page; charts repeat line + dot + 11px legend + dashed empty state. No per-page snowflakes.
- Against the skill's restraint rule it passes: boldness is spent in exactly one place (the dark rail + equipment labels), everything else stays quiet; copy is plain-verbed and directional (search/empty/error states name the action). Replicating it therefore means replicating the token file and the shared control/table/chart primitives — not copying any single page.

### Source facts (RealWear `apps/web/src`)

- `index.css`: `@theme --font-sans DM Sans`; base sets ink `#173b57`, background `#f6f9fb`, body `0.875rem`/400, `font-variant-numeric: tabular-nums`; component classes `.equipment-label`, `.panel`, `.panel-label`, `.rail-node`; focus-visible `3px rgba(63,124,166,.26)`; 320px minimum.
- `components/ui/control.ts`: `controlClass` = `min-h-9 rounded-md border-[#b8c8d3] bg-white px-3 text-[13px] text-[#173b57] placeholder-[#7d8e9a] focus:border-[#3f7ca6] disabled:bg-[#eaf2f7]`; `labelClass` 13px `#28475e`; `helpClass` 11px `#667987`.
- `components/ui/button.tsx`: variants primary/secondary/quiet/danger; sizes sm `h-8` / md `h-9` at 13px; e.g. primary `bg-[#3f7ca6] hover:bg-[#346b92]`.
- `components/ui/select.tsx`: trigger `h-9` with identical border/text/placeholder scale; content `border-[#c7d5de] shadow-[0_12px_32px_rgba(23,59,87,.14)]`.
- `components/data-table/data-table.tsx`: `panel` wrapper, toolbar row (search `h-9 pl-9` + Columns menu), manual sort/pagination via TanStack Table, `LoadingState`/`ErrorState`/`EmptyState`.
- `components/charts/activity-chart.tsx`: `@tanstack/charts` `defineChart` with `lineY` + `dot` marks, point/linear scales, tooltip, 11px legend, `ChartEmpty` dashed panel, `<details>` exact-values table.
- `components/layout/app-shell.tsx`: `FIELDLINE` product mark + `equipment-label` subline; grouped nav with permission gating.
- `features/auth/login-page.tsx` + `auth-flow-shell.tsx`: centered `max-w-[400px]` card (`rounded-lg border-[#d7e1e8] shadow-[0_12px_34px_rgba(23,59,87,.08)]`, title `1.65rem`/medium) and 880px two-column shell with dark `#173b57` rail + step list.
- Deps: `@fontsource/dm-sans`, `@tanstack/charts 0.14.0`, `@tanstack/react-table`, Radix primitives, `lucide-react`, Tailwind v4 (`apps/web/package.json`).

### Lens current facts (`client/`)

- `src/index.css`: Poppins body + Libre Baskerville serif, 16px base, token set (`--paper/--ink/--surface/--line`, `--lens-blue #1f628e`, `--radius-control 8px`, `--radius-card 12px`, `--control-sm/md/lg 36/40/44px`), full `.dark` theme plus `.invert-surface`.
- `src/components/inputs/Input.tsx`: bespoke wrapper (`field-label`, prefix/suffix icons, file/date/checkbox branches) over shadcn `ui/input`; siblings `Select.tsx`, `Combobox.tsx`, `DatePicker.tsx`, `TextArea.tsx`, `Button.tsx`.
- `src/components/table/Table.tsx` + `TablePagination.tsx` + `DebouncedInput.tsx`: TanStack Table already, but Lens-styled (not panel/toolbar pattern).
- `src/components/graphs/DashboardChart.tsx`: `recharts` `ComposedChart` with `EditorialTooltip` + `PulseDot` — the unit to delete.
- `src/containers/Sidebar.tsx`: framer-motion `w-60`/`w-16`, `top-16`, Lens active color; `src/containers/Navbar.tsx`, `UserLayout.tsx`.
- `src/pages/authentication/`: `Login.tsx` (PublicNavbar/Footer + `sonner` toasts), `SignUp.tsx`, `RequestInvitation.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `CompleteInvitation.tsx`.
- `src/App.tsx` + `src/components/ui/sonner.tsx`: raw `sonner` Toaster; toasts fired from hooks (e.g. `label.hooks.tsx`, `userInvitations.hooks.tsx`).

## Constraints And Non-goals

- Exact light-only replica: delete the `.dark` theme and `.invert-surface` overrides; do not keep a dark mode (per user answer).
- Auth: restyle only — keep all six Lens pages, fields, and flows; do NOT add the RealWear workspace-slug field or rebuild flows (per user answer).
- One complete swap in a single implementation slice: tokens, inputs, tables, charts, sidebar/navbar, auth, toasts, dialogs/popovers, state panels, and public/landing surfaces together (per user answer).
- Non-goals: no behavior/API changes, no permission/routing changes, no new pages, no workspace-slug auth, no dark-mode retention, no recharts remnants, no per-page one-off styling.

## Key Decisions

- Theme token transplant over adaptation: copy the RealWear base/component layers into `client/src/index.css` (DM Sans via Fontsource, same hex scale, same type scale, same radii, same focus ring, tabular numerals) and remove Poppins/Libre, `.dark`, and `.invert-surface`. Rejected keeping dark mode because the user chose exact replica and the source has no dark tokens to map.
- Shared control primitive first (inputs are the priority): add one `control.ts`-equivalent plus label/help classes and route every Lens input through it before touching tables or charts, so all forms inherit identical height/border/type/error behavior.
- Charts: delete `DashboardChart.tsx` (recharts) and implement a TanStack Charts replacement that keeps the current `data`/`dataKey` props but renders line + dot marks, legend, tooltip, empty state, and exact-values table per `activity-chart.tsx`. Rejected wrapping recharts with new CSS because the requirement names TanStack explicitly and the source pattern is proven.
- Tables: keep Lens's TanStack Table engine and column definitions; replace chrome (panel, toolbar, search, columns menu, pagination, loading/error/empty) with the `data-table.tsx` + `state-panel` composition.
- Sidebar: keep Lens nav items, permissions, and collapse behavior in `Sidebar.tsx`/`sidebar.constants.ts`; reskin to app-shell aesthetics (ink text, panel-label group headers, active `bg-[#eaf2f7]`-family treatment, equipment-label sublines).
- Toasts: keep `sonner` (both projects effectively use it) and restyle the Toaster to the light panel treatment; unify success/error copy to single-verb style.

## Recommended Approach

1. Transplant the token/type/base layer and delete dark mode.
2. Build the shared input primitive and migrate every input/select/picker in dependency order.
3. Reskin tables around the existing TanStack engine.
4. Swap charts engine (add `@tanstack/charts`, port pattern, remove `recharts`).
5. Reskin sidebar/navbar/layout shells.
6. Restyle the six auth pages onto the card pattern (single-column card; two-column dark-rail shell where the page has steps).
7. Restyle toasts, dialogs, popovers, and state panels; sweep landing/public surfaces; delete dead styles.

## Work Plan

1. Tokens + base: rewrite `client/src/index.css` from RealWear `index.css` (DM Sans, hex scale, 14px body, tabular-nums, equipment-label/panel/panel-label/rail, focus ring, 320px min); add `@fontsource/dm-sans`, drop Google Fonts imports; delete `.dark`/`.invert-surface`; update `tailwind` theme mappings.
2. Buttons: rewrite `components/inputs/Button.tsx` + `components/ui/button.tsx` to the four RealWear variants and sm/md heights; update all call sites.
3. Input primitive (priority): add shared control/label/help module mirroring `control.ts`; migrate `inputs/Input.tsx`, `TextArea.tsx`, `Select.tsx`, `Combobox.tsx`, `CustomPopover.tsx`, `inputs/DatePicker.tsx` + `ui/calendar.tsx`, checkbox/switch, file input; wire password reveal, prefix/suffix, disabled, `aria-invalid`/`aria-describedby`, error/help lines.
4. Selects/menus: align `ui/select.tsx`, `ui/popover.tsx`, `ui/command.tsx`, `ui/dialog.tsx`, `ui/tooltip.tsx`, `modals/Modal.tsx` borders/shadows/type to `#c7d5de` panels.
5. Tables: restyle `components/table/Table.tsx`, `TablePagination.tsx`, `DebouncedInput.tsx`, `ui/table.tsx` to panel + toolbar + `h-9` search + Columns menu + pagination; add shared loading/error/empty states; keep column defs and data flow in `hooks/*/columns.*`.
6. Charts: add `@tanstack/charts` (pin to the proven `0.14.0` line); rewrite `components/graphs/DashboardChart.tsx` on the `defineChart(lineY + dot)` pattern with legend, tooltip, `ChartEmpty`, and exact-values `<details>` table; remove `recharts` from `package.json`; update `dashboard.constants.ts` consumers and `pages/dashboard`.
7. Sidebar/navbar/layout: reskin `containers/Sidebar.tsx`, `Navbar.tsx`, `UserLayout.tsx`, `outlets/AuthenticatedRoutes.tsx` to app-shell look (product mark, group labels, active states, mobile collapse, page-header pattern); keep nav items/permissions.
8. Auth pages: restyle `pages/authentication/*` (Login, SignUp, RequestInvitation, ForgotPassword, ResetPassword, CompleteInvitation) onto the centered card + flow-shell pattern with existing fields; align `components/layout/PublicNavbar.tsx`/`PublicFooter.tsx`.
9. Toasts + feedback: restyle `App.tsx` Toaster + `ui/sonner.tsx` to panel treatment; normalize `toast.success/error` copy; align `feedbacks/ErrorLabels.tsx`.
10. Sweep + delete: landing (`pages/landing`, `components/landing`), tracks/releases/contributors surfaces, `text/Headings.tsx`; remove Poppins/Libre, `press-on-*`, `chart-*` remnants and dead shadcn overrides; verify no `recharts`/`.dark`/`invert-surface` references remain.

## Validation Plan

- `cd client && npm run lint` — expected: clean.
- `cd client && npx tsc --noEmit` — expected: no type errors (covers the charts engine swap and input prop changes).
- `cd client && npm run build` — expected: production bundle succeeds with `@tanstack/charts`, without `recharts`.
- Manual per-surface checks (dev server): inputs (default/focus/disabled/error, password reveal, date/select/combobox menus, 320px width, keyboard focus ring visible, reduced-motion on); tables (search, sort, column visibility, pagination, loading/error/empty); charts (multi-series, tooltip, empty state, exact-values table, screen-reader labels); sidebar (expanded/collapsed/mobile, active route, group headers); auth (all six pages at 360px and desktop, error copy, focus order); toasts (success/error visible on light panel).
- Highest-risk validation: the TanStack Charts swap on the dashboard — verify real data renders, tooltips work, and the build carries the new dependency before deleting `recharts`.

## Risks / Rollback

- React version gap (Lens React 18 vs. source React 19): pin `@tanstack/charts 0.14.0` and prove the dashboard build before removing `recharts`; if incompatible, keep the TanStack API shape but hold the upgrade as the single rollback point.
- Dark-mode removal is user-visible: single-swap means no fallback theme; rollback is revert of the `index.css` commit unit.
- Font swap (Poppins → DM Sans) shifts metrics: check dense surfaces (tables, release forms) at 320px and desktop for wrapping.
- Icon sets differ (FontAwesome in Lens vs. lucide in source): keep Lens icons, change only color/size/placement to avoid a second migration.
- Toast duration (`duration={1000}` in `App.tsx`) is too fast for the new treatment: set an explicit readable duration during restyle.

## Open Questions

None.
