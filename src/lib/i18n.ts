/**
 * Ocean GYM — Site-wide bilingual dictionary (العربية / English).
 * UI chrome + a DB-content translation layer (see DB_EN at the bottom).
 */

export type Lang = "ar" | "en";

const ar = {
  nav: {
    items: [
      { href: "#home", label: "الرئيسية" },
      { href: "#about", label: "عن الجيم" },
      { href: "#classes", label: "الكلاسات" },
      { href: "#schedule", label: "الجدول الأسبوعي" },
      { href: "#trainers", label: "المدربون" },
      { href: "#pricing", label: "الباقات" },
      { href: "#gallery", label: "المعرض" },
      { href: "#testimonials", label: "آراء العملاء" },
      { href: "#contact", label: "تواصل معنا" },
    ],
    joinCta: "انضم الآن",
    openMenu: "فتح قائمة التنقل",
    closeMenu: "إغلاق قائمة التنقل",
    mainNav: "التنقل الرئيسي",
    mobileNav: "قائمة التنقل",
    langLabel: "اللغة",
    homeAria: "Ocean GYM — الرئيسية",
    logoAlt: "شعار Ocean GYM",
  },
  meta: {
    title: "Ocean GYM | أوشن جيم — بحر من القوة",
  },
  a11y: {
    skip: "تجاوز إلى المحتوى",
  },
  hero: {
    badge: "أقوى جيم في القاهرة",
    carouselRole: "كاروسيل",
    imagesLabel: "صور أجواء Ocean GYM",
    titleGradient: "بحر من القوة",
    titlePost: " يبدأ من هنا",
    subtitle:
      "تدرب على أحدث الأجهزة الأمريكية بإشراف مدربين معتمدين دوليًا، واستمتع بأكثر من 30 حصة أسبوعية لكل المستويات — رحلتك نحو نسخة أقوى منك تبدأ اليوم.",
    ctaJoin: "انضم الآن",
    ctaClasses: "اكتشف الكلاسات",
    stats: {
      members: "عضو نشط",
      trainers: "مدرب محترف",
      sessions: "حصة أسبوعية",
      years: "سنوات خبرة",
    },
    prevSlide: "الصورة السابقة",
    nextSlide: "الصورة التالية",
    pause: "إيقاف تقليب الصور",
    play: "تشغيل تقليب الصور",
    slideOf: "الشريحة",
    of: "من",
    slideAlts: [
      "صالة Ocean GYM الرئيسية بأحدث الأجهزة الأمريكية",
      "كلاس البوكسينج بإشراف مدربين محترفين",
      "منطقة الأوزان الحرة بالمعدات المتطورة",
    ],
  },
  about: {
    kicker: "عن الجيم",
    titleGradient: "Ocean GYM",
    titlePre: "لماذا ",
    titlePost: "؟",
    subtitle:
      "لسنا مجرد نادٍ رياضي — نحن مجتمع متكامل صُمم ليأخذك من أول تمرين إلى أفضل نسخة من نفسك، بمكانة عالمية وأجواء تدفعك للاستمرار.",
    membersBadge: "عضو نشط",
    sinceBadge: "منذ 2017",
    imageAlt: "من داخل Ocean GYM — منطقة الأوزان والأجهزة الحديثة",
    features: [
      {
        title: "أحدث الأجهزة الأمريكية",
        desc: "أجهزة Life Fitness و Hammer Strength بأحدث الموديلات العالمية.",
      },
      {
        title: "مدربون معتمدون دوليًا",
        desc: "فريق متخصص يحمل شهادات ISSA و NASM و خبرة ميدانية طويلة.",
      },
      {
        title: "برنامج تغذية متكامل",
        desc: "خطط غذائية مخصصة لهدفك من خبراء التغذية الرياضية.",
      },
      {
        title: "منطقة كارديو متطورة",
        desc: "أجهزة جري ودراجات وإليبتيكال بأحدث الموديلات وشاشات تفاعلية لمتابعة أدائك.",
      },
      {
        title: "ساونا وجاكوزي",
        desc: "استرجاع سريع للعضلات واسترخاء كامل بعد كل تمرين.",
      },
      {
        title: "مساحة 1500 متر مربع",
        desc: "ثلاثة أدوار مجهزة بالكامل من الأوزان الحرة إلى استوديوهات الكلاسات.",
      },
    ],
  },
  classes: {
    kicker: "الكلاسات",
    titlePre: "اختر ",
    titleGradient: "تحديك",
    titlePost: " القادم",
    subtitle:
      "من البوكسينج إلى الكروس فت واليوجا — أكثر من 30 حصة أسبوعية بإشراف مدربين متخصصين لكل المستويات.",
    book: "احجز مكانك",
    bookAria: (name: string) => `احجز مكانك في كلاس ${name}`,
    classAlt: (name: string) => `كلاس ${name}`,
    minutesUnit: "د",
    minutes: "دقائق",
    upTo: "حتى",
    trainerPrefix: "المدرب: ",
    emptyTitle: "لا توجد كلاسات متاحة حاليًا",
    emptyDesc: "تابعنا قريبًا — جدول الحصص يجدد باستمرار.",
    levels: {
      all: "جميع المستويات",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
    } as Record<string, string>,
  },
  schedule: {
    kicker: "الجدول الأسبوعي",
    titlePre: "خطط ",
    titleGradient: "أسبوعك",
    titlePost: " بالساعة",
    subtitle:
      "حصصنا متاحة طوال الأسبوع من السبت إلى الجمعة — اختر اليوم المناسب واكتشف مواعيد الكلاسات والمدربين المتاحين.",
    days: ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
    today: "اليوم",
    am: "صباحًا",
    pm: "مساءً",
    minutesLabel: (minutes: number) =>
      minutes === 1
        ? "دقيقة واحدة"
        : minutes === 2
          ? "دقيقتين"
          : minutes >= 3 && minutes <= 10
            ? `${minutes} دقائق`
            : `${minutes} دقيقة`,
    trainerAlt: (name: string) => `كلاس ${name}`,
    emptyTitle: "لا توجد حصص مجدولة في هذا اليوم",
    emptyDesc: "استمتع براحة أو تمرن فردّي",
    help: "بتحتاج مساعدة في اختيار الحصة المناسبة؟",
    cta: "انضم الآن",
    daysAria: "أيام الجدول الأسبوعي",
  },
  trainers: {
    kicker: "المدربون",
    titlePre: "نخبة من ",
    titleGradient: "الخبراء",
    titlePost: " معك خطوة بخطوة",
    subtitle:
      "مدربون معتمدون دوليًا يجمعون بين العلم والخبرة الميدانية، ويصممون لك برنامجًا يناسب هدفك ومستواك.",
    empty: "سيتم التعريف بفريق المدربين قريبًا.",
    trainerAlt: (name: string) => `المدرب ${name}`,
  },
  pricing: {
    kicker: "الباقات",
    titlePre: "باقات ",
    titleGradient: "مرنة",
    titlePost: " تناسب طموحك",
    subtitle: "اختر الباقة التي تناسب هدفك — بدون رسوم خفية، وبإمكانك الترقية في أي وقت.",
    currency: "ج.م",
    equalPre: "يعادل ",
    equalCurrency: "ج.م",
    equalPost: " شهريًا فقط",
    flexible: "دفع شهري مرن — بدون التزام",
    subscribe: "اشترك الآن",
    popular: "الأكثر طلبًا",
    trust: ["دفع آمن ومضمون", "ترقية الباقة في أي وقت", "حصة تقييم مجانية"],
    comingSoon: "سيتم إعلان الباقات قريبًا — تواصل معنا لمعرفة التفاصيل.",
  },
  gallery: {
    kicker: "المعرض",
    liveRegion: (index: number, total: number, title: string) =>
      `الصورة ${index} من ${total}: ${title}`,
    titlePre: "جولة داخل ",
    titleGradient: "المكان",
    titlePost: "",
    subtitle:
      "اطلع على أرضية التمرين والاستوديوهات ومناطق الكارديو — الأجواء التي ستمارس فيها كل يوم.",
    view: "عرض صورة: ",
    prev: "الصورة السابقة",
    next: "الصورة التالية",
    hint: "صورة من معرض Ocean GYM — استخدم الأسهم للتنقل بين الصور",
  },
  video: {
    kicker: "فيديو Ocean GYM",
    titlePre: "عيش ",
    titleGradient: "الأجواء",
    titlePost: " بنفسك",
    subtitle:
      "جولة سينمائية داخل Ocean GYM — من أرضية الأوزان إلى الكارديو والكلاسات، شاهد الأجواء التي تنتظرك قبل أن تزرنا.",
    play: "تشغيل الفيديو التعريفي",
    pause: "إيقاف الفيديو",
    mute: "كتم الصوت",
    unmute: "تشغيل الصوت",
    fullscreen: "ملء الشاشة",
    exitFullscreen: "الخروج من ملء الشاشة",
    ctaHint: "شاهد الجولة الآن",
    durationChip: "جولة سينمائية",
    loading: "جارٍ تحميل الفيديو...",
    ambientChip: "تشغيل تلقائي — اضغط للتحكم",
    stageLabel: "مشغل الفيديو التعريفي",
    seekLabel: "شريط التقدم",
  },
  testimonials: {
    kicker: "آراء العملاء",
    titlePre: "قصص ",
    titleGradient: "نجاح",
    titlePost: " أعضائنا",
    subtitle: "أكثر من 1200 عضو اختاروا Ocean GYM — إليك بعض تجاربهم الحقيقية.",
    empty: "آراء العملاء ستتوفر قريبًا.",
    ratingAria: (rating: number) => `التقييم: ${rating} من 5 نجوم`,
    imageAlt: (name: string) => `صورة ${name}`,
  },
  join: {
    kicker: "انضم إلينا",
    titlePre: "ابدأ ",
    titleGradient: "رحلتك",
    titlePost: " الآن",
    subtitle:
      "املأ النموذج وسيتواصل معك فريق الاستقبال خلال 24 ساعة لحجز حصة التقييم المجانية واختيار الباقة المناسبة لك.",
    benefits: [
      "حصة تقييم لياقة مجانية مع مدرب معتمد",
      "خطة تدريب وتغذية مصممة حسب هدفك",
      "متابعة دورية لقياس تقدمك وتعديل البرنامج",
    ],
    callDirect: "أو اتصل بنا مباشرة:",
    form: {
      name: "الاسم الكامل",
      namePh: "اكتب اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPh: "you@example.com",
      phone: "رقم الهاتف",
      phonePh: "01xxxxxxxxx",
      plan: "اختر الباقة",
      planPh: "اختر الباقة (اختياري)",
      notes: "ملاحظات",
      notesPh: "أخبرنا عن هدفك أو أي متطلبات خاصة (اختياري)",
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال...",
      privacy: "بياناتك محفوظة بسرية تام ولا تُشارك مع أي جهة خارجية",
      planItem: (name: string, price: string) => `${name} — ${price} ج.م`,
    },
    errors: {
      nameRequired: "الاسم الكامل مطلوب",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
      phoneRequired: "رقم الهاتف مطلوب",
      phoneInvalid: "رقم الهاتف غير صحيح",
      sendFailed: "تعذر إرسال الطلب",
      unexpected: "حدث خطأ غير متوقع، حاول مرة أخرى",
      network: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
    },
    success: {
      title: "تم استلام طلبك!",
      text: "سنتواصل معك خلال 24 ساعة لتأكيد اشتراكك وحجز حصة التقييم المجانية.",
      again: "إرسال طلب آخر",
    },
  },
  contact: {
    kicker: "تواصل معنا",
    titlePre: "نحن ",
    titleGradient: "هنا",
    titlePost: " من أجلك",
    subtitle:
      "لديك سؤال عن الباقات أو الحصص؟ زرنا في المقطم — حي الدبلومسيين أو تواصل معنا مباشرة — فريقنا جاهز لمساعدتك.",
    phone: "الهاتف",
    address: "العنوان",
    hours: "مواعيد العمل",
    email: "البريد الإلكتروني",
    satThu: "السبت — الخميس:",
    fri: "الجمعة:",
    directions: "احصل على الاتجاهات",
    mapTitle: "موقع Ocean GYM على الخريطة — المقطم، حي الدبلومسيين",
  },
  footer: {
    logoAlt: "شعار Ocean GYM",
    desc: "أقوى جيم في المقطم — حي الدبلومسيين: أحدث الأجهزة الأمريكية، مدربون معتمدون دوليًا، وأجواء تدفعك كل يوم لتكون نسخة أقوى من نفسك.",
    quickLinks: "روابط سريعة",
    contactUs: "تواصل معنا",
    certified: "مدربون معتمدون دوليًا — تجربة تمرين آمنة وممتعة",
    rights: "جميع الحقوق محفوظة",
  },
  floats: {
    backToTop: "العودة إلى الأعلى",
    whatsapp: "تواصل معنا عبر واتساب",
    whatsappTip: "كلمنا واتساب — بنرد فورًا",
  },
  testimonialsPill: {
    avgPre: "متوسط تقييم ",
    avgPostMulti: " تجارب حقيقية",
    avgPostSingle: " تجربة حقيقية",
  },
};

export type Dict = typeof ar;

const en: Dict = {
  nav: {
    items: [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About" },
      { href: "#classes", label: "Classes" },
      { href: "#schedule", label: "Schedule" },
      { href: "#trainers", label: "Trainers" },
      { href: "#pricing", label: "Plans" },
      { href: "#gallery", label: "Gallery" },
      { href: "#testimonials", label: "Reviews" },
      { href: "#contact", label: "Contact" },
    ],
    joinCta: "Join Now",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    mainNav: "Main navigation",
    mobileNav: "Navigation menu",
    langLabel: "Language",
    homeAria: "Ocean GYM — Home",
    logoAlt: "Ocean GYM logo",
  },
  meta: {
    title: "Ocean GYM — A Sea of Strength",
  },
  a11y: {
    skip: "Skip to content",
  },
  hero: {
    badge: "The Strongest Gym in Cairo",
    carouselRole: "carousel",
    imagesLabel: "Ocean GYM atmosphere gallery",
    titleGradient: "A Sea of Strength",
    titlePost: " Starts Here",
    subtitle:
      "Train on the latest American equipment under internationally certified coaches, and enjoy 30+ weekly classes for every level — your journey to a stronger you starts today.",
    ctaJoin: "Join Now",
    ctaClasses: "Explore Classes",
    stats: {
      members: "Active Members",
      trainers: "Pro Coaches",
      sessions: "Weekly Classes",
      years: "Years of Experience",
    },
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    pause: "Pause slideshow",
    play: "Play slideshow",
    slideOf: "Slide",
    of: "of",
    slideAlts: [
      "Ocean GYM main hall with the latest American equipment",
      "Boxing class supervised by professional coaches",
      "Free weights zone with advanced machines",
    ],
  },
  about: {
    kicker: "About the Gym",
    titleGradient: "Ocean GYM",
    titlePre: "Why ",
    titlePost: "?",
    subtitle:
      "We are not just a fitness club — we are a complete community designed to take you from your first workout to the best version of yourself, with world-class standards and an atmosphere that keeps you going.",
    membersBadge: "Active Members",
    sinceBadge: "Since 2017",
    imageAlt: "Inside Ocean GYM — the free weights and modern machines area",
    features: [
      {
        title: "Latest American Equipment",
        desc: "Life Fitness and Hammer Strength machines with the newest global models.",
      },
      {
        title: "Internationally Certified Coaches",
        desc: "A specialist team holding ISSA & NASM certifications with long field experience.",
      },
      {
        title: "Complete Nutrition Program",
        desc: "Custom nutrition plans built for your goal by sports nutrition experts.",
      },
      {
        title: "Advanced Cardio Zone",
        desc: "Treadmills, bikes and ellipticals with the latest models and interactive screens to track your performance.",
      },
      {
        title: "Sauna & Jacuzzi",
        desc: "Fast muscle recovery and full relaxation after every workout.",
      },
      {
        title: "1,500 m² of Space",
        desc: "Three fully equipped floors — from free weights to group class studios.",
      },
    ],
  },
  classes: {
    kicker: "Classes",
    titlePre: "Choose Your Next ",
    titleGradient: "Challenge",
    titlePost: "",
    subtitle:
      "From boxing to crossFit and yoga — more than 30 weekly classes supervised by specialist coaches for every level.",
    book: "Book Your Spot",
    bookAria: (name: string) => `Book your spot in the ${name} class`,
    classAlt: (name: string) => `${name} class`,
    minutesUnit: "min",
    minutes: "minutes",
    upTo: "Up to",
    trainerPrefix: "Coach: ",
    emptyTitle: "No classes available right now",
    emptyDesc: "Stay tuned — the class schedule keeps refreshing.",
    levels: {
      all: "All Levels",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    } as Record<string, string>,
  },
  schedule: {
    kicker: "Weekly Schedule",
    titlePre: "Plan Your ",
    titleGradient: "Week",
    titlePost: " by the Hour",
    subtitle:
      "Our classes run all week from Saturday to Friday — pick the day that suits you and discover class times and the coaches on deck.",
    days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    today: "Today",
    am: "AM",
    pm: "PM",
    minutesLabel: (minutes: number) => (minutes === 1 ? "1 minute" : `${minutes} minutes`),
    trainerAlt: (name: string) => `${name} class`,
    emptyTitle: "No classes scheduled on this day",
    emptyDesc: "Enjoy a rest day or train on your own",
    help: "Need help choosing the right class?",
    cta: "Join Now",
    daysAria: "Weekly schedule days",
  },
  trainers: {
    kicker: "Coaches",
    titlePre: "An Elite Team of ",
    titleGradient: "Experts",
    titlePost: " by Your Side",
    subtitle:
      "Internationally certified coaches combining science and field experience, designing a program that fits your goal and level.",
    empty: "Our coaching team will be introduced soon.",
    trainerAlt: (name: string) => `Coach ${name}`,
  },
  pricing: {
    kicker: "Plans",
    titlePre: "Flexible ",
    titleGradient: "Plans",
    titlePost: " for Every Ambition",
    subtitle: "Pick the plan that fits your goal — no hidden fees, and you can upgrade anytime.",
    currency: "EGP",
    equalPre: "That's just ",
    equalCurrency: "EGP",
    equalPost: " per month",
    flexible: "Flexible monthly payment — no commitment",
    subscribe: "Subscribe Now",
    popular: "Most Popular",
    trust: ["Secure & guaranteed payment", "Upgrade your plan anytime", "Free assessment session"],
    comingSoon: "Plans will be announced soon — contact us for details.",
  },
  gallery: {
    kicker: "Gallery",
    liveRegion: (index: number, total: number, title: string) =>
      `Image ${index} of ${total}: ${title}`,
    titlePre: "A Tour Inside ",
    titleGradient: "The Place",
    titlePost: "",
    subtitle:
      "Check out the training floor, studios and cardio zones — the atmosphere you will train in every day.",
    view: "View image: ",
    prev: "Previous image",
    next: "Next image",
    hint: "Image from the Ocean GYM gallery — use the arrows to navigate between images",
  },
  video: {
    kicker: "Ocean GYM Video",
    titlePre: "Feel The ",
    titleGradient: "Atmosphere",
    titlePost: " Yourself",
    subtitle:
      "A cinematic tour inside Ocean GYM — from the weights floor to cardio and classes, see the atmosphere waiting for you before you visit.",
    play: "Play the promo video",
    pause: "Pause video",
    mute: "Mute",
    unmute: "Unmute",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    ctaHint: "Watch the tour now",
    durationChip: "Cinematic tour",
    loading: "Loading the video...",
    ambientChip: "Auto-playing — tap for controls",
    stageLabel: "Promo video player",
    seekLabel: "Seek bar",
  },
  testimonials: {
    kicker: "Reviews",
    titlePre: "Member ",
    titleGradient: "Success Stories",
    titlePost: "",
    subtitle: "More than 1,200 members chose Ocean GYM — here are some of their real experiences.",
    empty: "Reviews will be available soon.",
    ratingAria: (rating: number) => `Rating: ${rating} out of 5 stars`,
    imageAlt: (name: string) => `Photo of ${name}`,
  },
  join: {
    kicker: "Join Us",
    titlePre: "Start Your ",
    titleGradient: "Journey",
    titlePost: " Now",
    subtitle:
      "Fill in the form and our reception team will contact you within 24 hours to book your free assessment session and choose the right plan.",
    benefits: [
      "Free fitness assessment session with a certified coach",
      "A training & nutrition plan designed around your goal",
      "Regular follow-ups to measure progress and adjust the program",
    ],
    callDirect: "Or call us directly:",
    form: {
      name: "Full Name",
      namePh: "Type your full name",
      email: "Email Address",
      emailPh: "you@example.com",
      phone: "Phone Number",
      phonePh: "01xxxxxxxxx",
      plan: "Choose a Plan",
      planPh: "Choose a plan (optional)",
      notes: "Notes",
      notesPh: "Tell us about your goal or any special requirements (optional)",
      submit: "Send Request",
      submitting: "Sending...",
      privacy: "Your data is kept strictly confidential and never shared with any third party",
      planItem: (name: string, price: string) => `${name} — ${price} EGP`,
    },
    errors: {
      nameRequired: "Full name is required",
      emailRequired: "Email address is required",
      emailInvalid: "Invalid email format",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Invalid phone number",
      sendFailed: "Could not send the request",
      unexpected: "An unexpected error occurred, please try again",
      network: "Check your internet connection and try again",
    },
    success: {
      title: "Request received!",
      text: "We will contact you within 24 hours to confirm your subscription and book your free assessment session.",
      again: "Send another request",
    },
  },
  contact: {
    kicker: "Contact Us",
    titlePre: "We Are ",
    titleGradient: "Here",
    titlePost: " for You",
    subtitle:
      "A question about plans or classes? Visit us in Mokattam — Diplomats District or reach out directly — our team is ready to help.",
    phone: "Phone",
    address: "Address",
    hours: "Working Hours",
    email: "Email",
    satThu: "Saturday — Thursday:",
    fri: "Friday:",
    directions: "Get Directions",
    mapTitle: "Ocean GYM location on the map — Mokattam, Diplomats District",
  },
  footer: {
    logoAlt: "Ocean GYM logo",
    desc: "The strongest gym in Mokattam — Diplomats District: the latest American equipment, internationally certified coaches, and an atmosphere that pushes you every day to become a stronger version of yourself.",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    certified: "Internationally certified coaches — a safe and fun training experience",
    rights: "All rights reserved",
  },
  floats: {
    backToTop: "Back to top",
    whatsapp: "Contact us via WhatsApp",
    whatsappTip: "Message us on WhatsApp — we reply instantly",
  },
  testimonialsPill: {
    avgPre: "Average of ",
    avgPostMulti: " real reviews",
    avgPostSingle: " real review",
  },
};

export const translations: Record<Lang, Dict> = { ar, en };

/**
 * Database-content translation layer — maps every stored Arabic string
 * (class names/descriptions/schedules, trainer names/roles/bios, plan names/
 * features, testimonials, gallery titles) to its English counterpart.
 * Unknown strings gracefully fall back to the original stored text, so
 * admin-managed content still renders in English mode (just untranslated).
 */
const DB_EN: Record<string, string> = {
  // ── Classes — names ──
  "بوكسينج": "Boxing",
  "كروسفت": "CrossFit",
  "كمال أجسام": "Bodybuilding",
  "سبيننج": "Spinning",
  "يوجا": "Yoga",
  "تمارين وظيفية": "Functional Training",

  // ── Classes — descriptions ──
  "كلاس بوكسينج احترافي بتقنيات الملاكمه الحديثة، يبني قوة التحمل وسرعة رد الفعل ويحرق أكبر عدد سعرات في أقصر وقت.":
    "A professional boxing class using modern boxing techniques — builds endurance and reaction speed while burning the most calories in the shortest time.",
  "تمارين عالية الكثافة تجمع بين القوة والتحمل، WOD يومي متغير يشتغل على كل عضلات الجسم في جو حماسي جماعي.":
    "High-intensity workouts that combine strength and endurance — a daily changing WOD that works every muscle of the body in an electric group atmosphere.",
  "أحدث أجهزة Hammer Strength وLife Fitness مع متابعة بوتير متخصص لبناء عضلي متناسق وبرامج تضخيم وتجفيف مدروسة.":
    "The latest Hammer Strength and Life Fitness machines with a dedicated personal coach for balanced muscle building and proven bulking and cutting programs.",
  "ركوب دراجات جماعي بإضاءة وصوتيات محفزة، حرق يصل إلى 700 سعرة في الحصة مع مدرب يشجعك تكتمل الرحلة.":
    "Group indoor cycling with motivating lights and sound — burn up to 700 calories per session with a coach who pushes you until the ride is done.",
  "جلسات يوجا هادئة لتحسين المرونة والتنفس وخفض التوتر، مناسبة لكل المستويات من المبتدئ للمتقدم.":
    "Calm yoga sessions to improve flexibility, breathing and stress relief — suitable for every level, from beginner to advanced.",
  "Functional Training بتحسين حركتك اليومية، تمارين كيتلبل وروبات وبوكس جامب لتقوية الجسم كوحدة واحدة.":
    "Functional training that improves your daily movement — kettlebell, rope and box-jump exercises that strengthen the body as one unit.",

  // ── Classes — schedule strings ──
  "السبت والاثنين والأربعاء — 7:00 مساً": "Sat, Mon & Wed — 7:00 PM",
  "يومياً — 8:00 صباحاً و 7:00 مساً": "Daily — 8:00 AM & 7:00 PM",
  "متاح طوال ساعات العمل": "Available throughout working hours",
  "الأحد والثلاثاء والخميس — 6:00 مساً": "Sun, Tue & Thu — 6:00 PM",
  "السبت والأربعاء — 10:00 صباحاً": "Sat & Wed — 10:00 AM",
  "الأحد والثلاثاء — 9:00 صباحاً": "Sun & Tue — 9:00 AM",

  // ── Trainers ──
  "كريم الشناوي": "Karim El Shenawy",
  "المدير الرياضي وبوتير معتمد": "Athletic Director & Certified Coach",
  "خبرة 12 سنة في بناء العضلات وتكوين الجسم، مدرب معتمد من NASM وISSA، متخصص في تحويل الأجسام وبرامج التضخيم العضلي.":
    "12 years of experience in muscle building and body recomposition, NASM & ISSA certified coach, specialized in body transformation and muscle-growth programs.",
  "بناء العضلات وتكوين الجسم": "Muscle Building & Body Recomposition",
  "سارة محمود": "Sara Mahmoud",
  "مدربة كلاسات جروب ولياقة": "Group Classes & Fitness Coach",
  "مدربة يوجا ولياقة معتمدة دولياً، شغوفة بمساعدة المتدربات على الوصول لأفضل نسخة من نفسهم عبر كلاسات ممتعة وفعالة.":
    "Internationally certified yoga and fitness coach, passionate about helping trainees reach the best version of themselves through fun, effective classes.",
  "يوجا وتمارين الحرق": "Yoga & Fat-Burning Workouts",
  "أحمد فتحي": "Ahmed Fathy",
  "مدرب بوكسينج وفنون قتالية": "Boxing & Martial Arts Coach",
  "بطل جمهورية سابق في الملاكمه، مدرب بوكسينج وMMA بخبرة 8 سنوات في تدريب المحترفين والمبتدئين.":
    "Former national boxing champion, boxing and MMA coach with 8 years of experience training professionals and beginners.",
  "بوكسينج وكارديو عالي": "Boxing & High-Intensity Cardio",

  // ── Plans — names ──
  "الباقة الشهرية": "Monthly Plan",
  "الباقة الفضية": "Silver Plan",
  "الباقة الذهبية": "Gold Plan",

  // ── Plans — features ──
  "دخول غير محدود للجيم": "Unlimited gym access",
  "خزانة تغيير ملابس": "Locker room access",
  "برنامج تدريب أساسي": "Basic training program",
  "متابعة أول تقييم مع مدرب": "First assessment follow-up with a coach",
  "كل مزايا الباقة الشهرية": "All Monthly Plan benefits",
  "كلاسات جروب غير محدودة": "Unlimited group classes",
  "خطة تدريب شخصية": "Personal training plan",
  "تقييم لياقة شهري": "Monthly fitness assessment",
  "خصم 15% على المكملات": "15% off supplements",
  "كل مزايا الباقة الفضية": "All Silver Plan benefits",
  "بوتير شخصي مخصص": "Dedicated personal coach",
  "خطة تغذية من متخصص": "Nutrition plan from a specialist",
  "دخول بوابة الأعضاء والمتابعة": "Member portal access & progress tracking",
  "ساونا وجاكوزي": "Sauna & jacuzzi",
  "ضيف مجاني أسبوعياً": "Free guest pass every week",

  // ── Testimonials ──
  "محمد السيد": "Mohamed El Sayed",
  "عضو منذ سنتين": "Member for 2 years",
  "أفضل جيم جربته في حياتي. الأجهزة بجرمني والمدربين بيتابعوا معايا خطوة بخطوة. جسمي اتغير 180 درجة في سنة، والمكان نظيف والجو رائع.":
    "The best gym I have ever tried. The machines are brand new and the coaches follow up with me step by step. My body changed 180 degrees in a year, the place is spotless and the atmosphere is great.",
  "نهى عبد الله": "Noha Abdallah",
  "عضوة كلاسات جروب": "Group Classes Member",
  "كلاسات السارة في اليوجا والسبيننج حياتي اتغيرت بجد. الجو حماسي والبنات متعاونين، وأول مرة ألتزم بروتين رياضي لمدة سنة كاملة.":
    "Sara's yoga and spinning classes genuinely changed my life. The energy is amazing and the girls are supportive — for the first time I stuck to a fitness routine for a full year.",
  "أحمد طارق": "Ahmed Tarek",
  "خسر 9 كيلو في 5 شهور": "Lost 9 kg in 5 months",
  "جربت نوادي كتير وفشلت، لكن مع خطة التغذية والمتابعة على بوابة الأعضاء هنا، خسرت 9 كيلو وأخيراً فهمت إزاي أطبعم صح. الشكر للفريق كله.":
    "I tried many clubs and failed, but with the nutrition plan and the follow-up on the member portal here, I lost 9 kg and finally understood how to eat right. Thanks to the whole team.",
  "م. عمرو دياب": "Eng. Amr Diab",
  "عضو الباقة الذهبية": "Gold Plan Member",
  "الساونا والجاكوزي بعد التدريب تجربة تانية خالص. الأسعار ممتازة مقارنة بالمستوى، والقفل الإلكتروني والنظافة بيرفعوا التجربة لأعلى مستوى.":
    "The sauna and jacuzzi after training are a completely different experience. The prices are excellent for this level, and the electronic lockers and cleanliness take the experience to the highest standard.",

  // ── Gallery ──
  "صالة الكمال أجسام الرئيسية": "Main Bodybuilding Floor",
  "كلاس البوكسينج": "Boxing Class",
  "منطقة الكروسفت": "CrossFit Zone",
  "استوديو السبيننج": "Spinning Studio",
  "منطقة التمارين الوظيفية": "Functional Training Zone",
  "استوديو اليوجا": "Yoga Studio",
  "أجواء النادي العامة": "General Club Atmosphere",
};

/**
 * Translates a database-backed string to English when the site is in
 * English mode; returns the original string in Arabic mode. Renderers
 * call this through `tx()` from `useLang()` for any stored content.
 */
export function translateDb(text: string | null | undefined, lang: Lang): string {
  if (!text) return "";
  if (lang !== "en") return text;
  return DB_EN[text] ?? text;
}
