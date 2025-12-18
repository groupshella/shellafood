/**
 * Worker Feature Constants
 */

import type { BenefitCard } from "../types/worker.types";
import type { ImageItem } from "@/shared/components";

export const WORKER_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Notification timeout
	NOTIFICATION_TIMEOUT: 5000, // 5 seconds
	
	// Form validation
	MIN_NAME_LENGTH: 2,
	MAX_NAME_LENGTH: 50,
	ID_NUMBER_LENGTH: 10,
	
	// Driver types
	DRIVER_TYPES: {
		DELIVERY: 'delivery',
		SERVICE: 'service',
	} as const,
	
	// Vehicle types
	VEHICLE_TYPES: {
		MOTORCYCLE: 'motorcycle',
		CAR: 'car',
		BICYCLE: 'bicycle',
	} as const,
	
	// ID types
	ID_TYPES: {
		NATIONAL_ID: 'national_id',
		IQAMA: 'iqama',
	} as const,
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const NAME_RULES = {
	MIN_LENGTH: 2,
	MAX_LENGTH: 50,
} as const;

export const ID_NUMBER_RULES = {
	LENGTH: 10,
	REGEX: /^\d{10}$/,
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
	PHONE_NUMBER: {
		REQUIRED: 'رقم الهاتف مطلوب',
	},
	DRIVER_TYPE: {
		REQUIRED: 'نوع العمل مطلوب',
		INVALID: 'نوع العمل غير صالح',
	},
	AREA: {
		REQUIRED: 'المنطقة مطلوبة',
	},
	VEHICLE_TYPE: {
		REQUIRED: 'نوع المركبة مطلوب',
		INVALID: 'نوع المركبة غير صالح',
	},
	ID_TYPE: {
		REQUIRED: 'نوع الهوية مطلوب',
		INVALID: 'نوع الهوية غير صالح',
	},
	ID_IMAGE: {
		REQUIRED: 'صورة الهوية مطلوب',
		INVALID:"صورة الهوية يجب ان تكون أقل من 4 ميفابايت" ,
	},
	ID_NUMBER: {
		REQUIRED: 'رقم الهوية مطلوب',
		INVALID: 'رقم الهوية يجب أن يتكون من 10 أرقام',
	},
} as const;

// ============================================================================
// Mock Reviews Data
// ============================================================================

export interface MockReview {
	id: number;
	userName: {
		ar: string;
		en: string;
	};
	userAvatar: string;
	rating: number;
	comment: {
		ar: string;
		en: string;
	};
	date: string;
}

export const MOCK_REVIEWS: MockReview[] = [
	{
		id: 1,
		userName: {
			ar: "محمد العتيبي",
			en: "Mohammed Al-Otaibi"
		},
		userAvatar: "/worker2.jpg",
		rating: 5,
		comment: {
			ar: "خدمة ممتازة ومهنية عالية. المحامي كان متعاون جداً وساعدني في حل مشكلتي القانونية بسرعة.",
			en: "Excellent service with high professionalism. The lawyer was very cooperative and helped me solve my legal issue quickly."
		},
		date: "2024-01-15"
	},
	{
		id: 2,
		userName: {
			ar: "فاطمة السعد",
			en: "Fatima Al-Saad"
		},
		userAvatar: "/worker1.jpg",
		rating: 5,
		comment: {
			ar: "تجربة رائعة، المحامي كان مفيد جداً وشرح لي كل التفاصيل بوضوح. أنصح به بشدة.",
			en: "Amazing experience, the lawyer was very helpful and explained everything clearly. Highly recommended."
		},
		date: "2024-01-10"
	},
	{
		id: 3,
		userName: {
			ar: "خالد النعيمي",
			en: "Khalid Al-Naimi"
		},
		userAvatar: "/worker2.jpg",
		rating: 4,
		comment: {
			ar: "خدمة جيدة وسريعة، النتائج كانت مرضية. المحامي محترف في عمله.",
			en: "Good and fast service, the results were satisfactory. The lawyer is professional in his work."
		},
		date: "2024-01-08"
	}
] as const;

// ============================================================================
// Benefit Cards Data
// ============================================================================

export const BENEFIT_CARDS: BenefitCard[] = [
	{
		id: "card-1",
		image: "/worker2.jpg",
		titleKey: "worker.card1.title",
		descriptionKey: "worker.card1.description",
	},
	{
		id: "card-2",
		image: "/worker1.jpg",
		titleKey: "worker.card2.title",
		descriptionKey: "worker.card2.description",
	},
] as const;

// ============================================================================
// Worker Hero Images
// ============================================================================

export const WORKER_IMAGES: ImageItem[] = [
	{ id: 1, url: "/worker.png", thumbnail: "/worker.png" },
] as const;

// ============================================================================
// Form Select Options
// ============================================================================

export const getDriverTypeOptions = (isArabic: boolean) => [
	{ value: WORKER_CONSTANTS.DRIVER_TYPES.DELIVERY, label: isArabic ? "توصيل" : "Delivery" },
	{ value: WORKER_CONSTANTS.DRIVER_TYPES.SERVICE, label: isArabic ? "خدمة" : "Service" },
];

export const getVehicleTypeOptions = (isArabic: boolean) => [
	{ value: WORKER_CONSTANTS.VEHICLE_TYPES.MOTORCYCLE, label: isArabic ? "دراجة نارية" : "Motorcycle" },
	{ value: WORKER_CONSTANTS.VEHICLE_TYPES.CAR, label: isArabic ? "سيارة" : "Car" },
	{ value: WORKER_CONSTANTS.VEHICLE_TYPES.BICYCLE, label: isArabic ? "دراجة هوائية" : "Bicycle" },
];

export const getIdTypeOptions = (isArabic: boolean) => [
	{ value: WORKER_CONSTANTS.ID_TYPES.NATIONAL_ID, label: isArabic ? "هوية وطنية" : "National ID" },
	{ value: WORKER_CONSTANTS.ID_TYPES.IQAMA, label: isArabic ? "إقامة" : "Iqama (Residence)" },
];

