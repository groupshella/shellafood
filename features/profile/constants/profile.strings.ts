/** Bilingual profile copy — resolve with `isArabic ? x.ar : x.en` at the call site. */
export type LocaleCopy = { ar: string; en: string };

export const PROFILE_STRINGS = {
	pageTitle: { ar: "حسابي", en: "My account" },
	accountSettings: { ar: "إعدادات الحساب", en: "Account settings" },
	welcome: (name: string): LocaleCopy => ({
		ar: `أهلاً ${name}`,
		en: `Hello ${name}`,
	}),
	yourPoints: { ar: "نقاطك", en: "Your points" },
	myWallet: { ar: "محفظتي", en: "My wallet" },
	qidhaWallet: { ar: "محفظة قيدها", en: "Qidha wallet" },
	earnPointsNow: { ar: "اربح نقاط الآن", en: "Earn points now" },
	addBalanceNow: { ar: "أضف رصيد الآن", en: "Add balance now" },
	subscribeNow: { ar: "اشترك الآن", en: "Subscribe now" },
	sectionMyAccount: { ar: "حسابي", en: "My account" },
	deliveryAddresses: { ar: "عناوين التوصيل", en: "Delivery addresses" },
	language: { ar: "اللغة", en: "Language" },
	languageAr: {
		ar: "العربية (المملكة العربية السعودية)",
		en: "Arabic (Saudi Arabia)",
	},
	languageEn: { ar: "English (US)", en: "English (US)" },
	darkMode: { ar: "تفعيل الوضع الداكن", en: "Enable dark mode" },
	notifications: { ar: "الإشعارات", en: "Notifications" },
	sectionPromo: {
		ar: "النشاط الترويجي والأرباح",
		en: "Promotions and earnings",
	},
	coupons: { ar: "الكوبونات", en: "Coupons" },
	statistics: { ar: "إحصائيات", en: "Statistics" },
	earnWithFriends: {
		ar: "اكسب مع مشاركة الأصدقاء",
		en: "Earn by inviting friends",
	},
	joinAsDriver: { ar: "انضم كرجل توصيل", en: "Join as a delivery driver" },
	voucherRep: {
		ar: "مندوب تسويق قسائم شرائية",
		en: "Voucher marketing rep",
	},
	sectionHelp: { ar: "المساعدة والدعم", en: "Help & support" },
	liveChat: { ar: "الدردشة الحية", en: "Live chat" },
	technicalSupport: {
		ar: "المساعدة والدعم الفني",
		en: "Help & technical support",
	},
	checkUpdates: { ar: "التحقق من التحديثات", en: "Check for updates" },
	aboutUs: { ar: "معلومات عنا", en: "About us" },
	sectionLegal: { ar: "المستندات القانونية", en: "Legal documents" },
	privacy: { ar: "الخصوصية", en: "Privacy" },
	terms: { ar: "الشروط والأحكام", en: "Terms and conditions" },
	refundPolicy: { ar: "سياسة استرداد الأموال", en: "Refund policy" },
	logout: { ar: "تسجيل الخروج", en: "Log out" },
	editTitle: { ar: "إعدادات الحساب", en: "Account settings" },
	name: { ar: "الاسم", en: "Name" },
	email: { ar: "البريد الالكتروني", en: "Email" },
	phone: { ar: "رقم الهاتف", en: "Phone number" },
	phoneNotEditable: { ar: "(غير قابل للتعديل)", en: "(not editable)" },
	gender: { ar: "الجنس", en: "Gender" },
	selectGender: { ar: "اختار الجنس", en: "Select gender" },
	genderMale: { ar: "ذكر", en: "Male" },
	genderFemale: { ar: "أنثى", en: "Female" },
	deleteAccount: { ar: "حذف الحساب", en: "Delete account" },
	save: { ar: "حفظ", en: "Save" },
	genderPageTitle: { ar: "تحديد الجنس", en: "Select gender" },
	chooseGender: { ar: "اختر جنسك", en: "Choose your gender" },
	genderHelper: {
		ar: "نستخدم هذه المعلومة لتحسين تجربتك داخل التطبيق.",
		en: "We use this to improve your experience in the app.",
	},
	photoTitle: { ar: "صورة الملف الشخصي", en: "Profile photo" },
	photoGuidanceTitle: {
		ar: "يرجى التأكد من أن الصورة:",
		en: "Please make sure the photo:",
	},
	photoGuidance1: {
		ar: "لا توجد بالصورة أي ضبابية والإضاءة بها جيدة",
		en: "Is clear and well lit",
	},
	photoGuidance2: {
		ar: "دون نظارات أو قبعات أو أي اكسسوارات أخرى",
		en: "Has no glasses, hats, or other accessories",
	},
	deleteTitle: { ar: "حذف الحساب", en: "Delete account" },
	deleteIntro: {
		ar: "يرجى مراجعة المعلومات التالية بعناية قبل حذف حسابك.",
		en: "Please review the following carefully before deleting your account.",
	},
	deleteBody: {
		ar: "سيؤدي هذا الإجراء إلى حذف حسابك بشكل نهائي، بالإضافة إلى إزالة بعض البيانات المرتبطة به، مثل:",
		en: "This will permanently delete your account and remove related data, such as:",
	},
	deleteWarning: {
		ar: "لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.",
		en: "This action cannot be undone.",
	},
	deleteAgree: {
		ar: "لقد قرأت البيان أعلاه وأوافق عليه",
		en: "I have read and agree to the statement above",
	},
	logoutConfirmTitle: {
		ar: "هل أنت متأكد أنك تريد تسجيل الخروج ؟",
		en: "Are you sure you want to log out?",
	},
	logoutConfirmYes: { ar: "نعم ، تسجيل خروج", en: "Yes, log out" },
	cancel: { ar: "إلغاء", en: "Cancel" },
	loginRequiredTitle: {
		ar: "هذه الخدمة تتطلب تسجيل دخول",
		en: "This service requires sign-in",
	},
	loginRequiredSubtitle: {
		ar: "الرجاء تسجيل الدخول للاستمتاع بخدمتك",
		en: "Please sign in to continue",
	},
	login: { ar: "تسجيل الدخول", en: "Sign in" },
	qidhaSubscribeTitle: {
		ar: "الاشتراك في قيدها المطلوب",
		en: "Qidha subscription required",
	},
	qidhaSubscribeBody: {
		ar: "لاستخدام محفظة قيدها ، يجب الاشتراك وتفعيل المحفظة أولاً",
		en: "To use the Qidha wallet, you must subscribe and activate it first",
	},
	updateSuccess: {
		ar: "تم حفظ التغييرات بنجاح",
		en: "Changes saved successfully",
	},
	updateError: {
		ar: "تعذر حفظ التغييرات، حاول مرة أخرى",
		en: "Could not save changes. Please try again",
	},
	deleteSuccess: { ar: "تم حذف حسابك", en: "Your account was deleted" },
	deleteError: {
		ar: "تعذر حذف الحساب، حاول مرة أخرى",
		en: "Could not delete account. Please try again",
	},
	requiredField: { ar: "هذا الحقل مطلوب", en: "This field is required" },
	invalidPhoto: {
		ar: "يرجى اختيار صورة JPG أو PNG بحجم أقل من 5 ميجابايت",
		en: "Please choose a JPG or PNG under 5MB",
	},
	invalidEmail: {
		ar: "يرجى إدخال بريد إلكتروني صحيح",
		en: "Please enter a valid email",
	},
	invalidName: { ar: "يرجى إدخال الاسم", en: "Please enter your name" },
	missingPhone: {
		ar: "رقم الهاتف غير متوفر في حسابك",
		en: "Phone number is missing from your account",
	},
} as const;

export type AppLocale = "ar" | "en";

export const LOCALE_LABELS: Record<AppLocale, LocaleCopy> = {
	ar: PROFILE_STRINGS.languageAr,
	en: PROFILE_STRINGS.languageEn,
};
