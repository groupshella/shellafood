# 🛒 مشروع Shella Food - منصة التوصيل والخدمات الشاملة

## 📋 نظرة عامة

**مشروع Shella Food** هو تطبيق ويب شامل مبني بتقنية Next.js 16 يوفر منصة متعددة الخدمات للتوصيل والشراكات التجارية. يدعم المشروع اللغتين العربية والإنجليزية (RTL/LTR) مع نظام توثيق متقدم ونظام إدارة متكامل للمتاجر والمنتجات والطلبات.

### 🎯 الخدمات الرئيسية
المنصة تربط بين:
- **المستثمرين** - فرص استثمارية مع توثيق رقمي
- **الشركاء التجاريين** - تسجيل وإدارة المتاجر
- **السائقين** - خدمات توصيل (دراجات نارية وشاحنات)
- **العمال** - خدمات "خدمني" المنزلية
- **العملاء** - نظام تمويل "قيدها"
- **المستخدمين** - تسوق إلكتروني شامل

---

## 🛠 التقنيات المستخدمة

### Frontend Stack
- **Next.js 16.0.1** - React Framework مع App Router
- **TypeScript 5** - للكتابة الآمنة
- **Tailwind CSS 4** - تصميم متجاوب وحديث
- **React 18.3.1** - مكتبة واجهة المستخدم
- **React DOM 18.3.1** - مكتبة DOM للـ React
- **Framer Motion 12.23.12** - رسوم متحركة متقدمة

### UI Components
- **@radix-ui/react-*** - مكونات UI متاحة (Dialog 1.1.15, Label 2.1.7, Popover 1.1.15, Scroll Area 1.2.10, Slot 1.2.3)
- **Lucide React 0.540.0** - مكتبة أيقونات حديثة
- **React Hook Form 7.62.0** - إدارة النماذج
- **React Phone Input 2 2.15.1** - إدخال أرقام هواتف دولية
- **Shadcn/ui** - مكونات UI قابلة للتخصيص

### Maps & Location
- **@react-google-maps/api 2.20.7** - خرائط جوجل تفاعلية
- **Google Maps Distance Matrix API** - حساب المسافات
- **Geolocation API** - تحديد الموقع

### File Management
- **UploadThing 7.7.4** - رفع الملفات (صور، فيديو)
- **@uploadthing/react 7.3.3** - مكونات React لـ UploadThing
- **React PDF** - عرض وإنشاء PDF

### State Management
- **React Context API** - إدارة الحالة العامة
- **Session Storage** - حفظ بيانات الطلبات
- **Local Storage** - سلة التسوق والمفضلة

### Additional Libraries
- **i18next 25.5.2** - نظام الترجمة الدولي
- **react-i18next 15.7.3** - تكامل i18next مع React
- **@tanstack/react-virtual 3.13.12** - Virtual scrolling للقوائم الطويلة
- **swiper 12.0.3** - سلايدر متقدم
- **zod 4.0.17** - التحقق من صحة البيانات
- **next-themes 0.4.6** - دعم Dark Mode
- **@vercel/analytics 1.5.0** - تحليلات Vercel
- **@vercel/speed-insights 1.2.0** - تحليل الأداء

---

## 🚚 نظام جلب وتوصيل (Pick and Order)

### الميزات الرئيسية

#### 1. أنواع النقل
- **🏍 دراجة نارية (Motorbike)**
  - للطرود الصغيرة والمستندات
  - توصيل سريع
  - تفاصيل: نوع الطرد، مستندات، توصيل سريع

- **🚛 شاحنة (Truck)**
  - للطرود الكبيرة والبضائع
  - 4 أحجام: صغيرة (1.5 طن)، متوسطة (3 طن)، كبيرة (5 طن)، كبيرة جداً (5+ طن)
  - تفاصيل: نوع البضاعة، هشة، تبريد، معدات تحميل

#### 2. أنواع التوصيل
- **باتجاه واحد (One-Way)**: نقطة استلام واحدة → نقطة تسليم واحدة
- **متعدد الاتجاهات (Multi-Direction)**: عدة نقاط استلام وتسليم

#### 3. تفاصيل الطلب
- **نقاط الموقع**: اختيار من الخريطة مع تفاصيل كاملة
- **تفاصيل الطرد**: وصف، وزن، أبعاد، تعليمات خاصة
- **الوسائط**: 5 صور + فيديو للطرد

#### 4. اختيار السائق
- **اختيار تلقائي**: النظام يختار أفضل سائق
- **اختيار يدوي**: المستخدم يختار من قائمة السائقين

### تدفق العمل
```
1. اختيار نوع النقل (شاحنة/دراجة نارية)
2. اختيار نوع التوصيل (باتجاه واحد/متعدد الاتجاهات)
3. إدخال تفاصيل الطلب
4. مراجعة الطلب والسعر
5. اختيار السائق
6. تأكيد الطلب
7. تتبع الطلب في الوقت الفعلي
```

---

## 🏠 نظام خدمني (Serve Me)

### الخدمات المتاحة
- تنظيف منزلي
- إصلاح سباكة
- صيانة كهربائية
- تنظيف مكيفات
- نقل أثاث
- صيانة أجهزة

---

## 📦 نظام طلباتي (My Orders)

### التبويبات
1. **المنتجات** - طلبات التسوق من المتاجر
2. **الخدمات** - طلبات خدمني
3. **جلب وتوصيل** - طلبات Pick and Order

### الميزات
- عرض جميع الطلبات مع التفاصيل الكاملة
- فلترة حسب الحالة
- البحث في الطلبات
- الترتيب: الأحدث، الأقدم، حسب الحالة
- سحب للتحديث (Pull to Refresh)
- إحصائيات شاملة

---

## 🔍 نظام تتبع الطلبات (Order Tracking)

### المكونات الرئيسية

1. **رأس الطلب** - رقم وحالة الطلب
2. **بانر وقت الوصول** - ETA ديناميكي
3. **الخط الزمني** - تتبع مراحل الطلب
4. **الخريطة المباشرة** - موقع السائق/العامل
5. **تفاصيل الطلب** - معلومات كاملة قابلة للتوسيع
6. **معلومات السائق/العامل** - ملف شخصي ووسائل تواصل
7. **أزرار الإجراءات** - إلغاء، تقييم، إعادة طلب

---

## 🛒 نظام المتاجر والمنتجات

### هيكل التصنيف
```
القسم (Category)
  └── المتجر (Store)
      └── قسم المتجر (Department)
          └── المنتج (Product)
```

### صفحة المتجر
- رأس المتجر مع الشعار والتقييم
- أقسام المتجر (Tabs مع Scroll Spy)
- شبكة المنتجات متجاوبة
- إضافة للسلة من أي مكان

### صفحة المنتج
- عرض سطح المكتب وموبايل منفصلين
- معلومات تفصيلية شاملة
- معلومات غذائية وصحية
- التقييمات والمراجعات
- منتجات مشابهة

---

## 🛍 سلة التسوق (Cart)

### الميزات
- إضافة/تحديث/حذف منتجات
- مسح السلة بالكامل (مع تأكيد)
- حساب الإجمالي تلقائياً
- حفظ في Local Storage
- تحديثات مباشرة عبر Custom Events

---

## 👤 نظام الملف الشخصي (Profile)

### الأقسام
1. معلومات الحساب
2. العناوين المحفوظة
3. المفضلة
4. المحفظة
5. محفظة قيدها
6. النقاط والقسائم
7. الإحصائيات
8. الدعم الفني
9. السياسات

---

## 🌐 نظام اللغات (i18n)

### الميزات
- دعم العربية 🇸🇦 والإنجليزية 🇬🇧
- تبديل فوري بدون إعادة تحميل
- حفظ الاختيار في localStorage
- RTL/LTR Support كامل

### الاستخدام
```typescript
const { language, setLanguage, t, isArabic } = useLanguage();

// تبديل اللغة
setLanguage('ar');

// استخدام الترجمة
<h1>{t('nav.home')}</h1>
```

---

## 🗺 نظام الخرائط والموقع

### Google Maps Integration
- عرض الخريطة مع موقع المستخدم
- اختيار الموقع بالنقر
- البحث عن مكان (Places API)
- Reverse Geocoding
- حساب المسافة (Distance Matrix API)
- رسم المسارات (Directions API)

---

## 📱 التصميم المتجاوب (Responsive Design)

### Breakpoints
```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

### استراتيجية
- **Mobile First** - التصميم يبدأ من الموبايل
- **Progressive Enhancement** - تحسينات تدريجية
- **Touch-Friendly** - أزرار كبيرة للموبايل
- **Optimized Images** - صور محسنة لكل حجم

---

## ⚡ الأداء والتحسينات

### Next.js Optimizations
- Image Optimization تلقائي
- Code Splitting للمكونات
- Route Prefetching
- Static Generation للمحتوى الثابت

### React Optimizations
- useMemo للحسابات الثقيلة
- useCallback للدوال
- React.memo للمكونات
- Lazy Loading للمكونات الثقيلة
- Virtual Scrolling للقوائم الطويلة

### Caching Strategy
- Session Storage للطلبات
- Local Storage للسلة واللغة
- Client-Side Cache للبيانات المتكررة

---

## 🔧 أدوات التطوير

### Commands
```bash
# تشغيل الخادم المحلي
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص الكود
npm run lint

# فحص الأنواع
npm run type-check
```

### Environment Variables
```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

# UploadThing
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id

# API URLs
NEXT_PUBLIC_API_URL=https://api.shellafood.com
```

---

## 🐛 معالجة الأخطاء

### Client-Side Error Handling
- Error Boundaries
- Try-Catch Blocks
- Safe Data Access مع Nullish Coalescing
- Toast Notifications للمستخدم

---

## 📊 الإحصائيات

### الملفات والمكونات
- **200+ مكون React**
- **15+ صفحة رئيسية**
- **50+ صفحة فرعية**
- **20+ Custom Hook**
- **30+ Type Definition**

### الأنظمة المكتملة
✅ Landing Page  
✅ Shopping System  
✅ Pick and Order  
✅ Serve Me  
✅ My Orders  
✅ Order Tracking  
✅ Profile System  
✅ Cart & Favorites  
✅ Multi-Language  
✅ Responsive Design  
✅ Dark Mode  

### خطوط الكود
- **TypeScript/TSX**: ~50,000 سطر
- **CSS/Tailwind**: ~5,000 سطر

---

## 🔮 الخطط المستقبلية

### ميزات مقترحة
- [ ] نظام تقييمات ومراجعات متقدم
- [ ] نظام نقاط الولاء
- [ ] نظام كوبونات وخصومات
- [ ] نظام إشعارات push متقدم
- [ ] دردشة مباشرة مع الدعم
- [ ] تطبيق جوال (React Native)
- [ ] نظام دفع إلكتروني متكامل

### تحسينات تقنية
- [ ] Service Workers
- [ ] Redis للـ Caching
- [ ] CDN Integration
- [ ] Two-Factor Authentication
- [ ] Sentry للأخطاء
- [ ] Analytics Dashboard

---

## 🤝 المساهمة

### إرشادات المساهمة
1. Fork المشروع
2. إنشاء branch للميزة: `git checkout -b feature/amazing-feature`
3. Commit التغييرات: `git commit -m 'Add amazing feature'`
4. Push للـ branch: `git push origin feature/amazing-feature`
5. فتح Pull Request

### معايير الكود
- استخدام TypeScript مع الأنواع الصريحة
- Functional Components و Hooks
- Tailwind CSS للتصميم
- دعم Dark Mode و RTL/LTR
- Commit messages واضحة

---

## 📞 الدعم والتواصل

### للمطورين
- **GitHub**: [github.com/shellafood](https://github.com/nasser1207/shellafood)
- **Issues**: لتقارير الأخطاء
- **Discussions**: للأسئلة والنقاشات

### للمستخدمين
- **الموقع**: [shellafood.com](https://shellafood.com)
- **البريد**: info@shellafood.com
- **الهاتف**:+966599966674

---

## 📄 الرخصة

هذا المشروع محمي بحقوق الملكية الفكرية لشركة Shella Food.

**جميع الحقوق محفوظة © 2024 Shella Food**

---

## 👥 الفريق

### فريق التطوير
- **مطور Full Stack** - التطوير الرئيسي
- **مصمم UI/UX** - التصميم والواجهات
- **مهندس DevOps** - النشر والبنية التحتية
- **مدير المشروع** - الإدارة والتنسيق

---

**آخر تحديث**: ديسمبر 2024  
**الإصدار**: 0.1.0  
**Build**: Production Ready  

---

🚀 **Built with ❤️ by Shella Food Team**
