## Goal

Two tracks, one implementation slice: (1) make Combobox search work reliably inside `Modal` (CreateRelease's Type field as the reference case); (2) replace the warm beige-gray "AI slop" line/surface system with a calm, minimal palette anchored only on the enforceable `--lens-blue: rgb(31, 98, 142)`.

## Success Criteria

- In the CreateRelease modal: opening the Type dropdown, typing a query, filtering, keyboard-navigating, selecting, and pressing Escape all behave exactly as they do on plain pages, and the modal never closes except via overlay click, its close control, or successful submit.
- No `slop` tokens remain: zero warm-beige surfaces (`#e4e2dd` sand fills), zero blue-gray text/borders (`#6f6a5f`, `#8b867b`, `#e3dfd5`, `#cfcbc1`, `#d8d4c9`); every background/border resolves to white, true neutrals, or a blue-whisper tint derived from `--lens-blue`.
- `--lens-blue` keeps its exact value `rgb(31, 98, 142)`; dark-mode branches stay deleted.
- `npx tsc --noEmit` and `npm run build` pass; the manual repro matrix below signs off.

## Context And Current Facts

### Combobox-in-Modal (from installed Radix source + current files)

- `Combobox.tsx` renders a `modal` Radix Popover containing cmdk `Command` with a controlled `CommandInput` (`value`/`onValueChange` + `shouldFilter={false}` + manual `visibleOptions` filter), plus a `searchInputRef` + `onOpenAutoFocus` preventDefault + rAF manual-focus hack and `onCloseAutoFocus` preventDefault.
- `Modal.tsx` portals a modal Radix `Dialog` into `#modal`; `ui/dialog.tsx` already carries an `onPointerDownOutside` guard that prevents dialog dismiss for targets inside `[data-radix-popper-content-wrapper], [data-radix-select-content], [data-combobox-menu]`.
- Verified in `node_modules`: modal Dialog wires `onDismiss → onOpenChange(false)` (closes our modal); modal Popover sets `trapFocus: context.open`, `disableOutsidePointerEvents`, `hideOthers`, `RemoveScroll`; the focus-scope stack pauses underlying traps, so the popover trap should win while open; `z-50000` popover correctly stacks above the `z-50` dialog; the popper-wrapper attribute exists in `@radix-ui/react-popper` and covers both Popover and Select dropdowns.
- What this rules out: dialog-closes-on-dropdown-click (guarded), stacking/pointer-events (correct), implicit cmdk filtering (bypassed by manual filter). What remains unverified without a browser: whether keystrokes reach the input (focus path) and whether the rAF focus hack fights the FocusScope autofocus.

### Palette (current `client/src/index.css` + sweep state)

- Enforceable anchor: `--lens-blue: rgb(31, 98, 142)` (also in built CSS).
- Flagged slop: `--surface/--muted #e4e2dd` sand, `--slate #6f6a5f`, `--placeholder #8b867b`, `--line #e3dfd5`, `--line-strong #cfcbc1`, `--menu-border #d8d4c9`, `--ink #100e09`, `--label-ink #3d3830`; page shells already white.
- Functional colors (danger `#a54b4b` family, approve teal) were not flagged.

## Constraints And Non-goals

- `--lens-blue` value is immutable.
- No behavior/API/routing changes; no new pages; auth flows untouched.
- No dark-mode reintroduction; the single in-app dark empty-state panel may only be re-tinted, not expanded.
- Non-goals: cmdk version upgrades, React 19 migration, replacing Radix primitives, landing copy changes.

## Key Decisions

- Combobox fix: replace cmdk `CommandInput` with a plain controlled `<input>` wired to the existing `search` state, keeping cmdk only for list rendering, arrow/enter selection, and empty state. Rejected options: (a) more focus-timing hacks — the rAF manual focus is a moving part that fights FocusScope autofocus and is removed; (b) non-modal Popover — would surrender the trap that currently protects typing and re-expose dismiss races; (c) cmdk upgrade — out of scope, same API risk.
- Palette direction: true-neutral minimalism with blue-whisper functional tints, not another beige or blue-gray ramp. Rejected keeping warm sand (flagged as slop) and rejected blue-tinted grays (same AI-default family as the blue-grays being removed).
- Exact replacement map (old → new): ink `#100e09` → `#1C1917`; secondary text `#6f6a5f` → `#57534E`; placeholder/muted `#8b867b` → `#A8A29E`; hairline `#e3dfd5` → `#E7E5E4`; control/menu borders `#cfcbc1`/`#d8d4c9` → `#D6D3D1`; surfaces `#e4e2dd` → white, with hover `#F4F7FA` and selected `#E9F1F7` (both blue whispers); label ink `#3d3830` → `#1C1917`; focus ring → `rgba(31,98,142,.25)`; overlay → neutral black; approve teal → desaturated green `#3E7C4F`/`#EDF4EE` (assumption: functional green may shift hue; flagged below).
- Dark empty-state panel: re-tint base to `#1C1917`, keep pale microcopy.

## Recommended Approach

1. Reproduce first on the dev server using the matrix below and record which branch fires; do not edit until the symptom is named.
2. Apply the deterministic Combobox fix (plain input, drop the rAF hack, keep manual filter + cmdk list).
3. Transplant the neutral token set, sweep hardcoded warm hexes, re-tint the one dark panel.
4. Validate: tsc, lint, build, plus matrix sign-off.

## Work Plan

1. Repro matrix on `npm run dev` (CreateRelease modal): open Type dropdown; type "sin" and confirm filtering; arrow-down + Enter to select and confirm the modal stays open with the value set; Escape closes only the dropdown; overlay click still closes the modal. Record the failing step.
2. `components/inputs/Combobox.tsx`: swap `CommandInput` for a plain controlled input bound to `search`/`setSearch` (same classes/placeholder/aria); delete `searchInputRef` and the rAF `onOpenAutoFocus` hack (keep its `preventDefault` so FocusScope autofocus, which targets the first tabbable element — the input — proceeds deterministically); keep `shouldFilter={false}`, manual `visibleOptions`, `onCloseAutoFocus` preventDefault, and cmdk selection. If arrow/enter navigation regresses, keep cmdk `CommandInput` and note it as the single rollback point.
3. `index.css`: apply the replacement map (tokens, focus ring, overlay, shadows, chart grays to `#57534E`/`#D6D3D1`); update `field-chrome`/`field-label`/`field-help` dependent tones; re-tint `.invert-surface` to `#1C1917`.
4. Sweep hardcoded warm hexes across `src` (tables, pagination, charts, auth shadows, empty states) to white/neutrals/blue-whispers per the map; delete dead sand variables.
5. Re-run the repro matrix plus one plain-page combobox (lyrics Language picker) to prove parity.

## Validation Plan

- Repro matrix sign-off (manual, dev server): filter-while-typing, select-keeps-modal-open, Escape-only-closes-dropdown, overlay-click-closes-modal, plain-page parity.
- `cd client && npx tsc --noEmit` — expected: clean.
- `cd client && npm run build` — expected: green, no `--lens-blue` drift (grep built CSS).
- `cd client && npm run lint` — expected: 0 errors (6 pre-existing warnings unchanged).
- Highest-risk validation: typing + Enter-select inside the CreateRelease modal; if it fails, the rollback is the cmdk-Input variant, not a Popover modality change.

## Risks / Rollback

- Plain input may weaken cmdk keyboard interplay (type-ahead highlight sync). Mitigation: cmdk still owns items/selection; fallback is restoring cmdk `CommandInput` with the manual filter kept.
- Neutral borders on white reduce separation vs. beige fills; hairlines + spacing carry structure — verify dense surfaces (wizard forms, tables) at 320px and desktop.
- Removing the rAF focus changes which element autofocuses on open (now deterministically the search input via scope autofocus); if AT testing shows focus loss, re-add a scope-friendly autofocus instead of rAF.
- Approve-green hue shift (`#4F8795` → `#3E7C4F`) is an assumption (see Open Questions).

## Open Questions

- Which matrix step currently fails for you (can't type vs. dropdown closes modal vs. list doesn't filter)? The plan covers all three branches, but your answer picks the verification emphasis.
- May the functional approve-green shift hue to desaturated green, or must it stay teal?
