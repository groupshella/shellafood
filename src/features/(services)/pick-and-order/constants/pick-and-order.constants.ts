/**
 * Pick & Order Feature Constants
 */

export const PICK_AND_ORDER_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Notification timeout
	NOTIFICATION_TIMEOUT_MS: 3000,
	
	// Transport types
	TRANSPORT_TYPES: {
		MOTORBIKE: 'motorbike',
		TRUCK: 'truck',
	} as const,
	
	// Order types
	ORDER_TYPES: {
		ONE_WAY: 'one-way',
		MULTI_DIRECTION: 'multi-direction',
	} as const,
} as const;

// ============================================================================
// UI Constants
// ============================================================================

// Color constants
export const COLORS = {
	primary: "#31A342",
	primaryHover: "#2a8f38",
	secondary: "#FA9D2B",
	secondaryHover: "#E88D26",
	success: "#10b981",
	warning: "#f59e0b",
	error: "#ef4444",
} as const;

// Animation durations
export const ANIMATION_DURATION = {
	fast: 0.2,
	normal: 0.3,
	slow: 0.5,
} as const;

// Spacing constants
export const SPACING = {
	section: {
		mobile: "py-12 sm:py-16",
		desktop: "lg:py-20 xl:py-32 2xl:py-40",
	},
	container: {
		mobile: "px-4 sm:px-6",
		desktop: "lg:px-8 xl:px-12 2xl:px-16",
	},
} as const;

// Container max widths
export const MAX_WIDTHS = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-6xl",
	xl: "max-w-7xl xl:max-w-[1400px]",
	"2xl": "2xl:max-w-[1600px]",
} as const;

// Common animation variants
export const ANIMATION_VARIANTS = {
	container: {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	},
	item: {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	},
	fadeIn: {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.4 },
		},
	},
	slideUp: {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	},
} as const;

// Viewport settings for scroll animations
export const VIEWPORT_SETTINGS = {
	once: true,
	margin: "-100px",
} as const;

// ============================================================================
// Driver Constants
// ============================================================================

// Driver data storage keys
export const DRIVER_STORAGE_KEYS = {
	DRIVER_PREFIX: 'driver_',
} as const;

// Default driver values
export const DEFAULT_DRIVER_VALUES = {
	AVATAR: '/driver1.jpg',
	JOIN_DATE: '2016-03-15',
	PRICE_PER_KM_MOTORBIKE: 2.5,
	PRICE_PER_KM_TRUCK: 5.0,
} as const;

// Driver specialties (default)
export const DEFAULT_DRIVER_SPECIALTIES = {
	ar: [
		"توصيل سريع",
		"خدمة ممتازة",
		"تعامل احترافي",
		"متاح على مدار الساعة",
	],
	en: [
		"Fast Delivery",
		"Excellent Service",
		"Professional",
		"24/7 Available",
	],
} as const;

// Message status delays (in milliseconds)
export const MESSAGE_STATUS_DELAYS = {
	DELIVERED: 1000,
	READ: 2000,
	TYPING_INDICATOR: 3000,
	DRIVER_RESPONSE: 3000,
} as const;

// ============================================================================
// Features Section Constants
// ============================================================================

// Feature data structure
export interface FeatureData {
	iconName: 'Clock' | 'Shield' | 'Headphones';
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
}

// Features section data
export const FEATURES_DATA: FeatureData[] = [
	{
		iconName: 'Clock',
		title: {
			ar: "توصيل سريع",
			en: "Fast Delivery",
		},
		description: {
			ar: "وصول شحنتك في الوقت المحدد",
			en: "Your shipment arrives on time",
		},
	},
	{
		iconName: 'Shield',
		title: {
			ar: "خدمة آمنة",
			en: "Secure Service",
		},
		description: {
			ar: "شحن آمن مع تتبع مباشر للشحنة",
			en: "Secure shipping with real-time tracking",
		},
	},
	{
		iconName: 'Headphones',
		title: {
			ar: "خدمة متميزة",
			en: "Premium Service",
		},
		description: {
			ar: "فريق محترف لخدمة العملاء",
			en: "Professional customer service team",
		},
	},
] as const;

// ============================================================================
// Steps Section Constants
// ============================================================================

// Step data structure
export interface StepData {
	number: string;
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
}

// Steps section data
export const STEPS_DATA: StepData[] = [
	{
		number: "01",
		title: {
			ar: "اختر نوع النقل",
			en: "Choose Transport",
		},
		description: {
			ar: "اختر ما يناسب احتياجاتك",
			en: "Select what suits your needs",
		},
	},
	{
		number: "02",
		title: {
			ar: "أدخل التفاصيل",
			en: "Enter Details",
		},
		description: {
			ar: "أدخل معلومات الشحنة",
			en: "Enter shipment information",
		},
	},
	{
		number: "03",
		title: {
			ar: "تتبع الشحنة",
			en: "Track Shipment",
		},
		description: {
			ar: "تابع شحنتك في الوقت الفعلي",
			en: "Follow your shipment in real-time",
		},
	},
] as const;

// ============================================================================
// Transport Type Section Constants
// ============================================================================

// Transport type data structure
export interface TransportTypeData {
	iconName: 'Bike' | 'Truck';
	title: {
		ar: string;
		en: string;
	};
	slug: 'motorbike' | 'truck';
	description: {
		ar: string;
		en: string;
	};
	features: {
		ar: string[];
		en: string[];
	};
	color: 'green' | 'orange';
}

// Transport types section data
export const TRANSPORT_TYPES_DATA: TransportTypeData[] = [
	{
		iconName: 'Bike',
		title: {
			ar: "دراجة نارية",
			en: "Motorbike",
		},
		slug: 'motorbike',
		description: {
			ar: "مناسبة للتوصيل السريع",
			en: "Suitable for fast delivery",
		},
		features: {
			ar: ["توصيل سريع", "أقل تكلفة", "مناسب للمسافات القصيرة"],
			en: ["Fast delivery", "Lower cost", "Suitable for short distances"],
		},
		color: 'green',
	},
	{
		iconName: 'Truck',
		title: {
			ar: "شاحنة",
			en: "Truck",
		},
		slug: 'truck',
		description: {
			ar: "مناسبة للشحنات الكبيرة",
			en: "Suitable for large shipments",
		},
		features: {
			ar: ["شحنات كبيرة", "آمنة ومضمونة", "مناسبة للمسافات الطويلة"],
			en: ["Large shipments", "Safe & secure", "Suitable for long distances"],
		},
		color: 'orange',
	},
] as const;

// ============================================================================
// Additional Section Constants (Transport Type Page)
// ============================================================================

// How It Works step data structure
export interface HowItWorksStepData {
	iconName: 'Car' | 'MapPin' | 'CreditCard' | 'Package';
	number: string;
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
}

// Why Choose Us item data structure
export interface WhyChooseItemData {
	iconName: 'Star' | 'CheckCircle2' | 'Shield';
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
}

// How It Works section data
export const HOW_IT_WORKS_DATA: HowItWorksStepData[] = [
	{
		iconName: 'Car',
		number: "01",
		title: {
			ar: "اختر نوع الخدمة",
			en: "Choose Service Type",
		},
		description: {
			ar: "اختر النوع المناسب لاحتياجاتك",
			en: "Select the type that suits your needs",
		},
	},
	{
		iconName: 'MapPin',
		number: "02",
		title: {
			ar: "حدد الوجهة",
			en: "Set Destination",
		},
		description: {
			ar: "أدخل عنوان التوصيل والمكان المطلوب",
			en: "Enter delivery address and destination",
		},
	},
	{
		iconName: 'CreditCard',
		number: "03",
		title: {
			ar: "ادفع بأمان",
			en: "Pay Securely",
		},
		description: {
			ar: "راجع تفاصيل الطلب وأكده",
			en: "Review order details and confirm",
		},
	},
	{
		iconName: 'Package',
		number: "04",
		title: {
			ar: "تتبع شحنتك",
			en: "Track Your Shipment",
		},
		description: {
			ar: "تابع شحنتك في الوقت الفعلي",
			en: "Track your shipment in real-time",
		},
	},
] as const;

// Why Choose Us section data
export const WHY_CHOOSE_US_DATA: WhyChooseItemData[] = [
	{
		iconName: 'Star',
		title: {
			ar: "خدمة متميزة",
			en: "Premium Service",
		},
		description: {
			ar: "فريق محترف ومدرب لضمان أفضل تجربة توصيل",
			en: "Professional and trained team to ensure the best delivery experience",
		},
	},
	{
		iconName: 'CheckCircle2',
		title: {
			ar: "ضمان الجودة",
			en: "Quality Guarantee",
		},
		description: {
			ar: "نضمن وصول شحنتك بأمان وفي الوقت المحدد",
			en: "We guarantee your shipment arrives safely and on time",
		},
	},
	{
		iconName: 'Shield',
		title: {
			ar: "أمان مضمون",
			en: "Guaranteed Safety",
		},
		description: {
			ar: "شحن آمن مع تأمين كامل على جميع الشحنات",
			en: "Secure shipping with full insurance on all shipments",
		},
	},
] as const;

// Additional Section Content
export const ADDITIONAL_SECTION_CONTENT = {
	howItWorks: {
		title: {
			ar: "كيف تعمل خدمتنا",
			en: "How Our Service Works",
		},
		subtitle: {
			ar: "خطوات بسيطة لتوصيل سريع وآمن",
			en: "Simple steps for fast and secure delivery",
		},
	},
	whyChooseUs: {
		title: {
			ar: "لماذا تختارنا؟",
			en: "Why Choose Us?",
		},
		subtitle: {
			ar: "نقدم أفضل تجربة توصيل لتناسب احتياجاتك اليومية.",
			en: "We provide the best delivery experience to suit your daily needs.",
		},
	},
} as const;

// ============================================================================
// Transport Type Page Features Section Constants
// ============================================================================

// Transport Type Page feature data structure
export interface TransportTypePageFeatureData {
	iconName: 'Zap' | 'Shield' | 'Headphones';
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
	badge: {
		ar: string | null;
		en: string | null;
	};
}

// Transport Type Page features section data
export const TRANSPORT_TYPE_PAGE_FEATURES_DATA: TransportTypePageFeatureData[] = [
	{
		iconName: 'Zap',
		title: {
			ar: "توصيل سريع",
			en: "Fast Delivery",
		},
		description: {
			ar: "وصول شحنتك في الوقت المحدد مع ضمان السرعة",
			en: "Your shipment arrives on time with speed guarantee",
		},
		badge: {
			ar: "جديد",
			en: "New",
		},
	},
	{
		iconName: 'Shield',
		title: {
			ar: "خدمة آمنة",
			en: "Secure Service",
		},
		description: {
			ar: "شحن آمن مع تتبع مباشر للشحنة وتأمين كامل",
			en: "Secure shipping with real-time tracking and full insurance",
		},
		badge: {
			ar: null,
			en: null,
		},
	},
	{
		iconName: 'Headphones',
		title: {
			ar: "خدمة متميزة",
			en: "Premium Service",
		},
		description: {
			ar: "فريق محترف لخدمة العملاء متاح على مدار الساعة",
			en: "Professional customer service team available 24/7",
		},
		badge: {
			ar: null,
			en: null,
		},
	},
] as const;

// ============================================================================
// Transport Type Page Info Section Constants
// ============================================================================

// Info item data structure
export interface InfoItemData {
	iconName: 'Clock' | 'MapPin' | 'Shield' | 'CheckCircle2';
	title: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
}

// Testimonial data structure
export interface TestimonialData {
	name: {
		ar: string;
		en: string;
	};
	role: {
		ar: string;
		en: string;
	};
	rating: number;
	comment: {
		ar: string;
		en: string;
	};
	avatar: string;
}

// Info section items data
export const INFO_SECTION_ITEMS_DATA: InfoItemData[] = [
	{
		iconName: 'Clock',
		title: {
			ar: "توصيل سريع",
			en: "Fast Delivery",
		},
		description: {
			ar: "في أقل من 30 دقيقة",
			en: "In less than 30 minutes",
		},
	},
	{
		iconName: 'MapPin',
		title: {
			ar: "تتبع مباشر",
			en: "Real-Time Tracking",
		},
		description: {
			ar: "تابع شحنتك لحظة بلحظة",
			en: "Track your shipment in real-time",
		},
	},
	{
		iconName: 'Shield',
		title: {
			ar: "ضمان الأمان",
			en: "Safety Guarantee",
		},
		description: {
			ar: "تأمين كامل على جميع الشحنات",
			en: "Full insurance on all shipments",
		},
	},
	{
		iconName: 'CheckCircle2',
		title: {
			ar: "خدمة موثوقة",
			en: "Reliable Service",
		},
		description: {
			ar: "نسبة نجاح 98%",
			en: "98% success rate",
		},
	},
] as const;

// Testimonials data
export const TESTIMONIALS_DATA: TestimonialData[] = [
	{
		name: {
			ar: "أحمد محمد",
			en: "Ahmed Mohammed",
		},
		role: {
			ar: "رجل أعمال",
			en: "Business Owner",
		},
		rating: 5,
		comment: {
			ar: "خدمة ممتازة وسريعة، أنصح بها بشدة",
			en: "Excellent and fast service, highly recommended",
		},
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
	},
	{
		name: {
			ar: "فاطمة علي",
			en: "Fatima Ali",
		},
		role: {
			ar: "ربة منزل",
			en: "Housewife",
		},
		rating: 5,
		comment: {
			ar: "أفضل خدمة توصيل استخدمتها، موثوقة جداً",
			en: "Best delivery service I've used, very reliable",
		},
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
	},
] as const;

