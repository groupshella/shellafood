# Shella Food

منصة توصيل وتسوق إلكتروني (هايبر ماركت ومتاجر) مبنية بـ **Next.js 16** مع واجهة عربية أولاً، ودعم Dark Mode و RTL.

---

## نظرة عامة

التطبيق يتيح للمستخدمين:

- تصفح الوحدات (Modules) والمتاجر والمنتجات
- البحث عن متاجر ومنتجات وعلامات تجارية
- إدارة السلة وإتمام الطلب والدفع عبر MyFatoorah
- إدارة العناوين والملف الشخصي والمحفظة والعروض والقسائم

يدعم وضع الضيف (Guest) وتسجيل الدخول عبر OTP، مع ربط بـ Backend API خارجي.

---

## التقنيات المستخدمة

### Core
| التقنية | الإصدار |
|---------|---------|
| Next.js (App Router) | ^16.0.7 |
| React / React DOM | ^18.3.1 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |

### UI & UX
- **Radix UI** — Dialog, Label, Popover, Scroll Area, Slot
- **Lucide React** + **react-icons** — الأيقونات
- **Framer Motion** — الحركة والانتقالات
- **Swiper** — السلايدرات
- **cmdk** — واجهات الأوامر/البحث
- **class-variance-authority** + **clsx** + **tailwind-merge** — تنسيق المكونات
- **next-themes** — Dark Mode
- **tw-animate-css** — حركات CSS

### Forms & Data
- **React Hook Form** + **@hookform/resolvers** + **Zod** — النماذج والتحقق
- **SWR** — جلب البيانات من جهة العميل مع إعادة التحقق
- **use-debounce** — تأخير البحث والإدخال
- **@tanstack/react-virtual** — Virtual scrolling

### Maps, Files & Analytics
- **@react-google-maps/api** — الخرائط واختيار الموقع
- **UploadThing** — رفع الصور (مثل صورة الملف الشخصي)
- **@vercel/analytics** + **@vercel/speed-insights**

### i18n
- **i18next** / **react-i18next** موجودة في الاعتماديات؛ معظم النصوص حالياً عربية مركزية داخل الميزات (جاهزة للربط لاحقاً)

---

## هيكل المشروع

```
shellafood/
├── app/                 # Next.js App Router (صفحات + API routes)
│   ├── (main)/          # صفحات التطبيق بعد الدخول/الضيف
│   ├── auth/            # تسجيل الدخول والتسجيل
│   ├── onboarding/      # شاشات التعريف
│   └── api/             # BFF / proxies نحو الـ Backend
├── features/            # منطق المنتج مقسّم حسب الميزة
├── shared/              # مكونات ومساعدات مشتركة
├── public/              # أصول ثابتة
└── postman/             # مجموعة Postman للـ API
```

### الميزات (`features/`)

| الميزة | الوظيفة |
|--------|---------|
| `auth` | OTP، تسجيل، ضيف، جلسة (cookies) |
| `onboarding` | شاشات الترحيب واختيار اللغة |
| `home` | بانرات، وحدات، عروض ترويجية |
| `markets` / `stores` / `hyper-market` | المتاجر، التصنيفات، تفاصيل الهايبر |
| `item` | تفاصيل المنتج والمنتجات المرتبطة |
| `brands` | العلامات التجارية ومنتجاتها |
| `search` | بحث متاجر/منتجات وبحث شائع |
| `offers` / `coupons` / `discounts` | العروض والقسائم والخصومات |
| `cart` | السلة (Server Actions) |
| `checkout` | إتمام الطلب |
| `payment` | تكامل MyFatoorah |
| `my-orders` | قائمة الطلبات وتفاصيل الطلب |
| `addresses` | العناوين + المنطقة (zone) |
| `favorites` | المفضلة (منتجات / متاجر) |
| `notifications` | الإشعارات |
| `profile` | الحساب، المحفظة، قيدها، النقاط، الإحصائيات، الإحالة، الدعم |
| `layout` | هيكل التنقل والواجهة المشتركة |

كل ميزة عادةً تحتوي على: `api/`، `components/`، `actions/` (عند الحاجة)، `types/`، `hooks/`، `constants/`.

---

## الصفحات الرئيسية

| المسار | الوصف |
|--------|--------|
| `/` | توجيه حسب الجلسة → `/home` أو `/onboarding` |
| `/onboarding` | التعريف |
| `/auth` | تسجيل الدخول / إنشاء حساب |
| `/home` | الرئيسية |
| `/modules/[id]` | وحدة (مثل هايبر ماركت) |
| `/hyper-market` | هايبر ماركت وتصنيفاته |
| `/stores/[id]` | تفاصيل المتجر |
| `/items/[id]` | تفاصيل المنتج |
| `/brands` / `/brands/[id]` | العلامات التجارية |
| `/search` | البحث |
| `/offers/[offerId]` | عرض |
| `/coupons` / `/discounts` | قسائم وخصومات |
| `/cart` | السلة |
| `/checkout` / `/checkout/payment` | الدفع |
| `/my-orders` / `/my-orders/[id]` | الطلبات |
| `/addresses` | العناوين |
| `/favorites` | المفضلة |
| `/notifications` | الإشعارات |
| `/profile/*` | الملف الشخصي والأنظمة الفرعية |

### أقسام الملف الشخصي
- تعديل الحساب، العناوين، اللغة، الوضع الداكن
- المحفظة وإضافة رصيد، اشتراك المحفظة
- محفظة **قيدها** (Qidha)
- النقاط، الإحصائيات، الإحالة (Referral)
- الانضمام كسائق / مندوب قسائم
- الدعم، الدردشة المباشرة، السياسات (خصوصية، استرجاع، شروط، من نحن)
- حذف الحساب

---

## المصادقة والجلسة

- تسجيل الدخول / التسجيل عبر **OTP** ورقم الجوال
- وضع **ضيف** (`guest_id`) للتصفح بدون حساب
- الجلسة تُحفظ عبر `/api/auth/session` كـ **httpOnly cookies** (`access_token` / `guest_id`)
- الصفحة الجذر `/` توجّه المستخدم حسب وجود توكن أو ضيف

---

## الدفع والطلبات

1. إضافة منتجات للسلة (`features/cart` — Server Actions)
2. مراجعة الطلب في `/checkout` (عنوان، طريقة توصيل، ملاحظات، فاتورة)
3. الدفع عبر **MyFatoorah** (`/api/payment/myfatoorah/*`)
4. تتبع الطلبات من `/my-orders`

---

## متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Backend
NEXT_PUBLIC_API_URL=https://your-api-base-url

# Zone / Module (ترسل كـ headers للـ Backend)
ZONE_ID=[2]
MODULE_ID=3

# موقع افتراضي (خرائط / طلبات تعتمد على الإحداثيات)
NEXT_PUBLIC_LATITUDE=24.7136
NEXT_PUBLIC_LONGITUDE=46.6753

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

# Caching (ثوانٍ لـ next.revalidate)
REVALIDATE_TIME=3600

# اختياري
NODE_ENV=development
```

> الـ Frontend يتحدث مع الـ Backend عبر `NEXT_PUBLIC_API_URL`، ويمرّر غالباً `zoneId` / `moduleId` / الإحداثيات في الـ headers.

---

## أوامر التطوير

```bash
# تثبيت الاعتماديات
npm install

# تشغيل محلي
npm run dev

# بناء للإنتاج
npm run build

# تشغيل نسخة الإنتاج
npm start

# فحص ESLint
npm run lint

# حذف مجلد .next
npm run clean
```

---

## Next.js API Routes (BFF)

المسارات تحت `app/api/` تعمل كوسيط نحو الـ Backend، وتشمل مجموعات مثل:

- **Auth** — `send-otp`, `verify-otp`, `login`, `register`, `guest`, `session`, `forgot-password`, `reset-password`, …
- **Home / Module** — banners, modules, stores, categories, offers, popular brands
- **Search** — items, stores, popular search / brands
- **Item / Brands / Offers** — تفاصيل، مرتبط، فلترة وبحث
- **Payment** — MyFatoorah (`payment-methods`, `process`, `check-status`)
- **Profile analytics** — summary, spending trends, insights, …

للتفاصيل والاختبار: راجع مجموعة Postman في [`postman/Shellafood API.json`](./postman/Shellafood%20API.json).

---

## أنماط معمارية مستخدمة

- **Feature-based folders** — كل مجال عمل معزول تحت `features/`
- **Server Components + Suspense** — جلب بيانات من السيرفر مع skeletons
- **Server Actions** — السلة، العناوين، الطلب، المفضلة، الملف الشخصي
- **Route Handlers** — وكيل API + إدارة الجلسة والكوكيز
- **SWR** — تحديثات العميل للبحث والقوائم الديناميكية

---

## التصميم المتجاوب

```
sm: 640px    md: 768px    lg: 1024px    xl: 1280px    2xl: 1536px
```

الواجهة موجهة للجوال أولاً مع تحسين تدريجي للشاشات الأكبر.

---

## المساهمة

1. أنشئ فرعاً للميزة: `git checkout -b feature/your-feature`
2. التزم بالتغييرات برسالة واضحة
3. افتح Pull Request للمراجعة

### معايير الكود
- TypeScript صارم (`strict`)
- Functional components و Hooks
- Tailwind للتصميم
- احترام RTL والوضع الداكن عند تعديل الواجهة

---

## الدعم

- **GitHub**: [github.com/nasser1207/shellafood](https://github.com/nasser1207/shellafood)
- **الموقع**: [shellafood.com](https://shellafood.com)
- **البريد**: info@shellafood.com
- **الهاتف**: +966599966674

---

© Shella Food — جميع الحقوق محفوظة  
**الإصدار**: 0.1.0
