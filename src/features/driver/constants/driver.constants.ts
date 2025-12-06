/**
 * Driver Feature Constants
 */

import type { BenefitCard } from '../types/driver.types';

export const DRIVER_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Form validation
	MIN_PASSWORD_LENGTH: 8,
	MIN_NAME_LENGTH: 2,
	MAX_NAME_LENGTH: 50,
	IDENTITY_NUMBER_LENGTH: 10,
	PHONE_DIGITS: 9,
	
	// Identity types
	IDENTITY_TYPES: {
		NID: 'nid',
		RESIDENCE: 'residence',
		PASSPORT: 'passport',
		DRIVING_LICENSE: 'driving_license',
	} as const,
	
	// Vehicle types
	VEHICLE_TYPES: {
		TRUCK: 'truck',
		MOTORBIKE: 'motorbike',
	} as const,
	
	// Image slider
	IMAGE_SLIDER_AUTOPLAY_INTERVAL: 5000,
} as const;

export const DRIVER_IMAGES = [
	{ id: 1, url: "/drivers1.jpg", thumbnail: "/drivers1.jpg" },
	{ id: 2, url: "/drivers2.jpg", thumbnail: "/drivers2.jpg" },
	{ id: 3, url: "/drivers3.jpg", thumbnail: "/drivers3.jpg" },
];

export const DRIVER_BENEFIT_CARDS: BenefitCard[] = [
	{
		id: "card-1",
		image: "/driver1.jpg",
		route: "/CardDeleviry2",
		titleKey: "driver.card1.title",
		descriptionKey: "driver.card1.description",
		moreKey: "driver.card1.more",
	},
	{
		id: "card-2",
		image: "/driver2.jpg",
		route: "/CardDeleviry1",
		titleKey: "driver.card2.title",
		descriptionKey: "driver.card2.description",
		moreKey: "driver.card2.more",
	},
];

// ============================================================================
// Validation Rules
// ============================================================================

export const PASSWORD_RULES = {
	MIN_LENGTH: 8,
} as const;

export const NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 50,
} as const;

export const IDENTITY_NUMBER_RULES = {
	LENGTH: 10,
	REGEX: /^\d{10}$/,
} as const;

// ============================================================================
// Validation Messages
// ============================================================================

export const VALIDATION_MESSAGES = {
	F_NAME: {
		REQUIRED: 'الاسم الأول مطلوب',
		MIN_LENGTH: 'الاسم الأول يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'الاسم الأول طويل جداً',
	},
	L_NAME: {
		REQUIRED: 'اسم العائلة مطلوب',
		MIN_LENGTH: 'اسم العائلة يجب أن يكون حرفين على الأقل',
		MAX_LENGTH: 'اسم العائلة طويل جداً',
	},
	PHONE: {
		REQUIRED: 'رقم الهاتف مطلوب',
	},
	EMAIL: {
		REQUIRED: 'البريد الإلكتروني مطلوب',
		INVALID: 'البريد الإلكتروني غير صحيح',
	},
	PASSWORD: {
		REQUIRED: 'كلمة المرور مطلوبة',
		MIN_LENGTH: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
	},
	IDENTITY_NUMBER: {
		REQUIRED: 'رقم الهوية مطلوب',
		INVALID: 'رقم الهوية يجب أن يتكون من 10 أرقام',
	},
	IDENTITY_TYPE: {
		REQUIRED: 'نوع الهوية مطلوب',
		INVALID: 'نوع الهوية غير صالح',
	},
	ZONE_ID: {
		REQUIRED: 'يرجى اختيار المنطقة',
	},
	AGREED: {
		REQUIRED: 'يجب الموافقة على الشروط والأحكام',
	},
} as const;
