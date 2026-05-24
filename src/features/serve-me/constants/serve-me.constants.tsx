/**
 * Serve Me Feature Constants
 */

import type { ServiceItem, FeatureItem, ReviewItem, FAQItem } from '../types/serve-me.types'	;
import { Baby, Car, CircleCheck, Headphones, MapIcon, Scissors, Truck } from "lucide-react";
import { Wrench } from "lucide-react";

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




// Features data (Arabic)
export const SERVE_ME_FEATURES = [
	{
	  icon: <MapIcon className="w-8 h-8" />,
	  title: "تغطية شاملة",
	  description: "نصلك أينما كنت من خلال شبكة واسعة من مقدمي الخدمة المعتمدين",
	},
	{
	  icon: <Headphones className="w-8 h-8" />,
	  title: "دعم على مدار الساعة",
	  description: "فريق دعم متواجد دائماً لمساعدتك في أي وقت",
	},
	{
	  icon: <CircleCheck className="w-8 h-8" />,
	  title: "خدمة موثوقة",
	  description: "نعمل فقط مع مقدمي خدمات معتمدين لضمان أعلى جودة",
	},
  ] as FeatureItem[];
  

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


