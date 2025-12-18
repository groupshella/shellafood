/**
 * Partner Feature Constants
 */

export const PARTNER_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Google Maps
	GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
	DEFAULT_CENTER: { lat: 24.7136, lng: 46.6753 },
	MAP_ZOOM: 10,
	MAP_HEIGHT: "400px",
	
	// Notification timeout
	NOTIFICATION_TIMEOUT: 5000, // 5 seconds
	
	// Form validation
	MIN_NAME_LENGTH: 2,
	MAX_NAME_LENGTH: 50,
	MIN_STORE_NAME_LENGTH: 3,
	MAX_STORE_NAME_LENGTH: 100,
	MIN_ADDRESS_LENGTH: 5,
	MAX_ADDRESS_LENGTH: 200,
	MIN_PASSWORD_LENGTH: 8,
} as const;

// Google Maps libraries (separate to avoid readonly type issues)
export const PARTNER_MAP_LIBRARIES = ['places'];

// ============================================================================
// Validation Rules
// ============================================================================

export const NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 50,
} as const;

export const STORE_NAME_RULES = {
	MIN_LENGTH: 3,
	MAX_LENGTH: 100,
} as const;

export const ADDRESS_RULES = {
	MIN_LENGTH: 5,
	MAX_LENGTH: 200,
} as const;

export const PASSWORD_RULES = {
	MIN_LENGTH: 8,
} as const;

// ============================================================================
// Validation Messages (Arabic)
// ============================================================================

export const VALIDATION_MESSAGES = {
	FIRST_NAME: {
		REQUIRED: 'الاسم الأول مطلوب',
		MIN_LENGTH: 'الاسم الأول يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'الاسم الأول طويل جداً',
	},
	LAST_NAME: {
		REQUIRED: 'اسم العائلة مطلوب',
		MIN_LENGTH: 'اسم العائلة يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم العائلة طويل جداً',
	},
	EMAIL: {
		REQUIRED: 'البريد الإلكتروني مطلوب',
		INVALID: 'البريد الإلكتروني غير صحيح',
	},
	PHONE: {
		REQUIRED: 'رقم الهاتف مطلوب',
	},
	PASSWORD: {
		REQUIRED: 'كلمة المرور مطلوبة',
		MIN_LENGTH: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
	},
	ZONE_ID: {
		REQUIRED: 'المنطقة مطلوبة',
	},
	MODULE_ID: {
		REQUIRED: 'نوع المتجر مطلوب',
	},
	STORE_NAME: {
		REQUIRED: 'اسم المتجر مطلوب',
		MIN_LENGTH: 'اسم المتجر يجب أن يكون 3 أحرف على الأقل',
		MAX_LENGTH: 'اسم المتجر طويل جداً',
	},
	ADDRESS: {
		REQUIRED: 'العنوان مطلوب',
		MIN_LENGTH: 'العنوان يجب أن يكون 5 أحرف على الأقل',
		MAX_LENGTH: 'العنوان طويل جداً',
	},
	LOCATION: {
		REQUIRED: 'يجب تحديد موقع المتجر على الخريطة',
	},
	PHOTO: {
		REQUIRED:'الشعار مطلوب',
		INVALID:"صورة  يجب ان تكون أقل من 4 ميفابايت" ,
	},
	TERMS: {
		REQUIRED: 'يجب الموافقة على الشروط والأحكام',
	},
} as const;

