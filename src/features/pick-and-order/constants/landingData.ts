/**
 * Landing page data for Pick & Order (flat structure for inline components)
 */
export interface TransportTypeData {
  iconName: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  badge?: string | null;
  weight: string;
  category: string;
}

export const TRANSPORT_DATA: TransportTypeData[] = [
  {
    iconName: "Bike", title: "دراجة نارية", slug: "motorbike",
    description: "الخيار الأسرع للطرود الصغيرة — تتجاوز الازدحام وتصل في الوقت المحدد.",
    features: ["حتى 10 كجم", "توصيل فوري", "أقل تكلفة", "مسافات قصيرة"],
    badge: "الأسرع", weight: "10 كجم", category: "light",
  },
  {
    iconName: "Van", title: "فان مغلق", slug: "van",
    description: "حماية كاملة من العوامل الجوية للبضائع الحساسة والطرود المتعددة.",
    features: ["حماية من الطقس", "طرود متعددة", "أمان تام", "تجارة إلكترونية"],
    weight: "1 طن", category: "light",
  },
  {
    iconName: "Dina", title: "دينا (1.5 طن)", slug: "dyna",
    description: "العمود الفقري للسوق السعودي — الأمثل للبضائع التجارية وتوزيع المستودعات.",
    features: ["بضائع تجارية", "توزيع مستودعات", "اقتصادي للأعمال", "موثوق ومجرب"],
    badge: "الأكثر طلباً", weight: "1.5 طن", category: "medium",
  },
  {
    iconName: "Jumbo", title: "جامبو (3 – 5 طن)", slug: "jumbo",
    description: "مساحة واسعة لنقل محتويات الشقق بالكامل في رحلة واحدة بكفاءة.",
    features: ["شقق كاملة", "مساحة واسعة", "رحلة واحدة", "فعّال بالتكلفة"],
    weight: "3–5 طن", category: "medium",
  },
  {
    iconName: "BigTruck", title: "شاحنة كبيرة", slug: "heavy-truck",
    description: "مخصصة للشحنات الضخمة والكميات الصناعية الكبيرة عبر المسافات الطويلة.",
    features: ["حتى 20 طن", "شحنات صناعية", "مسافات طويلة", "مؤمّن بالكامل"],
    weight: "20 طن", category: "heavy",
  },
  {
    iconName: "Refrigerated", title: "شاحنة مبردة", slug: "refrigerated",
    description: "تتبع متطور لدرجات الحرارة — تضمن سلامة الأغذية والأدوية طوال الرحلة.",
    features: ["تحكم بالحرارة", "أغذية وأدوية", "تتبع مباشر", "معتمد صحياً"],
    weight: "10 طن", category: "heavy",
  },
  {
    iconName: "BoxTruck", title: "صندوق مغلق", slug: "box-truck",
    description: "أقصى درجات الأمان للبضائع الثمينة والحساسة — مغلق ومحكم بالكامل.",
    features: ["بضائع ثمينة", "إغلاق محكم", "أمان فائق", "قفل مزدوج"],
    weight: "5 طن", category: "heavy",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  light:  "حلول سريعة — خفيف",
  medium: "نقل متوسط وتجاري",
  heavy:  "شحن ثقيل ومتخصص",
};

export const CATEGORIES = ["light", "medium", "heavy"] as const;
export const CAT_AR: Record<string, string> = {
  light: "حلول سريعة",
  medium: "نقل تجاري",
  heavy: "شحن ثقيل",
};

export const STEPS = [
  { n: "01", title: "حدد نوع الشحنة", desc: "اختر فئة الشحن المناسبة — خفيف، متوسط، أو ثقيل — بناءً على وزن بضاعتك." },
  { n: "02", title: "أدخل تفاصيل الطلب", desc: "حدد موقعَي الاستلام والتسليم وأضف متطلبات خاصة كالتغليف أو العمالة." },
  { n: "03", title: "تأكيد وجدولة", desc: "راجع التفاصيل والسعر النهائي، ثم اختر الاستلام الفوري أو الموعد المجدول." },
  { n: "04", title: "تتبع لحظي وتسليم مضمون", desc: "تابع شحنتك لحظة بلحظة عبر التطبيق حتى تصل إلى وجهتها بأمان." },
];

export const FEATURES = [
  { icon: "Clock",  title: "توصيل في الوقت المحدد", desc: "نضمن وصول شحنتك في الموعد المحدد — لأن وقتك يساوي أموالك." },
  { icon: "Shield", title: "تأمين شامل على كل شحنة", desc: "جميع الشحنات مؤمَّنة بالكامل — نحمي بضاعتك من الاستلام حتى التسليم." },
  { icon: "Headphones", title: "دعم متخصص 24/7", desc: "فريق دعم متاح على مدار الساعة للإجابة على استفساراتك وحل أي طارئ." },
];
