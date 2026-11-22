# Task 2-b: Member Portal (بوابة الأعضاء) — Work Record

## Status: COMPLETE (lint clean, tsc clean for src/, all curl tests passed)

## Files Created

### PART 1 — Portal APIs
- `src/app/api/portal/login/route.ts` — POST {email, accessCode}; email trim+lowercase, code trimmed but case-sensitive exact compare. Missing fields → 400 Arabic. Not found/mismatch → 401 {"error":"البريد الإلكتروني أو كود الدخول غير صحيح"}. Success → `createPortalSession(member.id)` → {ok:true, member:{id,name,email}}. NOTE: Member.email is NOT unique in schema → uses `findFirst({where:{email}})` (findUnique throws PrismaClientValidationError).
- `src/app/api/portal/logout/route.ts` — POST destroyPortalSession() → {ok:true}
- `src/app/api/portal/me/route.ts` — GET; getCurrentPortalMember() → 401 portalUnauthorizedResponse() when null; fetches member with plan (id,name,price,duration), nutritionPlan + meals (orderBy day asc, mealType asc), progressLogs orderBy date desc; 500 Arabic on error. Dates serialize as ISO automatically.

### PART 2 — Pages + components (src/components/portal/)
- `src/app/portal/(auth)/login/page.tsx` — server; getCurrentPortalMember() → redirect("/portal"); glass + glow-cyan card on bg-ocean-gradient, logo h-24, title "بوابة أعضاء Ocean GYM", subtitle, LoginForm, "العودة للموقع" link to "/", local sonner `<Toaster richColors position="top-center" dir="rtl" />` (needed because login form toasts while panel shell isn't mounted; login + panel never coexist so no duplicate toasters).
- `src/components/portal/login-form.tsx` — client; email input (dir=ltr, Mail icon) + access code mono input (dir=ltr, tracking-widest, hint "مثل OC-1234"), Alert destructive inline + sonner toast on error, loading Loader2 state, success → router.replace("/portal") + refresh. Demo hint box: nourhan@example.com / OC-1002.
- `src/app/portal/(panel)/layout.tsx` — server guard: `const member = await getCurrentPortalMember(); if (!member) redirect("/portal/login");` → `<PortalShell member={member}>`.
- `src/app/portal/(panel)/page.tsx` — thin wrapper rendering PortalDashboard (+ metadata title).
- `src/components/portal/portal-shell.tsx` — client; sticky glass header: logo + "بوابة الأعضاء" link, member chip (Avatar fallback first letter, name hidden on xs), destructive-outline logout button (Loader2 while pending) → POST logout → router.replace("/portal/login"). Content max-w-6xl mx-auto p-4 md:p-6. Sonner Toaster rtl top-center.
- `src/components/portal/portal-dashboard.tsx` — client; fetches /api/portal/me on mount (cancelled-flag + async IIFE — avoids react-hooks/set-state-in-effect), skeletons while loading, error card with "إعادة المحاولة" (retry via reloadKey state), Tabs (dir=rtl, defaultValue overview): نظرة عامة / نظامي الغذائي / متابعتي with icons.
- `src/components/portal/overview-tab.tsx` — greeting "أهلاً بيك، {firstName}" + StatusBadge; expired → destructive Alert; pending → amber Alert; subscription card (glass glow-cyan when active): plan name/price/durationLabel, start/end dates (safe ar-EG), Progress bar + "متبقي X يوم من أصل Y" (daysRemaining ceil; daysTotal from start→end else plan.duration*30; clamp 0-100); 4 quick stats (الوزن الحالي / تغير الوزن +/- with TrendingUp/Down green-red via formatDelta / سعرات خطتك / باقة الاشتراك); quote-style coach note (nutritionPlan.notes ?? member.notes).
- `src/components/portal/nutrition-tab.tsx` — empty state handled by dashboard (Apple icon); plan header (name text-gradient-ocean, goal badge, Flame calories "2200 سعرة/يوم", macro chips بروتين/كارب/دهون only when present, description); 7 GYM_DAYS pill buttons (default = (new Date().getDay()+1)%7, lazy useState init — safe because pills render only client-side after fetch); meals timeline (right-side gradient line, circular icons: Sunrise/UtensilsCrossed/Moon/Apple, mealTypeLabel, calories Badge, content) sorted breakfast→lunch→dinner→snack; "ملاحظات الكابتن" card.
- `src/components/portal/progress-tab.tsx` — empty state (Scale icon); recharts LineChart in ResponsiveContainer 280px inside dir="ltr" wrapper: chronological data (API desc → reversed), XAxis short ar-EG labels, YAxis auto domain, Line #38c7e8 w2.5 dot r4, custom dark Tooltip (bg #0a1630, border cyan, typed TooltipProps<number,string>); 4 stat cards (الوزن الحالي/المبدئي/التغير الكلي/نسبة الدهون الحالية); measurements table last 6 logs (التاريخ/الوزن/الدهون%/العضلات/الخصر/الصدر/الذراع/ملاحظات) in overflow-x-auto custom-scrollbar, "٢٢ نوف"-style dates via {day:'numeric',month:'short'} ar-EG.
- `src/components/portal/types.ts` — PortalMemberSession, PortalLoginResponse, PlanSummary, NutritionMealItem, NutritionPlanDetail, ProgressLogItem, PortalMemberDetail, PortalMeResponse. No `any` anywhere.
- `src/components/portal/api.ts` — apiFetch<T> + jsonPost (throws Error with server Arabic message).
- `src/components/portal/format.ts` — safeDate/formatDate/formatShortDate/daysRemaining/daysBetween/clamp/formatDelta (±1-decimal rounding).
- `src/components/portal/empty-state.tsx`, `status-badge.tsx` — shared (badge colors: pending amber, active emerald, expired red, frozen slate).

## NOT touched
page.tsx, layout.tsx, globals.css, src/lib/*, prisma/*, admin/*, site/*, public APIs.

## DATA FIX (important for other agents)
Seed drift found & repaired (data-only, via prisma script — no schema/seed file touched):
1. Member.accessCode for nourhan was OC-6685 and mahmoud OC-9812 (not the documented OC-1002/OC-1001) → reset to OC-1001/OC-1002 per seed-v2.ts intent. Now: mahmoud=OC-1001, nourhan=OC-1002, omar=OC-1003, heba=OC-1004, youssef=OC-1005.
2. All members had nutritionPlanId=null (seed never assigned) → assigned: nourhan=Balance(maintain,2200,28 meals), mahmoud=Cut(1800,28 meals), omar=Bulk(3000,28 meals); heba intentionally left null (pending empty-state demo). ProgressLogs already existed (nourhan 3, mahmoud 5).
If another agent re-runs seed.ts it may regenerate random codes — seed-v2.ts (which sets OC-1001..1005 + assignments) is the canonical fixer.

## API Shapes
- POST /api/portal/login {email,accessCode} → 200 {ok,member:{id,name,email}} | 400/401 {error}
- POST /api/portal/logout → {ok:true}
- GET /api/portal/me → {member:{id,name,email,phone,status,startDate,endDate,notes,plan:{id,name,price,duration}|null,nutritionPlan:{...,meals:[{id,day,mealType,content,calories}]}|null,progressLogs:[{id,date,weight,fatPercent,muscleMass,waist,chest,arm,notes}]}} | 401 {error:"انتهت الجلسة — سجل الدخول من جديد"}

## Curl Results (actual)
- wrong code → 401 {"error":"البريد الإلكتروني أو كود الدخول غير صحيح"}
- wrong email → 401 same; missing fields → 400
- nourhan/OC-1002 (with " Nourhan@Example.COM " case/space normalization) → 200 ok:true
- me w/ cookie → 200: 28 meals (days 0-6 × 4 types), 3 logs; mahmoud → cut plan 28 meals 5 logs; heba → pending, plan null, 0 logs
- me w/o cookie → 401; logout → {ok:true}; me-after-logout → 401
- GET /portal no cookie → **307** → /portal/login; /portal/login → **200** (Arabic content + demo hint verified in HTML); /portal w/ cookie → 200; /portal/login w/ cookie → **307** → /portal

## Lint / tsc
- `bun run lint` → clean (exit 0).
- `bunx tsc --noEmit` → zero errors in src/ (only pre-existing examples/ + skills/ errors, not mine).

## Environment note
The system dev server died mid-task (port 3000 refused). Restarted detached: `setsid nohup bun run dev` in /home/z/my-project (same port 3000, writes dev.log). If it dies again, rerun that command — do NOT run the system boot script.
