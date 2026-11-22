/**
 * Ocean GYM — Database seed script
 * Run with: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("🌊 Seeding Ocean GYM database...");

  // ===== Admin =====
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashPassword("ocean123"),
      name: "مدير Ocean GYM",
    },
  });
  console.log("✓ Admin created: admin / ocean123");

  // ===== Plans =====
  const planMonthly = await prisma.plan.create({
    data: {
      name: "الباقة الشهرية",
      price: 600,
      duration: 1,
      popular: false,
      features: [
        "دخول كامل للجيم طوال الشهر",
        "أحدث الأجهزة الأمريكية",
        "خزانة ملابس شخصية",
        "تقييم لياقة شهري",
        "دخول لكلاسات الصباح",
      ].join("\n"),
    },
  });

  const planQuarterly = await prisma.plan.create({
    data: {
      name: "باقة المحيط — 3 شهور",
      price: 1500,
      duration: 3,
      popular: true,
      features: [
        "كل مزايا الباقة الشهرية",
        "خطة تدريب مخصصة لك",
        "خطة تغذية من خبراء التغذية",
        "دخول مجاني لجميع الكلاسات",
        "جلسة ساونا أسبوعية",
        "خصم 10% للمستوى التالي",
      ].join("\n"),
    },
  });

  const planYearly = await prisma.plan.create({
    data: {
      name: "باقة VIP سنوية",
      price: 4800,
      duration: 12,
      popular: false,
      features: [
        "كل مزايا باقة المحيط",
        "8 جلسات مدرب شخصي شهريًا",
        "خزانة VIP خاصة",
        "دخول مجاني للسباحة",
        "مكملات غذائية بخصم 20%",
        "استقبال VIP ومشروب ترحيبي",
      ].join("\n"),
    },
  });
  console.log("✓ 3 plans created");

  // ===== Trainers =====
  const trainerKarim = await prisma.trainer.create({
    data: {
      name: "كريم الشناوي",
      role: "المدير الفني ومدرب كمال الأجسام",
      bio: "خبرة 12 سنة في كمال الأجسام والتحضير للبطولات، مدرب معتمد من ISSA وأخصائي تغذية رياضية.",
      image: "/images/trainer-1.jpg",
      specialty: "كمال الأجسام — خطة التضخيم والتنشيف",
      instagram: "karim.oceangym",
      order: 1,
    },
  });

  const trainerSarah = await prisma.trainer.create({
    data: {
      name: "سارة محمود",
      role: "مدربة لياقة ويوجا",
      bio: "مدربة يوجا معتمدة دوليًا RYT-500، متخصصة في التدريب الوظيفي للنساء واستعادة الرشاقة.",
      image: "/images/trainer-2.jpg",
      specialty: "يوجا — تدريب وظيفي — لياقة النساء",
      instagram: "sara.oceangym",
      order: 2,
    },
  });

  const trainerAhmed = await prisma.trainer.create({
    data: {
      name: "أحمد فتحي",
      role: "مدرب بوكسينج وفنون قتالية",
      bio: "بطل جمهورية سابق في الملاكمه، خبرة 9 سنوات في تدريب البوكسينج والكيك بوكسينج لجميع المستويات.",
      image: "/images/trainer-3.jpg",
      specialty: "بوكسينج — كيك بوكسينج — لياقة قتالية",
      instagram: "ahmed.oceangym",
      order: 3,
    },
  });
  console.log("✓ 3 trainers created");

  // ===== Classes =====
  await prisma.gymClass.createMany({
    data: [
      {
        name: "بوكسينج",
        description:
          "حصص بوكسينج احترافية تعلمك الأساسيات الصحيحة من اللكمات للحركة، مع لياقة قتالية عالية وحرق يصل لـ 800 سعرة في الحصة.",
        trainerId: trainerAhmed.id,
        schedule: "السبت — الإثنين — الأربعاء | 8:00 مساءً",
        duration: 60,
        capacity: 20,
        level: "advanced",
        image: "/images/class-boxing.jpg",
      },
      {
        name: "كروس فت",
        description:
          "تدريب عالي الكثافة يجمع بين القوة والتحمل والسرعة، وديناميكية جماعية تدفعك لتخطي حدودك في كل حصة.",
        trainerId: trainerKarim.id,
        schedule: "يوميًا | 7:00 صباحًا و 7:00 مساءً",
        duration: 45,
        capacity: 16,
        level: "all",
        image: "/images/class-crossfit.jpg",
      },
      {
        name: "كمال أجسام",
        description:
          "منطقة أوزان حرة وأجهزة أمريكية حديثة بإشراف مدربين متخصصين، مع برامج تضخيم وتنشيف مخصصة لهدفك.",
        trainerId: trainerKarim.id,
        schedule: "يوميًا | من 8 صباحًا حتى 12 منتصف الليل",
        duration: 90,
        capacity: 30,
        level: "all",
        image: "/images/class-bodybuilding.jpg",
      },
      {
        name: "سبينينج",
        description:
          "حصص دراجات هوائية بإضاءة موسيقية حماسية، أقوى حرق للدهون ورفع للياقة القلبية في أجواء لا تُنسى.",
        trainerId: trainerSarah.id,
        schedule: "الجمعة — الأحد | 6:00 مساءً",
        duration: 45,
        capacity: 18,
        level: "intermediate",
        image: "/images/class-spinning.jpg",
      },
      {
        name: "يوجا واستطالة",
        description:
          "جلسات هادئة لتحسين المرونة وشد العضلات وتقليل التوتر، مناسبة لجميع الأعمار والمستويات.",
        trainerId: trainerSarah.id,
        schedule: "الثلاثاء — الخميس | 10:00 صباحًا",
        duration: 60,
        capacity: 15,
        level: "beginner",
        image: "/images/class-yoga.jpg",
      },
      {
        name: "تدريب وظيفي",
        description:
          "تمارين وظيفية بالحبال والكيتل بيل وصناديق القفز تحسن حركتك اليومية وقوتك البدنية بشكل متكامل.",
        trainerId: trainerKarim.id,
        schedule: "السبت — الأربعاء | 6:00 مساءً",
        duration: 50,
        capacity: 20,
        level: "intermediate",
        image: "/images/class-functional.jpg",
      },
      {
        name: "سباحة",
        description:
          "حمام سباحة أولمبي بمياه معالجة ومدفأة، حصص تعليم وتحسين أداء بإشراف مدربين معتمدين.",
        schedule: "يوميًا | 9:00 صباحًا — 10:00 مساءً",
        duration: 60,
        capacity: 12,
        level: "all",
        image: "/images/class-swimming.jpg",
      },
    ],
  });
  console.log("✓ 7 classes created");

  // ===== Testimonials =====
  await prisma.testimonial.createMany({
    data: [
      {
        name: "محمود السيد",
        role: "عضو من سنتين",
        content:
          "أحسن جيم جربته في حياتي، الأجهزة نضيفة والمدربين متعاونين جدًا. خسرت 18 كيلو في 6 شهور مع خطة تغذية Ocean GYM.",
        rating: 5,
      },
      {
        name: "نورهان أحمد",
        role: "عضوة — كلاسات جروب",
        content:
          "كلاسات السبينينج واليوجا عند سارة مش هتنساها، الأجواء باين فيها حب وشغف حقيقي. المكان نضيف والتعامل راقي جدًا.",
        rating: 5,
      },
      {
        name: "عمر خالد",
        role: "لاعب بوكسينج",
        content:
          "مع أحمد كوتش اتطور مستواي في البوكسينج بشكل مش طبيعي، الجيم فيه روح تنافسية حقيقية وبنستعد للبطولات هناك.",
        rating: 5,
      },
      {
        name: "هبة مصطفى",
        role: "عضوة جديدة — 3 شهور",
        content:
          "كنت مترددة أبدأ، لكن الاستقبال كان أحلى حاجة. كل الناس بتحفزك وبيتابعوا معاك. شكرًا Ocean GYM على تغيير حياتي.",
        rating: 5,
      },
    ],
  });
  console.log("✓ 4 testimonials created");

  // ===== Gallery =====
  await prisma.galleryItem.createMany({
    data: [
      { title: "منطقة الأوزان الحرة", image: "/images/class-bodybuilding.jpg" },
      { title: "حصة بوكسينج", image: "/images/class-boxing.jpg" },
      { title: "كروس فت", image: "/images/class-crossfit.jpg" },
      { title: "الحمام السباحة", image: "/images/class-swimming.jpg" },
      { title: "استوديو السبينينج", image: "/images/class-spinning.jpg" },
      { title: "قاعة يوجا", image: "/images/class-yoga.jpg" },
      { title: "تدريب وظيفي", image: "/images/class-functional.jpg" },
      { title: "أجواء الجيم", image: "/images/about-gym.jpg" },
    ],
  });
  console.log("✓ 8 gallery items created");

  // ===== Sample Members =====
  const now = new Date();
  const monthsFromNow = (m: number) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() + m);
    return d;
  };

  await prisma.member.createMany({
    data: [
      {
        name: "محمود السيد",
        email: "mahmoud@example.com",
        phone: "01012345678",
        planId: planQuarterly.id,
        status: "active",
        startDate: now,
        endDate: monthsFromNow(3),
        notes: "عميل مميز — دفع كاش",
      },
      {
        name: "نورهان أحمد",
        email: "nourhan@example.com",
        phone: "01098765432",
        planId: planMonthly.id,
        status: "active",
        startDate: now,
        endDate: monthsFromNow(1),
      },
      {
        name: "عمر خالد",
        email: "omar@example.com",
        phone: "01122334455",
        planId: planYearly.id,
        status: "active",
        startDate: now,
        endDate: monthsFromNow(12),
        notes: "VIP",
      },
      {
        name: "هبة مصطفى",
        email: "heba@example.com",
        phone: "01277889900",
        planId: planMonthly.id,
        status: "pending",
        notes: "طلب انضمام من الموقع",
      },
      {
        name: "يوسف عادل",
        email: "youssef@example.com",
        phone: "01055667788",
        status: "expired",
        notes: "انتهى اشتراكه — محتاج متابعة",
      },
    ],
  });
  console.log("✓ 5 sample members created");

  // ===== Sample Messages =====
  await prisma.message.createMany({
    data: [
      {
        name: "أحمد رشدي",
        email: "ahmed.r@example.com",
        phone: "01011112222",
        subject: "استفسار عن الباقات",
        content:
          "السلام عليكم، عايز أعرف تفاصيل باقة الـ VIP وهل فيها تقسيط؟ وشكرًا.",
        read: false,
      },
      {
        name: "مي سمير",
        email: "mai.s@example.com",
        subject: "حصة تجريبية",
        content: "هل فيه حصة تجريبية مجانية للسبينينج؟",
        read: false,
      },
      {
        name: "طارق حسن",
        email: "tarek@example.com",
        phone: "01233334444",
        subject: "شكر وامتنان",
        content: "تجربة رائعة جدًا، الجيم نضيف والتعامل محترم. تسلم إيدكم.",
        read: true,
      },
    ],
  });
  console.log("✓ 3 sample messages created");

  console.log("🌊 Ocean GYM seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
