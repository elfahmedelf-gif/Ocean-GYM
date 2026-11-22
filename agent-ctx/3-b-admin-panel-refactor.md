# Task 3-b — Admin Panel Refactor & Polish (Ocean GYM)

Agent: senior frontend engineer (Task ID 3-b)
Scope honored: only files under `src/components/admin/**`, `src/app/admin/**`, and `src/lib/gym.ts` were touched. No API handlers, no globals.css, no ui/* components, no prisma, no DB, no package.json.

## Files changed / created

### Created
- `src/components/admin/confirm-dialog.tsx` — reusable Arabic AlertDialog-based `ConfirmDialog` (title, description, cancel/confirm, destructive confirm button, `busy` spinner). Confirm does NOT auto-close (same as before: parent closes after async op).
- `src/components/admin/member-form-dialog.tsx` — extracted member create/edit dialog; owns form state, generate-access-code flow, save payload (identical shape), toasts.
- `src/components/admin/member-progress-dialog.tsx` — extracted progress-log dialog; owns logs state, add-log form validation/payload, log deletion + its confirm dialog, `fmtNum` (dead `undefined` branch removed), `formatLogDate`, `todayDateInput`.

### Modified
- `src/lib/gym.ts` — added shared `formatDate(iso: string | null)` (long Arabic date, null → "—") now used by dashboard + members flows (members-view's unused copy deleted).
- `src/components/admin/image-options.ts` — added `imageOptionLabel(path)` (strips `/images/` + extension, Arabic label map, fallback bare name). Value stays the path.
- `src/components/admin/shared.tsx` — PageHeader icon chip cyan → `bg-primary/10 border-primary/25 text-primary`; exported `DANGER_BUTTON_CLASS` (destructive outline) and `DANGER_CONFIRM_CLASS` (destructive solid); StatusBadge now `rounded-full px-2.5` pill (color semantics unchanged).
- `src/components/admin/admin-shell.tsx` — sidebar `right-0 border-l` → `start-0 border-e`; content `md:mr-64` → `md:ms-64` (identical geometry in RTL: sidebar on physical right, content to its left); desktop logout button gets visible "خروج" label at xl+ (icon-only below, h-9); `aria-current="page"` was already present; unread refetch untouched.
- `src/app/admin/(auth)/login/page.tsx` — **bug fix**: mounted `<Toaster richColors position="top-center" dir="rtl" />` (mirrors portal login pattern, imports `Toaster` from `sonner` like portal + admin-shell do, not `@/components/ui/sonner`); added "الرجوع إلى الموقع" ghost pill link with ArrowRight under the card.
- `src/components/admin/login-form.tsx` — `right-3/pr-9/pl-10` → `start-3/ps-9/pe-10`; password toggle `left-2 h-7 w-7` → `end-1 h-9 w-9`; demo-credentials box → subtle collapsible `<details>` with chevron (still shows `admin / ocean123`); focus-visible rings preserved.
- `src/components/admin/views/dashboard-view.tsx` — stat cards redesigned: neutral `bg-card` cards + colored icon chips (primary members/classes, emerald active/revenue, amber pending/nutrition, red unread, violet slots); cyan/blue → primary tokens; progress gradient `from-primary to-primary/50`; unread dot/badge primary; local `formatDate` removed (imports `@/lib/gym`).
- `src/components/admin/views/members-view.tsx` — split (1042 → ~310 lines); search icon `start-3`/`ps-9`; actions header `text-end`; access-code chip + follow-up + generate-code buttons cyan → primary; copy icon button h-7→h-9 w-9; action buttons h-8→h-9; dead `formatDate` removed.
- `src/components/admin/views/schedule-view.tsx` — time chip cyan → primary; `LEVEL_BADGE_CLASS.all` cyan → primary; day-tab count `mr-2` → `ms-2`; class-info divider `md:border-r md:pr-4` → `md:border-s md:ps-4` (visually identical in RTL — border stays on the physical-right edge facing the time block; note: task suggested border-e/pe-4, but that would have flipped the divider to the wrong side); redundant `text-right` on LTR time removed (kept `dir="ltr"`).
- `src/components/admin/views/messages-view.tsx` — tab badges `ms-2`; unread highlights/badges/dots cyan → primary; message button redundant `text-right` removed; desktop action buttons stacked `flex-col` → `flex-row flex-wrap justify-end` one row; buttons h-8→h-9; dialog delete button uses `DANGER_BUTTON_CLASS`.
- `src/components/admin/views/plans-view.tsx` — actions header `text-end`; Crown badge cyan → primary, `ml-1` → `me-1` (same visual gap between icon and text); buttons h-9.
- `src/components/admin/views/trainers-view.tsx` — inactive badge `top-2 left-2` → `top-2 start-2` (RTL-correct corner per task); image select shows friendly labels; delete button `DANGER_BUTTON_CLASS`; buttons h-9.
- `src/components/admin/views/classes-view.tsx` — same badge flip, level "all" badge cyan → primary, image labels, `DANGER_BUTTON_CLASS`, h-9.
- `src/components/admin/views/nutrition-view.tsx` — goal "maintain" badge cyan → primary; "الوجبات"/"إضافة وجبة" buttons cyan → `text-primary border-primary/40 hover:bg-primary/10`; day-tab count `ms-2`; meal list `pr-1` → `ps-1`; `DANGER_BUTTON_CLASS`; h-9.
- `src/components/admin/views/testimonials-view.tsx` — image select friendly labels; h-9 buttons; ConfirmDialog.
- `src/components/admin/views/gallery-view.tsx` — delete button `DANGER_BUTTON_CLASS` + h-9; ConfirmDialog.

## Duplicated delete-confirmations replaced with ConfirmDialog (10 total)
members (member + progress log), classes, trainers, plans, schedule, messages, nutrition, testimonials, gallery. All keep the same API calls (`jsonDelete` endpoints), same success/error toasts, same refetches, same disabled-while-busy behavior.

## CRUD signature verification
All handlers (`handleSave`, `handleDelete`, `handleActivate`, `handleGenerateCode`, `handleSaveProgress`, `handleDeleteLog`, `toggleApproved`, `markRead`, `handleToggleActive`, `saveMeals`) preserved verbatim payloads and endpoints. The only behavioral nuance from the members split: the form dialog re-initializes its (previously parent-held) form state on open, which is exactly what `openAdd`/`openEdit` did before.

## Verification
- `bun run lint` → 0 errors, 0 warnings.
- All admin routes compile and render: `/admin/login` 200; panel routes 307 without session, 200 with a logged-in admin cookie (verified via curl + dev.log clean, no compile/runtime errors).
- No import cycles: views → dialogs/confirm-dialog → shared/ui (DAG verified by grep).

## Notes / deviations
1. Toaster mounted via `sonner` package import (exactly mirroring portal login & admin-shell) instead of `@/components/ui/sonner` as the brief loosely stated — the two instructions conflicted; portal pattern won for consistency.
2. schedule-view divider converted to `md:border-s md:ps-4` (not `border-e/pe-4`) to keep the visual side identical in RTL, per the brief's own "verify visual side stays same" rule.
3. Switch components untouched (shadcn default h-[1.15rem] w-8); no h-7 toggles existed; all h-7/h-8 buttons raised to h-9.
4. Out of scope / not doable within ownership: nothing blocking. `metadataBase` warning in dev.log is pre-existing and unrelated.
