import type { LocaleCopy } from "@/features/profile/constants/profile.strings";

/** Join-as-driver / voucher-rep registration copy — resolve with isArabic ? x.ar : x.en. */
export const JOIN_STRINGS = {
	driverTitle: { ar: "انضم كرجل توصيل", en: "Join as a delivery driver" },
	driverSubtitle: {
		ar: "خطوات بسيطة لتكون بمثابة رجل التسليم",
		en: "Simple steps to become a delivery driver",
	},
	voucherTitle: { ar: "انضم كمندوب تسويق", en: "Join as a marketing rep" },
	voucherSubtitle: {
		ar: "خطوات بسيطة لتصبح مندوب تسويق قسائم شرائية",
		en: "Simple steps to become a voucher marketing representative",
	},

	yourProfile: { ar: "ملفك التعريفي", en: "Your profile" },
	personalId: { ar: "الهوية الشخصية", en: "Personal ID" },
	documents: { ar: "المستندات", en: "Documents" },
	documentsDesc: {
		ar: "يرجى رفع صورة الهوية أو عقد الإيجار، مع التأكد من وضوح المستند وكتابة اسم الملف بشكل صحيح.",
		en: "Please upload an ID photo or lease agreement. Make sure the document is clear and named correctly.",
	},

	firstName: { ar: "الاسم الأول", en: "First name" },
	lastName: { ar: "اسم العائلة", en: "Last name" },
	email: { ar: "البريد الالكتروني", en: "Email" },
	password: { ar: "كلمة المرور", en: "Password" },
	confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm password" },
	phone: { ar: "رقم الهاتف", en: "Phone number" },

	addProfilePhoto: {
		ar: "أضف صورة لملفك التعريفي",
		en: "Add a profile photo",
	},
	addIdPhoto: { ar: "أضف صورة للهوية الشخصية", en: "Add an ID photo" },
	chooseFile: { ar: "اختر ملفاً وأضفه", en: "Choose a file" },
	uploadHelper: {
		ar: "برجاء التأكد أن الصورة واضحة وبحد أقصى 2 ميجا.",
		en: "Please make sure the image is clear and under 2MB.",
	},

	chooseWorkType: { ar: "اختر نوع العمل", en: "Choose work type" },
	chooseAddress: { ar: "اختر العنوان", en: "Choose address" },
	chooseDeliveryMethod: {
		ar: "اختر وسيلة التوصيل",
		en: "Choose delivery method",
	},
	chooseIdType: { ar: "اختر نوع الهوية", en: "Choose ID type" },

	agreeTerms: {
		ar: "أوافق على الشروط وسياسة الخصوصية",
		en: "I agree to the terms and privacy policy",
	},

	send: { ar: "ارسال", en: "Submit" },

	fileName: { ar: "اسم الصورة", en: "File name" },
	fileSize: (size: string): LocaleCopy => ({
		ar: `حجم الصورة ${size}`,
		en: `File size ${size}`,
	}),

	successTitle: {
		ar: "تم إرسال طلب انضمامك بنجاح",
		en: "Your join request was sent successfully",
	},
	successSubtitle: {
		ar: "وسيتم التواصل معك قريباً",
		en: "We will contact you soon",
	},

	fileTooLarge: {
		ar: "حجم الملف يجب ألا يتجاوز 2 ميجا",
		en: "File size must not exceed 2MB",
	},
	requiredField: { ar: "هذا الحقل مطلوب", en: "This field is required" },
	passwordMismatch: {
		ar: "كلمتا المرور غير متطابقتين",
		en: "Passwords do not match",
	},
	mustAgreeTerms: {
		ar: "يجب الموافقة على الشروط وسياسة الخصوصية",
		en: "You must agree to the terms and privacy policy",
	},

	invalidPhone: {
		ar: "صيغة رقم الهاتف غير صالحة",
		en: "Invalid phone number format",
	},
	invalidEmail: {
		ar: "صيغة البريد الإلكتروني غير صالحة",
		en: "Invalid email format",
	},
	minPassword: {
		ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
		en: "Password must be at least 6 characters",
	},
	passwordLetters: {
		ar: "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل",
		en: "Password must contain at least one letter",
	},
	alreadyRegistered: {
		ar: "هذا الحساب مسجل مسبقاً",
		en: "This account is already registered",
	},
	metaLoadError: {
		ar: "تعذر تحميل البيانات. اضغط لإعادة المحاولة",
		en: "Could not load data. Tap to retry",
	},
	networkError: {
		ar: "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى",
		en: "Could not reach the server. Check your connection and try again",
	},

	dropdownPlaceholder: { ar: "مثال", en: "Example" },

	statusNone: { ar: "غير مسجّل", en: "Not registered" },
	statusPending: { ar: "قيد المراجعة", en: "Pending" },
	statusApproved: { ar: "مقبول", en: "Approved" },
	statusActive: { ar: "نشط", en: "Active" },
	statusRejected: { ar: "مرفوض", en: "Rejected" },
	statusRegistered: { ar: "مسجّل", en: "Registered" },

	driverAlreadyRegisteredBanner: {
		ar: "أنت مسجّل مسبقاً كرجل توصيل. لا يمكن إرسال طلب جديد.",
		en: "You are already registered as a delivery driver. A new request cannot be submitted.",
	},
	driverPendingBanner: {
		ar: "طلب انضمامك كرجل توصيل قيد المراجعة.",
		en: "Your delivery driver application is under review.",
	},
	driverActiveBanner: {
		ar: "حسابك كرجل توصيل نشط.",
		en: "Your delivery driver account is active.",
	},
	submitting: { ar: "جاري الإرسال...", en: "Submitting..." },
	fillRequiredFields: {
		ar: "يرجى تعبئة الحقول المطلوبة",
		en: "Please fill in the required fields",
	},
	scrollToFix: {
		ar: "يرجى تصحيح الحقول المشار إليها باللون الأحمر",
		en: "Please fix the fields marked in red",
	},
} as const;

/** Backend may return unresolved i18n keys; map them to bilingual copy. */
const JOIN_API_ERROR_MESSAGES: Record<string, LocaleCopy> = {
	"messages.validation.password.letters": JOIN_STRINGS.passwordLetters,
};

export function localizeJoinApiMessage(
	message: string,
	lang: "ar" | "en" = "ar",
): string {
	const mapped = JOIN_API_ERROR_MESSAGES[message.trim()];
	if (!mapped) return message;
	return lang === "ar" ? mapped.ar : mapped.en;
}

export function localizeJoinFieldErrors(
	fieldErrors: Partial<Record<string, string>>,
	lang: "ar" | "en" = "ar",
): Partial<Record<string, string>> {
	const localized: Record<string, string> = {};
	for (const [field, message] of Object.entries(fieldErrors)) {
		if (message) localized[field] = localizeJoinApiMessage(message, lang);
	}
	return localized;
}

export const JOIN_STATUS_LABEL: Record<
	"none" | "pending" | "approved" | "active" | "rejected" | "registered",
	LocaleCopy
> = {
	none: JOIN_STRINGS.statusNone,
	pending: JOIN_STRINGS.statusPending,
	approved: JOIN_STRINGS.statusApproved,
	active: JOIN_STRINGS.statusActive,
	rejected: JOIN_STRINGS.statusRejected,
	registered: JOIN_STRINGS.statusRegistered,
};

export const JOIN_DROPDOWN_OPTIONS: LocaleCopy[] = [
	{ ar: "مثال 1", en: "Example 1" },
	{ ar: "مثال 2", en: "Example 2" },
	{ ar: "مثال 3", en: "Example 3" },
	{ ar: "مثال 4", en: "Example 4" },
	{ ar: "مثال 5", en: "Example 5" },
];

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
