/**
 * Auth Feature Constants
 * All constants for authentication feature
 */

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
	TOKEN: 'auth_token',
	USER: 'user',
	REMEMBER_ME: 'remember_me',
} as const;

// ============================================================================
// Token Configuration
// ============================================================================

export const TOKEN_CONFIG = {
	HEADER_NAME: 'Authorization',
	TOKEN_PREFIX: 'Bearer',
	EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// ============================================================================
// Language & API
// ============================================================================

export const DEFAULT_LANG = 'ar';

// Ensure BASE_URL is set correctly for production

// BASE_URL is used for internal Next.js API routes (e.g., /api/modules, /api/stores)
// In development: http://localhost:3000 (Next.js dev server)
// In production: Use NEXT_PUBLIC_APP_URL if set, otherwise fallback to production domain
// For external API calls, use the hardcoded URL in the API route handlers
export const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
	  return window.location.origin;
	}	
	
	if (process.env.VERCEL_URL) {
	  return `https://${process.env.VERCEL_URL}`;
	}
	
	return 'http://localhost:3000';
  };
  export const BASE_URL = "https://shellafood.com";
// ============================================================================
// Frontend Routes
// ============================================================================

export const AUTH_ROUTES = {
	LOGIN: '/login',
	REGISTER: '/register',
	HOME: '/home',
} as const;

// ============================================================================
// API Endpoints
// ============================================================================

export const AUTH_ENDPOINTS = {
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	SIGN_UP: '/auth/sign-up',
	VERIFY_PHONE: '/auth/verify-phone',
	SEND_OTP_AGAIN: '/auth/send-otp-again',
	ME: '/auth/me',
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const PASSWORD_RULES = {
	MIN_LENGTH: 8,
	MAX_LENGTH: 128,
	REQUIRE_UPPERCASE: true,
	REQUIRE_LOWERCASE: true,
	REQUIRE_NUMBER: true,
	REQUIRE_SPECIAL: false,
} as const;

export const PHONE_RULES = {
	REGEX: /^(05|5)[0-9]{8}$/,
	FORMAT: '05XXXXXXXX',
	LENGTH: 10,
	COUNTRY_CODE: '+966',
} as const;

export const EMAIL_RULES = {
	MAX_LENGTH: 255,
	REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 50,
} as const;

// ============================================================================
// Validation Messages (Arabic)
// ============================================================================

export const VALIDATION_MESSAGES = {
	EMAIL: {
		REQUIRED: 'البريد الإلكتروني مطلوب',
		INVALID: 'البريد الإلكتروني غير صحيح',
		MAX_LENGTH: 'البريد الإلكتروني طويل جداً',
	},
	PASSWORD: {
		REQUIRED: 'كلمة المرور مطلوبة',
		MIN_LENGTH: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
		REQUIRE_UPPERCASE: 'كلمة المرور يجب أن تحتوي على حرف كبير',
		REQUIRE_NUMBER: 'كلمة المرور يجب أن تحتوي على رقم',
		NOT_MATCH: 'كلمات المرور غير متطابقة',
	},
	PHONE: {
		REQUIRED: 'رقم الجوال مطلوب',
		INVALID: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام',
	},
	NAME: {
		REQUIRED: 'الاسم مطلوب',
		MIN_LENGTH: 'الاسم يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'الاسم طويل جداً',
	},
	TERMS: {
		REQUIRED: 'يجب الموافقة على الشروط والأحكام',
	},
} as const;

// ============================================================================
// Legacy Constants (for backward compatibility)
// ============================================================================

export const AUTH_CONSTANTS = {
	LOGIN_REDIRECT_PATH: '/',
} as const;
