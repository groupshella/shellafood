"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

// ملفات الترجمة
const translations = {
	ar: {
		// Navbar
		"navbar.arabic": "العربية",
		"navbar.english": "English",

		// Company Name
		"company.name": "شلة",

		// Landing Page
		"landing.welcome": "مرحباً بك في شلة",
		"landing.description": "منصة التسوق والخدمات الرائدة",
		"landing.getStarted": "ابدأ الآن",
		"landing.learnMore": "اعرف المزيد",

		// Investore Page
		"investor.title": "الإنضمام كمستثمر في ",
		"investor.downloadContract": "تحميل مسودة العقد",
		"investor.benefits": "فوائد الدخول باستثمار تجاري",
		"investor.benefit1":
			"يساعد الاستثمار في الأعمال على ضمان نجاح الشركة على المدى الطويل.",
		"investor.benefit2": "الاستثمار التجاري يساعد على خلق فرص العمل.",
		"investor.benefit3":
			"يمكن أن يساعد الاستثمار في الشركات الناشئة على تعزيز النمو الاقتصادي.",
		"investor.benefit4":
			"يمكن أن يؤدي الاستثمار في الشركات الناشئة إلى الابتكار.",
		"investor.benefit5":
			"يمكن أن يساعد الاستثمار التجاري في جذب الموظفين الموهوبين.",
		"investor.card1.title": "تحقيق عائد طويل الاجل خلال الاستثمار",
		"investor.card1.description":
			"سوف تحصل على عائد طويل الاجل لطالما بقيت من المستثمرين معنا في شلة",
		"investor.card2.title": "ارباح سنوية مدروسة",
		"investor.card2.description":
			"قم بزيادة راس مالك عن طريق الاستثمار في شركتنا واحصل على مبالغ سنوية مجزية",

		// Investore Form
		"form.firstName": "الاسم الأول",
		"form.fatherName": "اسم الأب",
		"form.familyName": "اسم العائلة",
		"form.grandfatherName": "اسم الجد",
		"form.birthDate": "تاريخ الميلاد",
		"form.nationalId": "رقم الهوية",
		"form.email": "البريد الإلكتروني",
		"form.phone": "رقم الهاتف",
		"form.nationalAddressEmail": "البريد الإلكتروني حسب العنوان الوطني",
		"form.region": "المنطقة",
		"form.iban": "رقم الآيبان",
		"form.bankName": "اسم البنك",
		"form.amount": "المبلغ المراد استثماره",
		"form.agreeTerms": "الموافقة على جميع",
		"form.termsAndConditions": "الشروط والأحكام",
		"form.showContract": "عرض العقد",
		"form.creatingContract": "جاري إنشاء العقد...",
		"form.editData": "تعديل البيانات",
		"form.nafathAuth": "التوثيق عبر نفاذ",
		"form.sending": "جارٍ الإرسال...",
		"form.close": "إغلاق",
		"form.loadingContract": "جاري تحميل العقد...",
		"form.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
		"form.agreeToTerms": "يرجى الموافقة على الشروط والأحكام",
		"form.contractError": "حدث خطأ أثناء إنشاء العقد",
		"form.nafathSent": "تم إرسال طلب التوثيق. الرجاء اختيار الرقم",
		"form.nafathOnApp": "على تطبيق نفاذ بجوالك.",
		"form.nafathSuccess": "✅ تم التوثيق بنجاح عبر نفاذ",
		"form.nafathRejected": "❌ تم رفض التوثيق عبر نفاذ",
		"form.nafathError": "حدث خطأ أثناء بدء التوثيق عبر نفاذ",

		// Partner Page
		"partner.title": "الإنضمام كشريك تاجر",
		"partner.subtitle":
			"إنضم الينا وزد مبيعاتك مع تحقيق اكبر استفادة من خدماتنا المميزة",
		"partner.benefits": "فوائد الانضمام كشريك تاجر في",
		"partner.benefit1.title": "فرصة استثنائية لشركاء شلة",
		"partner.benefit1.description":
			"انطلق بأعمالك نحو القمة مع باقة نمو متكاملة بقيمة 5400 ريال، مجانًا بالكامل!",
		"partner.benefit2.title": "حدود متجرك الآن حدود المملكة",
		"partner.benefit2.description": "انطلق بمنتجاتك إلى كل مدينة وقرية",
		"partner.benefit3.title": "ضاعف أرباحك وزد مبيعاتك",
		"partner.benefit3.description": "انضم إلى عالم متاجر شلة اليوم!",
		"partner.benefit4.title": "وداعاً لقلق الشحن",
		"partner.benefit4.description":
			"مرحباً بعصر جديد من الثقة والسرعة الفائقة مع تطبيق شلة",
		"partner.benefit5.title": "إحصائيات البيع مع شلة",
		"partner.benefit5.description":
			"بوصلتك الدقيقة نحو قرارات أذكى وأرباح أعلى",
		"partner.benefit6.title": "إبداع في عملك",
		"partner.benefit6.description": "يمكنك إدارة كل شئ من التطبيق لعملائك",
		"partner.benefit7.title": "إدارة عملياتك بفعالية",
		"partner.benefit7.description":
			"خاصية التنبيه الفوري بالطلبات الجديدة في تطبيق شلة للتجار",
		"partner.newsletter.title": "إشترك في قائمتنا البريدية",
		"partner.newsletter.description":
			"هل ترغب في تلقي اخر الاخبار والمعلومات عن تطبيق شلة",
		"partner.newsletter.subscribe": "ادخل بريدك الالكتروني هنا لنصل إليك",
		"partner.newsletter.button": "إشتراك",

		// Partner Form
		"partnerForm.storeInfo": "معلومات المتجر",
		"partnerForm.storeClassification": "تصنيف المتجر",
		"partnerForm.storeName": "اسم المتجر",
		"partnerForm.city": "المدينة",
		"partnerForm.whatOffers": "ماذا يقدمه متجرك؟",
		"partnerForm.phoneNumber": "رقم الجوال",
		"partnerForm.branchCount": "عدد فروع متجرك",
		"partnerForm.personalId": "رقم الهوية الشخصية / الإقامة",
		"partnerForm.idImage": "صورة الهوية /الإقامة",
		"partnerForm.municipalLicense": "رخصة البلدية (ان وجدت)",
		"partnerForm.storefrontImage": "صورة واجهة المحل /الشعار",
		"partnerForm.location": "موقع المتجر على الخريطة",
		"partnerForm.searchLocation": "ابحث عن موقع...",
		"partnerForm.myLocation": "📍 موقعي",
		"partnerForm.loadingMap": "جاري تحميل الخريطة...",
		"partnerForm.agreeTerms": "الموافقة على جميع",
		"partnerForm.termsAndConditions": "الشروط والأحكام",
		"partnerForm.submit": "إرسال",
		"partnerForm.reset": "إعادة ضبط",
		"partnerForm.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
		"partnerForm.agreeToTerms": "يرجى الموافقة على الشروط والأحكام",
		"partnerForm.idTooLong": "الرقم القومي اكبر من 10 خانات",
		"partnerForm.success": "تم تسجيل البيانات بنجاح!",
		"partnerForm.error": "حدث خطأ اثناء الستجيل",
		"partnerForm.submitError": "حدث خطأ أثناء تسجيل البيانات",
		"partnerForm.idUploadSuccess": "تم رفع صورة الهوية الشخصية بنجاح",
		"partnerForm.licenseUploadSuccess": "تم رفع صورة الرخصة بنجاح",
		"partnerForm.storeUploadSuccess": "تم رفع صورة المتجر/اللوجو بنجاح",
		"partnerForm.locationError": "فشل في تحديد موقعك 😢",
		"partnerForm.locationNotSupported": "المتصفح لا يدعم تحديد الموقع",
		"partnerForm.placeholder.supermarket": "سوبر ماركت",
		"partnerForm.placeholder.storeName": "أدخل اسم متجرك",
		"partnerForm.placeholder.saudi": "السعودية",
		"partnerForm.placeholder.services":
			"ماهي الخدمات التي تقدمها في حال لم تجد تصنيف للمتجر",
		"partnerForm.placeholder.branches": "3",
		"partnerForm.placeholder.idExample": "EX:1234567890",

		// Driver Page
		"driver.title": "الانضمام كعامل توصيل",
		"driver.benefits": "فوائد الانضمام كعامل توصيل في",
		"driver.card1.title": "استمتع برسوم خدمة منخفضة",
		"driver.card1.description":
			"سوف تحصل على عائد طويل الأجل لطالما بقيت من المستثمرين معنا في شلة",
		"driver.card1.more": "معرفة المزيد",

		"driver.card2.title": "متصل في أي وقت",
		"driver.card2.description":
			"التمتع بحرية العمل في الأوقات الملائمة لك كما سوف تتمكن من عملك ومسؤولياتك الأخرى",
		"driver.card2.more": "معرفة المزيد",

		// Driver Form
		"driverForm.driverInfo": "معلومات عامل التوصيل",
		"driverForm.firstName": "الاسم الأول",
		"driverForm.lastName": "اسم العائلة",
		"driverForm.deliveryType": "نوع مندوب التوصيل",
		"driverForm.vehicleType": "نوع المركبة",
		"driverForm.idType": "نوع الهوية",
		"driverForm.personalId": "رقم الهوية الشخصية / الإقامة",
		"driverForm.phoneNumber": "رقم الموبايل",
		"driverForm.region": "المنطقة",
		"driverForm.idImage": "صورة الهوية /الإقامة",
		"driverForm.driverLicense": "رخصة القيادة",
		"driverForm.vehicleRegistration": "استمارة المركبة",
		"driverForm.personalPhoto": "صورة شخصية",
		"driverForm.agreeTerms": "الموافقة على جميع",
		"driverForm.termsAndConditions": "الشروط والأحكام",
		"driverForm.submit": "إرسال",
		"driverForm.reset": "إعادة ضبط",
		"driverForm.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
		"driverForm.agreeToTerms": "يرجى الموافقة على الشروط والأحكام",
		"driverForm.idTooLong": "الرقم القومي اكبر من 10 خانات",
		"driverForm.success": "تم تسجيل البيانات بنجاح!",
		"driverForm.error": "حدث خطأ اثناء الستجيل",
		"driverForm.submitError": "حدث خطأ أثناء تسجيل البيانات",
		"driverForm.idUploadSuccess": "تم رفع صورة الهوية الشخصية بنجاح",
		"driverForm.licenseUploadSuccess": "تم رفع صورة الرخصة بنجاح",
		"driverForm.registrationUploadSuccess": "تم رفع صورة الاستمارة بنجاح",
		"driverForm.photoUploadSuccess": "تم رفع الصورة الشخصية بنجاح",
		"driverForm.placeholder.firstName": "أحمد",
		"driverForm.placeholder.lastName": "خلف",
		"driverForm.placeholder.region": "جدة",
		"driverForm.placeholder.idExample": "EX:1234567890",
		"driverForm.placeholder.choose": "-- اختر --",
		"driverForm.option.freelance": "مستقل",
		"driverForm.option.employee": "موظف",
		"driverForm.option.motorcycle": "دراجة نارية",
		"driverForm.option.car": "سيارة",
		"driverForm.option.bicycle": "دراجة هوائية",
		"driverForm.option.nationalId": "بطاقة هوية وطنية",
		"driverForm.option.residence": "إقامة",

		// Worker Page
		"worker.title": "الانضمام كمقدم خدمة",
		"worker.benefits": "فوائد الانضمام كمقدم خدمة في",
		"worker.card1.title": "استمتع برسوم خدمة تنافسية",
		"worker.card1.description":
			"استمتع برسوم خدمة تنافسية عند استلام كل طلب واختر الطلبات القريبة منك",
		"worker.card2.title": "متصل في أي وقت",
		"worker.card2.description":
			"التمتع بحرية العمل في الأوقات الملائمة لك كما سوف تتمكن من عملك ومسؤولياتك الأخرى",

		// Worker Form
		"workerForm.workerInfo": "معلومات مقدم الخدمة",
		"workerForm.firstName": "الاسم الأول",
		"workerForm.lastName": "اسم العائلة",
		"workerForm.email": "البريد الإلكتروني",
		"workerForm.workType": "نوع العمل الخص بك",
		"workerForm.region": "المنطقة",
		"workerForm.vehicleType": "نوع المركبة",
		"workerForm.idType": "نوع الهوية",
		"workerForm.personalId": "رقم الهوية الشخصية / الإقامة",
		"workerForm.idImage": "صورة الهوية /الإقامة",
		"workerForm.driverLicense": "رخصة القيادة (إن وجدت)",
		"workerForm.vehicleRegistration": "استمارة المركبة (إن وجدت)",
		"workerForm.personalPhoto": "صورة شخصية",
		"workerForm.agreeTerms": "الموافقة على جميع",
		"workerForm.termsAndConditions": "الشروط والأحكام",
		"workerForm.submit": "إرسال",
		"workerForm.reset": "إعادة ضبط",
		"workerForm.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
		"workerForm.agreeToTerms": "يرجى الموافقة على الشروط والأحكام",
		"workerForm.idTooLong": "الرقم القومي اكبر من 10 خانات",
		"workerForm.success": "تم تسجيل البيانات بنجاح!",
		"workerForm.error": "حدث خطأ اثناء الستجيل",
		"workerForm.submitError": "حدث خطأ أثناء تسجيل البيانات",
		"workerForm.idUploadSuccess": "تم رفع صورة الهوية الشخصية بنجاح",
		"workerForm.licenseUploadSuccess": "تم رفع صورة الرخصة بنجاح",
		"workerForm.registrationUploadSuccess": "تم رفع صورة الاستمارة بنجاح",
		"workerForm.photoUploadSuccess": "تم رفع الصورة الشخصية بنجاح",
		"workerForm.placeholder.firstName": "أحمد",
		"workerForm.placeholder.lastName": "خلف",
		"workerForm.placeholder.email": "ex@example.com",
		"workerForm.placeholder.region": "جدة",
		"workerForm.placeholder.idExample": "EX:1234567890",
		"workerForm.placeholder.choose": "-- اختر --",
		"workerForm.option.foodDelivery": "توصيل طعام",
		"workerForm.option.supermarketShopping": "تسوق من سوبرماركت",
		"workerForm.option.homeServices": "خدمات منزلية",
		"workerForm.option.other": "أخرى",
		"workerForm.option.motorcycle": "دراجة نارية",
		"workerForm.option.car": "سيارة",
		"workerForm.option.bicycle": "دراجة هوائية",
		"workerForm.option.noVehicle": "لايوجد",
		"workerForm.option.residence": "إقامة",
		"workerForm.option.nationalId": "بطاقة هوية وطنية",

		// Landing Page
		"landing.hero.title": "  كل احتياجاتك بضغطة زر",
		"landing.hero.subtitle": "أكثر من 60,000 مطعم ومتجر",
		"landing.hero.browseButton": "تصفّح الآن",
		"landing.mobileApp.title": "تطبيق الجوال",
		"landing.mobileApp.subtitle": "حمّل تطبيق شلة على جوالك واطلب بضغطة زر",
		"landing.qaydha.title": "مع قيدها",
		"landing.qaydha.subtitle": "لا تحسب كم باقي على الراتب",
		"landing.qaydha.description":
			"شوف كم ناقصك في بيتك مقاضي وإحنا نعطيك على الراتب!",
		"landing.qaydha.registerButton": "سجّل الآن",
		"landing.qaydha.learnMoreButton": "معرفة المزيد",
		"landing.tiles.partner.title": "سجّل مطعمك أو متجرك",
		"landing.tiles.partner.desc": "وسّع نشاطك بالوصول إلى عملاء أكثر معنا.",
		"landing.tiles.driver.title": "سجّل كمندوب توصيل",
		"landing.tiles.driver.desc":
			"كن مندوب توصيل واكسب دخلًا إضافيًا معنا، سجّل الآن!",
		"landing.tiles.investor.title": "سجّل الآن كمستثمر في شلة",
		"landing.tiles.investor.desc":
			"قُم بالاستثمار في شركتنا وتعرّف على مزايا الاستثمار.",
		"landing.tiles.worker.title": "سجّل كمقدّم خدمة",
		"landing.tiles.worker.desc": "سجّل حسب مهنتك معنا واكسب دخلًا إضافيًا.",
		"landing.tiles.registerNow": "سجّل الآن",

		// Footer
		"footer.downloadApp": "حمل التطبيق",
		"footer.downloadSubtitle": "احصل على كل ما تحتاجه من المطعم والسوبرماركت والمزيد مع خدماتنا المميزة",
		"footer.companyDescription": "شلة منشأة سعودية مرخصة من قبل وزارة التجارة لممارسة النشاط التسويقي للغير وبيع التجزئة والجملة للأفراد والمنشآت بسجل تجاري رقم 1009128112 برأس مال 50 مليون ريال سعودي",
		"footer.company": "الشركة",
		"footer.aboutUs": "عن شلة",
		"footer.careers": "الوظائف",
		"footer.faq": "أسئلة وأجوبة",
		"footer.islamicLaw": "الشريعة الإسلامية",
		"footer.legal": "القانونية",
		"footer.kaidhaTerms": "شروط قيدها",
		"footer.privacyPolicy": "سياسة الخصوصية",
		"footer.termsConditions": "الشروط والأحكام",
		"footer.violations": "الإبلاغ عن المخالفات",
		"footer.application": "التطبيق",
		"footer.joinAsDriver": "انضمام كمندوب توصيل",
		"footer.joinAsPartner": "انضمام كشريك تاجر",
		"footer.joinAsWorker": "انضمام كمقدم خدمة",
		"footer.joinAsInvestor": "انضمام كمستثمر معنا",
		"footer.customerService": "خدمة العملاء",
		"footer.customerTestimonials": "إقرارات العملاء",
		"footer.contactUs": "تواصل معنا",
		"footer.copyright": "ShellaKsa 2024",
		
		// Kaidha Page
		"kaidha.description":
			'تُقدّم خدمة "قيدها" منصةً مبتكرةً تُعيد تعريف مفهوم التمويل الاستهلاكي، حيث تُتيح للمستخدمين مرونةً غير مسبوقة في سداد قيمة مشترياتهم من المواد الغذائية والاستهلاكية. تعتمد "قيدها" على مبدأ "اشتر الآن، ادفع مع الراتب"، مما يُمكّن الأفراد من تلبية احتياجاتهم الأساسية دون القلق بشأن توافر السيولة النقدية في وقت الشراء. وتُمثّل "قيدها" نقلةً نوعيةً في مفهوم التمويل الاستهلاكي، حيث تُوفّر مرونةً غير مسبوقة وتُساهم في تحسين القوة الشرائية للأفراد. ومن خلال التعامل المسؤول والتوعية المالية، يُمكن أن تُساهم "قيدها" في تحقيق الاستقرار المالي والرفاهية الاقتصادية للمستخدمين.',

		// Kaidha Form
		"kaidhaForm.title": "نموذج التسجيل في خدمة قيدها",
		"kaidhaForm.subtitle": "يرجى ملء جميع الحقول المطلوبة بدقة",
		"kaidhaForm.personalInfo": "المعلومات الشخصية",
		"kaidhaForm.firstName": "الاسم الأول",
		"kaidhaForm.lastName": "اسم العائلة",
		"kaidhaForm.fatherName": "اسم الأب",
		"kaidhaForm.grandFatherName": "اسم الجد",
		"kaidhaForm.birthDate": "تاريخ الميلاد",
		"kaidhaForm.nationality": "الجنسية",
		"kaidhaForm.socialStatus": "الحالة الاجتماعية",
		"kaidhaForm.familyMembersCount": "عدد أفراد الأسرة",
		"kaidhaForm.idType": "نوع الهوية",
		"kaidhaForm.personalIdNumber": "رقم الهوية",
		"kaidhaForm.idExpirationDate": "تاريخ الانتهاء",
		"kaidhaForm.phoneNumber": "رقم الجوال",
		"kaidhaForm.whatsappNumber": "رقم الواتساب",
		"kaidhaForm.email": "بريد إلكتروني",
		"kaidhaForm.homeType": "نوع المنزل",
		"kaidhaForm.homeNature": "طبيعة المنزل",
		"kaidhaForm.city": "المدينة",
		"kaidhaForm.neighborhood": "الحي",
		"kaidhaForm.addressDetails": "العنوان التفصيلي للمنزل",
		"kaidhaForm.homeLocation": "تحديد موقع السكن على الخريطة",
		"kaidhaForm.workInfo": "معلومات العمل",
		"kaidhaForm.companyName": "اسم الشركة",
		"kaidhaForm.jobTitle": "المسمى الوظيفي",
		"kaidhaForm.yearsOfExperience": "عدد سنين العمل",
		"kaidhaForm.grossSalary": "إجمالي الراتب",
		"kaidhaForm.workAddress": "العنوان التفصيلي للعمل",
		"kaidhaForm.workLocation": "تحديد موقع العمل على الخريطة",
		"kaidhaForm.installments": "هل لديك أقساط",
		"kaidhaForm.addInstallment": "إضافة قسط",
		"kaidhaForm.commitmentAmount": "مبلغ الالتزام",
		"kaidhaForm.entityName": "اسم الجهة",
		"kaidhaForm.additionalInfo": "معلومات إضافية",
		"kaidhaForm.additionalIncome": "مصادر دخل إضافية",
		"kaidhaForm.additionalAmount": "المبلغ",
		"kaidhaForm.incomeSource": "جهة الدخل",
		"kaidhaForm.submit": "إرسال",
		"kaidhaForm.reset": "إعادة ضبط",
		"kaidhaForm.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
		"kaidhaForm.birthDateError": "تاريخ الميلاد يجب أن يكون قبل 2005-12-31",
		"kaidhaForm.success": "تم تسجيل البيانات بنجاح!",
		"kaidhaForm.error": "حدث خطأ أثناء تسجيل البيانات",
		"kaidhaForm.locationError": "فشل في تحديد موقعك 😢",
		"kaidhaForm.locationNotSupported": "المتصفح لا يدعم تحديد الموقع",
		"kaidhaForm.searchLocation": "ابحث عن موقع...",
		"kaidhaForm.myLocation": "📍 موقعي",
		"kaidhaForm.loadingMap": "جاري تحميل الخريطة...",
		"kaidhaForm.locationSelected": "تم تحديد الموقع",
		"kaidhaForm.placeholder.nationality": "سعودي",
		"kaidhaForm.placeholder.idNumber": "001447888554",
		"kaidhaForm.placeholder.city": "الرياض",
		"kaidhaForm.placeholder.neighborhood": "حي الغروب",
		"kaidhaForm.placeholder.address": "جدة، شارع 500 تفرع 2",
		"kaidhaForm.placeholder.email": "example@example.com",
		"kaidhaForm.placeholder.choose": "-- اختر --",
		"kaidhaForm.option.single": "أعزب",
		"kaidhaForm.option.married": "متزوج",
		"kaidhaForm.option.nationalId": "بطاقة هوية وطنية",
		"kaidhaForm.option.passport": "جواز سفر",

		// Register Page
		"register.title": "إنشاء حساب جديد",
		"register.subtitle": "سجل معنا للحصول على أفضل تجربة تسوق",
		"register.personalInfo": "المعلومات الشخصية",
		"register.fullName": "الاسم الكامل",
		"register.phoneNumber": "رقم الهاتف",
		"register.birthDate": "تاريخ الميلاد",
		"register.accountInfo": "معلومات الحساب",
		"register.email": "البريد الإلكتروني",
		"register.password": "كلمة المرور",
		"register.confirmPassword": "تأكيد كلمة المرور",
		"register.address": "العنوان",
		"register.selectLocation": "اختر موقعك على الخريطة",
		"register.selectedAddress": "العنوان المحدد",
		"register.coordinates": "الإحداثيات",
		"register.cancel": "إلغاء",
		"register.confirm": "تأكيد",
		"register.submit": "تسجيل",
		"register.haveAccount": "لديك حساب بالفعل؟",
		"register.loginLink": "تسجيل الدخول",

		// Login Page
		"login.title": "تسجيل الدخول",
		"login.subtitle": "مرحباً بعودتك! سجل دخولك للمتابعة",
		"login.email": "البريد الإلكتروني",
		"login.password": "كلمة المرور",
		"login.submit": "تسجيل الدخول",
		"login.noAccount": "ليس لديك حساب؟",
		"login.registerLink": "إنشاء حساب جديد",

		// ServeMe Page (اخدمني)
		"serveMe.title": "خدمة توصيل سريعة وموثوقة",
		"serveMe.subtitle": "نقدم لك الخدمات المناسبة والأمان اختر خدمتك المناسبة وأترك الباقي علينا",
		"serveMe.searchPlaceholder": "البحث عن خدمة معينة",
		"serveMe.servicesTitle": "اختر من بين مجموعة واسعة من الخدمات",
		"serveMe.requestService": "اطلب الخدمة",
		
		// Services
		"serveMe.carMaintenance": "صيانة السيارات",
	"serveMe.homeMaintenance": "الصيانة المنزلية",
	"serveMe.educationTutoring": "التعليم والتدريس",
	"serveMe.babysitting": "رعاية الأطفال",
	"serveMe.womenSalons": "صالونات نسائية",
	"serveMe.menSalons": "صالونات رجالية",
	"serveMe.legal": "الخدمات القانونية",
	"serveMe.travelTourism": "السفر والسياحة",
	"serveMe.pickAndOrder": "التوصيل والاستلام",
	"serveMe.construction": "مواد البناء",
		
		// Features
		"serveMe.features.coverage": "تغطية واسعة",
		"serveMe.features.coverageDesc": "نصل إليك أينما كنت مع مزودي الخدمات",
		"serveMe.features.support": "دعم مستمر",
		"serveMe.features.supportDesc": "دعم مستمر على مدار الساعة",
		"serveMe.features.reliable": "خدمة موثوقة",
		"serveMe.features.reliableDesc": "أفضل جودة خدمة من المعتمدين",
		
		// Service Detail Page (Category Page)
		"serviceDetail.searchPlaceholder": "ابحث عن الخدمة التي تحتاجها",
		"serviceDetail.mainServicesTitle": "خدماتنا الرئيسية",
		"serviceDetail.keyServicesTitle": "أهم الخدمات",
		"serviceDetail.whyChooseUsTitle": "لماذا تختارنا",
		"serviceDetail.howItWorksTitle": "شاهد كيف نعمل",
		"serviceDetail.requestButton": "اطلب الخدمة",
		"serviceDetail.availableWorkshopsTitle": "الورش المتاحة",
		"serviceDetail.bookAppointment": "حجز موعد",
		"serviceDetail.features": "المميزات",
		"serviceDetail.benefits": "الفوائد",
		"serviceDetail.requestService": "اطلب الخدمة",
		
		// Individual Service Page
		"individualService.startsFrom": "يبدأ من",
		"individualService.sar": "ريال",
		"individualService.priceIncludes": "السعر يشمل الجصة وتقييم مستوى الطالب",
		"individualService.reviews": "تقييم",
		"individualService.serviceFeatures": "مميزات الخدمة",
		"individualService.serviceDetails": "تفاصيل الخدمة",
		"individualService.bookNow": "احجز موعدك الآن",
		"individualService.chooseLawyer": "اختيار المحامي",
		"individualService.status": "الحالة:",
		"individualService.availableNow": "متاح الآن",
		"individualService.responseTime": "وقت الاستجابة:",
		"individualService.within24Hours": "خلال 24 ساعة",
		"serviceDetail.name": "الاسم الكامل",
		"serviceDetail.namePlaceholder": "أدخل اسمك الكامل",
		"serviceDetail.phone": "رقم الهاتف",
		"serviceDetail.phonePlaceholder": "أدخل رقم هاتفك",
		"serviceDetail.email": "البريد الإلكتروني",
		"serviceDetail.emailPlaceholder": "أدخل بريدك الإلكتروني",
		"serviceDetail.address": "العنوان",
		"serviceDetail.addressPlaceholder": "أدخل عنوانك",
		"serviceDetail.notes": "ملاحظات إضافية",
		"serviceDetail.notesPlaceholder": "أضف أي ملاحظات أو تفاصيل إضافية",
		"serviceDetail.submit": "إرسال الطلب",
		"kaidhaForm.option.villa": "فيلا",
		"kaidhaForm.option.apartment": "شقة",
		"kaidhaForm.option.rent": "إيجار",
		"kaidhaForm.option.ownership": "تملك",
		"kaidhaForm.option.yes": "نعم",
		"kaidhaForm.option.no": "لا",

		// Profile Dashboard
		"profile.dashboard.title": "مرحباً بك في ملفك الشخصي",
		"profile.dashboard.subtitle": "اختر من القائمة الجانبية للوصول إلى مختلف أقسام ملفك الشخصي",
		"profile.dashboard.accountInfo": "معلومات الحساب",
		"profile.dashboard.accountInfoDesc": "عرض وتعديل معلوماتك الشخصية",
		"profile.dashboard.viewDetails": "عرض التفاصيل",
		"profile.dashboard.favorites": "المفضلة",
		"profile.dashboard.favoritesDesc": "المنتجات والمتاجر المفضلة لديك",
		"profile.dashboard.viewFavorites": "عرض المفضلة",
		"profile.dashboard.wallet": "محفظتي",
		"profile.dashboard.walletDesc": "إدارة رصيدك المالي",
		"profile.dashboard.viewWallet": "عرض المحفظة",
		"profile.dashboard.loading": "جاري التحميل...",

		// Profile Navigation
		"profile.navigation.accountInfo": "معلومات الحساب",
		"profile.navigation.addresses": "العناوين المحفوظة",
		"profile.navigation.favorites": "المفضلة لديك",
		"profile.navigation.stats": "إحصائياتي",
		"profile.navigation.wallet": "محفظتي",
		"profile.navigation.kaidhaWallet": "محفظة قيدها",
		"profile.navigation.points": "نقاطي",
		"profile.navigation.vouchers": "قسائمي",
		"profile.navigation.privacy": "سياسة الخصوصية",
		"profile.navigation.kaidhaTerms": "الشروط قيدها",
		"profile.navigation.terms": "الشروط والأحكام",
		"profile.navigation.support": "المساعدة والدعم",
		"profile.navigation.refund": "سياسة الاسترداد",
		"profile.navigation.logout": "تسجيل الخروج",

		// Profile Common
		"profile.common.loading": "جاري التحميل...",
		"profile.common.error": "حدث خطأ",
		"profile.common.success": "تم بنجاح",
		"profile.common.save": "حفظ",
		"profile.common.cancel": "إلغاء",
		"profile.common.edit": "تعديل",
		"profile.common.delete": "حذف",
		"profile.common.add": "إضافة",
		"profile.common.view": "عرض",
		"profile.common.back": "رجوع",
		"profile.common.next": "التالي",
		"profile.common.previous": "السابق",
		"profile.common.close": "إغلاق",
		"profile.common.confirm": "تأكيد",
		"profile.common.yes": "نعم",
		"profile.common.no": "لا",
	},
	en: {
		// Navbar
		"navbar.arabic": "العربية",
		"navbar.english": "English",

		// Company Name
		"company.name": "Shalla",

		// Landing Page
		"landing.welcome": "Welcome to Shalla",
		"landing.description": "Leading shopping and services platform",
		"landing.getStarted": "Get Started",
		"landing.learnMore": "Learn More",

		// Investore Page
		"investor.title": "Join as an investor in Shalla",
		"investor.downloadContract": "Download Contract Draft",
		"investor.benefits": "Benefits of Commercial Investment",
		"investor.benefit1":
			"Business investment helps ensure the company's long-term success.",
		"investor.benefit2":
			"Commercial investment helps create job opportunities.",
		"investor.benefit3":
			"Investing in startups can help boost economic growth.",
		"investor.benefit4": "Investing in startups can lead to innovation.",
		"investor.benefit5":
			"Commercial investment can help attract talented employees.",
		"investor.card1.title": "Achieve long-term returns through investment",
		"investor.card1.description":
			"You will get long-term returns as long as you remain an investor with us at Shalla",
		"investor.card2.title": "Well-planned annual profits",
		"investor.card2.description":
			"Increase your capital by investing in our company and get rewarding annual amounts",

		// Investore Form
		"form.firstName": "First Name",
		"form.fatherName": "Father's Name",
		"form.familyName": "Family Name",
		"form.grandfatherName": "Grandfather's Name",
		"form.birthDate": "Birth Date",
		"form.nationalId": "National ID",
		"form.email": "Email",
		"form.phone": "Phone Number",
		"form.nationalAddressEmail": "National Address Email",
		"form.region": "Region",
		"form.iban": "IBAN Number",
		"form.bankName": "Bank Name",
		"form.amount": "Investment Amount",
		"form.agreeTerms": "Agree to all",
		"form.termsAndConditions": "Terms and Conditions",
		"form.showContract": "Show Contract",
		"form.creatingContract": "Creating Contract...",
		"form.editData": "Edit Data",
		"form.nafathAuth": "Nafath Authentication",
		"form.sending": "Sending...",
		"form.close": "Close",
		"form.loadingContract": "Loading Contract...",
		"form.fillAllFields": "Please fill in all required fields",
		"form.agreeToTerms": "Please agree to the terms and conditions",
		"form.contractError": "An error occurred while creating the contract",
		"form.nafathSent": "Authentication request sent. Please select the number",
		"form.nafathOnApp": "on the Nafath app on your phone.",
		"form.nafathSuccess": "✅ Successfully authenticated via Nafath",
		"form.nafathRejected": "❌ Nafath authentication was rejected",
		"form.nafathError":
			"An error occurred while starting Nafath authentication",

		// Partner Page
		"partner.title": "Join as a Trading Partner",
		"partner.subtitle":
			"Join us and increase your sales with maximum benefit from our premium services",
		"partner.benefits": "Benefits of joining as a trading partner in",
		"partner.benefit1.title": "Exceptional opportunity for Shalla partners",
		"partner.benefit1.description":
			"Launch your business to the top with a complete growth package worth 5400 SAR, completely free!",
		"partner.benefit2.title":
			"Your store boundaries are now the boundaries of the Kingdom",
		"partner.benefit2.description":
			"Launch your products to every city and village",
		"partner.benefit3.title": "Double your profits and increase your sales",
		"partner.benefit3.description": "Join the world of Shalla stores today!",
		"partner.benefit4.title": "Goodbye to shipping worries",
		"partner.benefit4.description":
			"Welcome to a new era of trust and super speed with the Shalla app",
		"partner.benefit5.title": "Sales statistics with Shalla",
		"partner.benefit5.description":
			"Your precise compass towards smarter decisions and higher profits",
		"partner.benefit6.title": "Creativity in your work",
		"partner.benefit6.description":
			"You can manage everything from the app to your customers",
		"partner.benefit7.title": "Manage your operations effectively",
		"partner.benefit7.description":
			"Instant notification feature for new orders in the Shalla app for merchants",
		"partner.newsletter.title": "Subscribe to our newsletter",
		"partner.newsletter.description":
			"Would you like to receive the latest news and information about the Shalla app",
		"partner.newsletter.subscribe": "Enter your email here so we can reach you",
		"partner.newsletter.button": "Subscribe",

		// Partner Form
		"partnerForm.storeInfo": "Store Information",
		"partnerForm.storeClassification": "Store Classification",
		"partnerForm.storeName": "Store Name",
		"partnerForm.city": "City",
		"partnerForm.whatOffers": "What does your store offer?",
		"partnerForm.phoneNumber": "Phone Number",
		"partnerForm.branchCount": "Number of store branches",
		"partnerForm.personalId": "Personal ID / Residence Number",
		"partnerForm.idImage": "ID / Residence Image",
		"partnerForm.municipalLicense": "Municipal License (if available)",
		"partnerForm.storefrontImage": "Store Front / Logo Image",
		"partnerForm.location": "Store location on map",
		"partnerForm.searchLocation": "Search for location...",
		"partnerForm.myLocation": "📍 My Location",
		"partnerForm.loadingMap": "Loading map...",
		"partnerForm.agreeTerms": "Agree to all",
		"partnerForm.termsAndConditions": "Terms and Conditions",
		"partnerForm.submit": "Submit",
		"partnerForm.reset": "Reset",
		"partnerForm.fillAllFields": "Please fill in all required fields",
		"partnerForm.agreeToTerms": "Please agree to the terms and conditions",
		"partnerForm.idTooLong": "National ID is longer than 10 digits",
		"partnerForm.success": "Data registered successfully!",
		"partnerForm.error": "An error occurred during registration",
		"partnerForm.submitError": "An error occurred while registering data",
		"partnerForm.idUploadSuccess": "ID image uploaded successfully",
		"partnerForm.licenseUploadSuccess": "License image uploaded successfully",
		"partnerForm.storeUploadSuccess": "Store/logo image uploaded successfully",
		"partnerForm.locationError": "Failed to determine your location 😢",
		"partnerForm.locationNotSupported":
			"Browser does not support location detection",
		"partnerForm.placeholder.supermarket": "Supermarket",
		"partnerForm.placeholder.storeName": "Enter your store name",
		"partnerForm.placeholder.saudi": "Saudi Arabia",
		"partnerForm.placeholder.services":
			"What services do you provide if you don't find a store classification",
		"partnerForm.placeholder.branches": "3",
		"partnerForm.placeholder.idExample": "EX:1234567890",

		// Driver Page
		"driver.title": "Join as a delivery agent",
		"driver.benefits": "Benefits of joining as a delivery agent in",
		"driver.card1.title": "Enjoy low service fees",
		"driver.card1.description":
			"You will get a long-term return as long as you remain an investor with us in Shalla",
		"driver.card1.more": "for more",
		"driver.card2.title": "Connected anytime",
		"driver.card2.description":
			"Enjoy the freedom to work at times that suit you and you will be able to manage your work and other responsibilities",
		"driver.card2.more": "for more",

		// Driver Form
		"driverForm.driverInfo": "Delivery agent information",
		"driverForm.firstName": "First name",
		"driverForm.lastName": "Last name",
		"driverForm.deliveryType": "Delivery agent type",
		"driverForm.vehicleType": "Vehicle type",
		"driverForm.idType": "ID type",
		"driverForm.personalId": "Personal ID / Residence number",
		"driverForm.phoneNumber": "Phone number",
		"driverForm.region": "Region",
		"driverForm.idImage": "ID / Residence image",
		"driverForm.driverLicense": "Driver license",
		"driverForm.vehicleRegistration": "Vehicle registration",
		"driverForm.personalPhoto": "Personal photo",
		"driverForm.agreeTerms": "Agree to all",
		"driverForm.termsAndConditions": "Terms and conditions",
		"driverForm.submit": "Submit",
		"driverForm.reset": "Reset",
		"driverForm.fillAllFields": "Please fill in all required fields",
		"driverForm.agreeToTerms": "Please agree to the terms and conditions",
		"driverForm.idTooLong": "National ID is longer than 10 digits",
		"driverForm.success": "Data registered successfully!",
		"driverForm.error": "An error occurred during registration",
		"driverForm.submitError": "An error occurred while registering data",
		"driverForm.idUploadSuccess": "ID image uploaded successfully",
		"driverForm.licenseUploadSuccess": "License image uploaded successfully",
		"driverForm.registrationUploadSuccess":
			"Registration image uploaded successfully",
		"driverForm.photoUploadSuccess": "Personal photo uploaded successfully",
		"driverForm.placeholder.firstName": "Ahmed",
		"driverForm.placeholder.lastName": "Khalaf",
		"driverForm.placeholder.region": "Jeddah",
		"driverForm.placeholder.idExample": "EX:1234567890",
		"driverForm.placeholder.choose": "-- Choose --",
		"driverForm.option.freelance": "Freelance",
		"driverForm.option.employee": "Employee",
		"driverForm.option.motorcycle": "Motorcycle",
		"driverForm.option.car": "Car",
		"driverForm.option.bicycle": "Bicycle",
		"driverForm.option.nationalId": "National ID card",
		"driverForm.option.residence": "Residence",

		// Worker Page
		"worker.title": "Join as a service provider",
		"worker.benefits": "Benefits of joining as a service provider in",
		"worker.card1.title": "Enjoy competitive service fees",
		"worker.card1.description":
			"Enjoy competitive service fees when receiving each order and choose orders near you",
		"worker.card2.title": "Connected anytime",
		"worker.card2.description":
			"Enjoy the freedom to work at times that suit you and you will be able to manage your work and other responsibilities",

		// Worker Form
		"workerForm.workerInfo": "Service provider information",
		"workerForm.firstName": "First name",
		"workerForm.lastName": "Last name",
		"workerForm.email": "Email",
		"workerForm.workType": "Type of work you specialize in",
		"workerForm.region": "Region",
		"workerForm.vehicleType": "Vehicle type",
		"workerForm.idType": "ID type",
		"workerForm.personalId": "Personal ID / Residence number",
		"workerForm.idImage": "ID / Residence image",
		"workerForm.driverLicense": "Driver license (if available)",
		"workerForm.vehicleRegistration": "Vehicle registration (if available)",
		"workerForm.personalPhoto": "Personal photo",
		"workerForm.agreeTerms": "Agree to all",
		"workerForm.termsAndConditions": "Terms and conditions",
		"workerForm.submit": "Submit",
		"workerForm.reset": "Reset",
		"workerForm.fillAllFields": "Please fill in all required fields",
		"workerForm.agreeToTerms": "Please agree to the terms and conditions",
		"workerForm.idTooLong": "National ID is longer than 10 digits",
		"workerForm.success": "Data registered successfully!",
		"workerForm.error": "An error occurred during registration",
		"workerForm.submitError": "An error occurred while registering data",
		"workerForm.idUploadSuccess": "ID image uploaded successfully",
		"workerForm.licenseUploadSuccess": "License image uploaded successfully",
		"workerForm.registrationUploadSuccess":
			"Registration image uploaded successfully",
		"workerForm.photoUploadSuccess": "Personal photo uploaded successfully",
		"workerForm.placeholder.firstName": "Ahmed",
		"workerForm.placeholder.lastName": "Khalaf",
		"workerForm.placeholder.email": "ex@example.com",
		"workerForm.placeholder.region": "Jeddah",
		"workerForm.placeholder.idExample": "EX:1234567890",
		"workerForm.placeholder.choose": "-- Choose --",
		"workerForm.option.foodDelivery": "Food delivery",
		"workerForm.option.supermarketShopping": "Supermarket shopping",
		"workerForm.option.homeServices": "Home services",
		"workerForm.option.other": "Other",
		"workerForm.option.motorcycle": "Motorcycle",
		"workerForm.option.car": "Car",
		"workerForm.option.bicycle": "Bicycle",
		"workerForm.option.noVehicle": "None",
		"workerForm.option.residence": "Residence",
		"workerForm.option.nationalId": "National ID card",

		// Landing Page
		"landing.hero.title":
			"All your needs at the click of a button",
		"landing.hero.subtitle": "More than 60,000 restaurants and stores",
		"landing.hero.browseButton": "Browse Now",
		"landing.mobileApp.title": "Mobile App",
		"landing.mobileApp.subtitle":
			"Download Shalla app on your phone and order with one click",
		"landing.qaydha.title": "With Qaydha",
		"landing.qaydha.subtitle": "Don't count how much is left until payday",
		"landing.qaydha.description":
			"See what you need at home and we'll give you on salary!",
		"landing.qaydha.registerButton": "Register Now",
		"landing.qaydha.learnMoreButton": "Learn More",
		"landing.tiles.partner.title": "Register your restaurant or store",
		"landing.tiles.partner.desc":
			"Expand your business by reaching more customers with us.",
		"landing.tiles.driver.title": "Register as a delivery agent",
		"landing.tiles.driver.desc":
			"Be a delivery agent and earn extra income with us, register now!",
		"landing.tiles.investor.title": "Register now as an investor in Shalla",
		"landing.tiles.investor.desc":
			"Invest in our company and learn about investment benefits.",
		"landing.tiles.worker.title": "Register as a service provider",
		"landing.tiles.worker.desc":
			"Register according to your profession with us and earn extra income.",
		"landing.tiles.registerNow": "Register Now",

		// Footer
		"footer.downloadApp": "Download the App",
		"footer.downloadSubtitle": "Get everything you need from restaurants and supermarkets and more with our premium services",
		"footer.companyDescription": "Shella is a Saudi establishment licensed by the Ministry of Commerce to practice marketing activities for others and retail and wholesale sales for individuals and establishments with commercial registration number 1009128112 with a capital of 50 million Saudi riyals",
		"footer.company": "Company",
		"footer.aboutUs": "About Shella",
		"footer.careers": "Careers",
		"footer.faq": "FAQ",
		"footer.islamicLaw": "Islamic Law",
		"footer.legal": "Legal",
		"footer.kaidhaTerms": "Qaydha Terms",
		"footer.privacyPolicy": "Privacy Policy",
		"footer.termsConditions": "Terms and Conditions",
		"footer.violations": "Report Violations",
		"footer.application": "Application",
		"footer.joinAsDriver": "Join as Delivery Agent",
		"footer.joinAsPartner": "Join as Partner Merchant",
		"footer.joinAsWorker": "Join as Service Provider",
		"footer.joinAsInvestor": "Join as Investor with Us",
		"footer.customerService": "Customer Service",
		"footer.customerTestimonials": "Customer Testimonials",
		"footer.contactUs": "Contact Us",
		"footer.copyright": "ShellaKsa 2024",

		// Kaidha Page
		"kaidha.description":
			'The "Qaydha" service provides an innovative platform that redefines the concept of consumer financing, offering users unprecedented flexibility in paying for their food and consumer goods purchases. "Qaydha" is based on the principle of "buy now, pay with salary", enabling individuals to meet their basic needs without worrying about cash availability at the time of purchase. "Qaydha" represents a qualitative shift in the concept of consumer financing, providing unprecedented flexibility and contributing to improving the purchasing power of individuals. Through responsible dealing and financial awareness, "Qaydha" can contribute to achieving financial stability and economic well-being for users.',

		// Kaidha Form
		"kaidhaForm.title": "Kaidha Service Registration Form",
		"kaidhaForm.subtitle": "Please fill in all required fields accurately",
		"kaidhaForm.personalInfo": "Personal Information",
		"kaidhaForm.firstName": "First Name",
		"kaidhaForm.lastName": "Last Name",
		"kaidhaForm.fatherName": "Father's Name",
		"kaidhaForm.grandFatherName": "Grandfather's Name",
		"kaidhaForm.birthDate": "Birth Date",
		"kaidhaForm.nationality": "Nationality",
		"kaidhaForm.socialStatus": "Marital Status",
		"kaidhaForm.familyMembersCount": "Number of Family Members",
		"kaidhaForm.idType": "ID Type",
		"kaidhaForm.personalIdNumber": "ID Number",
		"kaidhaForm.idExpirationDate": "Expiration Date",
		"kaidhaForm.phoneNumber": "Phone Number",
		"kaidhaForm.whatsappNumber": "WhatsApp Number",
		"kaidhaForm.email": "Email",
		"kaidhaForm.homeType": "Home Type",
		"kaidhaForm.homeNature": "Home Nature",
		"kaidhaForm.city": "City",
		"kaidhaForm.neighborhood": "Neighborhood",
		"kaidhaForm.addressDetails": "Detailed Home Address",
		"kaidhaForm.homeLocation": "Locate Home on Map",
		"kaidhaForm.workInfo": "Work Information",
		"kaidhaForm.companyName": "Company Name",
		"kaidhaForm.jobTitle": "Job Title",
		"kaidhaForm.yearsOfExperience": "Years of Experience",
		"kaidhaForm.grossSalary": "Gross Salary",
		"kaidhaForm.workAddress": "Detailed Work Address",
		"kaidhaForm.workLocation": "Locate Work on Map",
		"kaidhaForm.installments": "Do you have installments",
		"kaidhaForm.addInstallment": "Add Installment",
		"kaidhaForm.commitmentAmount": "Commitment Amount",
		"kaidhaForm.entityName": "Entity Name",
		"kaidhaForm.additionalInfo": "Additional Information",
		"kaidhaForm.additionalIncome": "Additional Income Sources",
		"kaidhaForm.additionalAmount": "Amount",
		"kaidhaForm.incomeSource": "Income Source",
		"kaidhaForm.submit": "Submit",
		"kaidhaForm.reset": "Reset",
		"kaidhaForm.fillAllFields": "Please fill in all required fields",
		"kaidhaForm.birthDateError": "Birth date must be before 2005-12-31",
		"kaidhaForm.success": "Data registered successfully!",
		"kaidhaForm.error": "An error occurred while registering data",
		"kaidhaForm.locationError": "Failed to determine your location 😢",
		"kaidhaForm.locationNotSupported":
			"Browser does not support location detection",
		"kaidhaForm.searchLocation": "Search for location...",
		"kaidhaForm.myLocation": "📍 My Location",
		"kaidhaForm.loadingMap": "Loading map...",
		"kaidhaForm.locationSelected": "Location Selected",
		"kaidhaForm.placeholder.nationality": "Saudi",
		"kaidhaForm.placeholder.idNumber": "001447888554",
		"kaidhaForm.placeholder.city": "Riyadh",
		"kaidhaForm.placeholder.neighborhood": "Al-Ghurub District",
		"kaidhaForm.placeholder.address": "Jeddah, Street 500 Branch 2",
		"kaidhaForm.placeholder.email": "example@example.com",
		"kaidhaForm.placeholder.choose": "-- Choose --",
		"kaidhaForm.option.single": "Single",
		"kaidhaForm.option.married": "Married",
		"kaidhaForm.option.nationalId": "National ID Card",
		"kaidhaForm.option.passport": "Passport",

		// Register Page
		"register.title": "Create New Account",
		"register.subtitle": "Register with us for the best shopping experience",
		"register.personalInfo": "Personal Information",
		"register.fullName": "Full Name",
		"register.phoneNumber": "Phone Number",
		"register.birthDate": "Birth Date",
		"register.accountInfo": "Account Information",
		"register.email": "Email",
		"register.password": "Password",
		"register.confirmPassword": "Confirm Password",
		"register.address": "Address",
		"register.selectLocation": "Select your location on the map",
		"register.selectedAddress": "Selected Address",
		"register.coordinates": "Coordinates",
		"register.cancel": "Cancel",
		"register.confirm": "Confirm",
		"register.submit": "Register",
		"register.haveAccount": "Already have an account?",
		"register.loginLink": "Login",

		// Login Page
		"login.title": "Login",
		"login.subtitle": "Welcome back! Login to continue",
		"login.email": "Email",
		"login.password": "Password",
		"login.submit": "Login",
		"login.noAccount": "Don't have an account?",
		"login.registerLink": "Create New Account",

		// ServeMe Page
		"serveMe.title": "Fast and Reliable Delivery Service",
		"serveMe.subtitle": "We provide you with the right services and security. Choose your suitable service and leave the rest to us",
		"serveMe.searchPlaceholder": "Search for a specific service",
		"serveMe.servicesTitle": "Choose from a wide range of services",
		"serveMe.requestService": "Request Service",
		
		// Services
		"serveMe.carMaintenance": "Car Maintenance",
		"serveMe.homeMaintenance": "Home Maintenance",
		"serveMe.educationTutoring": "Education & Tutoring",
		"serveMe.babysitting": "Babysitting",
		"serveMe.womenSalons": "Women's Salons",
		"serveMe.menSalons": "Men's Salons",
		"serveMe.legal": "Legal Services",
		"serveMe.travelTourism": "Travel & Tourism",
		"serveMe.pickAndOrder": "Pick & Order",
		"serveMe.construction": "Construction Materials",
		
		// Features
		"serveMe.features.coverage": "Wide Coverage",
		"serveMe.features.coverageDesc": "We reach you wherever you are with service providers",
		"serveMe.features.support": "Continuous Support",
		"serveMe.features.supportDesc": "Continuous support around the clock",
		"serveMe.features.reliable": "Reliable Service",
		"serveMe.features.reliableDesc": "Best quality service from certified providers",
		
		// Service Detail Page (Category Page)
		"serviceDetail.searchPlaceholder": "Search for the service you need",
		"serviceDetail.mainServicesTitle": "Our Main Services",
		"serviceDetail.keyServicesTitle": "Key Services",
		"serviceDetail.whyChooseUsTitle": "Why Choose Us",
		"serviceDetail.howItWorksTitle": "See How We Work",
		"serviceDetail.requestButton": "Request Service",
		"serviceDetail.availableWorkshopsTitle": "Available Workshops",
		"serviceDetail.bookAppointment": "Book Appointment",
		"serviceDetail.features": "Features",
		"serviceDetail.benefits": "Benefits",
		"serviceDetail.requestService": "Request Service",
		
		// Individual Service Page
		"individualService.startsFrom": "Starts from",
		"individualService.sar": "SAR",
		"individualService.priceIncludes": "Price includes session and student assessment",
		"individualService.reviews": "reviews",
		"individualService.serviceFeatures": "Service Features",
		"individualService.serviceDetails": "Service Details",
		"individualService.bookNow": "Book Your Appointment Now",
		"individualService.chooseLawyer": "Choose Lawyer",
		"individualService.status": "Status:",
		"individualService.availableNow": "Available Now",
		"individualService.responseTime": "Response Time:",
		"individualService.within24Hours": "Within 24 hours",
		"serviceDetail.name": "Full Name",
		"serviceDetail.namePlaceholder": "Enter your full name",
		"serviceDetail.phone": "Phone Number",
		"serviceDetail.phonePlaceholder": "Enter your phone number",
		"serviceDetail.email": "Email",
		"serviceDetail.emailPlaceholder": "Enter your email",
		"serviceDetail.address": "Address",
		"serviceDetail.addressPlaceholder": "Enter your address",
		"serviceDetail.notes": "Additional Notes",
		"serviceDetail.notesPlaceholder": "Add any additional notes or details",
		"serviceDetail.submit": "Submit Request",
		"kaidhaForm.option.villa": "Villa",
		"kaidhaForm.option.apartment": "Apartment",
		"kaidhaForm.option.rent": "Rent",
		"kaidhaForm.option.ownership": "Ownership",
		"kaidhaForm.option.yes": "Yes",
		"kaidhaForm.option.no": "No",

		// Profile Dashboard
		"profile.dashboard.title": "Welcome to Your Profile",
		"profile.dashboard.subtitle": "Choose from the sidebar to access different sections of your profile",
		"profile.dashboard.accountInfo": "Account Information",
		"profile.dashboard.accountInfoDesc": "View and edit your personal information",
		"profile.dashboard.viewDetails": "View Details",
		"profile.dashboard.favorites": "Favorites",
		"profile.dashboard.favoritesDesc": "Your favorite products and stores",
		"profile.dashboard.viewFavorites": "View Favorites",
		"profile.dashboard.wallet": "My Wallet",
		"profile.dashboard.walletDesc": "Manage your financial balance",
		"profile.dashboard.viewWallet": "View Wallet",
		"profile.dashboard.loading": "Loading...",

		// Profile Navigation
		"profile.navigation.accountInfo": "Account Information",
		"profile.navigation.addresses": "Saved Addresses",
		"profile.navigation.favorites": "My Favorites",
		"profile.navigation.stats": "My Statistics",
		"profile.navigation.wallet": "My Wallet",
		"profile.navigation.kaidhaWallet": "Kaidha Wallet",
		"profile.navigation.points": "My Points",
		"profile.navigation.vouchers": "My Vouchers",
		"profile.navigation.privacy": "Privacy Policy",
		"profile.navigation.kaidhaTerms": "Kaidha Terms",
		"profile.navigation.terms": "Terms & Conditions",
		"profile.navigation.support": "Help & Support",
		"profile.navigation.refund": "Refund Policy",
		"profile.navigation.logout": "Logout",

		// Profile Common
		"profile.common.loading": "Loading...",
		"profile.common.error": "An error occurred",
		"profile.common.success": "Success",
		"profile.common.save": "Save",
		"profile.common.cancel": "Cancel",
		"profile.common.edit": "Edit",
		"profile.common.delete": "Delete",
		"profile.common.add": "Add",
		"profile.common.view": "View",
		"profile.common.back": "Back",
		"profile.common.next": "Next",
		"profile.common.previous": "Previous",
		"profile.common.close": "Close",
		"profile.common.confirm": "Confirm",
		"profile.common.yes": "Yes",
		"profile.common.no": "No",
	},
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<Language>("ar");
	const [isLoaded, setIsLoaded] = useState(false);

	// تحميل اللغة من localStorage عند التحميل الأول
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("language") as Language;
			if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
				setLanguage(savedLanguage);
			}
			setIsLoaded(true);
		}
	}, []);

	// حفظ اللغة في localStorage عند تغييرها
	useEffect(() => {
		if (isLoaded && typeof window !== "undefined") {
			localStorage.setItem("language", language);
		}
	}, [language, isLoaded]);

	const t = (key: string): string => {
		// إذا لم يتم تحميل اللغة بعد، استخدم العربية كافتراضي
		if (!isLoaded) {
			return (
				translations["ar"][key as keyof (typeof translations)["ar"]] || key
			);
		}
		return (
			translations[language][
				key as keyof (typeof translations)[typeof language]
			] || key
		);
	};

	// تحديث dir و lang في HTML
	useEffect(() => {
		if (isLoaded && typeof window !== "undefined") {
			document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
			document.documentElement.lang = language;

			// تحديث title أيضاً
			document.title =
				language === "ar"
					? "شلة - منصة التسوق والخدمات"
					: "Shalla - Shopping and Services Platform";
		}
	}, [language, isLoaded]);

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
