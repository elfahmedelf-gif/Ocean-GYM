import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/hash";

const db = new PrismaClient();

/** تواريخ ماضية كأيام من الآن */
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** تواريخ قادمة كأيام من الآن */
function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding Ocean GYM data...");

  // ===== Admin =====
  const adminPassword = hashPassword("ocean123");
  await db.admin.upsert({
    where: { username: "admin" },
    update: { password: adminPassword },
    create: { username: "admin", password: adminPassword, name: "مدير أوشن جيم" },
  });

  // ===== Plans =====
  await db.plan.deleteMany();
  const monthly = await db.plan.create({
    data: {
      name: "الباقة الشهرية",
      price: 600,
      duration: 1,
      features: "دخول غير محدود للجيم\nخزانة تغيير ملابس\nبرنامج تدريب أساسي\nمتابعة أول تقييم مع مدرب",
      popular: false,
      active: true,
    },
  });
  const silver = await db.plan.create({
    data: {
      name: "الباقة الفضية",
      price: 1500,
      duration: 3,
      features: "كل مزايا الباقة الشهرية\nكلاسات جروب غير محدودة\nخطة تدريب شخصية\nتقييم لياقة شهري\nخصم 15% على المكملات",
      popular: true,
      active: true,
    },
  });
  const gold = await db.plan.create({
    data: {
      name: "الباقة الذهبية",
      price: 4800,
      duration: 12,
      features: "كل مزايا الباقة الفضية\nبوتير شخصي مخصص\nخطة تغذية من متخصص\nدخول بوابة الأعضاء والمتابعة\nساونا وجاكوزي\nضيف مجاني أسبوعياً",
      popular: false,
      active: true,
    },
  });

  // ===== Trainers =====
  await db.trainer.deleteMany();
  const karim = await db.trainer.create({
    data: {
      name: "كريم الشناوي",
      role: "المدير الرياضي وبوتير معتمد",
      bio: "خبرة 12 سنة في بناء العضلات وتكوين الجسم، مدرب معتمد من NASM وISSA، متخصص في تحويل الأجسام وبرامج التضخيم العضلي.",
      image: "/images/trainer-1.jpg",
      specialty: "بناء العضلات وتكوين الجسم",
      instagram: "https://instagram.com",
      active: true,
      order: 1,
    },
  });
  const sara = await db.trainer.create({
    data: {
      name: "سارة محمود",
      role: "مدربة كلاسات جروب ولياقة",
      bio: "مدربة يوجا ولياقة معتمدة دولياً، شغوفة بمساعدة المتدربات على الوصول لأفضل نسخة من نفسهم عبر كلاسات ممتعة وفعالة.",
      image: "/images/trainer-2.jpg",
      specialty: "يوجا وتمارين الحرق",
      instagram: "https://instagram.com",
      active: true,
      order: 2,
    },
  });
  const ahmed = await db.trainer.create({
    data: {
      name: "أحمد فتحي",
      role: "مدرب بوكسينج وفنون قتالية",
      bio: "بطل جمهورية سابق في الملاكمه، مدرب بوكسينج وMMA بخبرة 8 سنوات في تدريب المحترفين والمبتدئين.",
      image: "/images/trainer-3.jpg",
      specialty: "بوكسينج وكارديو عالي",
      instagram: "https://instagram.com",
      active: true,
      order: 3,
    },
  });

  // ===== Gym Classes =====
  await db.gymClass.deleteMany();
  const boxing = await db.gymClass.create({
    data: {
      name: "بوكسينج",
      description:
        "كلاس بوكسينج احترافي بتقنيات الملاكمه الحديثة، يبني قوة التحمل وسرعة رد الفعل ويحرق أكبر عدد سعرات في أقصر وقت.",
      trainerId: ahmed.id,
      schedule: "السبت والاثنين والأربعاء — 7:00 مساً",
      duration: 60,
      capacity: 16,
      level: "advanced",
      image: "/images/class-boxing.jpg",
      active: true,
    },
  });
  const crossfit = await db.gymClass.create({
    data: {
      name: "كروسفت",
      description:
        "تمارين عالية الكثافة تجمع بين القوة والتحمل، WOD يومي متغير يشتغل على كل عضلات الجسم في جو حماسي جماعي.",
      trainerId: karim.id,
      schedule: "يومياً — 8:00 صباحاً و 7:00 مساً",
      duration: 60,
      capacity: 18,
      level: "all",
      image: "/images/class-crossfit.jpg",
      active: true,
    },
  });
  const bodybuilding = await db.gymClass.create({
    data: {
      name: "كمال أجسام",
      description:
        "أحدث أجهزة Hammer Strength وLife Fitness مع متابعة بوتير متخصص لبناء عضلي متناسق وبرامج تضخيم وتجفيف مدروسة.",
      trainerId: karim.id,
      schedule: "متاح طوال ساعات العمل",
      duration: 90,
      capacity: 30,
      level: "all",
      image: "/images/class-bodybuilding.jpg",
      active: true,
    },
  });
  const spinning = await db.gymClass.create({
    data: {
      name: "سبيننج",
      description:
        "ركوب دراجات جماعي بإضاءة وصوتيات محفزة، حرق يصل إلى 700 سعرة في الحصة مع مدرب يشجعك تكتمل الرحلة.",
      trainerId: sara.id,
      schedule: "الأحد والثلاثاء والخميس — 6:00 مساً",
      duration: 45,
      capacity: 20,
      level: "intermediate",
      image: "/images/class-spinning.jpg",
      active: true,
    },
  });
  const yoga = await db.gymClass.create({
    data: {
      name: "يوجا",
      description:
        "جلسات يوجا هادئة لتحسين المرونة والتنفس وخفض التوتر، مناسبة لكل المستويات من المبتدئ للمتقدم.",
      trainerId: sara.id,
      schedule: "السبت والأربعاء — 10:00 صباحاً",
      duration: 60,
      capacity: 15,
      level: "beginner",
      image: "/images/class-yoga.jpg",
      active: true,
    },
  });
  const functional = await db.gymClass.create({
    data: {
      name: "تمارين وظيفية",
      description:
        "Functional Training بتحسين حركتك اليومية، تمارين كيتلبل وروبات وبوكس جامب لتقوية الجسم كوحدة واحدة.",
      trainerId: ahmed.id,
      schedule: "الأحد والثلاثاء — 9:00 صباحاً",
      duration: 50,
      capacity: 14,
      level: "intermediate",
      image: "/images/class-functional.jpg",
      active: true,
    },
  });

  // ===== Weekly Schedule =====
  // day: 0=السبت .. 6=الجمعة
  await db.scheduleSlot.deleteMany();
  const slots: { day: number; time: string; gymClassId: string; trainerId: string | null }[] = [
    // السبت
    { day: 0, time: "08:00", gymClassId: crossfit.id, trainerId: karim.id },
    { day: 0, time: "10:00", gymClassId: yoga.id, trainerId: sara.id },
    { day: 0, time: "19:00", gymClassId: boxing.id, trainerId: ahmed.id },
    // الأحد
    { day: 1, time: "09:00", gymClassId: functional.id, trainerId: ahmed.id },
    { day: 1, time: "18:00", gymClassId: spinning.id, trainerId: sara.id },
    // الاثنين
    { day: 2, time: "08:00", gymClassId: crossfit.id, trainerId: karim.id },
    { day: 2, time: "19:00", gymClassId: boxing.id, trainerId: ahmed.id },
    // الثلاثاء
    { day: 3, time: "09:00", gymClassId: functional.id, trainerId: ahmed.id },
    { day: 3, time: "18:00", gymClassId: spinning.id, trainerId: sara.id },
    // الأربعاء
    { day: 4, time: "08:00", gymClassId: crossfit.id, trainerId: karim.id },
    { day: 4, time: "10:00", gymClassId: yoga.id, trainerId: sara.id },
    { day: 4, time: "19:00", gymClassId: boxing.id, trainerId: ahmed.id },
    // الخميس
    { day: 5, time: "19:00", gymClassId: crossfit.id, trainerId: karim.id },
    // الجمعة
    { day: 6, time: "17:00", gymClassId: bodybuilding.id, trainerId: karim.id },
  ];
  await db.scheduleSlot.createMany({ data: slots });

  // ===== Nutrition Plans =====
  await db.nutritionPlan.deleteMany();

  const bulkPlan = await db.nutritionPlan.create({
    data: {
      name: "خطة زيادة الكتلة العضلية",
      goal: "bulk",
      calories: 3000,
      protein: 180,
      carbs: 380,
      fats: 80,
      description: "خطة عالية السعرات لبناء العضلات مع توزيع وجبات متوازن طوال اليوم.",
      notes: "اشرب 3 لتر ماء يومياً — المكملات بعد استشارة المدرب",
      active: true,
    },
  });
  const cutPlan = await db.nutritionPlan.create({
    data: {
      name: "خطة خسارة الدهون",
      goal: "cut",
      calories: 1800,
      protein: 150,
      carbs: 140,
      fats: 60,
      description: "عجز سعرات مدروس مع بروتين عالي للحفاظ على العضلات أثناء الجفاف.",
      notes: "المشي 30 دقيقة يومياً خارج التدريب — قياس الوزن أسبوعياً صباحاً",
      active: true,
    },
  });
  const healthyPlan = await db.nutritionPlan.create({
    data: {
      name: "خطة الصيانة الصحية",
      goal: "maintain",
      calories: 2200,
      protein: 130,
      carbs: 250,
      fats: 70,
      description: "نظام متوازن مستدام للحفاظ على الوزن والصحة العامة.",
      notes: "التزم بتوقيت الوجبات — سماحية أسبوعية لوجبة حرة",
      active: true,
    },
  });

  type MealSeed = { day: number; mealType: string; content: string; calories: number };
  const bulkMeals: MealSeed[] = [
    { day: 0, mealType: "breakfast", content: "5 بياض بيض + 2 صفار، شوفان 100جم بالحليب، موزة، قرفة", calories: 750 },
    { day: 0, mealType: "lunch", content: "صدور فراخ مشوية 250جم، أرز أبيض 200جم مطبوخ، سلطة خضراء بزيت الزيتون", calories: 900 },
    { day: 0, mealType: "dinner", content: "سمك بلطي مشوي 250جم، بطاطا مسلوقة 200جم، خضار سوتيه", calories: 700 },
    { day: 0, mealType: "snack", content: "زبادي يوناني 200جم + مكسرات 30جم + عسل", calories: 450 },
    { day: 1, mealType: "breakfast", content: "فطير مشلتت بالجبنه القريش (كمية محسوبة) + 4 بيضات", calories: 800 },
    { day: 1, mealType: "lunch", content: "لحم بقري مشوي 250جم، مكرونة 200جم، سلطة", calories: 950 },
    { day: 1, mealType: "dinner", content: "صدور فراخ 200جم، كينوا 150جم، أفوكادو نص حبة", calories: 650 },
    { day: 2, mealType: "breakfast", content: "أومليت 4 بيضات بالجبن، توست أسمر 3 شرائح، عصير برتقال", calories: 700 },
    { day: 2, mealType: "lunch", content: "كبدة اسكندراني 250جم، أرز بالسمن البلدي، سلطة طحينة", calories: 950 },
    { day: 2, mealType: "dinner", content: "تونة بالزيت 2 علب، بطاطا، سلطة كول سلو", calories: 700 },
    { day: 3, mealType: "breakfast", content: "شوفان 100جم + بروتين باودر + فول سوداني 30جم", calories: 780 },
    { day: 3, mealType: "lunch", content: "فراخ مشوية 250جم، بطاطا محمرة بالفرن 250جم، سلطة", calories: 900 },
    { day: 3, mealType: "dinner", content: "لحم مفروم 200جم 10%، خبز بلدي، خضار مشوية", calories: 720 },
    { day: 4, mealType: "breakfast", content: "بيض مقلي بالسمن 3 حبات، فول بالزيت، خبز بلدي، جبنة", calories: 760 },
    { day: 4, mealType: "lunch", content: "سمك مشوي 300جم، رز معمر صغير، سلطة خضراء", calories: 920 },
    { day: 4, mealType: "dinner", content: "بيتزا بيت منزلية بعجينة أسمر + سلطة بروتين", calories: 780 },
    { day: 5, mealType: "breakfast", content: "بان كيك شوفان وبيض بالعسل والموز", calories: 740 },
    { day: 5, mealType: "lunch", content: "دجاج بانيه صحي بالفرن 250جم، رز 200جم، شوربة عدس", calories: 900 },
    { day: 5, mealType: "dinner", content: "استيك لحم 250جم، مشروم سوتيه، بطاطا مهروسة بالحليب", calories: 760 },
    { day: 6, mealType: "breakfast", content: "شكشوكة 4 بيضات، خبز بلدي، جبنة بيضاء", calories: 720 },
    { day: 6, mealType: "lunch", content: "كفتة مشوية 250جم، كوسا بشرمولة، أرز", calories: 930 },
    { day: 6, mealType: "dinner", content: "سلطة بروتين كبيرة: تونة + بيض + حمص + زيت زيتون", calories: 680 },
  ];
  const cutMeals: MealSeed[] = [
    { day: 0, mealType: "breakfast", content: "4 بياض بيض أومليت بالخضار، توست أسمر شريحة، قهوة سادة", calories: 350 },
    { day: 0, mealType: "lunch", content: "صدور فراخ مشوية 200جم، سلطة كبيرة بلا نشويات، زيت زيتون ملعقة", calories: 450 },
    { day: 0, mealType: "dinner", content: "سمك مشوي 200جم، خضار بخار، ليمون", calories: 380 },
    { day: 0, mealType: "snack", content: "زبادي سكيم 170جم + قرفة", calories: 130 },
    { day: 1, mealType: "breakfast", content: "فول بالليمون والكمون (بدون زيت) + بيضة مسلوقة", calories: 320 },
    { day: 1, mealType: "lunch", content: "لحم مشوي 180جم، سلطة طحينة خفيفة، خبز بلدي ربع", calories: 480 },
    { day: 1, mealType: "dinner", content: "شوربة خضار + تونة مصفاة + سلطة", calories: 350 },
    { day: 2, mealType: "breakfast", content: "شوفان 40جم بماء + بروتين سكوب + قرفة", calories: 340 },
    { day: 2, mealType: "lunch", content: "كبدة مشوية 180جم، سلطة خضراء", calories: 420 },
    { day: 2, mealType: "dinner", content: "بيض مسلوق 2 + جبنة قريش 100جم + خيار", calories: 300 },
    { day: 3, mealType: "breakfast", content: "أومليت بياض 5 + سبانخ، توست أسمر", calories: 330 },
    { day: 3, mealType: "lunch", content: "فراخ مشوية 200جم، بروكلي وبطاطا مسلوقة صغيرة", calories: 440 },
    { day: 3, mealType: "dinner", content: "سلطة تونة كبيرة + ملعطة زيت زيتون", calories: 360 },
    { day: 4, mealType: "breakfast", content: "زبادي يوناني لايت + فراولة + مكسرات 15جم", calories: 310 },
    { day: 4, mealType: "lunch", content: "سمك بلطي مشوي 250جم، سلطة، رز شعيرية ملعقة", calories: 460 },
    { day: 4, mealType: "dinner", content: "شوربة عدس صغيرة + بيضة + خبز أسمر", calories: 340 },
    { day: 5, mealType: "breakfast", content: "بيض مخدود 2 + أفوكادو ربع + توست", calories: 330 },
    { day: 5, mealType: "lunch", content: "استيك لحم 180جم، سلطة سيزر بصوص لايت", calories: 450 },
    { day: 5, mealType: "dinner", content: "كوكتيل بروتين + موزة صغيرة", calories: 320 },
    { day: 6, mealType: "breakfast", content: "فيتا وجبة حرة متوازنة (سلطة بروتين كبيرة)", calories: 400 },
    { day: 6, mealType: "lunch", content: "دجاج مشوي 200جم، كوسا محشي بالخضار", calories: 430 },
    { day: 6, mealType: "dinner", content: "زبادي + خيار + توست أسمر", calories: 300 },
  ];
  const healthyMeals: MealSeed[] = [
    { day: 0, mealType: "breakfast", content: "3 بيضات أومليت بالجبن، توست أسمر 2، خضار", calories: 480 },
    { day: 0, mealType: "lunch", content: "فراخ مشوية 200جم، أرز 150جم، سلطة", calories: 620 },
    { day: 0, mealType: "dinner", content: "سمك مشوي 200جم، خضار سوتيه، بطاطا صغيرة", calories: 520 },
    { day: 0, mealType: "snack", content: "فاكتا موزة + شاي أخضر", calories: 180 },
    { day: 1, mealType: "breakfast", content: "فول medial + بيضة + خبز بلدي ربع", calories: 450 },
    { day: 1, mealType: "lunch", content: "لحم مشوي 200جم، مكرونة 150جم، سلطة", calories: 650 },
    { day: 1, mealType: "dinner", content: "شوربة خضار + جبنة قريش + توست", calories: 420 },
    { day: 2, mealType: "breakfast", content: "شوفان 60جم بالحليب لايت + فاكتا + عسل ملعقة", calories: 460 },
    { day: 2, mealType: "lunch", content: "كبدة 200جم، رز 150جم، سلطة", calories: 640 },
    { day: 2, mealType: "dinner", content: "تونة بالزيت + سلطة كبيرة + ربع خبز", calories: 440 },
    { day: 3, mealType: "breakfast", content: "بيض مسلوق 2 + أفوكادو نص + توست أسمر", calories: 470 },
    { day: 3, mealType: "lunch", content: "دجاج بالفرن 200جم، بطاطا 150جم، بروكلي", calories: 610 },
    { day: 3, mealType: "dinner", content: "زبادي يوناني + مكسرات + فاكتا", calories: 400 },
    { day: 4, mealType: "breakfast", content: "منتصف أومليت 3 بيضات + خضار + جبنة", calories: 480 },
    { day: 4, mealType: "lunch", content: "سمك مشوي 250جم، رز 150جم، سلطة الطحينة الخفيفة", calories: 640 },
    { day: 4, mealType: "dinner", content: "شوربة عدس + توست أسمر + بيضة", calories: 430 },
    { day: 5, mealType: "breakfast", content: "بان كيك شوفان صحي + عسل + فاكتا", calories: 500 },
    { day: 5, mealType: "lunch", content: "كفتة بالفرن 200جم، كوسا، أرز 150جم", calories: 660 },
    { day: 5, mealType: "dinner", content: "سلطة بروتين + تونة + بيضة", calories: 440 },
    { day: 6, mealType: "breakfast", content: "شكشوكة 3 بيضات + خبز بلدي", calories: 470 },
    { day: 6, mealType: "lunch", content: "وجبة حرة متوازنة (اختيارك المفضل بحكمة)", calories: 700 },
    { day: 6, mealType: "dinner", content: "زبادي + فاكتا + مكسرات", calories: 380 },
  ];
  await db.nutritionMeal.createMany({ data: bulkMeals.map((m) => ({ ...m, planId: bulkPlan.id })) });
  await db.nutritionMeal.createMany({ data: cutMeals.map((m) => ({ ...m, planId: cutPlan.id })) });
  await db.nutritionMeal.createMany({ data: healthyMeals.map((m) => ({ ...m, planId: healthyPlan.id })) });

  // ===== Members =====
  await db.member.deleteMany();

  const m1 = await db.member.create({
    data: {
      name: "محمد السيد",
      email: "mohamed@example.com",
      phone: "01001234567",
      planId: silver.id,
      status: "active",
      startDate: daysAgo(90),
      endDate: daysFromNow(0),
      notes: "هدفه زيادة الكتلة العضلية — جدول 4 أيام Push/Pull/Legs",
      accessCode: "OC-2024",
      nutritionPlanId: bulkPlan.id,
    },
  });
  const m2 = await db.member.create({
    data: {
      name: "أحمد طارق",
      email: "ahmed.tarek@example.com",
      phone: "01112223344",
      planId: gold.id,
      status: "active",
      startDate: daysAgo(150),
      endDate: daysFromNow(215),
      notes: "مبتدئ سابق — تقدم ممتاز، يستهدف خسارة 8 كيلو",
      accessCode: "OC-2041",
      nutritionPlanId: cutPlan.id,
    },
  });
  const m3 = await db.member.create({
    data: {
      name: "نهى عبد الله",
      email: "noha@example.com",
      phone: "01223334455",
      planId: silver.id,
      status: "active",
      startDate: daysAgo(60),
      endDate: daysFromNow(30),
      notes: "كلاسات جروب + يوجا — صيانة وزن مستقر",
      accessCode: "OC-2105",
      nutritionPlanId: healthyPlan.id,
    },
  });
  const m4 = await db.member.create({
    data: {
      name: "عمر حسن",
      email: "omar@example.com",
      phone: "01098765432",
      planId: null,
      status: "pending",
      notes: "سجل من الموقع — بحاجة لزيارة واختيار باقة",
      accessCode: null,
      nutritionPlanId: null,
    },
  });
  const m5 = await db.member.create({
    data: {
      name: "كريم مصطفى",
      email: "karim.m@example.com",
      phone: "01555667788",
      planId: monthly.id,
      status: "frozen",
      startDate: daysAgo(120),
      endDate: daysFromNow(-20),
      notes: "تجميد بسبب سفر — يفرد الاشتراك عند العودة",
      accessCode: "OC-2137",
      nutritionPlanId: null,
    },
  });

  // ===== Progress Logs =====
  await db.progressLog.deleteMany();
  await db.progressLog.createMany({
    data: [
      // محمد — هدف تضخيم: وزن يزيد
      { memberId: m1.id, date: daysAgo(90), weight: 78.4, fatPercent: 19.5, muscleMass: 58.2, waist: 88, chest: 100, arm: 33 },
      { memberId: m1.id, date: daysAgo(60), weight: 80.9, fatPercent: 18.9, muscleMass: 59.8, waist: 89, chest: 102, arm: 34.2 },
      { memberId: m1.id, date: daysAgo(30), weight: 82.6, fatPercent: 18.2, muscleMass: 61.1, waist: 89.5, chest: 104, arm: 35 },
      { memberId: m1.id, date: daysAgo(5), weight: 84.1, fatPercent: 17.8, muscleMass: 62.4, waist: 90, chest: 105.5, arm: 36.1, notes: "استجابة ممتازة — زيادة البروتين للفطار" },
      // أحمد — هدف تنشيف: وزن يقل
      { memberId: m2.id, date: daysAgo(150), weight: 96.2, fatPercent: 31, muscleMass: 60.1, waist: 104, chest: 108, arm: 35 },
      { memberId: m2.id, date: daysAgo(110), weight: 92.8, fatPercent: 28.6, muscleMass: 60.4, waist: 100, chest: 107, arm: 35.3 },
      { memberId: m2.id, date: daysAgo(70), weight: 90.1, fatPercent: 26.2, muscleMass: 60.8, waist: 96, chest: 106, arm: 35.5 },
      { memberId: m2.id, date: daysAgo(35), weight: 88.3, fatPercent: 24.4, muscleMass: 61.2, waist: 93, chest: 105.6, arm: 35.8 },
      { memberId: m2.id, date: daysAgo(7), weight: 86.9, fatPercent: 23.1, muscleMass: 61.5, waist: 91, chest: 105, arm: 36, notes: "قرب من الهدف — شدة كارديو زيادة 10 دقايق" },
      // نهى — صيانة: وزن مستقر
      { memberId: m3.id, date: daysAgo(60), weight: 64.5, fatPercent: 26, muscleMass: 42.8, waist: 74, chest: 90, arm: 27 },
      { memberId: m3.id, date: daysAgo(30), weight: 64.2, fatPercent: 25.6, muscleMass: 43.1, waist: 73.5, chest: 90, arm: 27.2 },
      { memberId: m3.id, date: daysAgo(6), weight: 64.0, fatPercent: 25.2, muscleMass: 43.4, waist: 73, chest: 90.5, arm: 27.5, notes: "مستقرة — استمرار كلاسات جروب 3 أيام" },
    ],
  });

  // ===== Testimonials =====
  await db.testimonial.deleteMany();
  await db.testimonial.createMany({
    data: [
      {
        name: "محمد السيد",
        role: "عضو منذ سنتين",
        content:
          "أفضل جيم جربته في حياتي. الأجهزة بجرمني والمدربين بيتابعوا معايا خطوة بخطوة. جسمي اتغير 180 درجة في سنة، والمكان نظيف والجو رائع.",
        rating: 5,
        approved: true,
      },
      {
        name: "نهى عبد الله",
        role: "عضوة كلاسات جروب",
        content:
          "كلاسات السارة في اليوجا والسبيننج حياتي اتغيرت بجد. الجو حماسي والبنات متعاونين، وأول مرة ألتزم بروتين رياضي لمدة سنة كاملة.",
        rating: 5,
        approved: true,
      },
      {
        name: "أحمد طارق",
        role: "خسر 9 كيلو في 5 شهور",
        content:
          "جربت نوادي كتير وفشلت، لكن مع خطة التغذية والمتابعة على بوابة الأعضاء هنا، خسرت 9 كيلو وأخيراً فهمت إزاي أطبعم صح. الشكر للفريق كله.",
        rating: 5,
        approved: true,
      },
      {
        name: "م. عمرو دياب",
        role: "عضو الباقة الذهبية",
        content:
          "الساونا والجاكوزي بعد التدريب تجربة تانية خالص. الأسعار ممتازة مقارنة بالمستوى، والقفل الإلكتروني والنظافة بيرفعوا التجربة لأعلى مستوى.",
        rating: 5,
        approved: true,
      },
    ],
  });

  // ===== Gallery =====
  await db.galleryItem.deleteMany();
  await db.galleryItem.createMany({
    data: [
      { title: "صالة الكمال أجسام الرئيسية", image: "/images/class-bodybuilding.jpg" },
      { title: "كلاس البوكسينج", image: "/images/class-boxing.jpg" },
      { title: "منطقة الكروسفت", image: "/images/class-crossfit.jpg" },
      { title: "استوديو السبيننج", image: "/images/class-spinning.jpg" },
      { title: "منطقة التمارين الوظيفية", image: "/images/class-functional.jpg" },
      { title: "استوديو اليوجا", image: "/images/class-yoga.jpg" },
      { title: "أجواء النادي العامة", image: "/images/about-gym.jpg" },
    ],
  });

  // ===== Messages =====
  await db.message.deleteMany();
  await db.message.createMany({
    data: [
      {
        name: "هدى إبراهيم",
        email: "hoda@example.com",
        phone: "01011223344",
        subject: "استفسار عن كلاسات البنات",
        content: "السلام عليكم، عايزة أعرف كلاسات البنات متاحة في أي أوقات، وهل فيه مدربات متخصصة للكلاسات؟",
        read: false,
      },
      {
        name: "شريف جمال",
        email: "sherif@example.com",
        subject: "عروض الشركات",
        content: "شغال في شركة ولو 20 موظف هنشترك — فيه خصم للمجموعات؟ وممكن نزور النادي للمعاينة؟",
        read: false,
      },
      {
        name: "مي سمير",
        email: "mai@example.com",
        subject: "شكراً لكم",
        content: "عايزة أشكر مدربة سارة على التميز في الكلاسات، تجربة رائعة فعلاً والتغيير واضح على جسمي.",
        read: true,
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("Admin: admin / ocean123");
  console.log("Portal codes: OC-2024 (محمد — تضخيم), OC-2041 (أحمد — تنشيف), OC-2105 (نهى — صيانة)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
