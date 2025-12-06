/**
 * Kaidha Feature Constants
 */

export const KAIDHA_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Google Maps
	GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
	DEFAULT_CENTER: { lat: 24.7136, lng: 46.6753 },
	
	// Form reset delay (after successful submission)
	RESET_DELAY: 3000, // 3 seconds
	
	// Notification timeout
	NOTIFICATION_TIMEOUT: 5000, // 5 seconds
} as const;

// Google Maps libraries (separate to avoid readonly type issues)
export const KAIDHA_MAP_LIBRARIES = ['places'];

// ============================================================================
// Validation Rules
// ============================================================================

export const NAME_RULES = {
	MIN_LENGTH: 1,
} as const;

export const PHONE_RULES = {
	MIN_LENGTH: 10,
	MAX_LENGTH: 15,
	PATTERN: /^\+?[0-9]{10,15}$/,
} as const;

// ============================================================================
// Validation Messages (Arabic)
// ============================================================================

export const VALIDATION_MESSAGES = {
	FIRST_NAME: {
		REQUIRED: 'الاسم الأول مطلوب',
	},
	LAST_NAME: {
		REQUIRED: 'اسم العائلة مطلوب',
	},
	FATHER_NAME: {
		REQUIRED: 'اسم الأب مطلوب',
	},
	ID_TYPE: {
		REQUIRED: 'نوع الهوية مطلوب',
	},
	PERSONAL_ID_NUMBER: {
		REQUIRED: 'رقم الهوية مطلوب',
	},
	PHONE_NUMBER: {
		INVALID: 'رقم الهاتف غير صحيح',
	},
	EMAIL: {
		INVALID: 'البريد الإلكتروني غير صحيح',
	},
	CITY: {
		REQUIRED: 'المدينة مطلوبة',
	},
	AGREED: {
		REQUIRED: 'يجب الموافقة على الشروط والأحكام',
	},
} as const;

