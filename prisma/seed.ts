import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/hash";

const db = new PrismaClient();

async function main() {
  console.log("Seeding Redline Transport data...");

  // ===== Admin =====
  const adminPassword = hashPassword("redline123");
  await db.admin.upsert({
    where: { username: "admin" },
    update: { password: adminPassword, name: "مدير ريد لاين" },
    create: { username: "admin", password: adminPassword, name: "مدير ريد لاين" },
  });

  // ===== Stats (verified company figures) =====
  await db.stat.deleteMany();
  await db.stat.createMany({
    data: [
      { value: 15, suffix: "+", label: "عام من الخبرة في النقل واللوجستيات", order: 1, active: true },
      { value: 450, suffix: "+", label: "شاحنة ومعدة حديثة في الأسطول", order: 2, active: true },
      { value: 98, suffix: "%", label: "التزام بمواعيد التسليم المتفق عليها", order: 3, active: true },
      { value: 12000, suffix: "+", label: "شحنة تُدار بنجاح كل عام", order: 4, active: true },
    ],
  });

  // ===== Services =====
  await db.service.deleteMany();
  await db.service.createMany({
    data: [
      {
        title: "النقل البري الداخلي",
        summary: "شبكة نقل بري تغطي كل محافظات الجمهورية بمواعيد دقيقة وتتبع لحظي.",
        description:
          "نقدم حلول نقل بري متكاملة للحمولات الثقيلة والخفيفة بين كل المحافظات، بأسطول مملوك بالكامل وسائقين محترفين مدربين على أعلى معايير السلامة، مع تتبع لحظي لكل شحنة عبر نظام إدارة الأسطول.",
        icon: "truck",
        image: "/images/svc-land.jpg",
        features: "تغطية 27 محافظة\nتتبع لحظي GPS\nسائقون معتمدون\nتأمين كامل على الحمولة",
        order: 1,
        active: true,
      },
      {
        title: "الشحن الدولي",
        summary: "خطوط شحن منتظمة بين مصر والدول العربية وأوروبا عبر المعابر البرية.",
        description:
          "حلول شحن دولي بري موثوقة بين مصر وجنوب أوروبا وتركيا والدول العربية، مع إدارة كاملة للرحلة من الباب للباب، وتنسيق دقيق للمعابر والمواعيد لضمان وصول الحمولة في الوقت المحدد.",
        icon: "globe",
        image: "/images/svc-intl.jpg",
        features: "خطوط ثابتة أسبوعية\nنقل من الباب للباب\nتوافق مع اتفاقيات TIR\nمناولة احترافية للحمولات",
        order: 2,
        active: true,
      },
      {
        title: "التخليص الجمركي",
        summary: "فريق متخصص في إنهاء إجراءات الجمارك والمنافذ بسرعة ودقة.",
        description:
          "فريق تخليص جمركي مرخص ينهي كافة الإجراءات في الموانئ والمنافذ البرية والجوية، من تجهيز المستندات حتى استلام الحمولة، لتوفير وقتك وضمان compliance كامل مع اللوائح.",
        icon: "file-check",
        image: "/images/svc-customs.jpg",
        features: "تراخيص معتمدة\nإنهاء الإجراءات في أقصر وقت\nتصنيف رسوم دقيق\nمتابعة يومية للشحنات الواردة",
        order: 3,
        active: true,
      },
      {
        title: "التخزين والمستودعات",
        summary: "مستودعات مؤمنة بتقنيات إدارة مخزون حديثة وWMS متكامل.",
        description:
          "مساحات تخزين مؤمنة ومكيّفة مع أنظمة إدارة مخزون حديثة (WMS)، خدمات التغليف والتجهيز والفرز، وإدارة تدفق البضائع الداخل والخارج بدقة جرد يومية.",
        icon: "warehouse",
        image: "/images/svc-warehouse.jpg",
        features: "مستودعات مؤمنة 24/7\nنظام إدارة مخزون WMS\nخدمات تغليف وتجهيز\nجرد دقيق لحظي",
        order: 4,
        active: true,
      },
      {
        title: "النقل المبرد",
        summary: "سلسلة تبريد متكاملة للأغذية والأدوية بدرجات حرارة مضبوطة.",
        description:
          "أسطول مبرد مجهز بتقنيات تتبع درجة الحرارة لحظياً وشهادات سلامة غذائية، لنقل الأغذية الطازجة والمجمدة والمستحضرات الصيدلانية وفق أعلى معايير سلسلة التبريد.",
        icon: "thermometer-snowflake",
        image: "/images/svc-cold.jpg",
        features: "تتبع درجة الحرارة لحظياً\nشهادات HACCP\nحاويات من -25° إلى +8°\nاستجابة طوارئ فورية",
        order: 5,
        active: true,
      },
      {
        title: "التوزيع للمخرات الأخيرة",
        summary: "شبكة توزيع سريعة للتجار والفروع داخل المدن الكبرى.",
        description:
          "حلول توزيع متكاملة للآخر ميل (Last Mile) للتاجر والفروع ومركزات التوزيع، مع جدولة ذكية للرحلات، إثبات تسليم رقمي، وربط API مع متاجركم.",
        icon: "package-check",
        image: "/images/svc-lastmile.jpg",
        features: "جدولة رحلات ذكية\nإثبات تسليم رقمي\nربط API للمتاجر\nتسليم بنفس اليوم",
        order: 6,
        active: true,
      },
    ],
  });

  // ===== Fleet =====
  await db.fleetVehicle.deleteMany();
  await db.fleetVehicle.createMany({
    data: [
      {
        name: "تريلات مجهرة",
        category: "حمولات ثقيلة",
        description: "تريلات مغلقة بمساحات تحميل متعددة لنقل الحمولات الثقيلة والمتخصصة.",
        image: "/images/fleet-trailer.jpg",
        capacity: "حتى 34 طن",
        count: 120,
        specs: "طول 13.6 متر\nحمولة حتى 34 طن\nتتبع GPS مدمج\nفرش قابلة للتعديل",
        order: 1,
        active: true,
      },
      {
        name: "قلابات",
        category: "مواد بناء",
        description: "قلابات ثابتة وسفلية لنقل الرمل والأسمنت ومواد البناء بمختلف الأحجام.",
        image: "/images/fleet-dump.jpg",
        capacity: "حتى 30 طن",
        count: 85,
        specs: "حاويات مقواة\nتفريغ سريع\nمناسبة لكل التضاريس\nصيانة دورية معتمدة",
        order: 2,
        active: true,
      },
      {
        name: "صهاريج",
        category: "سوائل ووقود",
        description: "صهاريج معتمدة لنقل الوقود والسوائل الغذائية والكيميائية بأمان تام.",
        image: "/images/fleet-tanker.jpg",
        capacity: "حتى 28 ألف لتر",
        count: 40,
        specs: "شهادات ADR\nعدادات تدفق معايرة\nقفل إلكتروني\nمواد عزل آمنة",
        order: 3,
        active: true,
      },
      {
        name: "مبردات",
        category: "سلسلة تبريد",
        description: "شاحنات مبرد بدرجات حرارة قابلة للتحكم وشهادات سلامة غذائية.",
        image: "/images/fleet-reefer.jpg",
        capacity: "من -25° إلى +8°",
        count: 60,
        specs: "تسجيل حرارة مستمر\nثلاجات Carrier/Thermo King\nشهادات HACCP\nأبواب عازلة مزدوجة",
        order: 4,
        active: true,
      },
      {
        name: "سطحات",
        category: "معدات وميكانات",
        description: "سطحات لنقل المعدات الثقيلة والميكانات والمواد ذات الأبعاد الخاصة.",
        image: "/images/fleet-flatbed.jpg",
        capacity: "حتى 45 طن",
        count: 55,
        specs: "منصات ممتدة\nأحزمة تثبيت هيدروليكية\nترخيص حمولات ضخمة\nمرافقة فنية",
        order: 5,
        active: true,
      },
      {
        name: "ناقلات سيارات",
        category: "سيارات",
        description: "سطحات مخصصة لنقل السيارات والسيارات الكهربائية بأمان.",
        image: "/images/fleet-carrier.jpg",
        capacity: "حتى 10 سيارات",
        count: 35,
        specs: "أنظمة تثبيت متخصصة\nرفوف هيدروليكية\nتأمين شامل\nتغليف واقي اختياري",
        order: 6,
        active: true,
      },
    ],
  });

  // ===== Testimonials =====
  await db.testimonial.deleteMany();
  await db.testimonial.createMany({
    data: [
      {
        name: "م. طارق السيد",
        role: "مدير اللوجستيات — مجموعة الأغذية المتحدة",
        content:
          "تعاملنا مع شركات نقل كتير، لكن التزام ريد لاين بالمواعيد ومستوى الشفافية في التتبع شيلوا عننا هامش الخطأ بالكامل. الشحنات بتوصل في وقتها والدعم الفني متاح 24 ساعة.",
        rating: 5,
        approved: true,
      },
      {
        name: "أ. منى عبد الرحمن",
        role: "مدير التشغيل — مصنع البلاستيك الحديث",
        content:
          "أسطولهم من التريلات المجهرة عالج لنا أكبر تحدي كان عندنا في نقل المواد الخام. تقارير يومية دقيقة وسائقين محترمين ومتعاونين. شراكة حقيقية مش مجرد مزود خدمة.",
        rating: 5,
        approved: true,
      },
      {
        name: "أ. كريم شكري",
        role: "المدير التنفيذي — شركة التجارة الدولية",
        content:
          "خدمة التخليص الجمركي عندهم وفرت لنا أسابيع من التأخير في أول شحنة استيراد لنا. فريق محترف بيفهم تفاصيل الشغل وبيحل المشاكل قبل ما تحصل.",
        rating: 5,
        approved: true,
      },
      {
        name: "د. أحمد فؤاد",
        role: "مدير سلسلة الإمداد — سلاسل الصيدليات",
        content:
          "النقل المبرد كان نقطة ضعف عندنا، ومع ريد لاين بقينا مرتاحين تماماً. تتبع درجة الحرارة لحظياً وتقارير compliance جاهزة وقت المراجعة. أنصح بيهم أي شركة أدوية.",
        rating: 5,
        approved: true,
      },
    ],
  });

  // ===== Quote requests =====
  await db.quoteRequest.deleteMany();
  await db.quoteRequest.createMany({
    data: [
      {
        name: "م. حسن المصري",
        phone: "01005551234",
        email: "hassan@foods-eg.com",
        company: "شركة الأغذية المصرية",
        serviceTitle: "النقل المبرد",
        origin: "القاهرة",
        destination: "الإسكندرية",
        cargo: "20 طن منتجات مجمدة أسبوعياً",
        status: "quoted",
      },
      {
        name: "أ. سارة يوسف",
        phone: "01112223344",
        company: "مجموعة التجارة الحديثة",
        serviceTitle: "التخزين والمستودعات",
        origin: "العاشر من رمضان",
        destination: "القاهرة",
        cargo: "500 متر مكعب تخزين شهري",
        status: "reviewing",
      },
      {
        name: "أ. محمود عبد العال",
        phone: "01223334455",
        serviceTitle: "النقل البري الداخلي",
        origin: "دمياط",
        destination: "أسوان",
        cargo: "شحنات مواد بناء متكررة",
        status: "new",
      },
    ],
  });

  // ===== Shipments =====
  await db.shipment.deleteMany();
  await db.portalSession.deleteMany();

  const s1 = await db.shipment.create({
    data: {
      code: "RL-1024",
      clientName: "شركة الأغذية المصرية",
      phone: "01005551234",
      origin: "مصنع العبور — القاهرة",
      destination: "مركز التوزيع — الإسكندرية",
      serviceType: "النقل المبرد",
      weight: "18.5 طن",
      vehicle: "مبردات — Carrier 650",
      status: "in_transit",
      currentLocation: "طريق القاهرة — الإسكندرية الصحراوي، كم 90",
      notes: "درجة الحرارة المطلوبة -18° طوال الرحلة",
      expectedAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
      events: {
        create: [
          {
            title: "تم استلام الشحنة",
            description: "تم تحميل الحمولة واعتماد المستندات",
            location: "مصنع العبور — القاهرة",
            status: "picked_up",
          },
          {
            title: "الشحنة في الطريق",
            description: "انطلقت الشحنة نحو الإسكندرية — درجة الحرارة مستقرة عند -18°",
            location: "طريق الصحراوي، كم 90",
            status: "in_transit",
          },
        ],
      },
    },
  });

  await db.shipment.create({
    data: {
      code: "RL-1025",
      clientName: "مجموعة التجارة الحديثة",
      phone: "01112223344",
      origin: "ميناء دمياط",
      destination: "مستودع العاشر من رمضان",
      serviceType: "التخليص الجمركي + النقل البري الداخلي",
      weight: "26 طن",
      vehicle: "تريلة مجهرة — 13.6م",
      status: "delivered",
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      events: {
        create: [
          { title: "تم استلام الشحنة", location: "ميناء دمياط", status: "picked_up" },
          { title: "إنهاء التخليص الجمركي", description: "تم إنهاء كافة الإجراءات في 48 ساعة", location: "ميناء دمياط", status: "in_transit" },
          { title: "خرجت للتسليم", location: "مستودع العاشر من رمضان", status: "out_for_delivery" },
          { title: "تم التسليم بنجاح", description: "استلم الشحنة مسؤول المستودع — توقيع رقمي معتمد", location: "مستودع العاشر من رمضان", status: "delivered" },
        ],
      },
    },
  });

  await db.shipment.create({
    data: {
      code: "RL-1026",
      clientName: "م. محمود عبد العال",
      phone: "01223334455",
      origin: "دمياط",
      destination: "أسوان",
      serviceType: "النقل البري الداخلي",
      weight: "22 طن",
      vehicle: "قلاب سفلي",
      status: "pending",
      currentLocation: "بانتظار التحميل",
      expectedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      events: {
        create: [
          { title: "تم تسجيل الشحنة", description: "جاري تجهيز الشاحنة وتحديد موعد التحميل", status: "pending" },
        ],
      },
    },
  });

  console.log("Seed completed:", { admin: 1, services: 6, fleet: 6, stats: 4, testimonials: 4, quotes: 3, shipments: 3 });
  console.log("Admin login: admin / redline123");
  console.log("Tracking codes: RL-1024 (in_transit), RL-1025 (delivered), RL-1026 (pending)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
