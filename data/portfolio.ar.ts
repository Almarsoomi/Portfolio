/**
 * Arabic content — same shape as data/portfolio.ts (the compiler checks every
 * field). Brand and product names stay in Latin script, as they are written.
 */
import type * as EN from "./portfolio";

export const site: typeof EN.site = {
  name: "أحمد",
  logo: "أحمد.",
  role: "مطوّر ومحاسب • دبي",
  title: "أحمد — مطوّر ومحاسب في دبي",
  description:
    "مطوّر في دبي يبني أدوات عملية للأعمال — تطبيقات ويب، وأتمتة مالية، وأنظمة محاسبية للشركات في الإمارات. متخصص في مسك الدفاتر على Zoho Books.",
  url: "https://almarsoomi.github.io/Portfolio",
  email: "almarsoomi96@gmail.com",
  github: "https://github.com/almarsoomi",
};

export const navByPath: typeof EN.navByPath = {
  build: [
    { label: "المشاريع", href: "#projects" },
    { label: "ماذا أقدّم", href: "#work" },
    { label: "المهارات", href: "#skills" },
    { label: "نبذة", href: "#about" },
    { label: "تواصل", href: "#contact" },
  ],
  books: [
    { label: "الخدمات", href: "#services" },
    { label: "طريقة العمل", href: "#process" },
    { label: "نبذة", href: "#about" },
    { label: "تواصل", href: "#contact" },
  ],
};

export const gateway: typeof EN.gateway = {
  greeting: "مرحباً، أنا أحمد",
  question: "كيف يمكنني مساعدتك؟",
  hint: "خدمتان وشخص واحد: المواقع والمحاسبة. اختر ما تحتاجه.",
  paths: {
    build: {
      href: "/build",
      eyebrow: "تطوير الويب",
      title: "أحتاج موقعاً أو تطبيقاً",
      description: "مواقع سريعة وتطبيقات ويب وأتمتة تخلّص عملك من المهام المتكررة.",
      chips: ["مواقع إلكترونية", "تطبيقات ويب", "أتمتة"],
      cta: "شاهد المواقع والتطبيقات",
      switchLabel: "تحتاج مسك دفاتر؟",
    },
    books: {
      href: "/books",
      eyebrow: "المحاسبة ومسك الدفاتر",
      title: "أحتاج محاسباً أو ماسك دفاتر",
      description:
        "دفاتر منظّمة وجاهزة لضريبة القيمة المضافة على Zoho Books — تُطابَق شهرياً لتعرف أرقامك دائماً.",
      chips: ["مسك الدفاتر", "ضريبة القيمة المضافة", "ضريبة الشركات", "Zoho Books"],
      cta: "شاهد خدمات المحاسبة",
      switchLabel: "تحتاج موقعاً؟",
    },
  },
};

export const hero: typeof EN.hero = {
  badge: "مطوّر ويب • دبي",
  greeting: "مرحباً، أنا أحمد",
  headline: "أبني أدوات تحل مشاكل حقيقية",
  lead: "أبني",
  typewriter: ["مواقع إلكترونية.", "تطبيقات ويب.", "أتمتة.", "أدوات ذكاء اصطناعي."],
  subheadline:
    "مطوّر برمجيات للشركات في الإمارات. أبني مواقع سريعة وتطبيقات ويب وأتمتة وأدوات ذكاء اصطناعي تخفّف المهام المتكررة عن فريقك — بلغتين، ومصممة للجوال أولاً، وقابلة للنمو مع عملك.",
  primaryCta: { label: "شاهد المشاريع", href: "#projects" },
  secondaryCta: { label: "تواصل معي", href: "#contact" },
};

export const booksHero: typeof EN.booksHero = {
  badge: "متخصص Zoho Books • دبي",
  greeting: "مرحباً، أنا أحمد",
  headline: "دفاتر يمكنك الوثوق بها",
  lead: "أحافظ على",
  typewriter: ["دفاترك منظّمة.", "ضريبتك في موعدها.", "حساباتك مطابقة.", "تدقيقك بلا قلق."],
  subheadline:
    "مسك دفاتر ومحاسبة للشركات في الإمارات على Zoho Books. مطابقات شهرية، ودعم في تقديم إقرارات ضريبة القيمة المضافة، وجاهزية لضريبة الشركات — لتتفرغ لإدارة عملك بدل ملاحقة الإيصالات.",
  primaryCta: { label: "الخدمات", href: "#services" },
  secondaryCta: { label: "تواصل معي", href: "#contact" },
};

export const projects: typeof EN.projects = [
  {
    kind: "finance",
    category: "أدوات مالية",
    title: "PreStatement",
    description:
      "شاهد فاتورة بطاقتك الائتمانية في الإمارات تتكوّن لحظة بلحظة من رسائل SMS التي يرسلها بنكك أصلاً، ثم طابقها سطراً بسطر مع الكشف عند وصوله.",
    impact: "اعرف فاتورتك قبل أن يرسلها البنك — والتقط كل اختلاف.",
    demo: "prestatement",
    status: "Live",
    link: "https://prestatement.com",
  },
  {
    kind: "web",
    category: "تطوير الويب",
    title: "MyBoatLog",
    description:
      "تطبيق لإدارة القوارب مصمم للجوال أولاً: سجل الرحلات، والمخزون، وتتبع الصيانة، وإدارة الطاقم لملاك القوارب ومشغّليها.",
    impact: "كل ساعة، وكل قطعة، وكل صيانة — مسجّلة من الهاتف الذي في جيبك.",
    demo: "myboatlog",
    status: "Live",
    link: "https://myboatlog.app",
  },
  {
    kind: "web",
    category: "تطوير الويب",
    title: "موقع Care Plus لإصلاح السيارات",
    description:
      "موقع لورشة إصلاح وطلاء سيارات في دبي يغطي السمكرة والدهان والكهرباء والميكانيك، مع الحجز عبر الموقع وواتساب.",
    impact: "يحجز العميل الإصلاح في ثوانٍ — ويصل الطلب إلى الورشة مباشرة على واتساب.",
    demo: "careplus",
    status: "Live",
    link: "https://careplusauto.com",
  },
  {
    kind: "web",
    category: "تطوير الويب",
    title: "موقع The Walls للنجارة",
    description:
      "موقع فاخر لشركة نجارة وأعمال خشبية في دبي، بتصميم موجي متحرك، وعرض مباشر لحساب إنستغرام، ومحتوى كامل بالعربية والإنجليزية.",
    impact: "موقع فاخر بلغتين يحوّل الزوار إلى طلبات عروض أسعار.",
    status: "Live",
    demo: "thewalls",
    link: "https://thewalls.ae",
  },
  {
    kind: "web",
    category: "تطوير الويب",
    title: "Metal East Records",
    description:
      "متجر أسطوانات افتراضي لمتجر Metal East Records في دبي: ادخل المتجر، وتصفّح الصناديق، واسحب أسطوانة وشغّلها على مشغّل المتجر.",
    impact: "يحوّل متجر أسطوانات محلياً إلى تجربة يمكن زيارتها من أي مكان.",
    demo: "metaleast",
    status: "Live",
    link: "https://metal-east-records.vercel.app",
  },
  {
    kind: "web",
    category: "تطوير الويب",
    title: "Build It للمقاولات",
    description:
      "موقع لشركة Build It للمقاولات في دبي. صفحة «قريباً» متاحة الآن بينما يُبنى الموقع الكامل.",
    status: "In Progress",
    link: "https://builditdxb.ae",
  },
  {
    kind: "ops",
    category: "عمليات الأعمال",
    title: "ZeroG Invoices",
    description:
      "أداة لمعالجة الفواتير تقرأ فواتير الموردين تلقائياً — ممسوحة ضوئياً أو PDF — وتحوّلها إلى سجلات نظيفة ومنظّمة، حتى دون اتصال بالإنترنت.",
    status: "In Progress",
  },
];

export const workCategories: typeof EN.workCategories = [
  {
    icon: "globe",
    title: "تطوير الويب",
    description:
      "مواقع وتطبيقات ويب سريعة وحديثة — من مواقع تسويقية بلغتين إلى منتجات متكاملة، مبنية بـ Next.js ومنشورة عالمياً.",
  },
  {
    icon: "wallet",
    title: "أدوات مالية",
    description:
      "تطبيقات تقنية مالية مثل PreStatement، وأنظمة تقارير تحوّل البيانات المالية المبعثرة إلى أرقام واضحة قابلة للتنفيذ.",
  },
  {
    icon: "workflow",
    title: "أتمتة الأعمال",
    description:
      "معالجة الفواتير، وقراءة المستندات آلياً، والحجز عبر الإنترنت، وتتبع الصيانة — أتمتة العمل المتكرر الذي تنجزه الشركات في الإمارات يدوياً.",
  },
];

export const accounting: typeof EN.accounting = {
  heading: "خدمات المحاسبة ومسك الدفاتر",
  intro:
    "خدمات احترافية في مسك الدفاتر والمحاسبة للشركات في الإمارات. متخصص في Zoho Books مع خبرة عملية في التصنيع والتجزئة والخدمات — بما يتوافق مع متطلبات ضريبة القيمة المضافة وضريبة الشركات في الإمارات.",
  industries: [
    {
      icon: "factory",
      industry: "التصنيع",
      client: "The Walls Carpentry L.L.C. (دبي)",
      points: [
        "توزيع تكاليف المشاريع",
        "الاعتراف بالإيراد حسب نسبة الإنجاز",
        "فواتير الموردين",
        "التقارير المالية الشهرية",
      ],
    },
    {
      icon: "store",
      industry: "التجزئة",
      client: "Metal East Record Store",
      points: [
        "مسك دفاتر قائم على المخزون",
        "مطابقة فواتير الموردين",
        "تتبع المشتريات من موردين متعددين",
      ],
    },
    {
      icon: "waves",
      industry: "الخدمات",
      client: "H&S Water Sports",
      points: ["مسك دفاتر إيرادات الخدمات", "تتبع المصروفات", "المحاسبة التشغيلية"],
    },
  ],
  handles: [
    "إعداد Zoho Books واستيراد البيانات",
    "مسك الدفاتر الشهري ومطابقة الحسابات البنكية",
    "دعم تقديم ضريبة القيمة المضافة (5%)",
    "الجاهزية لضريبة الشركات",
    "مطابقة فواتير الموردين",
    "التقارير المالية والتحليلات",
  ],
  cta: { label: "ناقش حساباتك", href: "#contact" },
};

export const skills: typeof EN.skills = [
  { title: "الواجهات الأمامية", skills: ["React", "Next.js", "Tailwind", "Figma"] },
  { title: "الواجهات الخلفية", skills: ["Node.js", "Express", "Python", "Supabase", "SQLite"] },
  { title: "المنصات", skills: ["Vercel", "Cloudflare", "cPanel", "GitHub"] },
  {
    title: "المجالات",
    skills: ["مواقع إلكترونية", "تطبيقات ويب", "أتمتة", "أدوات ذكاء اصطناعي", "عربي / إنجليزي"],
  },
];

export const about: typeof EN.about = {
  heading: "حلّ المشكلة أولاً. ثم اختر التقنية.",
  paragraphs: [
    "أبني مواقع وأدوات مصممة حول احتياجات حقيقية للشركات في الإمارات — عملاء بلغتين، وحجوزات عبر الإنترنت، وفواتير متراكمة، وجداول تُدار على الورق. نقطة البداية ليست إطار عمل برمجياً؛ بل المشكلة الفعلية التي يخسر بسببها العمل ساعات كل أسبوع.",
    "كل مشروع يُسلَّم بسرعة، ويعمل على الجوال أولاً، ويتحدث العربية والإنجليزية. حيث يوفّر الذكاء الاصطناعي وقتاً فعلياً — قراءة المستندات، والرد على الأسئلة المتكررة، وفرز البيانات — أُدمجه؛ وحيث لا يفيد، أُبقي الأمور بسيطة.",
  ],
};

export const booksAbout: typeof EN.booksAbout = {
  heading: "دفاتر دقيقة. بلا مفاجآت في نهاية الشهر.",
  paragraphs: [
    "أمسك دفاتر الشركات في الإمارات على Zoho Books — أسجّل المبيعات والفواتير والمصروفات، وأطابق كل حساب بنكي وبطاقة، وأُبقي سجلات ضريبة القيمة المضافة وضريبة الشركات جاهزة قبل مواعيدها.",
    "يعمل عملائي في التصنيع والتجزئة والخدمات، لذا أعرف كيف تُعالَج تكاليف المشاريع والمخزون وإيرادات الخدمات لكلٍّ منها. تحصل على تقارير شهرية واضحة وإجابة مباشرة كلما سألت عمّا تعنيه الأرقام.",
  ],
};

export const process: typeof EN.process = {
  heading: "من الفوضى إلى الجاهزية في نهاية الشهر",
  intro: "إيقاع بسيط ومتكرر. ترسل المستندات، وأتولى أنا المطابقة والتقديم والتقارير.",
  steps: [
    {
      title: "المراجعة والإعداد",
      text: "أراجع دفاترك الحالية، وأُعدّ Zoho Books أو أنظّمه، وأستورد الأرصدة الافتتاحية والبيانات السابقة.",
    },
    {
      title: "مسك الدفاتر الشهري",
      text: "تسجيل المبيعات والفواتير والمصروفات، ومطابقة كل حساب بنكي وبطاقة مع الكشف.",
    },
    {
      title: "الضريبة والامتثال",
      text: "إعداد إقرارات ضريبة القيمة المضافة في موعدها، والاحتفاظ بسجلات ضريبة الشركات جاهزة — دون استعجال في اللحظة الأخيرة.",
    },
    {
      title: "التقارير والتحليل",
      text: "قائمة دخل وميزانية عمومية وتدفق نقدي شهرية واضحة، مع ملاحظة قصيرة عمّا تعنيه الأرقام.",
    },
  ],
};

export const contact: typeof EN.contact = {
  heading: "لنبنِ شيئاً مفيداً",
  text: "تحتاج موقعاً أو تطبيق ويب أو أداة توفّر على فريقك ساعات؟ أنا على بُعد رسالة. مقيم في دبي، وأعمل مع الشركات في جميع أنحاء الإمارات.",
};

export const booksContact: typeof EN.booksContact = {
  heading: "لنرتّب حساباتك",
  text: "أخبرني عن عملك وحال دفاترك اليوم. سأرد بخطة واضحة وعرض سعر شهري ثابت — دون مصطلحات معقدة.",
};

export const crossover: typeof EN.crossover = {
  build: {
    text: "تحتاج أيضاً من يمسك دفاترك؟ أنا محاسب على Zoho Books أيضاً.",
    label: "خدمات المحاسبة",
    href: "/books",
  },
  books: {
    text: "أبني البرمجيات أيضاً — مواقع وتطبيقات ويب وأدوات مالية.",
    label: "أعمال التطوير",
    href: "/build",
  },
};

export const ui: typeof EN.ui = {
  langName: "العربية",
  otherLangName: "English",
  otherLangShort: "EN",
  switchLangLabel: "التبديل إلى الإنجليزية",
  portraitAlt: "أحمد",
  emailLabel: "راسل أحمد عبر البريد",
  githubLabel: "GitHub (يفتح في نافذة جديدة)",
  lastVisited: "آخر زيارة",
  or: "أو",
  themeLabel: "التبديل بين الوضع الفاتح والداكن",
  availability: {
    open: {
      build: "متاح لمشاريع جديدة",
      books: "أستقبل عملاء جدد",
    },
    busy: "محجوز بالكامل حالياً",
  },
  nav: {
    main: "التنقل الرئيسي",
    backToStart: "العودة إلى البداية — اختر مساراً",
    backToStartText: "العودة إلى البداية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    mobileMenu: "القائمة",
    switchPrefix: "انتقل إلى",
    switchTo: { build: "المحاسبة", books: "التطوير" },
  },
  status: {
    Live: "متاح",
    "In Progress": "قيد التنفيذ",
    Planning: "قيد التخطيط",
    Archived: "مؤرشف",
  },
  liveDemo: "عرض حي",
  liveDemoPlaying: "العرض الحي يعمل",
  prevProject: "المشروع السابق",
  nextProject: "المشروع التالي",
  visit: "زيارة الموقع",
  opensNewTab: "يفتح في نافذة جديدة",
  scrollTop: "العودة إلى الأعلى",
  step: "الخطوة",
  footer: "صُنع في دبي.",
  footerRole: {
    build: "مطوّر ويب • دبي",
    books: "محاسب على Zoho Books • دبي",
  },
  sections: {
    projects: {
      eyebrow: "مشاريع مختارة",
      title: "أدوات مبنية لأعمال حقيقية",
      intro: "تطبيقات ويب، وأتمتة مالية، وأدوات للعمليات الإدارية — كلٌّ منها بُني ليزيل مشكلة محددة ومتكررة.",
    },
    work: { eyebrow: "ماذا أقدّم", title: "ثلاثة أنواع من العمل، وهدف واحد" },
    skills: { eyebrow: "المهارات", title: "التقنيات خلف العمل" },
    about: { eyebrow: "نبذة / منهجي" },
    accounting: { eyebrow: "متخصص في مسك الدفاتر في الإمارات", handles: "ما أتولاه" },
    process: { eyebrow: "طريقة العمل" },
    testimonials: {
      eyebrow: "العملاء",
      title: "شركات أعمل معها",
      trustedBy: "موثوق من شركات في أنحاء الإمارات",
    },
  },
  speed: {
    loadedIn: "حُمّلت في",
    seconds: " ث",
    cached: "من الذاكرة المؤقتة",
    title: "الوقت الذي استغرقته هذه الصفحة للتحميل على جهازك",
  },
};
