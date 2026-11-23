# Task 2-a — Admin Dashboard Upgrade (Schedule / Nutrition / Member Follow-up)

Agent: 2-a (admin dashboard)
Date: 2026-11-22

## Summary
Upgraded the Ocean GYM admin dashboard with weekly schedule management, nutrition plan management, member follow-up (progress logs + portal access codes + nutrition assignment), and a light refactor of shared admin components. All new APIs are protected with `getCurrentAdmin()` → `unauthorizedResponse()`. Arabic-only UI, no emojis, consistent with existing patterns (`apiFetch`, sonner toasts, shadcn/ui dialogs).

## Files created
- `src/app/api/admin/schedule/route.ts` — GET (orderBy day asc, time asc, include gymClass{name,level,duration} + trainer{name}), POST (validates day 0–6 int, time `/^\d{2}:\d{2}$/`, gymClassId exists, trainerId optional → 400 Arabic errors)
- `src/app/api/admin/schedule/[id]/route.ts` — PUT (partial update with same validation), DELETE
- `src/app/api/admin/nutrition/route.ts` — GET (plans include meals orderBy day asc, orderBy createdAt desc), POST (validates name, goal in bulk/cut/maintain/healthy, calories > 0)
- `src/app/api/admin/nutrition/[id]/route.ts` — PUT, DELETE (blocked with 400 "لا يمكن حذف الخطة — يوجد أعضاء مشتركين فيها" when `_count.members > 0`)
- `src/app/api/admin/nutrition/[id]/meals/route.ts` — PUT bulk replace via `db.$transaction` (deleteMany then createMany), validates array max 200, per-meal day/mealType/content
- `src/app/api/admin/members/[id]/access-code/route.ts` — POST generates unique `OC-XXXX` via `crypto.randomInt(1000,10000)` with retry loop
- `src/app/api/admin/members/[id]/progress/route.ts` — GET (logs orderBy date desc), POST (validates date, weight > 0; optional fatPercent/muscleMass/waist/chest/arm/notes)
- `src/app/api/admin/progress/[id]/route.ts` — DELETE a progress log
- `src/app/admin/(panel)/schedule/page.tsx` + `src/components/admin/views/schedule-view.tsx` — day pill tabs (GYM_DAYS, default = today mapped `(jsDay+1)%7`), timeline cards with formatTime12, level badge, trainer, duration, active Switch toggle, add/edit dialog (day/time/class/trainer/active), delete AlertDialog
- `src/app/admin/(panel)/nutrition/page.tsx` + `src/components/admin/views/nutrition-view.tsx` — plan cards with goal badge colors (bulk=amber, cut=emerald, maintain=cyan, healthy=violet), calories Flame, macro chips, meals count, active Switch, meals-manager Dialog (max-w-3xl, day tabs, per-day meal rows with mealType Select + content Textarea + calories + remove, per-day total calories, PUT bulk save, max-h-[65vh] custom-scrollbar)
- `src/components/admin/shared.tsx` — `PageHeader` (icon in cyan tile + title + subtitle + right-side children), `StatusBadge` (pending=amber/active=emerald/expired=red/frozen=slate), `EmptyState` (dashed-border card), `Field` (label+required wrapper for new dialogs)

## Files modified
- `src/app/api/admin/members/route.ts` — list/create now include `nutritionPlan{id,name,goal}`
- `src/app/api/admin/members/[id]/route.ts` — PUT supports `nutritionPlanId` (validated) + `accessCode` (format `OC-\d{4}`, uniqueness check, or null to clear)
- `src/app/api/admin/stats/route.ts` — added `totalSlots` (active schedule slots) + `nutritionPlans` counts; all previous fields kept
- `src/components/admin/types.ts` — added ScheduleSlot, NutritionMeal, NutritionPlanItem, ProgressLogItem, NutritionPlanRef; Member gains accessCode/nutritionPlanId/nutritionPlan; StatsResponse gains totalSlots/nutritionPlans
- `src/components/admin/views/members-view.tsx` — new columns الخطة الغذائية + كود الدخول (mono chip + copy button), edit dialog gains nutrition plan Select + accessCode input + "توليد كود جديد" button, new "المتابعة" row action (TrendingUp, cyan) opening progress dialog (max-w-2xl): add-log form grid (date/weight*/fat%/muscle/waist/chest/arm/notes), logs table (ar-EG short date, cyan bold weight, delete with AlertDialog confirm), scrollable body
- `src/components/admin/views/dashboard-view.tsx` — 2 new stat cards: مواعيد الجدول (CalendarDays, violet, totalSlots) + خطط التغذية (UtensilsCrossed, amber, nutritionPlans); grid → `grid-cols-2 md:grid-cols-3 xl:grid-cols-4`
- `src/components/admin/admin-shell.tsx` — sidebar nav gains الجدول الأسبوعي (/admin/schedule) and خطط التغذية (/admin/nutrition)
- `src/components/admin/image-options.ts` — `IMAGE_OPTIONS` now re-exports `GYM_IMAGES` from lib/gym (same export names kept so imports don't break)

## Refactor of existing views (light touch, logic untouched)
- All 8 views (dashboard, members, classes, trainers, plans, messages, testimonials, gallery) now use `PageHeader` / `StatusBadge` / `EmptyState` from shared.tsx where they duplicated that markup.
- Hardcoded Arabic maps replaced with lib/gym helpers: classes-view (LEVEL_LABELS → `levelLabel`/`CLASS_LEVELS`), plans-view (duration → `durationLabel`), members-view + dashboard-view (status maps → `StatusBadge`/`MEMBER_STATUSES`), schedule/nutrition views use `dayName`/`formatTime12`/`goalLabel`/`mealTypeLabel`/GYM_DAYS/MEAL_TYPES/NUTRITION_GOALS.

## API endpoint list (all under /api/admin, all auth-guarded)
- GET|POST /api/admin/schedule ; PUT|DELETE /api/admin/schedule/[id]
- GET|POST /api/admin/nutrition ; PUT|DELETE /api/admin/nutrition/[id] ; PUT /api/admin/nutrition/[id]/meals
- PUT /api/admin/members/[id] (now + nutritionPlanId/accessCode) ; POST /api/admin/members/[id]/access-code
- GET|POST /api/admin/members/[id]/progress ; DELETE /api/admin/progress/[id]
- GET /api/admin/members (now includes nutritionPlan) ; GET /api/admin/stats (now + totalSlots/nutritionPlans)

## curl verification results (cookie auth via /tmp/ck.txt)
- Login admin/ocean123 → 200 ok
- GET schedule → 27 slots, ordered by day+time, includes class + trainer
- POST slot (day 5, 09:30) → 201 created; bad time "9:70" → 400 "الوقت مطلوب بصيغة HH:MM صحيحة"; PUT → day 6/10:15/active false applied; DELETE → ok
- GET nutrition → 3 plans × 28 meals (تضخيم 3000 bulk / تنشيف 1800 cut / توازن 2200 maintain)
- POST plan → 201; invalid goal → 400 Arabic; PUT bulk meals (3 meals) → ok saved 3; re-bulk with 1 meal → replace works (count 1); DELETE empty test plan → ok; DELETE plan with member assigned → 400 "لا يمكن حذف الخطة — يوجد أعضاء مشتركين فيها"
- POST access-code × 2 members → OC-9812 / OC-6685 unique
- Members PUT: assign خطة التنشيف + keep OC-1003 → 200; duplicate code on another member → 400 "كود الدخول مستخدم بالفعل لعضو آخر"; malformed code "1234" → 400 format error
- POST progress (weight 82.5 + measurements) → 201; weight 0 → 400; GET progress → ordered desc; DELETE log → ok (cleaned up)
- GET stats → totalSlots 27, nutritionPlans 3, all legacy fields present
- No-cookie /api/admin/schedule → 401 "غير مصرح — يجب تسجيل الدخول"
- Pages 200 with cookie: /admin, /admin/schedule, /admin/nutrition, /admin/members, /admin/classes, /admin/trainers, /admin/plans, /admin/messages, /admin/testimonials, /admin/gallery; SSR HTML contains new headers/nav

## Lint / TS status
- `bun run lint` → clean, zero errors
- `tsc --noEmit` → 0 errors in src/app + src/components (only pre-existing examples/skills folder errors unrelated to this task)
- dev.log shows all routes compiling and returning expected codes (200/400/401)

## Notes for next agents
- Test leftovers intentionally kept: members محمود السيد/نورهان أحمد have generated codes OC-9812/OC-6685; عمر خالد has nutrition plan خطة التنشيف assigned. Test slot/plan/progress-log were cleaned up.
- Admin nav order: لوحة التحكم، الأعضاء، الجدول الأسبوعي، الكلاسات، المدربون، خطط التغذية، الباقات، الرسائل، آراء العملاء، معرض الصور.
- The dev server was restarted once via `.zscripts/dev.sh` after the sandbox process was SIGTERMed mid-task.
