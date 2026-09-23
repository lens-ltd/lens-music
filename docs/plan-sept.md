# Lens Music: production plan (September 2026)

> A living document. Agents and people claim tasks, update their status, and add findings here. Last full audit: 2026-09-23.

## How to use this document
- **Claiming a task:** set `Status` to `in progress (<agent/person>, <date>)`. When finished, set it to `done (<PR/commit>)`. Change only your own task rows.
- **Task IDs** are stable. Don't renumber them. New tasks take the next free number in their workstream.
- **Dependencies:** start a task only when every task in its `Deps` is done, or say in the task why you went ahead.
- **Findings:** add new findings to the relevant workstream's "Findings" list with a file path. Don't fix out-of-scope things silently.
- **Decisions:** record them in the Decision log at the bottom, with the date.
- **Paths:** `client/…` and `api/…` are relative to the repo root.
- **Definition of done** (every task): typecheck and build pass, and new logic has tests. A UI task also needs a screenshot at 375px and 1440px, no new `text-[Npx]` sizes, shadows or hardcoded colors, and uses the design rules below.

## Product decisions (as of 2026-09-23)
| Topic | Decision |
|---|---|
| Customer | Artists and labels, **artists first**. One account can manage several artists. |
| Store delivery | **Through an aggregator (not yet chosen).** Build a `DeliveryAdapter` interface. The target format is DDEX ERN 4.3. |
| Payouts | **Provider not chosen.** Build a `PayoutProvider` interface. Mobile money, bank transfer and PayPal/Payoneer are all candidates. |
| Revenue model | Free to release. Lens keeps **15% of earnings**. |
| Timeline | No fixed date. Work in milestone order. |

## Design rules (client)
Tokens live in `client/src/index.css`.
- **Palette:** black, white and brand blue `--signal`. Use `--danger` and `--success` only for status. No gradients.
- **Surfaces:** pages sit on the gray `--canvas`. Containers are white `card-framed` or `SectionCard` cards with a 1px `--line` border. Tiles inside a card use `--surface`. Never put a card inside a card or white on white.
- **Type:** use the `type-*` utilities; no `text-[13px]`-style values. The minimum size is 12px. `--muted` is for secondary text.
- **Shadows:** only on menus, modals and the auth card.
- **Radius:** 6px (`--radius-card`/`--radius-control`); no `rounded-xl`.
- **Buttons:** one primary per view. Controls are 40px, or 32px for small ones. Every field uses `field-chrome`.
- **Icons:** `react-icons/lu`, and `react-icons/si` for brand marks.
- **Reuse:** `SectionCard`, `KeyValueList`/`KeyValuePair`, `StatusBadge`, `ExternalLink`, `Table`, `Modal`, `Combobox`.
- **Copy:** sentence case. No ALL-CAPS eyebrow labels. Artists see plain-language terms, never raw DDEX or enum names.

## Current state (summary of the audit)
**What works:**
- Auth with invitations and password reset.
- RBAC with roles and permissions.
- Contributors, including memberships, managers and a verification queue.
- Labels and stores (DDEX settings).
- A 6-step release wizard: Overview → Upload tracks → Contributions → Regions → Stores/Deals → Preview.
- Track management, including audio upload to Cloudinary and credits/rights.
- Lyrics create and sync.
- An admin review queue with approve/reject and emails.
- A dashboard backed by the real `/dashboard/summary`.
- Detailed server-side release validation (`api/src/modules/releases/releases.service.ts`).

**Critical gaps:**
1. **Money doesn't exist:** no sales-report import, 15% commission, splits, statements, balances or payouts. The landing, login and legal copy promise all of these.
2. **Delivery doesn't exist:** the ERN is generated but never sent. Stores have `PLACEHOLDER_*` DDEX party IDs. Nothing sets DELIVERED, LIVE or TAKENDOWN.
3. **The ERN won't validate:** the 4.3 header wraps 3.8-style elements (`*DetailsByTerritory`, `DealTerms/Usage`), and nothing checks it against the XSD.
4. **Identifiers are invalid:** UPCs look like `LNS2026483` (`api/src/helpers/releases.helper.ts:5`), and there's no ISRC allocation.
5. **Audio QC is broken:** `music-metadata` isn't installed, direct uploads trust the file details the browser reports, and MP3s pass as lossless.
6. **Release integrity:** releases aren't locked after submit/approve, `/submit` accepts any status, and a LIVE release can be hard-deleted.
7. **Platform hygiene:**
   - Database: `synchronize: true` with no migrations; no soft delete.
   - Security: open CORS, no rate limiting or helmet, and the seed admin password is hardcoded (`Test@123`).
   - Auth: 1-week JWT with no refresh or revocation; `PATCH /users/:id/role` can grant SUPER_ADMIN.
   - Operations: no env validation, health check, tests, CI or Docker.
8. **Wizard UX:**
   - Layout and styling: a card inside a card on every step, forbidden shadows, `--surface` on `--surface`, and up to 4 primary buttons in one view.
   - Navigation: steps can be skipped, and there's no autosave or unsaved-changes guard.
   - Mismatches: "worldwide" means one thing in Regions and another in Preview; the P-line and C-line are mislabeled.
   - Presentation: artists see DDEX terms, and Preview uses read-only inputs with no "Edit" links back to steps.
9. **Client gaps:**
   - `/settings` has no route (404), and there's no in-app password change.
   - `ListLyrics` is a stub, and Labels and Lyrics aren't in the sidebar.
   - Error handling: no error boundary, and a 401 isn't handled.
   - Admin routes aren't gated in the client.

---

## Milestones
| Milestone | Goal | Task IDs |
|---|---|---|
| **M0 Safe foundation** | Nothing in production can corrupt data or be abused. | OPS-1…4, SEC-1…6, LIFE-1…4, ADMIN-1, UI-1, MONEY-12 |
| **M1 Trustworthy releases** | An artist can create a correct release without help. | WIZ-1…28, MEDIA-1…5, ID-1…3, CAT-1, CAT-2, CAT-5, ACCT-1…3, DDEX-1…3, ADMIN-2 |
| **M2 Delivery** | Approved releases reach stores through the aggregator, and their status is tracked. | OPS-5…7, DLV-1…7, DDEX-4…5, LIFE-5…8, ADMIN-3, SEC-7…11 |
| **M3 Money** | Earnings are imported, split, reported and paid out. | MONEY-1…11, ACCT-4…6 |
| **M4 Growth and polish** | Retention and self-serve features. | GROW-1…8, UI-2…6, CAT-3/4/6/7, ADMIN-4…6, OPS-8…9, SEC-12, MEDIA-6 |

### Current phase: M1a, wizard stability and UI (from 2026-09-23)
Goal: an artist can move through all 6 steps without losing their input, never sees another release's data, gets a clear message whenever something fails, and sees one layout with one primary button per step. Client-only work comes first; tasks that need new server work wait.

| PR | Tasks | Summary |
|---|---|---|
| 1 Safety net ✅ | UI-1, WIZ-5, WIZ-23, WIZ-24, WIZ-25 | Error boundary, reset state on `:id` change, `useWizardStepNavigation` hook, shared error helper, `Button` disables while loading. Tests for `navigations.helper` and the hook. |
| 2 Data integrity | WIZ-26, WIZ-27, WIZ-28, WIZ-16, WIZ-18 (auto-deal only) | Refetches never wipe edits; error vs empty states; full lists; no server writes before Save; remove the auto-created worldwide deal. |
| 3 Layout shell | WIZ-1, WIZ-2, WIZ-3 (structural) | Drop the wrapper card, `SectionCard` per section, shared `WizardStepFooter` and `WizardStepHeader`, one primary per step, flat tiles, errors in `--danger`. |
| 4 Stepper and autosave | WIZ-4, WIZ-6, WIZ-7, WIZ-22 (nav) | One accessible stepper with locked later steps and a mobile bar; Overview autosave, unsaved-changes guard; "Needs review" on later steps. |
| 5 Search and credits | WIZ-12, WIZ-13 | `Combobox` for label and contributor search; grouped roles, drag order, per-row delete. |
| 6 Step content | WIZ-9, WIZ-15, WIZ-17 (client parts) | Overview wording and fields; explicit worldwide choice and continents; grouped stores with logos, DDEX badge admin-only. |
| 7 Preview | WIZ-19, WIZ-20 (client part), WIZ-22, UI-2 (wizard-steps) | `KeyValueList` summary with Edit links, danger banner, single "Submit for review", no `text-[Npx]` left in the wizard. |

Deferred from M1a (blocked): WIZ-8 (MEDIA-4), WIZ-11 bulk upload/QC (MEDIA-3, ID-2), WIZ-14 (MONEY-5), WIZ-18 server-generated deals, WIZ-20 structured `{step, field}` errors (API), WIZ-21 (LIFE-7), LIFE-4 (LIFE-2, CAT-5).

---

## Workstream OPS: infrastructure and quality (api + client)

**OPS-1 · P0 · Replace `synchronize` with migrations**
- Files: `api/src/app.module.ts:43`, `api/src/data-source.ts:12`
- Acceptance:
  - `synchronize: false`.
  - A baseline migration generated from the current schema.
  - `npm run migration:generate` and `migration:run` scripts.
  - The README documents the flow.
- Deps: none. Status: open.

**OPS-2 · P0 · Validate environment variables at startup**
- Files: `api/src/app.module.ts` (a `ConfigModule` schema), `api/.env.example`, a new `client/.env.example`
- Acceptance:
  - The app refuses to boot if `JWT_SECRET`, DB, Cloudinary or Resend settings are missing.
  - `DDEX_SENDER_DPID` is added to `.env.example`.
- Deps: none. Status: open.

**OPS-3 · P0 · Test harness**
- Files:
  - api: Jest with an e2e Postgres (testcontainers or a docker-compose service).
  - client: add a `"test": "vitest run"` script and fix the 2 failing `ComboboxModal.spec.tsx` tests.
- Acceptance: `npm test` passes in both packages. Release validation and the status transitions have unit tests.
- Deps: none. Status: done (branch `m0/ops-3-test-harness`, 2026-09-23).
  - api: 35 unit tests + 2 `it.todo` for LIFE-1; 6 e2e tests (including register → login → `GET /api/releases`) pass against local Postgres.
  - e2e uses testcontainers when Docker is available, or `E2E_DB_HOST=…` to create and drop a throwaway DB on any server. For OPS-4, use a GitHub `services: postgres` container with `E2E_DB_HOST`.

**OPS-4 · P0 · CI**
- Files: `.github/workflows/ci.yml`
- Acceptance: on every PR, lint, typecheck, test and build both packages. Change `client` `build` so it no longer runs `npm i`.
- Deps: OPS-3. Status: open.

**OPS-5 · P1 · Docker and deployment**
- Files: `api/Dockerfile`, `docker-compose.yml` (api, postgres, redis)
- Acceptance: one command runs the whole stack. Deployment targets are documented (the client is Azure SWA, `client/staticwebapp.config.json`).
- Deps: OPS-1. Status: open.

**OPS-6 · P1 · Observability**
- Files: `api/src/main.ts`; a client error boundary (see UI-1)
- Acceptance:
  - `GET /api/health` checks the DB.
  - Sentry (or similar) in both apps.
  - pino request IDs.
  - `AppError` logs 4xx at `warn`, not `error`.
  - `enableShutdownHooks()`.
- Deps: none. Status: open.

**OPS-7 · P1 · Background jobs**
- Files: a new `api/src/modules/jobs` (BullMQ plus Redis)
- Acceptance: a queue for delivery, report import, emails and media QC, with retries and a dead-letter queue. An admin can view failed jobs.
- Deps: OPS-5. Status: open.

**OPS-8 · P2 · API docs**
- Files: `@nestjs/swagger` in `api/src/main.ts`
- Acceptance: `/api/docs` is available in non-production environments, and DTOs are annotated.
- Deps: none. Status: open.

**OPS-9 · P2 · Clean up dependencies**
- Acceptance:
  - api: move `nodemon`, `ts-node` and `typescript` to devDependencies; add `uuid` explicitly.
  - client: remove `three`, `@react-three/*` and `moment`; standardize on date-fns.
  - Update the root README (it's Express-on-Nest, not "NestJS only", and the dashboard is live, not sample data).
- Deps: none. Status: open.

Findings:
- `client`: dialog, popover, select and tooltip each had their own copy of `@radix-ui/react-dismissable-layer`, so pressing Escape in a Combobox inside a Modal went to the dialog instead of the dropdown. Fixed in OPS-3 by upgrading all `@radix-ui/*` packages together. Keep them on matching versions.
- `api`: the app now honors `DB_SSL=true|false` (`api/src/helpers/database.helper.ts`). When it's unset, it keeps the old host-based rule. `.env.example` used to ship `DB_SSL=false`, which the app ignored. Check that no deployed env sets `DB_SSL=false` for a remote DB.
- `api`: the Joi `validateEmail` (`api/src/helpers/validations.helper.ts`) rejects reserved TLDs such as `.test`. Tests use `example.com`.

## Workstream SEC: security

**SEC-1 · P0 · HTTP hardening**
- Files: `api/src/main.ts:30`
- Acceptance:
  - helmet.
  - CORS allowlist from env.
  - `@nestjs/throttler` globally, with strict limits on login, register, password reset and invitation requests.
- Status: open.

**SEC-2 · P0 · Remove the hardcoded seed admin**
- Files: `api/src/seeds/user.seeds.ts:8`
- Acceptance: the password comes from env, the admin must change it on first login, and the production seed refuses a default.
- Status: open.

**SEC-3 · P0 · Close the role-escalation hole**
- Files: `api/src/modules/users` (`PATCH /:id/role`)
- Acceptance: only SUPER_ADMIN can grant SUPER_ADMIN or ADMIN, and nobody can change their own role. Tests cover both rules.
- Status: open.

**SEC-4 · P0 · DTOs everywhere**
- Files: the `lyrics` controller (it takes `Partial<Lyrics>`), roles `createdById`, and a sweep of every `@Body()`
- Acceptance: no entity types in `@Body()`, and the server sets audit fields. Add `ParseUUIDPipe` on every `:id`.
- Status: open.

**SEC-5 · P0 · Upload limits**
- Files: every `FileInterceptor`
- Acceptance:
  - Multer `limits` for size and file count.
  - Correct error messages (the audio error says 50 MB but the limit is 100 MB).
  - Prefer direct-to-storage uploads (MEDIA-2).
- Status: open.

**SEC-6 · P0 · Token lifecycle**
- Files: the api auth module; `client/src/state/api/*` base query
- Acceptance:
  - A 15-minute access token plus a rotating refresh token (httpOnly cookie), `POST /auth/refresh`, `POST /auth/logout` and `GET /auth/me`.
  - Permissions are read fresh rather than trusted from the token.
  - Deactivated users are blocked immediately.
  - The client handles a 401 by refreshing, then logging out.
- Status: open.

**SEC-7 · P1 · Pagination caps**
- Files: `api/src/helpers/pagination.helper.ts`
- Acceptance: page size capped at 100, and every list endpoint paginated.
- Status: open.

**SEC-8 · P1 · Privacy of the contributor directory**
- Acceptance: `GET /contributors` hides email and phone from anyone who isn't the owner, a manager or an admin, and lists are scoped to the user's workspace (ACCT-1).
- Deps: ACCT-1. Status: open.

**SEC-9 · P1 · Private master files**
- Acceptance: audio uses Cloudinary `authenticated` delivery (or S3 with signed GET URLs), so unreleased masters aren't publicly readable.
- Status: open.

**SEC-10 · P1 · Hash reset and invitation tokens at rest.** Status: open.

**SEC-11 · P1 · Password policy and email verification on self-signup.** Status: open.

**SEC-12 · P2 · 2FA (TOTP) for admins, optional for users.** Deps: ACCT-4. Status: open.

## Workstream LIFE: release lifecycle and integrity (api + client)

**LIFE-1 · P0 · State machine**
- Files: `api/src/modules/releases/releases.service.ts`, `api/src/constants/release.constants.ts`
- Acceptance:
  - One `transition(release, to)` function with an allowed-transitions table: DRAFT→VALIDATED→REVIEW→APPROVED→DELIVERING→DELIVERED→LIVE, plus →TAKEDOWN_REQUESTED→TAKENDOWN.
  - `/submit` accepts only DRAFT or VALIDATED.
  - `/approve` re-validates and blocks self-approval.
- Status: open.

**LIFE-2 · P0 · Editing lock**
- Files: `api/src/modules/catalog-access/catalog-access.service.ts` (`assertCanWriteRelease`)
- Acceptance: writes to a release or its children are rejected unless the status is DRAFT or VALIDATED, with a 409 and a clear message.
- Status: open.

**LIFE-3 · P0 · Safe deletes**
- Acceptance:
  - Only a DRAFT release can be deleted.
  - Soft delete (`deletedAt`) on release, track, contributor and label.
  - Hard cascades are removed from user-facing paths.
- Status: open.

**LIFE-4 · P0 · Client respects the lock**
- Files: `client/src/Router.tsx:301`, `client/src/hooks/releases/columns.releases.tsx:62`, `client/src/pages/dashboard/UserDashboard.tsx`
- Acceptance:
  - For any status other than DRAFT or VALIDATED, "Resume" becomes "View".
  - The wizard route redirects to a read-only release page.
- Deps: LIFE-2, CAT-5. Status: open.

**LIFE-5 · P1 · Change a live release**
- Acceptance: the user opens a "change request" (a new draft revision linked to the live release). It goes through review, and the approved version is redelivered as an ERN UpdateMessage.
- Deps: DLV-1. Status: open.

**LIFE-6 · P1 · Takedown flow**
- Acceptance:
  - The artist requests a takedown with a reason, and an admin approves it.
  - A takedown message is sent through the adapter (the ERN deal end date, or TakedownMessage per the aggregator's spec), and the status moves to TAKENDOWN.
  - Uses `Deal.takedownDate` and `takedownReason`.
- Deps: DLV-1. Status: open.

**LIFE-7 · P1 · Release history**
- Acceptance: every transition is stored (who, when, from→to, notes) and shown as a timeline on the release page and the review page.
- Deps: ADMIN-2. Status: open.

**LIFE-8 · P1 · Track status follows release status**
- Acceptance: track statuses (READY, DELIVERED, LIVE, TAKENDOWN) change with the release; unused enum values are removed.
- Status: open.

## Workstream ID: identifiers

**ID-1 · P0 · Real UPCs**
- Files: `api/src/helpers/releases.helper.ts:5`, release create and overview
- Acceptance:
  - Remove the `LNS…` UPC.
  - A UPC pool table: EAN-13 from a GS1 prefix range, or imported from the aggregator.
  - Allocate one on submit (not on create).
  - "I already have a UPC" input, validated with the existing unused `isValidUpc()`.
- Status: open.

**ID-2 · P0 · ISRC allocation**
- Acceptance:
  - Registrant code set in config.
  - Allocate `CC-XXX-YY-NNNNN` sequentially per year inside a transaction.
  - "I already have an ISRC" override, still validated.
- Status: open.

**ID-3 · P1 · Catalog number**
- Acceptance: a per-label pattern, kept separate from UPC.
- Status: open.

## Workstream MEDIA: audio and artwork quality control

**MEDIA-1 · P0 · Install `music-metadata`**
- Files: `api/package.json`, `api/src/modules/tracks/tracks.service.ts:70`
- Acceptance: sample rate, bit depth, channels and duration come from the file on the server.
- Status: open.

**MEDIA-2 · P0 · Server-side check of direct uploads**
- Files: the `POST /tracks/:id/audio/register` flow
- Acceptance: after the direct upload, a job downloads the file, probes it (ffprobe or music-metadata) and recalculates the SHA-256. Any value the browser reported is ignored.
- Deps: OPS-7. Status: open.

**MEDIA-3 · P0 · Audio rules**
- Acceptance:
  - Accept only WAV or FLAC, 16/24-bit, at 44.1 kHz or higher, stereo. Reject MP3 and other lossy formats.
  - Store the real `fileType`.
  - Flag silence or clipping (P2).
  - The UI shows a pass/fail for each rule.
- Deps: MEDIA-1. Status: open.

**MEDIA-4 · P0 · Artwork rules**
- Acceptance: check the real format from the file itself, not the extension (sharp), 3000–6000px square, RGB, and under 20 MB.
- Status: open.

**MEDIA-5 · P1 · Before-upload checks in the browser**
- Files: `client/src/pages/releases/wizard-steps/ReleaseWizardOverview.tsx:790`, `client/src/pages/tracks/components/TrackAudioPanel.tsx:82`
- Acceptance: read the image size and audio header before uploading and show inline errors. Uses the drop zone from WIZ-8.
- Status: open.

**MEDIA-6 · P2 · Derivatives**
- Acceptance: MP3 preview clips and the cover thumbnail are generated by a job.
- Deps: OPS-7. Status: open.

## Workstream WIZ: release wizard revamp (client, some api)

Files: `client/src/pages/releases/ReleaseWizardPage.tsx`, `wizard-steps/**`, `client/src/containers/releases/ReleaseNavigationPanel.tsx`, `ReleaseProgressNavigation.tsx`

### Structure and surfaces
**WIZ-1 · P0 · Remove the card inside a card**
- Acceptance:
  - Drop the `rounded-(--radius-card) bg-(--paper) p-6` wrapper (`ReleaseWizardPage.tsx:220`); it holds the `card-framed` sidebar and every step's cards.
  - Every step section is a `SectionCard` on the canvas.
  - Replace the 4 heading styles (`RelaxedHeading`, `h2 text-xl`, serif `text-[18px]`, `Heading h3`) with one `WizardStepHeader`.
- Status: open.

**WIZ-2 · P0 · One step footer**
- Acceptance:
  - A shared `WizardStepFooter` (sticky, `--paper` with a `--line` top border): Back (secondary), a saved-state indicator, and one primary "Save and continue".
  - Remove the duplicate top buttons (Regions `:187`, Stores `:212`).
  - Secondary actions ("Add label", "Add deal", "Add track") become secondary buttons.
- Status: open.

**WIZ-3 · P0 · Remove shadows and fix contrast**
- Acceptance:
  - Track card: `bg-(--paper)` on the white shell → a flat `--surface` tile, and the title in `type-card-title` `--ink` (`ReleaseTrackCard.tsx:87,90`).
  - `bg-white/20` in `ReleaseProgressNavigation.tsx:120`.
  - Store tiles: white tiles with a border, not `--surface` on `--surface` (`Stores:254,271,289`).
  - Errors in `--danger` (`Overview:819`, `Regions:265`, `Stores:308`, `PreviewValidationBanner:30-31`).
  - Replace `text-[Npx]` with `type-*` (77 places in the wizard as of 2026-09-23).
  - (The region tile and contributor row shadows are already gone.)
- Status: open.

**WIZ-4 · P1 · Step navigation**
- Acceptance:
  - The sidebar and tabs are a single accessible stepper (buttons, `aria-current="step"`, text for "Completed"), not a link to the same page.
  - Later steps are locked until the earlier ones are complete, but completed steps can be revisited.
  - On mobile, show a compact "Step 3 of 6" bar with a sheet listing the steps.
- Status: open.

**WIZ-5 · P1 · Reset state between releases**
- Acceptance: dispatch `resetNavigationState` and clear `state.release` when the `:id` changes, so the previous release never flashes up.
- Status: done (branch `m0/ops-3-test-harness`, M1a PR 1, 2026-09-23). The wizard is keyed by `:id`, resets navigation, release and tracks on mount, and renders no step until `release.id` matches the route.

**WIZ-6 · P1 · Autosave and unsaved-changes guard**
- Acceptance:
  - Autosave a draft after an 800ms debounce, with "Saved · 12:04" in the footer.
  - A `beforeunload` guard plus a router blocker.
  - Stop the Overview `useEffect` reset that wipes typing (`Overview:234-292`).
- Status: open.

**WIZ-7 · P1 · Invalidate completion**
- Acceptance: editing a completed step marks later steps as needing review. The server's own VALIDATED→DRAFT demotion stays the source of truth.
- Status: open.

### Step content
**WIZ-8 · P0 · Overview: cover art**
- Acceptance:
  - A drag-and-drop zone with a preview before upload.
  - Requirements shown upfront (3000×3000, JPG/PNG, RGB).
  - The preview is at least 240px on mobile (not `max-w-[20vw]`).
- Deps: MEDIA-4. Status: open.

**WIZ-9 · P0 · Overview: fields and wording**
- Acceptance:
  - Fix the "Control Line"/"Performance Line" labels to "© Copyright line" and "℗ Sound recording line".
  - Fix the Primary language placeholder.
  - Merge "Title version"/"Version" into one "Version (e.g. Remastered, Live)" field.
  - Description and marketing comment become textareas.
  - Metadata language is hidden under "Advanced" with the default `en`.
  - Add the primary artist(s) and a featured artist here, reusing the contributor search.
  - Add "Release label" (a single, simple field; multi-label goes under Advanced).
  - Add a subgenre.
  - Add a "Release timing" choice: as soon as possible, or a specific date and timezone.
- Deps: WIZ-12. Status: open.

**WIZ-10 · P0 · Overview: date rules and atomic save**
- Acceptance:
  - Check that pre-order < digital date, and the original date ≤ the digital date.
  - A single save endpoint (overview plus genres in one transaction), so no half-saved state. Clearing the secondary genre removes it.
- Status: open.

**WIZ-11 · P0 · Tracks step: upload inside the wizard**
- Acceptance:
  - Bulk drop several WAV/FLAC files, and one track is created per file (title taken from the filename or tags).
  - Each row shows its upload progress and QC result.
  - Edit a track in a side panel or modal without leaving the wizard (for now, `ManageReleaseTrack` stays for deep edits).
  - Always fetch tracks with `size: 100` (`:124,305`).
  - Add a Cancel button to the delete modal.
  - The Title field gets `rules` and the grid collapses on mobile (`CreateReleaseTrack.tsx:107-118`).
- Deps: MEDIA-3, ID-2. Status: open.

**WIZ-12 · P0 · Accessible Combobox for every search**
- Acceptance:
  - Replace the hand-built label and contributor search dropdowns with `components/inputs/Combobox` (cmdk), which has combobox/listbox roles, arrow keys and floating menus.
  - Debounce at 300ms (the contributor search is 2000ms).
  - "Create new artist" works inline, without opening a new tab.
- Status: open.

**WIZ-13 · P1 · Contributions: credits UX**
- Acceptance:
  - Roles are grouped: Artists, Writers, Production, Performers.
  - Order is set by drag, not a number input; duplicates are prevented.
  - Deleting asks for confirmation; delete spinners are per row.
  - Respect `isFetching`, so the empty state doesn't flash.
  - Show IPI/ISNI where present, and allow linking Spotify and Apple artist IDs (the enum already exists).
- Status: open.

**WIZ-14 · P1 · Contributions: splits**
- Acceptance: optional royalty splits per track (MONEY-5), shown as a total that must equal 100%. Collaborators are invited by email.
- Deps: MONEY-5. Status: open.

**WIZ-15 · P0 · Regions: fix the "worldwide" meaning**
- Acceptance:
  - An explicit choice: "Worldwide" (the default) or "Only selected countries" or "Worldwide except…".
  - Preview and the API use the same meaning (`PreviewTerritoriesSection.tsx:19,28,55`).
  - Group countries by continent, with select-all per group.
- Status: open.

**WIZ-16 · P0 · Regions: no silent server changes**
- Acceptance:
  - Unticking a country doesn't delete its overrides until Save (`ReleaseTerritoryDetailsSection.tsx:51-69`).
  - The overrides section lists only countries that have an override, plus "Add override for a country". It never shows 249 cards.
- Status: open.

**WIZ-17 · P0 · Stores: artist-friendly**
- Acceptance:
  - Group stores (Streaming, Download, Social/UGC, Regional), with logos (`react-icons/si`).
  - Hide the "Missing DDEX ID" badge from artists; unready stores are hidden, or shown as "Coming soon" to admins.
  - Opt-in toggles for YouTube Content ID, TikTok/Meta libraries and Shazam, each with a short explanation.
  - Remove the literal backticks (`:248`).
- Status: open.

**WIZ-18 · P0 · Deals hidden from artists**
- Acceptance:
  - Artists never see the DDEX Deals form. Deals are generated on the server from Regions, Stores, the release date and a price tier ("Standard", "Budget", "Premium") (`ReleaseWizardDealsSection.tsx`).
  - Admins get an "Advanced deals" panel on the review page.
  - Remove the silent auto-created worldwide deal (`:112-149`).
- Status: open.

**WIZ-19 · P0 · Preview: a real summary**
- Acceptance:
  - Replace the 23 read-only inputs with `KeyValueList` (`PreviewOverviewSection.tsx:71-110`).
  - Every section has an "Edit" link that jumps to its step.
  - Show cover art large, and give the track list a play preview.
  - Hide admin columns ("Added by", "Last updated").
- Status: open.

**WIZ-20 · P0 · Preview: actionable validation**
- Acceptance:
  - The API returns structured errors `{step, field, code, message}` in place of plain strings.
  - Show them at the top, grouped by step, each with a link to the field.
  - The failure banner uses danger styling.
  - One primary button, "Submit for review", which validates and submits in one action.
  - The Submit modal has a Cancel button and a checkbox confirming rights.
- Status: open.

**WIZ-21 · P1 · After submitting**
- Acceptance:
  - Show a confirmation page: what happens next, the typical review time, and a status timeline.
  - Email the artist when the release is approved, rejected, or goes live.
  - Move "Download DDEX" to the admin review page (`ReleaseWizardPreview.tsx:103-146`), served as `application/xml` through RTK Query.
- Deps: LIFE-7. Status: open.

**WIZ-22 · P1 · Accessibility and HTML validity**
- Acceptance:
  - Fix `menu`/`ul`/`p` nesting (`ReleaseNavigationPanel.tsx:140-178`, `ReleaseTrackCard.tsx:111`).
  - Icon buttons name their item (for example "Edit track Intro").
  - Errors are announced with `aria-live`.
  - Keys on the skeletons.
  - Full keyboard pass of all steps.
- Status: open.

### Stability
**WIZ-23 · P0 · Navigation never fails silently**
- Acceptance:
  - One `useWizardStepNavigation(currentStepName)` hook (`client/src/hooks/releases/navigation.hooks.ts`) with `goNext(saveFn?)`, `goBack()`, `goTo(step)` and `isNavigating`. Each is awaited and shows a `toast.error` on failure; the next step is not created if the save fails.
  - It replaces the 5 copies of complete-then-create (Overview `:211`, UploadTracks `:263`, Contributions `:515`, Regions `:126`, Stores `:139`), every Back handler and `activateStep` (`ReleaseWizardPage.tsx:116`).
  - `completeReleaseNavigationFlow` throws when no flow matches, instead of returning `undefined` (`navigation.hooks.ts:127`).
- Status: done (branch `m0/ops-3-test-harness`, M1a PR 1, 2026-09-23). `hooks/releases/wizardStepNavigation.hooks.ts`, used by every step and the page.

**WIZ-24 · P0 · Shared error-message helper**
- Acceptance: `getApiErrorMessage(error, fallback)` in `client/src/utils/` replaces `getMutationErrorMessage` (Overview `:64`), `getErrorMessage` (Regions `:22`) and about 15 inline `(error as {data?:{message}})` casts.
- Status: done (branch `m0/ops-3-test-harness`, M1a PR 1, 2026-09-23). Wizard steps and sections done; `pages/releases/SubmitRelease.tsx` and other pages still have their own casts.

**WIZ-25 · P0 · No double submit**
- Acceptance:
  - `Button` sets `disabled` while `isLoading` (`client/src/components/inputs/Button.tsx:59,97`).
  - A save's loading state covers its whole chain (Overview Save covers the genre upserts).
  - Back is disabled while a save runs (Stores `:169`).
  - Buttons with no `disabled` today: Preview Validate/Submit `:234`, Add deal, Deals Save, Add label, Labels Save, Add related, Related Save.
- Status: done (branch `m0/ops-3-test-harness`, M1a PR 1, 2026-09-23). `Button` is disabled while loading; `goNext` covers save + complete + create and ignores repeat clicks; Back is disabled while navigating.

**WIZ-26 · P0 · Refetch never wipes edits**
- Acceptance:
  - Overview: `useForm({ defaultValues })`, and `reset()` only when `release.id` changes or after a successful save (replaces `Overview:234-292`; a cover-art `setRelease` no longer clears the form).
  - Regions (`:66-74`) and Stores (`:61-68`) set up their selection once per release id and track `isDirty`.
  - `ReleaseTerritoryDetailsSection.tsx:71-87`: saved overrides win over the blank entries, so they show and no duplicate POST is sent.
- Status: open.

**WIZ-27 · P0 · Error states differ from empty states**
- Acceptance:
  - If `getRelease` fails, the wizard shows an error card with Retry, not "Step unavailable" (`ReleaseWizardPage.tsx:188-210`).
  - Tracks, contributors, stores, deals and labels show an error state from `isError`, and the empty state only when not fetching.
- Status: open.

**WIZ-28 · P0 · Full lists**
- Acceptance:
  - `fetchTracks` always passes `size: 100` (UploadTracks `:124,:305`), so `allTracksValidated` covers every track.
  - Related releases uses server search instead of loading `size: 100` (`RelatedReleasesSection.tsx:67`).
- Status: open.

Findings (audit, 2026-09-23; paths under `client/src/`):
- `resetNavigationState` (`state/features/navigationSlice.ts:37`) is never dispatched and `state.release` is never cleared, so switching releases renders the old release's step and a save can target the old id. `tracksList` in `trackSlice` is also global. → WIZ-5.
- `ReleaseTerritoryDetailsSection.tsx:51-69` deletes an override as soon as a country is unticked, and re-runs on every keystroke because `detailForms` is in its dependencies. → WIZ-16.
- `ReleaseWizardDealsSection.tsx:112-149` creates a worldwide deal on every mount with no deals and swallows errors (`:137`). → WIZ-18.
- Regions select-all ignores the search filter and renders about 249 override cards (`Regions:209-218`). → WIZ-15, WIZ-16.
- Contributions: no `isFetching` check (empty state flashes, `:416,:472`); one global delete spinner for every row (`:452`); uncontrolled Order input goes stale (`:438`); search debounce 2000ms (`:138`). → WIZ-13.
- The footer (Back + Save and continue) is copied in 6 steps; `components/layout/PageFooter.tsx` is unused by the wizard. → WIZ-2.
- Contributions (`:87-149`) and Labels (`:84-130`) share hand-built search dropdowns with the same debounce and request-id guard. → WIZ-12.
- Preview fetches release stores twice (`ReleaseWizardPreview.tsx:99`, `PreviewStoresSection.tsx:16`). → WIZ-19.
- `ReleaseNavigationPanel.tsx:166-170`: clipboard write not caught, `setTimeout` not cleared; the "•" separator shows without a catalog number (`:156`). Skeleton missing a `key` (`ReleaseProgressNavigation.tsx:99`). → WIZ-22.
- No `useDebounce` hook exists (only `components/table/DebouncedInput.tsx`), and there's no error boundary anywhere. → WIZ-6, UI-1.
- Client tests: only `components/modals/ComboboxModal.spec.tsx`. `utils/navigations.helper.ts` is pure and untested.

## Workstream DDEX: message generation

**DDEX-1 · P0 · Fix ERN 4.3 compliance**
- Files: `api/src/modules/ddex/ddex-ern-generator.service.ts`
- Acceptance: rewrite to the 4.3 structure. That means removing `*DetailsByTerritory`, adding `DisplayTitleText`/`DisplayArtist` and the `Deal/DealTerms` 4.3 form, and using the ISO `TerritoryCode` "Worldwide" as `Worldwide`.
- Status: open.

**DDEX-2 · P0 · XSD validation**
- Acceptance: vendor the ERN 4.3 XSD and validate every generated message (libxmljs2 or an xmllint job). Generation fails when validation fails. Add golden-file tests for a single, an EP and an album.
- Deps: OPS-3. Status: open.

**DDEX-3 · P0 · Party IDs**
- Acceptance: remove `PLACEHOLDER_*` store DPIDs from seeds (`api/src/seeds`). The sender DPID is required config, with no `'UNKNOWN'` fallback.
- Status: open.

**DDEX-4 · P1 · Real file names and codecs**
- Acceptance: the image codec is taken from the file, and `FilePath`/`FileName` follow the aggregator's batch layout rather than raw Cloudinary URLs.
- Deps: DLV-2. Status: open.

**DDEX-5 · P1 · Ownership check on `POST releases/:id/ddex/ern`.** Status: open.

## Workstream DLV: delivery through an aggregator

**DLV-1 · P0 · `DeliveryAdapter` interface**
- Files: a new `api/src/modules/delivery`
- Acceptance: `deliver(release, stores)`, `update()`, `takedown()`, `pollStatus()`, `ingestAcks()`. It is chosen by config. Ship a `ManualAdapter` first, which builds a downloadable batch zip (ERN, audio and art) for an admin to upload by hand.
- Status: open.

**DLV-2 · P1 · Batch packaging**
- Acceptance: the DDEX batch layout (`BatchComplete_*.xml`, `resources/`), with checksums and a job-based build.
- Deps: OPS-7, DDEX-2. Status: open.

**DLV-3 · P1 · Delivery pipeline**
- Acceptance:
  - On approve, queue delivery; the release moves to DELIVERING and each `ReleaseStore.deliveryStatus` goes PENDING→IN_PROGRESS→DELIVERED/FAILED.
  - Retries with backoff.
  - `ddexMessageSentAt` is set only when the message is actually sent (today it's set on generation).
- Deps: DLV-1, LIFE-1. Status: open.

**DLV-4 · P1 · Acknowledgements and live detection**
- Acceptance: ingest the aggregator's ACKs and status feed into the `ddexAcknowledgment*` columns. When the first store confirms, the release becomes LIVE; store links are stored per store.
- Deps: DLV-3. Status: open.

**DLV-5 · P1 · Aggregator adapter**
- Acceptance: implemented once the aggregator is chosen (Decision log). It supports SFTP or API as the aggregator requires.
- Deps: decision, DLV-1. Status: blocked.

**DLV-6 · P1 · Delivery panel for admins**
- Acceptance: a per-release, per-store status grid, a retry button and a download of the batch.
- Deps: DLV-3. Status: open.

**DLV-7 · P2 · Artist-facing status**
- Acceptance: the release page shows "Live on Spotify" with links, and "Processing on Apple Music".
- Deps: DLV-4. Status: open.

## Workstream MONEY: royalties, statements and payouts

**MONEY-1 · P0 · Ledger model**
- Acceptance:
  - Double-entry `LedgerEntry` (account, amount in minor units, currency, source, reference).
  - `Account` for each user or label and a Lens revenue account.
  - Balances are always derived from the ledger, never stored as editable numbers.
- Status: open.

**MONEY-2 · P0 · Sales report import**
- Acceptance:
  - Upload or fetch aggregator/DSP reports (CSV or DSR).
  - Map rows to track (ISRC) and release (UPC), with store, country, period, units and gross.
  - Imports are idempotent (file hash) and run as a job, with an admin review of the import (row counts, unmatched rows).
- Deps: OPS-7, ID-1, ID-2. Status: open.

**MONEY-3 · P0 · Commission**
- Acceptance: on posting, 15% goes to Lens revenue and the rest to the release owner (or is distributed by splits). The rate lives in config with an effective date, so it can change later.
- Deps: MONEY-1. Status: open.

**MONEY-4 · P0 · Currency**
- Acceptance: store the original currency plus the conversion rate used, and pay out in the payee's chosen currency.
- Status: open.

**MONEY-5 · P1 · Royalty splits**
- Acceptance: `Split` records per track (payee user or email invite, percentage, effective date) that must total 100%. Earnings are distributed on posting. Recipients accept the split by email.
- Deps: MONEY-1. Status: open.

**MONEY-6 · P0 · Monthly statements**
- Acceptance: a statement per account per period (opening balance, earnings by store, country and release, commission, splits, closing balance), downloadable as PDF and CSV.
- Deps: MONEY-2, MONEY-3. Status: open.

**MONEY-7 · P1 · `PayoutProvider` interface**
- Acceptance: `createRecipient`, `payout` and `getStatus`, with a `ManualProvider` first (an admin marks a payout paid with a reference). Providers (MoMo, bank, PayPal or Payoneer) come later, per the Decision log.
- Status: open.

**MONEY-8 · P1 · Payout methods and KYC**
- Acceptance: the user adds a payout method, identity is verified before the first payout, and tax information (country, a W-8BEN-style form if needed) is collected.
- Deps: MONEY-7. Status: open.

**MONEY-9 · P1 · Withdrawals**
- Acceptance: a minimum threshold and a request goes through requested → approved → processing → paid or failed. The ledger holds the funds, and emails are sent at each step.
- Deps: MONEY-7, MONEY-8. Status: open.

**MONEY-10 · P1 · Client: Earnings area**
- Acceptance: new sidebar sections "Earnings" (charts by month, store, country and release, reusing `DashboardChart`), "Statements" and "Payouts". Real data only.
- Deps: MONEY-6, MONEY-9. Status: open.

**MONEY-11 · P1 · Admin finance**
- Acceptance: the import queue, unmatched rows, a payout approval queue, and a Lens revenue report.
- Deps: MONEY-2, MONEY-9. Status: open.

**MONEY-12 · P0 · Honest copy until money ships**
- Files: `client/src/pages/landing/*`, `client/src/pages/authentication/Login.tsx:60`, `client/src/pages/legal/*`
- Acceptance: remove or reword claims about payouts and earnings dashboards until MONEY-10 is live, or label them "coming soon".
- Status: open.

## Workstream ACCT: accounts, workspaces and settings

**ACCT-1 · P0 · Workspaces**
- Acceptance: a `Workspace` (type: artist or label) owns its releases, contributors, labels and ledger account. Users are members with a workspace role. The data is backfilled from `createdById`, and every catalog query is scoped by workspace.
- Status: open.

**ACCT-2 · P0 · Settings page**
- Files: `client/src/containers/Navbar.tsx:134` links to `/settings`, which is a 404 today
- Acceptance: tabs for Profile (with avatar upload), Security (change password, sessions, 2FA later), Notifications and Payout methods (after MONEY-8).
- Status: open.

**ACCT-3 · P0 · Change password while logged in**
- Acceptance: `POST /auth/password`, which requires the current password and revokes other sessions.
- Deps: SEC-6. Status: open.

**ACCT-4 · P1 · Artist profiles**
- Acceptance: the workspace's artists, with Spotify and Apple IDs and an avatar. They're reused in the wizard's artist picker.
- Deps: ACCT-1. Status: open.

**ACCT-5 · P1 · Label roster**
- Acceptance: a label workspace invites and manages several artists, and can switch the "acting as" artist.
- Deps: ACCT-1. Status: open.

**ACCT-6 · P1 · Account deletion and data export (privacy).** Status: open.

## Workstream CAT: catalog modules (client and api)

**CAT-1 · P0 · Lyrics list**
- Files: `client/src/pages/lyrics/ListLyrics.tsx` (a stub)
- Acceptance: a table of tracks showing whether each has lyrics or synced lyrics, with Add or Sync actions. It uses the existing `fetchLyrics`.
- Status: open.

**CAT-2 · P0 · Sidebar entries for Labels and Lyrics**
- Files: `client/src/constants/sidebar.constants.ts`
- Acceptance: both are reachable and permission-gated.
- Status: open.

**CAT-3 · P1 · Tracks catalog page**
- Acceptance: all tracks across releases, searchable by title or ISRC.
- Status: open.

**CAT-4 · P1 · Search and filters**
- Acceptance: server-side search on releases, contributors, users and labels, plus a global ⌘K search (cmdk is already installed).
- Status: open.

**CAT-5 · P0 · Read-only release page**
- Acceptance: `/releases/:id` shows the status timeline, store links, tracks, credits and actions (view, request change, takedown). The review page reuses it.
- Status: open.

**CAT-6 · P1 · Bulk actions**
- Acceptance: row selection is already in `Table.tsx`; wire it up for bulk delete on drafts and bulk approve for admins.
- Status: open.

**CAT-7 · P2 · Genres admin**
- Acceptance: update and delete routes, using the existing unused permissions.
- Status: open.

## Workstream ADMIN: operations

**ADMIN-1 · P0 · Route gating in the client**
- Acceptance: a `RequirePermission` route wrapper for Users, Roles, the review queue, the verification queue and Stores. It replaces the one-off redirect in `StoresPage.tsx`.
- Status: open.

**ADMIN-2 · P0 · Audit log**
- Acceptance: an `AuditLog` entity (actor, action, entity, before/after diff, IP) written by an interceptor on every mutation, plus an admin viewer.
- Status: open.

**ADMIN-3 · P1 · Review workspace**
- Acceptance:
  - The reviewer sees the validation results, audio players, cover art at full size and a checklist.
  - Reject reasons come from a fixed list plus notes.
  - Claim or assign the release, so two reviewers don't collide.
- Deps: CAT-5. Status: open.

**ADMIN-4 · P1 · User management**
- Acceptance: deactivate or reactivate users (not hard delete); the status takes effect immediately.
- Deps: SEC-6. Status: open.

**ADMIN-5 · P1 · Role editing**
- Acceptance: `PATCH /roles/:id` and permission assignment, using the unused `UPDATE_ROLE` and `DELETE_ROLE` permissions.
- Status: open.

**ADMIN-6 · P2 · Support inbox or contact form, and a help center with release guidelines.** Status: open.

## Workstream UI: app-wide consistency

**UI-1 · P0 · Error boundary**
- Acceptance: a boundary at the root and one per route, with a friendly fallback and Sentry reporting.
- Status: done (branch `m0/ops-3-test-harness`, M1a PR 1, 2026-09-23). `RouteErrorBoundary` at the root and around every `withSeo` route; clears on navigation. Sentry reporting waits for OPS-6.

**UI-2 · P1 · Typography cleanup**
- Acceptance: replace the 240 `text-[13px]` and other `text-[Npx]` values with `type-*`. Work one directory per PR, starting with profile, contributors, and releases/wizard-steps.
- Status: open.

**UI-3 · P1 · Remove stray shadows and `rounded-xl`**
- Files: `ReleaseTrackCard.tsx:87`, `ReleaseWizardRegions.tsx:235`, `PreviewValidationBanner.tsx:16`, `ResetPassword.tsx:83`, `CompleteInvitation.tsx:88`
- Status: open.

**UI-4 · P1 · Table empty states with a next action**
- Acceptance: `Table` gets `emptyTitle`/`emptyAction` props, modeled on `DashboardEmptyState`.
- Status: open.

**UI-5 · P1 · Remove the dead serif style and dead code**
- Acceptance: remove `var(--font-serif)` (`UserDashboard.tsx:24`, `TrackDetailsPage.tsx:45`, `ReleaseWizardPreview.tsx:165`), `containers/DashboardCard.tsx` and `containers/Lyrics.tsx`, and rename `CreateRelase.tsx`.
- Status: open.

**UI-6 · P2 · In-app notifications**
- Acceptance: a bell in the navbar (review results, delivery, payouts) plus email preferences.
- Deps: OPS-7. Status: open.

## Workstream GROW: after launch
- **GROW-1** Smart links and pre-save pages per release.
- **GROW-2** Streaming analytics (daily trends from the aggregator's feed).
- **GROW-3** YouTube Content ID claims management.
- **GROW-4** Release scheduling templates (reuse the metadata from a previous release).
- **GROW-5** Localization (French and Kinyarwanda).
- **GROW-6** Referral program.
- **GROW-7** Public artist page.
- **GROW-8** Mobile layout pass for all pages.

---

## Open questions
| # | Question | Blocks |
|---|---|---|
| Q1 | Which aggregator? It fixes the DDEX profile, transport and report format. | DLV-5, DDEX-4, MONEY-2 |
| Q2 | Payout providers and supported countries? | MONEY-7…9 |
| Q3 | Will Lens buy a GS1 prefix, or take UPCs and ISRCs from the aggregator? | ID-1, ID-2 |
| Q4 | Minimum payout threshold and payout schedule? | MONEY-9 |
| Q5 | Is there a paid tier (for example Content ID or priority review)? | GROW |
| Q6 | Review turnaround promise (the SLA shown to artists)? | WIZ-21 |

## Decision log
| Date | Decision | By |
|---|---|---|
| 2026-09-23 | Artists first; labels are supported through workspaces. | user |
| 2026-09-23 | Delivery through an aggregator (not yet chosen), behind `DeliveryAdapter`, targeting ERN 4.3. | user |
| 2026-09-23 | Payout provider undecided; `PayoutProvider` abstraction with a manual provider first. | user |
| 2026-09-23 | No fixed launch date; work in milestone order M0 to M4. | user |
| 2026-09-23 | Next phase is M1a: wizard stability and UI (WIZ-23…28 first, then the client-only WIZ tasks, plus UI-1), in 7 PRs. | user |
