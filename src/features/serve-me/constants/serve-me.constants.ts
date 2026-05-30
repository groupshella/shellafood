/**
 * Serve Me Feature Constants
 */

import type { BookingStep, ServiceItem, FeatureItem, ReviewItem, FAQItem } from '../types/serve-me.types';

export const SERVE_ME_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Notification timeout
	NOTIFICATION_TIMEOUT_MS: 3000,
	
	// Media limits
	MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
	MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
	MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
	MAX_VIDEO_DURATION: 300, // 5 minutes in seconds
	
	// Time slots
	TIME_SLOT_DURATION: 60, // minutes
	WORKING_HOURS_START: 8, // 8 AM
	WORKING_HOURS_END: 22, // 10 PM
} as const;

// ============================================================================
// Booking Details Constants
// ============================================================================

// Time slots for scheduled services
export const TIME_SLOTS = [
	"08:00", "09:00", "10:00", "11:00", "12:00",
	"13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
] as const;

// Media upload limits
export const MEDIA_LIMITS = {
	MAX_IMAGES: 5,
	MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB in bytes
	MAX_VIDEO_DURATION: 30, // seconds
} as const;

// Allowed video file types
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'] as const;

// Geolocation options
export const GEOLOCATION_OPTIONS = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
} as const;

// Default location (Riyadh)
export const DEFAULT_LOCATION = {
	lat: 24.7136,
	lng: 46.6753,
} as const;

// ============================================================================
// Serve Me Main Page Constants
// ============================================================================



// Services data
export const SERVE_ME_SERVICES: ServiceItem[] = [ 
	{ 
		slug: "car-maintenance", 
		path: "/serve-me/car-maintenance", 
		translationKey: "serveMe.carMaintenance", 
		description: "Professional car maintenance and repair services including periodic maintenance, mechanical repair, electrical repair, and tire services", 
		descriptionAr: "خدمات صيانة وإصلاح السيارات الاحترافية بما في ذلك الصيانة الدورية والإصلاح الميكانيكي والكهربائي وخدمات الإطارات", 
		iconName: "Car", 
		image: "/car-maintenance.png", 
	},
	{ 
		slug: "home-maintenance", 
		path: "/serve-me/home-maintenance", 
		translationKey: "serveMe.homeMaintenance", 
		description: "Complete home maintenance and repair services including plumbing, electrical, carpentry, AC, painting, and pest control", 
		descriptionAr: "خدمات صيانة وإصلاح المنازل الكاملة بما في ذلك السباكة والكهرباء والنجارة والتكييف والدهانات ومكافحة الآفات", 
		iconName: "Wrench", 
		image: "/home-maintenance.jpg" 
	},

	{ 
		slug: "babysitting", 
		path: "/serve-me/babysitting", 
		translationKey: "serveMe.babysitting", 
		description: "Trusted babysitting and childcare services with qualified and experienced caregivers for all age groups", 
		descriptionAr: "خدمات رعاية الأطفال الموثوقة مع مقدمي رعاية مؤهلين وذوي خبرة لجميع الفئات العمرية", 
		iconName: "Baby", 
		image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop", 
	},
	{ 
		slug: "women-salons", 
		path: "/serve-me/women-salons", 
		translationKey: "serveMe.womenSalons", 
		description: "Premium women's salon services including hair styling, coloring, makeup, skincare, nails, and beauty treatments", 
		descriptionAr: "خدمات صالونات نسائية فاخرة بما في ذلك تصفيف الشعر والصبغات والمكياج والعناية بالبشرة والأظافر وعلاجات التجميل", 
		iconName: "Scissors", 
		image: "/w-sallon.png", 
	}, 
	{ 
		slug: "men-salons", 
		path: "/serve-me/men-salons", 
		translationKey: "serveMe.menSalons", 
		description: "Modern men's grooming services including haircuts, beard trimming, hot towel shaving, styling, and facials", 
		descriptionAr: "خدمات العناية الرجالية الحديثة بما في ذلك قص الشعر وتشذيب اللحية والحلاقة الساخنة والتصفيف والعناية بالوجه", 
		iconName: "Scissors", 
		image: "/m-sallon.jpg", 
	},
	{
		slug: "pick-and-order",
		path: "/pickandorder",
		translationKey: "serveMe.pickAndOrder", 
		description: "Convenient pick-up and delivery services for shopping, errands, document delivery, and package handling", 
		descriptionAr: "خدمات التوصيل والاستلام المريحة للتسوق والمهمات وتوصيل المستندات ونقل الطرود", 
		iconName: "Truck", 
		image: "/pickorder.png", 
	},

] as const;

// Features data
export const SERVE_ME_FEATURES: FeatureItem[] = [
	{
		iconName: "MapPin",
		titleKey: "serveMe.features.coverage",
		descriptionKey: "serveMe.features.coverageDesc",
	},
	{
		iconName: "Headphones",
		titleKey: "serveMe.features.support",
		descriptionKey: "serveMe.features.supportDesc",
	},
	{
		iconName: "CheckCircle",
		titleKey: "serveMe.features.reliable",
		descriptionKey: "serveMe.features.reliableDesc",
	},
] as const;

// ============================================================================
// Individual Service Page Constants
// ============================================================================


// Mock customer reviews (Arabic and English)
export const INDIVIDUAL_SERVICE_REVIEW:Record<string, ReviewItem[]> = {
	ar: [
		{
			name: "أحمد محمد",
			rating: 5,
			comment: "خدمة ممتازة ومهنية عالية. الفني كان في الوقت المحدد وأنجز العمل بسرعة وجودة. أنصح بها بشدة!",
			date: "2025-01-15",
			verified: true,
		},
		{
			name: "فاطمة علي",
			rating: 5,
			comment: "تجربة رائعة من البداية للنهاية. السعر مناسب والخدمة سريعة. شكراً لكم!",
			date: "2025-01-10",
			verified: true,
		},
		{
			name: "خالد عبدالله",
			rating: 4,
			comment: "خدمة جيدة جداً. الفني محترف والنتيجة ممتازة. سأستخدم الخدمة مرة أخرى.",
			date: "2025-01-05",
			verified: true,
		},
	],
	en: [
		{
			name: "Ahmed Mohammed",
			rating: 5,
			comment: "Excellent and highly professional service. The technician was on time and completed the work quickly and with quality. Highly recommend!",
			date: "2025-01-15",
			verified: true,
		},
		{
			name: "Fatima Ali",
			rating: 5,
			comment: "Amazing experience from start to finish. The price is reasonable and the service is fast. Thank you!",
			date: "2025-01-10",
			verified: true,
		},
		{
			name: "Khalid Abdullah",
			rating: 4,
			comment: "Very good service. The technician is professional and the result is excellent. I will use the service again.",
			date: "2025-01-05",
			verified: true,
		},
	],
} as const;

// FAQ Data (Arabic and English)
export const INDIVIDUAL_SERVICE_FAQS: Record<string, FAQItem[]> = {
	ar: [
	  {
		question: "كم يستغرق وصول مقدم الخدمة؟",
		answer:
		  "يصل مقدم الخدمة خلال مدة تتراوح بين 60 إلى 120 دقيقة داخل نفس المدينة، أو خلال الموعد المحدد عند الحجز. يعتمد الوقت على توفر أقرب مقدم خدمة ومتطلبات الخدمة.",
	  },
	  {
		question: "هل السعر شامل كل شيء؟",
		answer:
		  "السعر يشمل تكلفة الزيارة والخدمة الأساسية. قد تختلف التكلفة النهائية حسب المواد المطلوبة أو طبيعة الخدمة، ويتم إبلاغك بالسعر الكامل قبل البدء في العمل.",
	  },
	  {
		question: "متى يتم الدفع؟",
		answer:
		  "يتم الدفع بعد انتهاء الخدمة والتأكد من رضاك التام. يمكنك الدفع عبر مدى، Apple Pay، STC Pay، أو نقداً حسب الخدمة المتاحة.",
	  },
	  {
		question: "هل يوجد ضمان على الخدمة؟",
		answer:
		  "نعم، تقدم جميع الخدمات ضماناً يتراوح بين 14 إلى 30 يوماً حسب نوع الخدمة. يشمل الضمان إعادة تقديم الخدمة مجاناً في حال ظهور نفس المشكلة.",
	  },
	  {
		question: "هل يمكن إلغاء الحجز؟",
		answer:
		  "يمكنك إلغاء الحجز بدون رسوم قبل وصول مقدم الخدمة أو قبل الموعد المحدد بوقت كافٍ. بعد بدء الخدمة، قد تُطبق رسوم زيارة حسب السياسة.",
	  },
	],
  
	en: [
	  {
		question: "How long until the service provider arrives?",
		answer:
		  "The service provider typically arrives within 60–120 minutes in the same city, or at the scheduled appointment time. Arrival depends on provider availability and service requirements.",
	  },
	  {
		question: "Is the price all-inclusive?",
		answer:
		  "The price includes the visit and basic service cost. The final cost may vary depending on required materials or the nature of the service, and the complete price is shared with you before any work begins.",
	  },
	  {
		question: "When do I pay?",
		answer:
		  "Payment is made after the service is completed and you're fully satisfied. You can pay via Mada, Apple Pay, STC Pay, or cash depending on availability.",
	  },
	  {
		question: "Is the service guaranteed?",
		answer:
		  "Yes. All services include a guarantee ranging from 14 to 30 days depending on the service type. The guarantee covers free re-service if the same issue reappears.",
	  },
	  {
		question: "Can I cancel the booking?",
		answer:
		  "Yes. You can cancel the booking free of charge before the service provider arrives or before the scheduled time. After service begins, a visit fee may apply depending on policy.",
	  },
	],
  } as const;
  

// ============================================================================
// Booking Stepper Navigation Constants
// ============================================================================

/**
 * Get booking steps for stepper navigation
 * @param service - Service slug
 * @param serviceType - Service type slug
 * @returns Array of booking steps
 */
export function getBookingSteps(service: string, serviceType: string): BookingStep[] {
	return [
		{
			id: "details",
			path: `/serve-me/${service}/${serviceType}/book/details`,
			labelEn: "Details",
			labelAr: "التفاصيل",
		},
		{
			id: "summary",
			path: `/serve-me/${service}/${serviceType}/book/summary`,
			labelEn: "Summary",
			labelAr: "الملخص",
		},
		{
			id: "choose-worker",
			path: `/serve-me/${service}/${serviceType}/book/choose-worker`,
			labelEn: "Choose Worker",
			labelAr: "اختر  ",
		},

		{
			id: "accepted-workers",
			path: `/serve-me/${service}/${serviceType}/order/accepted-workers`,
			labelEn: "Accepted",
			labelAr: "المقبولون",
		},
		{
			id: "payment",
			path: `/serve-me/${service}/${serviceType}/book/payment`,
			labelEn: "Payment",
			labelAr: "الدفع",
		},
		{
			id: "confirmation",
			path: `/serve-me/${service}/${serviceType}/book/confirmation`,
			labelEn: "Confirmation",
			labelAr: "التأكيد",
		},
	];
}

// ============================================================================
// Rating Modal Constants
// ============================================================================

/**
 * Rating Modal Translations
 */
export const RATING_MODAL_TRANSLATIONS = {
	en: {
		thankYou: "Thank you for your booking!",
		howWasExperience: "How was your experience?",
		shareFeedback: "Share your feedback (optional)",
		submitRating: "Submit Rating",
		submitting: "Submitting...",
		successMessage: "Your rating has been submitted. Thank you!",
		lowRatingMessage: "We're sorry to hear that. What can we improve?",
		rateDriver: "Rate your driver",
		rateService: "Rate your service",
		close: "Close",
		keyboardHint: "Press Ctrl + Enter to submit",
		ratingLabels: {
			1: "Poor",
			2: "Fair",
			3: "Good",
			4: "Very Good",
			5: "Excellent",
		},
	},
	ar: {
		thankYou: "شكرًا لتأكيد الحجز!",
		howWasExperience: "كيف كانت تجربتك؟",
		shareFeedback: "شاركنا ملاحظاتك (اختياري)",
		submitRating: "إرسال التقييم",
		submitting: "جاري الإرسال...",
		successMessage: "تم إرسال تقييمك بنجاح. شكرًا لك!",
		lowRatingMessage: "نأسف لذلك. ما الذي يمكننا تحسينه؟",
		rateDriver: "قيم سائقك",
		rateService: "قيم خدمتك",
		close: "إغلاق",
		keyboardHint: "اضغط Ctrl + Enter للإرسال",
		ratingLabels: {
			1: "ضعيف",
			2: "مقبول",
			3: "جيد",
			4: "جيد جدًا",
			5: "ممتاز",
		},
	},
} as const;

/**
 * Rating Modal Configuration
 */
export const RATING_MODAL_CONFIG = {
	SUCCESS_DISPLAY_DURATION: 2000, // milliseconds
	FOCUS_DELAY: 300, // milliseconds
	CLOSE_DELAY: 300, // milliseconds
	MIN_RATING: 1,
	MAX_RATING: 5,
	LOW_RATING_THRESHOLD: 3,
	HIGH_RATING_THRESHOLD: 4,
	STAR_COUNT: 5,
} as const;

export const FUEL_TYPES_OPTIONS = {
	en: [
		{ value: "gasoline", label:  "Gasoline" },
		{ value: "diesel", label:  "Diesel" },
		{ value: "hybrid", label:  "Hybrid" },
		{ value: "electric", label: "Electric" },
	],
	ar: [
		{ value: "gasoline", label:  "بنزين"  },
		{ value: "diesel", label:  "ديزل"},
		{ value: "hybrid", label:  "هجين" },
		{ value: "electric", label:  "كهربائي"  },
	]
}
export const CAR_MAKES_OPTIONS = {
	en: [
		{ value: "toyota", label: "Toyota" },
		{ value: "hyundai", label: "Hyundai" },
		{ value: "ford", label: "Ford" },
		{ value: "chevrolet", label: "Chevrolet" },
		{ value: "nissan", label: "Nissan" },
		{ value: "honda", label: "Honda" },
		{ value: "kia", label: "Kia" },
		{ value: "mitsubishi", label: "Mitsubishi" },
		{ value: "mercedes", label: "Mercedes-Benz" },
		{ value: "bmw", label: "BMW" },
		{ value: "audi", label: "Audi" },
		{ value: "volkswagen", label: "Volkswagen" },
		{ value: "mazda", label: "Mazda" },
		{ value: "lexus", label: "Lexus" },
		{ value: "infiniti", label: "Infiniti" },
		{ value: "other", label: "Other" },
	],

	ar: [
		{ value: "toyota", label: "تويوتا" },
		{ value: "hyundai", label: "هيونداي" },
		{ value: "ford", label: "فورد" },
		{ value: "chevrolet", label: "شيفروليه" },
		{ value: "nissan", label: "نيسان" },
		{ value: "honda", label: "هوندا" },
		{ value: "kia", label: "كيا" },
		{ value: "mitsubishi", label: "ميتسوبيشي" },
		{ value: "mercedes", label: "مرسيدس" },
		{ value: "bmw", label: "بي إم دبليو" },
		{ value: "audi", label: "أودي" },
		{ value: "volkswagen", label: "فولكس واجن" },
		{ value: "mazda", label: "مازدا" },
		{ value: "lexus", label: "لكزس" },
		{ value: "infiniti", label: "إنفينيتي" },
		{ value: "other", label: "أخرى" },
	],
};
export const TRANSMISSION_OPTIONS = {
	en: [
		{ value: "automatic", label: "Automatic" },
		{ value: "manual", label: "Manual" },
	],
	ar: [
		{ value: "automatic", label: "أوتوماتيك" },
		{ value: "manual", label: "يدوي" },
	],
};
