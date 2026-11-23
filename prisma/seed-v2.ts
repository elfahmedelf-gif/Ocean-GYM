/**
 * Ocean GYM — Seed V2 (schedule slots, nutrition plans/meals, progress logs, access codes)
 * Run with: bun prisma/seed-v2.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DAY_NAMES = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

async function main() {
  console.log("🌊 Seeding Ocean GYM V2 data...");

  // ===== Weekly Schedule Slots =====
  const classes = await prisma.gymClass.findMany();
  const trainers = await prisma.trainer.findMany();
  const byClass = (n: string) => classes.find((c) => c.name === n)!;
  const byTrainer = (n: string) => trainers.find((t) => t.name.startsWith(n))!;

  const existingSlots = await prisma.scheduleSlot.count();
  if (existingSlots === 0) {
    const slots: { day: number; time: string; gymClassId: string; trainerId?: string }[] = [
      // السبت
      { day: 0, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 0, time: "10:00", gymClassId: byClass("كمال أجسام").id, trainerId: byTrainer("كريم").id },
      { day: 0, time: "18:00", gymClassId: byClass("يوجا واستطالة").id, trainerId: byTrainer("سارة").id },
      { day: 0, time: "20:00", gymClassId: byClass("بوكسينج").id, trainerId: byTrainer("أحمد").id },
      // الأحد
      { day: 1, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 1, time: "09:00", gymClassId: byClass("سباحة").id },
      { day: 1, time: "18:00", gymClassId: byClass("سبينينج").id, trainerId: byTrainer("سارة").id },
      { day: 1, time: "20:00", gymClassId: byClass("تدريب وظيفي").id, trainerId: byTrainer("كريم").id },
      // الإثنين
      { day: 2, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 2, time: "10:00", gymClassId: byClass("كمال أجسام").id, trainerId: byTrainer("كريم").id },
      { day: 2, time: "20:00", gymClassId: byClass("بوكسينج").id, trainerId: byTrainer("أحمد").id },
      // الثلاثاء
      { day: 3, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 3, time: "09:00", gymClassId: byClass("سباحة").id },
      { day: 3, time: "10:00", gymClassId: byClass("يوجا واستطالة").id, trainerId: byTrainer("سارة").id },
      { day: 3, time: "18:00", gymClassId: byClass("سبينينج").id, trainerId: byTrainer("سارة").id },
      // الأربعاء
      { day: 4, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 4, time: "10:00", gymClassId: byClass("كمال أجسام").id, trainerId: byTrainer("كريم").id },
      { day: 4, time: "18:00", gymClassId: byClass("تدريب وظيفي").id, trainerId: byTrainer("كريم").id },
      { day: 4, time: "20:00", gymClassId: byClass("بوكسينج").id, trainerId: byTrainer("أحمد").id },
      // الخميس
      { day: 5, time: "07:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 5, time: "09:00", gymClassId: byClass("سباحة").id },
      { day: 5, time: "10:00", gymClassId: byClass("يوجا واستطالة").id, trainerId: byTrainer("سارة").id },
      { day: 5, time: "18:00", gymClassId: byClass("سبينينج").id, trainerId: byTrainer("سارة").id },
      // الجمعة
      { day: 6, time: "09:00", gymClassId: byClass("سباحة").id },
      { day: 6, time: "11:00", gymClassId: byClass("كروس فت").id, trainerId: byTrainer("كريم").id },
      { day: 6, time: "17:00", gymClassId: byClass("كمال أجسام").id, trainerId: byTrainer("كريم").id },
      { day: 6, time: "19:00", gymClassId: byClass("بوكسينج").id, trainerId: byTrainer("أحمد").id },
    ];
    await prisma.scheduleSlot.createMany({ data: slots });
    console.log(`✓ ${slots.length} schedule slots created`);
  }

  // ===== Nutrition Plans + Meals =====
  const existingPlans = await prisma.nutritionPlan.count();
  if (existingPlans === 0) {
    const breakfasts = [
      "أومليت 4 بياض + جبن قريش + خبز عيش بلدي + شاي بدون سكر",
      "شوفان بالحليب قليل الدسم + موز + ملعقة عسل + 4 بياض بيض",
      "فول بالليمون والكمون + 5 بياض بيض مسلوق + خبز أسمر",
      "توست أسمر بأفوكادو + بيضتين مسلوقتين + كوب لبن رايب",
      "عصير برتقال طبيعي + كأس شوفان بالجبن القريش + تمرتان",
    ];
    const lunches = [
      "صدر دجاج مشوي 250جم + أرز بسمتي 200جم مطبوخ + سلطة خضراء",
      "سمك بلطي مشوي 300جم + بطاطس مسلوقة + سلطة طحينة بالليمون",
      "لحم بقري مشوي 250جم + مكرونة بالصلصة + سلطة خضراء",
      "صدور دجاج بالفرن مع خضار مشكلة + كينوا مطبوخة",
      "كفتة دجاج بالفرن + أرز + شوربة عدس",
    ];
    const dinners = [
      "علبة تونة بالماء + سلطة خضراء + توست أسمر",
      "شيش طاووق مشوي + سلطة زبادي بالخيار + خبز أسمر",
      "أومليت بالخضار + جبن قريش + خيار وطماطم",
      "سمك سلمون مشوي 200جم + بروكلي سوتيه",
      "شرائح ديك رومي مشوي + سلطة كول سلو خفيفة",
    ];
    const snacks = [
      "بروتين شيك 1 سكوب + موزة",
      "زبادي يوناني + حفنة مكسرات مشكلة",
      "تفاحة + ملعقة زبدة فول سوداني",
      "لبن زبادي بالعسل + لوز",
      "ساندوتش تونة خفيف + شاي أخضر",
    ];

    const plansData = [
      {
        name: "خطة التضخيم — Bulk Ocean",
        goal: "bulk",
        calories: 3000,
        protein: 180,
        carbs: 380,
        fats: 95,
        description:
          "خطة سعرات عالية مصممة لبناء الكتلة العضلية بسرعة مع أقل تراكم للدهون — 5 وجبات موزعة على اليوم.",
        notes: "اشرب 4 لتر مياه يوميًا — وجبة بعد التمرين خلال 30 دقيقة — نوم 8 ساعات إجباري.",
        splits: { breakfast: 0.25, lunch: 0.35, dinner: 0.28, snack: 0.12 },
      },
      {
        name: "خطة التنشيف — Cut Ocean",
        goal: "cut",
        calories: 1800,
        protein: 160,
        carbs: 140,
        fats: 55,
        description:
          "خطة عالية البروتين لحرق الدهون مع الحفاظ على العضلات — وجبات شبعة منخفضة الكاروهيدرات.",
        notes: "كارديو 20 دقيقة بعد الوزن — امشِ 8000 خطوة يوميًا — تجنب السكريات تمامًا.",
        splits: { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snack: 0.10 },
      },
      {
        name: "خطة التوازن — Balance",
        goal: "maintain",
        calories: 2200,
        protein: 150,
        carbs: 230,
        fats: 70,
        description:
          "خطة متوازنة للحفاظ على الوزن والرشاقة مع طاقة يومية عالية — مناسبة للأسلوب الصحي المتواصل.",
        notes: "وزنك مرة أسبوعيًا صباحًا على الريق — 3 أيام كارديو أسبوعيًا.",
        splits: { breakfast: 0.25, lunch: 0.35, dinner: 0.29, snack: 0.11 },
      },
    ];

    for (const p of plansData) {
      const plan = await prisma.nutritionPlan.create({
        data: {
          name: p.name,
          goal: p.goal,
          calories: p.calories,
          protein: p.protein,
          carbs: p.carbs,
          fats: p.fats,
          description: p.description,
          notes: p.notes,
        },
      });

      const meals: {
        day: number;
        mealType: string;
        content: string;
        calories: number;
      }[] = [];
      for (let day = 0; day < 7; day++) {
        const defs: [string, string[], number][] = [
          ["breakfast", breakfasts, p.splits.breakfast],
          ["lunch", lunches, p.splits.lunch],
          ["dinner", dinners, p.splits.dinner],
          ["snack", snacks, p.splits.snack],
        ];
        defs.forEach(([mealType, options, ratio], idx) => {
          meals.push({
            day,
            mealType,
            content: options[(day + idx) % options.length],
            calories: Math.round((p.calories * ratio) / 10) * 10,
          });
        });
      }
      await prisma.nutritionMeal.createMany({
        data: meals.map((m) => ({ ...m, planId: plan.id })),
      });
      console.log(`✓ Nutrition plan "${p.name}" with ${meals.length} meals`);
    }

    // ===== Assign plans to members =====
    const bulk = await prisma.nutritionPlan.findFirst({ where: { goal: "bulk" } });
    const cut = await prisma.nutritionPlan.findFirst({ where: { goal: "cut" } });
    const balance = await prisma.nutritionPlan.findFirst({ where: { goal: "maintain" } });

    const assign = async (email: string, planId?: string) => {
      const m = await prisma.member.findFirst({ where: { email } });
      if (m) await prisma.member.update({ where: { id: m.id }, data: { nutritionPlanId: planId } });
    };
    await assign("mahmoud@example.com", cut?.id);
    await assign("omar@example.com", bulk?.id);
    await assign("nourhan@example.com", balance?.id);
    console.log("✓ Nutrition plans assigned to members");
  }

  // ===== Access Codes =====
  const codes: [string, string][] = [
    ["mahmoud@example.com", "OC-1001"],
    ["nourhan@example.com", "OC-1002"],
    ["omar@example.com", "OC-1003"],
    ["heba@example.com", "OC-1004"],
    ["youssef@example.com", "OC-1005"],
  ];
  for (const [email, code] of codes) {
    const m = await prisma.member.findFirst({ where: { email } });
    if (m) await prisma.member.update({ where: { id: m.id }, data: { accessCode: code } });
  }
  console.log("✓ Portal access codes assigned (OC-1001..OC-1005)");

  // ===== Progress Logs =====
  const existingLogs = await prisma.progressLog.count();
  if (existingLogs === 0) {
    const monthsAgo = (m: number) => {
      const d = new Date();
      d.setMonth(d.getMonth() - m);
      return d;
    };

    const mahmoud = await prisma.member.findFirst({ where: { email: "mahmoud@example.com" } });
    const omar = await prisma.member.findFirst({ where: { email: "omar@example.com" } });
    const nourhan = await prisma.member.findFirst({ where: { email: "nourhan@example.com" } });

    await prisma.progressLog.createMany({
      data: [
        // محمود — تنشيف (نزول وزن)
        { memberId: mahmoud!.id, date: monthsAgo(5), weight: 92.0, fatPercent: 28.0, waist: 104, chest: 110, arm: 36, notes: "البداية — إعادة تشكيل" },
        { memberId: mahmoud!.id, date: monthsAgo(4), weight: 90.2, fatPercent: 26.4, waist: 101, chest: 109.5, arm: 36.2 },
        { memberId: mahmoud!.id, date: monthsAgo(3), weight: 88.4, fatPercent: 24.5, waist: 98.5, chest: 109, arm: 36.4 },
        { memberId: mahmoud!.id, date: monthsAgo(2), weight: 87.1, fatPercent: 23.0, waist: 96.5, chest: 109.5, arm: 36.6, notes: "ممتاز — استمر على نفس الخطة" },
        { memberId: mahmoud!.id, date: monthsAgo(1), weight: 86.0, fatPercent: 21.6, waist: 95, chest: 110, arm: 37 },
        // عمر — تضخيم (زيادة عضلات)
        { memberId: omar!.id, date: monthsAgo(4), weight: 78.0, fatPercent: 14.0, muscleMass: 34.0, arm: 34, chest: 102 },
        { memberId: omar!.id, date: monthsAgo(3), weight: 79.6, fatPercent: 14.3, muscleMass: 35.2, arm: 34.8, chest: 103.5 },
        { memberId: omar!.id, date: monthsAgo(2), weight: 80.4, fatPercent: 14.1, muscleMass: 36.0, arm: 35.5, chest: 104.5, notes: "زيادة نظيفة — كمل" },
        { memberId: omar!.id, date: monthsAgo(1), weight: 81.7, fatPercent: 14.6, muscleMass: 36.8, arm: 36.2, chest: 106 },
        // نورهان — توازن
        { memberId: nourhan!.id, date: monthsAgo(3), weight: 64.0, fatPercent: 27.0, muscleMass: 26.0, waist: 82 },
        { memberId: nourhan!.id, date: monthsAgo(2), weight: 63.5, fatPercent: 26.6, muscleMass: 26.5, waist: 81 },
        { memberId: nourhan!.id, date: monthsAgo(1), weight: 63.2, fatPercent: 26.2, muscleMass: 27.0, waist: 80.5, notes: "ثبات ممتاز" },
      ],
    });
    console.log("✓ 11 progress logs created");
  }

  console.log("🌊 Ocean GYM V2 seed completed!");
  console.log(`   Days: ${DAY_NAMES.join(" — ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
