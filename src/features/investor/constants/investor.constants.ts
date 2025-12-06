/**
 * Investor Feature Constants
 */

export const INVESTOR_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// API Endpoints
	ENDPOINTS: {
		CONTRACT_PDF: '/api/v1/investor/contract-pdf',
		SUBMIT_FORM: '/api/v1/investor/store',
		NAFATH_INIT: '/api/v1/investor/nafath-init',
		NAFATH_STATUS: '/api/v1/investor/nafath-status',
	} as const,
	
	// Polling configuration
	POLLING: {
		MAX_ATTEMPTS: 60, // 5 minutes (60 * 5 seconds)
		INTERVAL: 5000, // 5 seconds
	},
	
	// Form validation
	MIN_AMOUNT: 1000,
	MAX_AMOUNT: 10000000,
	
	// Regions (Saudi Arabia)
	REGIONS: [
		{ value: 'riyadh', label: 'الرياض', labelEn: 'Riyadh' },
		{ value: 'jeddah', label: 'جدة', labelEn: 'Jeddah' },
		{ value: 'dammam', label: 'الدمام', labelEn: 'Dammam' },
		{ value: 'makkah', label: 'مكة المكرمة', labelEn: 'Makkah' },
		{ value: 'madina', label: 'المدينة المنورة', labelEn: 'Madina' },
		{ value: 'khobar', label: 'الخبر', labelEn: 'Khobar' },
		{ value: 'taif', label: 'الطائف', labelEn: 'Taif' },
		{ value: 'abha', label: 'أبها', labelEn: 'Abha' },
		{ value: 'tabuk', label: 'تبوك', labelEn: 'Tabuk' },
		{ value: 'buraidah', label: 'بريدة', labelEn: 'Buraidah' },
	] as const,
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 30,
	PATTERN: /^[\u0600-\u06FFa-zA-Z\s]+$/,
} as const;

export const REGION_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 50,
} as const;

export const BANK_NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 100,
} as const;

export const NATIONAL_ID_RULES = {
	LENGTH: 10,
	PATTERN: /^\d{10}$/,
} as const;

export const AGE_RULES = {
	MIN: 18,
	MAX: 80,
} as const;

// ============================================================================
// Validation Messages (Arabic)
// ============================================================================

export const VALIDATION_MESSAGES = {
	FIRST_NAME: {
		REQUIRED: 'الاسم الأول مطلوب',
		MIN_LENGTH: 'الاسم الأول يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'الاسم الأول يجب أن يكون أقل من 30 حرف',
		INVALID: 'الاسم الأول يجب أن يحتوي على أحرف عربية أو إنجليزية فقط',
	},
	FATHER_NAME: {
		REQUIRED: 'اسم الأب مطلوب',
		MIN_LENGTH: 'اسم الأب يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم الأب يجب أن يكون أقل من 30 حرف',
		INVALID: 'اسم الأب يجب أن يحتوي على أحرف عربية أو إنجليزية فقط',
	},
	FAMILY_NAME: {
		REQUIRED: 'اسم العائلة مطلوب',
		MIN_LENGTH: 'اسم العائلة يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم العائلة يجب أن يكون أقل من 30 حرف',
		INVALID: 'اسم العائلة يجب أن يحتوي على أحرف عربية أو إنجليزية فقط',
	},
	GRANDFATHER_NAME: {
		REQUIRED: 'اسم الجد مطلوب',
		MIN_LENGTH: 'اسم الجد يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم الجد يجب أن يكون أقل من 30 حرف',
		INVALID: 'اسم الجد يجب أن يحتوي على أحرف عربية أو إنجليزية فقط',
	},
	BIRTH_DATE: {
		REQUIRED: 'تاريخ الميلاد مطلوب',
		INVALID_AGE: 'العمر يجب أن يكون بين 18-80 سنة',
	},
	NATIONAL_ID: {
		REQUIRED: 'الهوية الوطنية مطلوبة',
		INVALID: 'الهوية الوطنية يجب أن تحتوي على 10 أرقام بالضبط',
	},
	EMAIL: {
		REQUIRED: 'البريد الإلكتروني مطلوب',
		INVALID: 'البريد الإلكتروني غير صحيح',
	},
	PHONE: {
		REQUIRED: 'رقم الهاتف مطلوب',
	},
	NATIONAL_ADDRESS_EMAIL: {
		REQUIRED: 'بريد العنوان الوطني مطلوب',
		INVALID: 'بريد العنوان الوطني غير صحيح',
	},
	REGION: {
		REQUIRED: 'المنطقة مطلوبة',
		MIN_LENGTH: 'المنطقة يجب أن تكون حرفين على الأقل',
		MAX_LENGTH: 'المنطقة يجب أن تكون أقل من 50 حرف',
	},
	IBAN: {
		REQUIRED: 'رقم الآيبان مطلوب',
	},
	BANK_NAME: {
		REQUIRED: 'اسم البنك مطلوب',
		MIN_LENGTH: 'اسم البنك يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم البنك يجب أن يكون أقل من 100 حرف',
	},
	AMOUNT: {
		REQUIRED: 'المبلغ مطلوب',
		INVALID: `المبلغ يجب أن يكون بين ${INVESTOR_CONSTANTS.MIN_AMOUNT.toLocaleString()} - ${INVESTOR_CONSTANTS.MAX_AMOUNT.toLocaleString()} ريال`,
	},
	AGREED: {
		REQUIRED: 'يجب الموافقة على الشروط والأحكام',
	},
} as const;

// ============================================================================
// Investor Benefits
// ============================================================================

export const INVESTOR_BENEFITS = {
	ar: [
		"يساعد الاستثمار في الأعمال على ضمان نجاح الشركة على المدى الطويل",
		"الاستثمار التجاري يساعد على خلق فرص العمل",
		"يمكن أن يساعد الاستثمار في الشركات الناشئة على تعزيز النمو الاقتصادي",
		"يمكن أن يؤدي الاستثمار في الشركات الناشئة إلى الابتكار",
		"يمكن أن يساعد الاستثمار التجاري في جذب الموظفين الموهوبين"
	],
	en: [
		"Business investment helps ensure long-term company success",
		"Commercial investment helps create job opportunities",
		"Startup investment can help boost economic growth",
		"Startup investment can lead to innovation",
		"Commercial investment can help attract talented employees"
	]
} as const;

export const BENEFIT_CIRCLE_COLORS = [
	"from-purple-600 to-purple-400", // Purple
	"from-blue-500 to-blue-300", // Blue
	"from-green-500 to-green-300", // Green
	"from-orange-500 to-yellow-400", // Orange
	"from-pink-600 to-red-400" // Red
] as const;

// ============================================================================
// Investor Hero Videos
// ============================================================================

import type { VideoItem } from "@/shared/components";

export const INVESTOR_HERO_VIDEOS: VideoItem[] = [
	{ id: 1, url: "/video1.mp4", thumbnail: "/videoframe_0.png" },
	{ id: 2, url: "/video2.mp4", thumbnail: "/videoframe1.png" },
	{ id: 3, url: "/video3.mp4", thumbnail: "/videoframe2.png" },
	{ id: 4, url: "/video4.mp4", thumbnail: "/videoframe3.png" },
];

// ============================================================================
// Initial Form Data
// ============================================================================

import type { InvestorFormData } from "../types/investor.types";

export const INITIAL_INVESTOR_FORM_DATA: InvestorFormData = {
	first_name: "",
	father_name: "",
	family_name: "",
	grandfather_name: "",
	birth_date: "",
	national_id: "",
	email: "",
	phone: "",
	national_address_email: "",
	region: "",
	iban: "",
	bank_name: "",
	amount: "",
	agreed: false,
};

// ============================================================================
// Form Translations
// ============================================================================

export const INVESTOR_FORM_TRANSLATIONS = {
	ar: {
		personalInfo: 'البيانات الشخصية',
		contactInfo: 'معلومات الاتصال',
		bankingInfo: 'معلومات البنك',
		firstName: 'الاسم الأول',
		fatherName: 'اسم الأب',
		familyName: 'اسم العائلة',
		grandfatherName: 'اسم الجد',
		birthDate: 'تاريخ الميلاد',
		nationalId: 'رقم الهوية الوطنية',
		email: 'البريد الإلكتروني',
		phone: 'رقم الجوال',
		nationalAddressEmail: 'بريد العنوان الوطني',
		region: 'المنطقة',
		iban: 'رقم الآيبان',
		bankName: 'اسم البنك',
		amount: 'المبلغ المراد استثماره',
		agreeTerms: 'أوافق على الشروط والأحكام',
		submit: 'إرسال الطلب',
		processing: 'جاري المعالجة...',
		nafathTitle: 'التحقق من الهوية - نفاذ',
		nafathCode: 'كود التحقق',
		nafathInstructions: 'افتح تطبيق نفاذ على جوالك وأدخل الكود التالي للموافقة:',
		waitingApproval: 'بانتظار الموافقة...',
		contractTitle: 'معاينة العقد',
		downloadContract: 'تحميل العقد',
		confirmSign: 'تأكيد وتوقيع',
		successTitle: 'تم التسجيل بنجاح!',
		successMessage: 'تم تسجيلك كمستثمر وتوقيع العقد بنجاح',
		startNew: 'بدء تسجيل جديد',
		previewContract: 'معاينة العقد (اختياري)',
		cancelVerification: 'إلغاء التحقق',
		backToForm: 'العودة للنموذج',
		formStep: 'البيانات',
		verificationStep: 'التحقق',
		completeStep: 'مكتمل',
		formTitle: 'تسجيل مستثمر جديد',
		formSubtitle: 'يرجى ملء جميع الحقول المطلوبة',
		contractLoaded: 'تم تحميل العقد',
		viewContract: 'عرض العقد',
		contractPreviewMessage: 'يمكنك معاينة العقد قبل المتابعة. سيتم استخدام نفس العقد عند التوقيع.',
		signedContract: 'العقد الموقع',
		signedContractMessage: 'تم توقيع العقد بنجاح. يمكنك عرضه أو تحميله.',
		fullName: 'الاسم الكامل',
		nationalIdLabel: 'رقم الهوية الوطنية',
		requestId: 'رقم الطلب',
		status: 'الحالة',
		approved: 'موافق عليه',
		investorId: 'رقم المستثمر',
		contractLoadedSuccess: 'تم تحميل العقد بنجاح',
		contractLoadFailed: 'فشل تحميل العقد',
		verificationInitFailed: 'فشل في بدء التحقق',
		verificationInitError: 'خطأ في بدء التحقق',
		verificationSuccess: 'تم التحقق بنجاح',
		verificationFailed: 'فشل التحقق',
		verificationError: 'خطأ في التحقق',
		verificationTimeout: 'انتهت مهلة التحقق. يرجى المحاولة مرة أخرى',
		registrationFailed: 'فشل في إكمال التسجيل',
		registrationError: 'خطأ في التسجيل',
		registrationSuccess: 'تم التسجيل والتوقيع بنجاح!',
		signedContractNotFound: 'لم يتم العثور على العقد الموقع',
		signedContractFetchError: 'خطأ في جلب العقد الموقع',
	},
	en: {
		personalInfo: 'Personal Information',
		contactInfo: 'Contact Information',
		bankingInfo: 'Banking Information',
		firstName: 'First Name',
		fatherName: 'Father Name',
		familyName: 'Family Name',
		grandfatherName: 'Grandfather Name',
		birthDate: 'Birth Date',
		nationalId: 'National ID',
		email: 'Email',
		phone: 'Phone',
		nationalAddressEmail: 'National Address Email',
		region: 'Region',
		iban: 'IBAN',
		bankName: 'Bank Name',
		amount: 'Investment Amount',
		agreeTerms: 'I agree to terms and conditions',
		submit: 'Submit Application',
		processing: 'Processing...',
		nafathTitle: 'Identity Verification - Nafath',
		nafathCode: 'Verification Code',
		nafathInstructions: 'Open Nafath app on your phone and enter this code to approve:',
		waitingApproval: 'Waiting for approval...',
		contractTitle: 'Contract Preview',
		downloadContract: 'Download Contract',
		confirmSign: 'Confirm & Sign',
		successTitle: 'Registration Successful!',
		successMessage: 'You have been registered as an investor and the contract has been signed',
		startNew: 'Start New Registration',
		previewContract: 'Preview Contract (Optional)',
		cancelVerification: 'Cancel Verification',
		backToForm: 'Back to Form',
		formStep: 'Form',
		verificationStep: 'Verify',
		completeStep: 'Done',
		formTitle: 'New Investor Registration',
		formSubtitle: 'Please fill all required fields',
		contractLoaded: 'Contract Loaded',
		viewContract: 'View Contract',
		contractPreviewMessage: 'You can preview the contract before proceeding. The same contract will be used for signing.',
		signedContract: 'Signed Contract',
		signedContractMessage: 'Contract has been signed successfully. You can view or download it.',
		fullName: 'Full Name',
		nationalIdLabel: 'National ID',
		requestId: 'Request ID',
		status: 'Status',
		approved: 'Approved',
		investorId: 'Investor ID',
		contractLoadedSuccess: 'Contract loaded successfully',
		contractLoadFailed: 'Failed to load contract',
		verificationInitFailed: 'Failed to initiate verification',
		verificationInitError: 'Error initiating verification',
		verificationSuccess: 'Verified successfully',
		verificationFailed: 'Verification failed',
		verificationError: 'Verification error',
		verificationTimeout: 'Verification timeout. Please try again',
		registrationFailed: 'Failed to complete registration',
		registrationError: 'Registration error',
		registrationSuccess: 'Registration and signing completed successfully!',
		signedContractNotFound: 'Signed contract not found',
		signedContractFetchError: 'Error fetching signed contract',
	},
} as const;

// ============================================================================
// Contract Modal Translations
// ============================================================================

export const CONTRACT_MODAL_TRANSLATIONS = {
	ar: {
		title: "مسودة العقد",
		close: "إغلاق",
		loading: "جاري فتح العقد...",
		contractReady: "مسودة العقد جاهزة",
		mobileTitle: "اختر طريقة العرض",
		mobileMessage: "على الموبايل، يمكنك فتح العقد في نافذة جديدة لعرضه مباشرة، أو تحميله على جهازك للمراجعة لاحقاً.",
		mobileStep1: "الخطوة 1: اختر طريقة العرض",
		mobileStep2: "الخطوة 2: راجع العقد بعناية",
		mobileStep3: "الخطوة 3: أكمل عملية التسجيل",
		errorMessage: "حدث خطأ في عرض العقد. يمكنك استخدام الخيارات التالية:",
		fileName: "عقد_المستثمر.pdf",
		fileType: "نوع الملف: PDF",
		fileStatus: "الحالة: جاهز للعرض",
		openInNewWindow: "فتح العقد في نافذة جديدة",
		openInNewWindowDesc: "يفتح العقد في متصفحك لعرضه مباشرة",
		downloadContract: "تحميل العقد",
		downloadContractDesc: "يحفظ العقد على جهازك للمراجعة لاحقاً",
		additionalOptions: "إذا لم يظهر العقد أعلاه، يمكنك استخدام الخيارات التالية:",
		openInNewWindowShort: "فتح في نافذة جديدة",
		downloadContractShort: "تحميل العقد",
		mobileFooter: "على الموبايل، استخدم الأزرار أعلاه لعرض العقد",
		desktopFooter: "العقد معروض أعلاه. إذا لم يظهر، استخدم الخيارات في الأعلى.",
		fileNameLabel: "اسم الملف",
	},
	en: {
		title: "Contract Draft",
		close: "Close",
		loading: "Opening contract...",
		contractReady: "Contract draft is ready",
		mobileTitle: "Choose Viewing Method",
		mobileMessage: "On mobile, you can open the contract in a new window to view it directly, or download it to your device for later review.",
		mobileStep1: "Step 1: Choose viewing method",
		mobileStep2: "Step 2: Review the contract carefully",
		mobileStep3: "Step 3: Complete the registration process",
		errorMessage: "An error occurred while displaying the contract. You can use the following options:",
		fileName: "Investor_Contract.pdf",
		fileType: "File type: PDF",
		fileStatus: "Status: Ready for viewing",
		openInNewWindow: "Open contract in new window",
		openInNewWindowDesc: "Opens the contract in your browser for immediate viewing",
		downloadContract: "Download contract",
		downloadContractDesc: "Saves the contract to your device for later review",
		additionalOptions: "If the contract doesn't appear above, you can use the following options:",
		openInNewWindowShort: "Open in new window",
		downloadContractShort: "Download contract",
		mobileFooter: "On mobile, use the buttons above to view the contract",
		desktopFooter: "The contract is displayed above. If it doesn't appear, use the options above.",
		fileNameLabel: "File Name",
	},
} as const;

