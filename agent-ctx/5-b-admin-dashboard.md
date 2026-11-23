# Task 5-b: Admin Dashboard + Admin APIs — Work Record

## Status: COMPLETE (lint clean, all curl tests passed)

## Files Created

### PART 1 — Admin API routes (18 route files)
- `src/app/api/admin/login/route.ts` — POST login (verifyPassword + createSessionForAdmin), 401 on bad creds
- `src/app/api/admin/logout/route.ts` — POST destroySession
- `src/app/api/admin/me/route.ts` — GET current admin
- `src/app/api/admin/stats/route.ts` — GET dashboard stats (counts, monthlyRevenue via active-member plan sum, planDistribution, recentMembers(5), recentMessages(5 unread-first))
- `src/app/api/admin/members/route.ts` — GET (optional `?search=` on name/email/phone) | POST
- `src/app/api/admin/members/[id]/route.ts` — PUT (all fields, dates → new Date) | DELETE
- `src/app/api/admin/members/[id]/activate/route.ts` — POST: status=active, startDate=now, endDate=now+plan.duration (or 1); 400 if no plan
- `src/app/api/admin/trainers/route.ts` + `src/app/api/admin/trainers/[id]/route.ts` — CRUD
- `src/app/api/admin/classes/route.ts` + `src/app/api/admin/classes/[id]/route.ts` — CRUD (trainerId validated/nullable, includes trainer name)
- `src/app/api/admin/plans/route.ts` + `src/app/api/admin/plans/[id]/route.ts` — CRUD (DELETE blocked with 400 if plan has members)
- `src/app/api/admin/testimonials/route.ts` + `[id]/route.ts` — CRUD (rating clamped 1-5)
- `src/app/api/admin/gallery/route.ts` + `[id]/route.ts` — CRUD
- `src/app/api/admin/messages/route.ts` (GET, read-asc then createdAt-desc) + `[id]/route.ts` (PUT {read}, DELETE)

All routes call `getCurrentAdmin()` first → `unauthorizedResponse()`; 400 with Arabic messages for missing fields; try/catch → 500 `{error:"حدث خطأ في الخادم"}` + console.error. Dynamic `params` handled as Promise (`const { id } = await params`) per Next 16.

### PART 2 — Pages + components
- `src/app/admin/(auth)/login/page.tsx` — server component, redirects to /admin if logged in; glass card on bg-ocean-gradient, logo h-24
- `src/components/admin/login-form.tsx` — client form, password eye toggle, inline Alert destructive + sonner toast, hint box "بيانات الدخول التجريبية: admin / ocean123", loading state, success → router.replace("/admin") + refresh
- `src/app/admin/(panel)/layout.tsx` — getCurrentAdmin() guard → redirect("/admin/login"), wraps AdminShell
- `src/components/admin/admin-shell.tsx` — "use client"; desktop fixed right sidebar w-64 bg-sidebar, 8 nav items (lucide icons + Arabic), usePathname active highlight (bg-accent text-primary), unread-mail count badge (fetched from /api/admin/messages, refreshed on pathname change), mobile sticky topbar + Sheet side="right", footer with avatar-fallback + logout, `<Toaster richColors position="top-center" dir="rtl" />` from sonner, content `md:mr-64 p-4 md:p-6`
- `src/app/admin/(panel)/page.tsx` (+ members/trainers/classes/plans/messages/testimonials/gallery pages) — thin server wrappers with Arabic metadata rendering client views
- `src/components/admin/api.ts` — apiFetch<T> (throws Error(server Arabic msg) on !ok) + jsonPost/jsonPut/jsonDelete
- `src/components/admin/types.ts` — TS interfaces for AdminPayload, Member, Trainer, GymClass, Plan, Testimonial, GalleryItem, Message, StatsResponse
- `src/components/admin/image-options.ts` — IMAGE_OPTIONS (14 paths), TRAINER_IMAGE_OPTIONS, CLASS_IMAGE_OPTIONS
- `src/components/admin/views/dashboard-view.tsx` — 6 stat cards (2/3-col grid, colored icon tiles), plan-distribution horizontal bars (pure div, no recharts dependency needed), recent members table + recent messages list with "عرض الكل" links, skeletons, client-set date (set in async finally → passes react-hooks/set-state-in-effect rule)
- `src/components/admin/views/members-view.tsx` — search filter (client-side), table (name+email, phone dir=ltr, plan, status Badge colors: pending=amber/active=emerald/expired=red/frozen=slate, endDate ar-EG), activate button for pending rows, add/edit Dialog (name/email/phone required, plan Select from /api/admin/plans, status Select, native date inputs, notes Textarea), AlertDialog delete, empty state, skeletons
- `src/components/admin/views/classes-view.tsx` — card grid with image/level/active badges, dialog (name/desc/schedule required, trainer Select, duration/capacity numbers, level Select, class-image Select with preview, active Switch)
- `src/components/admin/views/trainers-view.tsx` — card grid with image, dialog (name/role required, bio, trainer-image Select with preview, specialty, instagram, order, active Switch)
- `src/components/admin/views/plans-view.tsx` — table with price formatted ج.م, popular crown badge, member count, features multiline; dialog (name/price required, duration, features Textarea "كل ميزة في سطر", popular/active Switches)
- `src/components/admin/views/messages-view.tsx` — Tabs (الكل/غير مقروءة with counts), unread cards cyan border + pulsing dot, click opens Dialog (auto-marks read), mark read/unread buttons, delete
- `src/components/admin/views/testimonials-view.tsx` — star cards, publish/hide quick toggle, dialog (name/role/content required, rating Select 1-5, image Select, approved Switch)
- `src/components/admin/views/gallery-view.tsx` — image grid with hover zoom, add/edit dialog (title + image path Input with datalist of IMAGE_OPTIONS + live preview), delete confirm

## NOT touched (per instructions)
src/app/page.tsx, src/app/layout.tsx, globals.css, src/lib/db.ts, src/lib/auth.ts, prisma folder, existing public APIs.

## API Endpoints
| Method | Route | Auth |
|---|---|---|
| POST | /api/admin/login | public |
| POST | /api/admin/logout | public (destroys session) |
| GET | /api/admin/me | admin |
| GET | /api/admin/stats | admin |
| GET/POST | /api/admin/members (?search=) | admin |
| PUT/DELETE | /api/admin/members/[id] | admin |
| POST | /api/admin/members/[id]/activate | admin |
| GET/POST | /api/admin/trainers | admin |
| PUT/DELETE | /api/admin/trainers/[id] | admin |
| GET/POST | /api/admin/classes | admin |
| PUT/DELETE | /api/admin/classes/[id] | admin |
| GET/POST | /api/admin/plans | admin |
| PUT/DELETE | /api/admin/plans/[id] | admin (delete blocked if has members) |
| GET/POST | /api/admin/testimonials | admin |
| PUT/DELETE | /api/admin/testimonials/[id] | admin |
| GET/POST | /api/admin/gallery | admin |
| PUT/DELETE | /api/admin/gallery/[id] | admin |
| GET | /api/admin/messages | admin |
| PUT/DELETE | /api/admin/messages/[id] | admin |

## Curl Test Results (actual outputs)
1. Login ok: `{"ok":true,"admin":{"id":"cmws4egm20000oefvu2ar30u7","username":"admin","name":"مدير Ocean GYM"}}`
2. Login wrong pw → 401 `{"error":"اسم المستخدم أو كلمة المرور غير صحيحة"}`
3. Stats with cookie: `{"totalMembers":5,"activeMembers":3,"pendingMembers":1,"expiredMembers":1,"unreadMessages":2,"totalTrainers":3,"totalClasses":7,"monthlyRevenue":6900,"planDistribution":[...],"recentMembers":[5],"recentMessages":[...]}`
4. Stats no cookie → 401 `{"error":"غير مصرح — يجب تسجيل الدخول"}`
5. Members list → 5 items with plan include
6. `GET /admin` no cookie → **307** redirect → /admin/login ; `/admin/login` → **200**
7. Gallery CRUD cycle: create → update (title changed) → verify → delete → count back to 8, deleted title absent
8. Member lifecycle: missing fields → 400 `الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة`; create temp → set plan → activate (status=active, end=+1mo) → update (frozen) → delete ok; activate without plan → 400
9. Classes cycle: create → update (active=false, level=advanced) → delete ok
10. Messages: PUT read=true then false → stats unread stays 2
11. Logout → me → 401
12. All 8 admin pages → 200 with cookie; Arabic content verified in HTML (مرحبًا بك في لوحة تحكم / إدارة الأعضاء / بيانات الدخول التجريبية)

## Lint
`bun run lint` → clean (0 errors, 0 warnings). Fixed one `react-hooks/set-state-in-effect` error in dashboard-view (date is now set in the fetch's async finally block).

## Notes for main agent
- DB is seeded (verified: 5 members, 3 plans, 3 trainers, 7 classes, 4 testimonials, 8 gallery items, 3 messages, admin/ocean123).
- Sonner Toaster is rendered inside AdminShell (dir rtl, top-center) and on login page toast works via sonner's global; layout.tsx still has the old radix Toaster — harmless, untouched per instructions.
- Tailwind 4 dynamic spacing used (h-4.5 etc.) — valid in v4.
- Plan delete returns 400 with Arabic error if plan has members (frontend surfaces via toast).
- Stats monthlyRevenue = 6900 (sum of active members' plan prices; quarterly plan counts once, not amortized).
- Used pure CSS bars for plan distribution (no recharts) — keeps bundle light and matches dark theme.
