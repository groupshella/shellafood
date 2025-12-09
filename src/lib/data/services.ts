import { Wrench, Shield, CircleDot, Hammer, Zap } from "lucide-react";
import React from "react";

/**
 * Service Types Configuration
 * New Structure:
 * - ServiceCategoryData: Main service categories (e.g., "Legal Services", "Home Maintenance")
 * - IndividualServiceData: Individual services within a category (e.g., "Legal Consultation")
 */

// Individual Service (the deepest nested level)
export interface IndividualServiceData {
	slug: string;
	titleAr: string;
	titleEn: string;
	descriptionAr: string;
	descriptionEn: string;
	heroImage: string;
	priceStartsFrom: number; // Price in SAR
	rating: number;
	reviewsCount: number;
	features: {
		ar: Array<{ text: string; included: boolean }>;
		en: Array<{ text: string; included: boolean }>;
	};
	serviceDetails: {
		ar: Array<{ text: string }>;
		en: Array<{ text: string }>;
	};
}

// Service Category (parent level)
export interface ServiceCategoryData {
	slug: string; // URL-friendly identifier
	titleAr: string;
	titleEn: string;
	descriptionAr: string;
	descriptionEn: string;
	heroImage: string; // Main hero image
	videoThumbnail: string; // Video section thumbnail
	mainServices: {
		ar: Array<{ slug: string; title: string; image: string; path: string,description: string }>;
		en: Array<{ slug: string; title: string; image: string; path: string,description: string }>;
	};
	whyChooseUs: {
		ar: Array<{ title: string; description: string; icon: React.ReactNode }>;
		en: Array<{ title: string; description: string; icon: React.ReactNode }>;
	};
	availableWorkshops: {
		ar: Array<{ 
			name: string; 
			image: string; 
			rating: number; 
			distance: string; 
			availableHours: string;
		}>;
		en: Array<{ 
			name: string; 
			image: string; 
			rating: number; 
			distance: string; 
			availableHours: string;
		}>;
	};
}

export const serviceCategoriesData: Record<string, ServiceCategoryData> = {
"home-maintenance": {
	slug: "home-maintenance",
	titleAr: "صيانة المنازل الشاملة",
	titleEn: "Complete Home Maintenance",
	descriptionAr: "نوفر لك حلول صيانة متكاملة تشمل السباكة، الكهرباء، النجارة، التكييف، والدهانات بجودة عالية وأسعار تنافسية",
	descriptionEn: "We provide comprehensive maintenance solutions including plumbing, electrical, carpentry, AC, and painting with high quality and competitive prices",
	heroImage: "/home-maintenance.jpg",
	videoThumbnail: "/ac-condition.jpg",
	mainServices: {
		ar: [
			{ 
				slug: "plumbing-water-services", 
				title: "السباكة وأعمال المياه", 
				description: "خدمات شاملة للسباكة تشمل إصلاح التسريبات، تسليك المجاري، تركيب الأدوات الصحية والسخانات",
				image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/plumbing-water-services" 
			},
			{ 
				slug: "electrical-lighting-services", 
				title: "الكهرباء والإنارة", 
				description: "تركيب وصيانة الأسلاك، إصلاح الأعطال الكهربائية، تركيب الإضاءة واللوحات الكهربائية",
				image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/electrical-lighting-services" 
			},
			{ 
				slug: "ac-cooling-services", 
				title: "التكييف والتبريد", 
				description: "تنظيف وصيانة المكيفات، إصلاح الأعطال، تعبئة الغاز، فك وتركيب جميع الأنواع",
				image: "/ac-condition.jpg", 
				path: "/serve-me/home-maintenance/ac-cooling-services" 
			},
			{ 
				slug: "carpentry-furniture-services", 
				title: "النجارة والأثاث", 
				description: "إصلاح الأبواب والنوافذ، تركيب الأثاث، الأقفال، والتركيبات الجدارية المختلفة",
				image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/carpentry-furniture-services" 
			},
			{ 
				slug: "painting-decoration-services", 
				title: "الدهانات والديكورات", 
				description: "دهان الجدران والأسقف، معالجة الرطوبة والتشققات، تركيب ورق الجدران",
				image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/painting-decoration-services" 
			},
			{ 
				slug: "structure-finishing-services", 
				title: "صيانة البنية والتشطيبات", 
				description: "تركيب وإصلاح البلاط والسيراميك، أعمال العزل، واللحام والمعادن",
				image: "https://images.unsplash.com/photo-1581092918484-8313e1f128b7?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/structure-finishing-services" 
			},
			{ 
				slug: "home-cleaning", 
				title: "التنظيف المنزلي", 
				description: "تنظيف شامل للمنزل، تلميع الأرضيات، تنظيف النوافذ والمفروشات",
				image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/home-cleaning" 
			},
			{ 
				slug: "pest-control", 
				title: "مكافحة الآفات", 
				description: "رش المبيدات الآمنة، مكافحة الحشرات والقوارض، حلول وقائية فعالة",
				image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/pest-control" 
			},
		],
		en: [
			{ 
				slug: "plumbing-water-services", 
				title: "Plumbing & Water Services", 
				description: "Comprehensive plumbing services including leak repair, drain cleaning, sanitary fixtures and heater installation",
				image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/plumbing-water-services" 
			},
			{ 
				slug: "electrical-lighting-services", 
				title: "Electrical & Lighting Services", 
				description: "Wiring installation and maintenance, electrical fault repair, lighting and electrical panel installation",
				image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/electrical-lighting-services" 
			},
			{ 
				slug: "ac-cooling-services", 
				title: "AC & Cooling Services", 
				description: "AC cleaning and maintenance, fault repair, gas refilling, installation and removal of all types",
				image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/ac-cooling-services" 
			},
			{ 
				slug: "carpentry-furniture-services", 
				title: "Carpentry & Furniture Services", 
				description: "Door and window repair, furniture assembly, locks installation, and various wall mounting services",
				image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/carpentry-furniture-services" 
			},
			{ 
				slug: "painting-decoration-services", 
				title: "Painting & Decoration Services", 
				description: "Wall and ceiling painting, moisture and crack treatment, wallpaper installation",
				image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/painting-decoration-services" 
			},
			{ 
				slug: "structure-finishing-services", 
				title: "Structure & Finishing Services", 
				description: "Tile and ceramic installation and repair, insulation work, welding and metalwork",
				image: "https://images.unsplash.com/photo-1581092918484-8313e1f128b7?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/structure-finishing-services" 
			},
			{ 
				slug: "home-cleaning", 
				title: "Home Cleaning", 
				description: "Complete home cleaning, floor polishing, window and upholstery cleaning",
				image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/home-cleaning" 
			},
			{ 
				slug: "pest-control", 
				title: "Pest Control", 
				description: "Safe pesticide spraying, insect and rodent control, effective preventive solutions",
				image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop", 
				path: "/serve-me/home-maintenance/pest-control" 
			},
		],
	},
	whyChooseUs: {
		ar: [
			{ title: "ضمان الجودة", description: "نلتزم بأعلى معايير الجودة في كل خدمة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "خدمة على مدار الساعة", description: "دعم فني متاح 24/7 لحالات الطوارئ", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "فنيون محترفون", description: "فريق من الخبراء المعتمدين وذوي الخبرة", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
		en: [
			{ title: "Quality Guarantee", description: "We commit to the highest quality standards in every service", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "24/7 Service", description: "Technical support available round the clock for emergencies", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "Professional Technicians", description: "Team of certified and experienced experts", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
	},
	availableWorkshops: {
		ar: [
		  { 
			name: "ورشة النخبة الحديثة", 
			image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", 
			rating: 4.9, 
			distance: "0.8 كم", 
			availableHours: "متاح اليوم: 24 ساعة"
		  },
		  { 
			name: "خدمات المحترف للصيانة", 
			image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop", 
			rating: 4.5, 
			distance: "5.2 كم", 
			availableHours: "متاح اليوم: 10 ص - 6 م"
		  },
		],
		en: [
		  { 
			name: "Elite Modern Workshop", 
			image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", 
			rating: 4.9, 
			distance: "0.8 km", 
			availableHours: "Available today: 24 Hours"
		  },
		  { 
			name: "Pro Maintenance Services", 
			image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop", 
			rating: 4.5, 
			distance: "5.2 km", 
			availableHours: "Available today: 10 AM - 6 PM"
		  },
		],
	  }
},
"car-maintenance": {
	slug: "car-maintenance",
	titleAr: "خدمات صيانة السيارات المتكاملة",
	titleEn: "Complete Car Maintenance Services",
	descriptionAr: "صيانة وإصلاح احترافية لسيارتك بأيدي خبراء معتمدين وقطع غيار أصلية",
	descriptionEn: "Professional maintenance and repair for your car by certified experts with original spare parts",
	heroImage: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=1200&h=800&fit=crop",
	videoThumbnail: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop",
	mainServices: {
		ar: [
			{ 
				slug: "periodic-maintenance", 
				title: "الصيانة الدورية", 
				image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/periodic-maintenance",
				description: "صيانة دورية شاملة حسب عداد الكيلومترات مع فحص كامل للسيارة"
			},
			{ 
				slug: "mechanical-repair", 
				title: "إصلاح ميكانيكي", 
				image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/mechanical-repair",
				description: "إصلاح المحرك، ناقل الحركة، نظام التعليق وجميع الأعطال الميكانيكية"
			},
			{ 
				slug: "electrical-repair", 
				title: "إصلاح كهربائي", 
				image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/electrical-repair",
				description: "إصلاح الأنظمة الكهربائية، البطارية، المولد والإلكترونيات"
			},
			{ 
				slug: "tire-services", 
				title: "خدمات الإطارات", 
				image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/tire-services",
				description: "بيع وتركيب الإطارات، ترصيص، موازنة وفحص شامل للإطارات"
			},
			{ 
				slug: "car-care", 
				title: "العناية بالسيارة", 
				image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/car-care",
				description: "غسيل، تلميع، تنظيف داخلي، معالجة الخدوش والعناية الكاملة"
			},
			{ 
				slug: "spare-parts", 
				title: "قطع الغيار", 
				image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/spare-parts",
				description: "توفير قطع غيار أصلية ومضمونة لجميع أنواع السيارات"
			},
		],
		en: [
			{ 
				slug: "periodic-maintenance", 
				title: "Periodic Maintenance", 
				image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/periodic-maintenance",
				description: "Comprehensive periodic maintenance according to mileage with complete car inspection"
			},
			{ 
				slug: "mechanical-repair", 
				title: "Mechanical Repair", 
				image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/mechanical-repair",
				description: "Engine, transmission, suspension system repair and all mechanical faults"
			},
			{ 
				slug: "electrical-repair", 
				title: "Electrical Repair", 
				image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/electrical-repair",
				description: "Electrical systems, battery, alternator and electronics repair"
			},
			{ 
				slug: "tire-services", 
				title: "Tire Services", 
				image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/tire-services",
				description: "Tire sales and installation, alignment, balancing and comprehensive tire inspection"
			},
			{ 
				slug: "car-care", 
				title: "Car Care", 
				image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/car-care",
				description: "Washing, polishing, interior cleaning, scratch treatment and complete care"
			},
			{ 
				slug: "spare-parts", 
				title: "Spare Parts", 
				image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop", 
				path: "/serve-me/car-maintenance/spare-parts",
				description: "Original and guaranteed spare parts for all car types"
			},
		],
	},
	whyChooseUs: {
		ar: [
			{ title: "فنيون معتمدون", description: "فريق من الفنيين المعتمدين والمحترفين", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "خدمة سريعة", description: "إنجاز العمل في الوقت المحدد", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "ضمان الخدمة", description: "ضمان على جميع أعمال الصيانة", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
		en: [
			{ title: "Certified Technicians", description: "Team of certified professional technicians", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "Fast Service", description: "Work completed on time", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "Service Warranty", description: "Warranty on all maintenance work", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
	},
	availableWorkshops: {
		ar: [
			{ 
				name: "ورشة السيارات المتقدمة", 
				image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
				rating: 4.9, 
				distance: "1.8 كم", 
				availableHours: "متاح اليوم من: 8 ص - 8 م"
			},
			{ 
				name: "مركز الصيانة السريع", 
				image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
				rating: 4.6, 
				distance: "2.3 كم", 
				availableHours: "متاح اليوم من: 9 ص - 7 م"
			},
		],
		en: [
			{ 
				name: "Advanced Auto Workshop", 
				image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
				rating: 4.9, 
				distance: "1.8 km", 
				availableHours: "Available today: 8 AM - 8 PM"
			},
			{ 
				name: "Quick Service Center", 
				image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
				rating: 4.6, 
				distance: "2.3 km", 
				availableHours: "Available today: 9 AM - 7 PM"
			},
		],
	},
},
};

/**
 * Individual Services Data
 * Maps `${categorySlug}/${serviceSlug}` to service details
 */
export const individualServicesData: Record<string, IndividualServiceData> = {


	// ============================================
	// CLEANING & PEST CONTROL (EXISTING SERVICES)
	// ============================================
	"home-maintenance/pest-control": {
		slug: "pest-control",
		titleAr: "مكافحة الآفات والحشرات",
		titleEn: "Pest and Insect Control",
		descriptionAr: "حلول متقدمة لمكافحة الحشرات والآفات باستخدام مواد آمنة ومعتمدة صحياً",
		descriptionEn: "Advanced pest and insect control solutions using safe and health-approved materials",
		heroImage: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop",
		priceStartsFrom: 250,
		rating: 4.8,
		reviewsCount: 387,
		features: {
			ar: [
				{ text: "فحص مجاني للمنزل قبل الخدمة", included: true },
				{ text: "مبيدات آمنة معتمدة من وزارة الصحة", included: true },
				{ text: "ضمان شامل لمدة 3 أشهر", included: true },
				{ text: "خدمة متابعة مجانية بعد شهر", included: true },
				{ text: "خدمة طوارئ على مدار الساعة", included: false },
			],
			en: [
				{ text: "Free home inspection before service", included: true },
				{ text: "Safe pesticides approved by Ministry of Health", included: true },
				{ text: "Comprehensive 3-month warranty", included: true },
				{ text: "Free follow-up service after one month", included: true },
				{ text: "24/7 emergency service", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "رش ومكافحة الصراصير بتقنية الجل الألماني" },
				{ text: "معالجة النمل الأبيض والقضاء على الأعشاش" },
				{ text: "مكافحة القوارض وإغلاق منافذ الدخول" },
				{ text: "رش المبيدات الخارجية للحديقة والمحيط" },
				{ text: "تعقيم وتطهير شامل بعد المكافحة" },
			],
			en: [
				{ text: "Cockroach control using German gel technology" },
				{ text: "Termite treatment and nest elimination" },
				{ text: "Rodent control and entry point sealing" },
				{ text: "Exterior pesticide spraying for garden and perimeter" },
				{ text: "Comprehensive sterilization after treatment" },
			],
		},
	},

	"home-maintenance/home-cleaning": {
		slug: "home-cleaning",
		titleAr: "التنظيف المنزلي والحدائق",
		titleEn: "Home and Garden Cleaning",
		descriptionAr: "خدمات تنظيف شاملة ومتخصصة للمنازل والحدائق بفريق مدرب ومواد صديقة للبيئة",
		descriptionEn: "Comprehensive specialized cleaning services for homes and gardens with trained team and eco-friendly materials",
		heroImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop",
		priceStartsFrom: 220,
		rating: 4.9,
		reviewsCount: 531,
		features: {
			ar: [
				{ text: "فريق محترف مدرب ومؤمن بالكامل", included: true },
				{ text: "مواد تنظيف عضوية آمنة للأطفال", included: true },
				{ text: "تأمين شامل على الممتلكات", included: true },
				{ text: "معدات تنظيف حديثة ومعقمة", included: true },
				{ text: "اشتراك شهري بخصم 20%", included: false },
			],
			en: [
				{ text: "Professional fully trained and insured team", included: true },
				{ text: "Organic cleaning materials safe for children", included: true },
				{ text: "Comprehensive property insurance", included: true },
				{ text: "Modern and sterilized cleaning equipment", included: true },
				{ text: "Monthly subscription with 20% discount", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تنظيف شامل لجميع الغرف والمرافق والحمامات" },
				{ text: "تنظيف وتلميع النوافذ والزجاج من الداخل والخارج" },
				{ text: "غسيل وتنظيف السجاد والمفروشات بالبخار" },
				{ text: "تنظيف وتنسيق الحدائق وقص الأشجار" },
				{ text: "تلميع الأرضيات الرخامية والخشبية بمواد متخصصة" },
			],
			en: [
				{ text: "Comprehensive cleaning of all rooms, facilities, and bathrooms" },
				{ text: "Interior and exterior window and glass cleaning and polishing" },
				{ text: "Carpet and upholstery steam washing and cleaning" },
				{ text: "Garden cleaning, landscaping, and tree trimming" },
				{ text: "Marble and wooden floor polishing with specialized materials" },
			],
		},
	},
	// ============================================
	// MAIN SERVICES (Category-level services)
	// ============================================
	"home-maintenance/plumbing-water-services": {
		slug: "plumbing-water-services",
		titleAr: "السباكة وأعمال المياه",
		titleEn: "Plumbing & Water Services",
		descriptionAr: "خدمات شاملة للسباكة تشمل إصلاح التسريبات، تسليك المجاري، تركيب الأدوات الصحية والسخانات",
		descriptionEn: "Comprehensive plumbing services including leak repair, drain cleaning, sanitary fixtures and heater installation",
		heroImage: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
		priceStartsFrom: 150,
		rating: 4.8,
		reviewsCount: 456,
		features: {
			ar: [
				{ text: "فنيون محترفون ومرخصون", included: true },
				{ text: "استجابة سريعة للطوارئ", included: true },
				{ text: "قطع غيار أصلية معتمدة", included: true },
				{ text: "ضمان 6 أشهر على جميع الأعمال", included: true },
				{ text: "خدمة طوارئ 24 ساعة", included: false },
			],
			en: [
				{ text: "Professional and licensed technicians", included: true },
				{ text: "Quick emergency response", included: true },
				{ text: "Certified original spare parts", included: true },
				{ text: "6-month warranty on all works", included: true },
				{ text: "24-hour emergency service", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "إصلاح تسريبات المياه المخفية والظاهرة" },
				{ text: "تسليك المجاري والبلاعات" },
				{ text: "تركيب وصيانة الأدوات الصحية" },
				{ text: "تركيب وصيانة السخانات" },
				{ text: "تركيب وصيانة مضخات المياه" },
			],
			en: [
				{ text: "Hidden and visible water leak repair" },
				{ text: "Drain and sewer unclogging" },
				{ text: "Sanitary fixtures installation and maintenance" },
				{ text: "Water heater installation and maintenance" },
				{ text: "Water pump installation and maintenance" },
			],
		},
	},

	"home-maintenance/electrical-lighting-services": {
		slug: "electrical-lighting-services",
		titleAr: "الكهرباء والإنارة",
		titleEn: "Electrical & Lighting Services",
		descriptionAr: "تركيب وصيانة الأسلاك، إصلاح الأعطال الكهربائية، تركيب الإضاءة واللوحات الكهربائية",
		descriptionEn: "Wiring installation and maintenance, electrical fault repair, lighting and electrical panel installation",
		heroImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop",
		priceStartsFrom: 180,
		rating: 4.7,
		reviewsCount: 412,
		features: {
			ar: [
				{ text: "فنيون مرخصون من الدفاع المدني", included: true },
				{ text: "ضمان سنة على جميع الأعمال", included: true },
				{ text: "مواد وكابلات أصلية معتمدة", included: true },
				{ text: "فحص مجاني للوحة الكهربائية", included: true },
				{ text: "خدمة طوارئ على مدار الساعة", included: false },
			],
			en: [
				{ text: "Civil Defense licensed technicians", included: true },
				{ text: "One-year warranty on all works", included: true },
				{ text: "Certified original materials and cables", included: true },
				{ text: "Free electrical panel inspection", included: true },
				{ text: "24/7 emergency service", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تركيب وصيانة جميع أنواع الإضاءة" },
				{ text: "إصلاح الأعطال الكهربائية الطارئة" },
				{ text: "تركيب المفاتيح والأفياش" },
				{ text: "تركيب وصيانة اللوحات الكهربائية" },
				{ text: "تمديد الكابلات والتأسيس الكهربائي" },
			],
			en: [
				{ text: "Installation and maintenance of all lighting types" },
				{ text: "Emergency electrical fault repair" },
				{ text: "Switch and socket installation" },
				{ text: "Electrical panel installation and maintenance" },
				{ text: "Cable extension and electrical installation" },
			],
		},
	},

	"home-maintenance/ac-cooling-services": {
		slug: "ac-cooling-services",
		titleAr: "التكييف والتبريد",
		titleEn: "AC & Cooling Services",
		descriptionAr: "تنظيف وصيانة المكيفات، إصلاح الأعطال، تعبئة الغاز، فك وتركيب جميع الأنواع",
		descriptionEn: "AC cleaning and maintenance, fault repair, gas refilling, installation and removal of all types",
		heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop",
		priceStartsFrom: 200,
		rating: 4.8,
		reviewsCount: 523,
		features: {
			ar: [
				{ text: "فنيون متخصصون في جميع الماركات", included: true },
				{ text: "فحص شامل لجميع المكونات", included: true },
				{ text: "ضمان 3 أشهر على الصيانة", included: true },
				{ text: "غاز فريون أصلي معتمد", included: true },
				{ text: "عقد صيانة سنوي شامل", included: false },
			],
			en: [
				{ text: "Technicians specialized in all brands", included: true },
				{ text: "Comprehensive inspection of all components", included: true },
				{ text: "3-month maintenance warranty", included: true },
				{ text: "Original certified Freon gas", included: true },
				{ text: "Comprehensive annual maintenance contract", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تنظيف وغسيل المكيفات بالبخار" },
				{ text: "إصلاح الأعطال الفنية" },
				{ text: "تعبئة غاز الفريون" },
				{ text: "فك وتركيب جميع أنواع المكيفات" },
				{ text: "فحص الأداء والتبريد" },
			],
			en: [
				{ text: "AC cleaning and steam washing" },
				{ text: "Technical fault repair" },
				{ text: "Freon gas refilling" },
				{ text: "Installation and removal of all AC types" },
				{ text: "Performance and cooling inspection" },
			],
		},
	},

	"home-maintenance/carpentry-furniture-services": {
		slug: "carpentry-furniture-services",
		titleAr: "النجارة والأثاث",
		titleEn: "Carpentry & Furniture Services",
		descriptionAr: "إصلاح الأبواب والنوافذ، تركيب الأثاث، الأقفال، والتركيبات الجدارية المختلفة",
		descriptionEn: "Door and window repair, furniture assembly, locks installation, and various wall mounting services",
		heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop",
		priceStartsFrom: 150,
		rating: 4.7,
		reviewsCount: 467,
		features: {
			ar: [
				{ text: "نجارون محترفون بخبرة طويلة", included: true },
				{ text: "تركيب سريع ودقيق", included: true },
				{ text: "ضمان 3 أشهر على الأعمال", included: true },
				{ text: "قطع غيار أصلية متوفرة", included: true },
				{ text: "تصاميم مخصصة حسب الطلب", included: false },
			],
			en: [
				{ text: "Professional carpenters with extensive experience", included: true },
				{ text: "Fast and accurate installation", included: true },
				{ text: "3-month warranty on works", included: true },
				{ text: "Original spare parts available", included: true },
				{ text: "Custom designs on request", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "إصلاح الأبواب والنوافذ الخشبية" },
				{ text: "تركيب الأثاث المُفَكَّك" },
				{ text: "تركيب الأقفال والمقابض" },
				{ text: "التركيبات الجدارية" },
				{ text: "صيانة وترميم الأثاث" },
			],
			en: [
				{ text: "Wooden door and window repair" },
				{ text: "Disassembled furniture assembly" },
				{ text: "Locks and handles installation" },
				{ text: "Wall mounting services" },
				{ text: "Furniture maintenance and restoration" },
			],
		},
	},

	"home-maintenance/painting-decoration-services": {
		slug: "painting-decoration-services",
		titleAr: "الدهانات والديكورات",
		titleEn: "Painting & Decoration Services",
		descriptionAr: "دهان الجدران والأسقف، معالجة الرطوبة والتشققات، تركيب ورق الجدران",
		descriptionEn: "Wall and ceiling painting, moisture and crack treatment, wallpaper installation",
		heroImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
		priceStartsFrom: 15,
		rating: 4.8,
		reviewsCount: 398,
		features: {
			ar: [
				{ text: "دهانات عالية الجودة ومعتمدة", included: true },
				{ text: "عمال ماهرون ومدربون", included: true },
				{ text: "ضمان سنة على الدهان", included: true },
				{ text: "تنظيف شامل بعد العمل", included: true },
				{ text: "استشارة مجانية للألوان", included: false },
			],
			en: [
				{ text: "High quality and certified paints", included: true },
				{ text: "Skilled and trained workers", included: true },
				{ text: "One-year painting warranty", included: true },
				{ text: "Comprehensive cleaning after work", included: true },
				{ text: "Free color consultation", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "دهان جدران وأسقف بجميع الألوان" },
				{ text: "معالجة التشققات والرطوبة" },
				{ text: "تركيب ورق الجدران" },
				{ text: "دهانات ديكورية وتأثيرات خاصة" },
				{ text: "دهان أبواب ونوافذ خشبية" },
			],
			en: [
				{ text: "Wall and ceiling painting in all colors" },
				{ text: "Crack and moisture treatment" },
				{ text: "Wallpaper installation" },
				{ text: "Decorative paints and special effects" },
				{ text: "Wooden door and window painting" },
			],
		},
	},

	"home-maintenance/structure-finishing-services": {
		slug: "structure-finishing-services",
		titleAr: "صيانة البنية والتشطيبات",
		titleEn: "Structure & Finishing Services",
		descriptionAr: "تركيب وإصلاح البلاط والسيراميك، أعمال العزل، واللحام والمعادن",
		descriptionEn: "Tile and ceramic installation and repair, insulation work, welding and metalwork",
		heroImage: "https://images.unsplash.com/photo-1581092918484-8313e1f128b7?w=600&h=400&fit=crop",
		priceStartsFrom: 200,
		rating: 4.8,
		reviewsCount: 312,
		features: {
			ar: [
				{ text: "عمال محترفون ومهرة", included: true },
				{ text: "مواد عالية الجودة", included: true },
				{ text: "ضمان سنة على الأعمال", included: true },
				{ text: "دقة في التنفيذ", included: true },
				{ text: "تنظيف شامل بعد الانتهاء", included: false },
			],
			en: [
				{ text: "Professional and skilled workers", included: true },
				{ text: "High quality materials", included: true },
				{ text: "One-year warranty on works", included: true },
				{ text: "Precision in execution", included: true },
				{ text: "Comprehensive cleaning after completion", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تركيب وإصلاح البلاط والسيراميك" },
				{ text: "أعمال العزل المائي والحراري" },
				{ text: "اللحام والمعادن" },
				{ text: "أعمال الجلي والتلميع" },
				{ text: "صيانة البنية التحتية" },
			],
			en: [
				{ text: "Tile and ceramic installation and repair" },
				{ text: "Water and thermal insulation work" },
				{ text: "Welding and metalwork" },
				{ text: "Grinding and polishing works" },
				{ text: "Infrastructure maintenance" },
			],
		},
	},

	// ============================================
	// LEGAL SERVICES
	// ============================================
	"legal-services/legal-consultation": {
		slug: "legal-consultation",
		titleAr: "استشارة قانونية",
		titleEn: "Legal Consultation",
		descriptionAr: "نقدم خدمات قانونية واستشارية متكاملة",
		descriptionEn: "We provide complete legal and consultative services",
		heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop",
		priceStartsFrom: 150,
		rating: 4.7,
		reviewsCount: 250,
		features: {
			ar: [
				{ text: "استشارة من محامي معتمد", included: true },
				{ text: "سرية تامة", included: true },
				{ text: "متابعة دورية", included: true },
				{ text: "تمثيل قانوني", included: false },
			],
			en: [
				{ text: "Consultation from certified lawyer", included: true },
				{ text: "Complete confidentiality", included: true },
				{ text: "Periodic follow-up", included: true },
				{ text: "Legal representation", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "استشارات قانونية عامة" },
				{ text: "مراجعة العقود" },
				{ text: "استشارات أحوال شخصية" },
				{ text: "استشارات تجارية" },
			],
			en: [
				{ text: "General legal consultations" },
				{ text: "Contract review" },
				{ text: "Personal status consultations" },
				{ text: "Commercial consultations" },
			],
		},
	},

	
"car-maintenance/periodic-maintenance": {
	slug: "periodic-maintenance",
	titleAr: "الصيانة الدورية الشاملة",
	titleEn: "Comprehensive Periodic Maintenance",
	descriptionAr: "صيانة دورية كاملة للسيارة وفق جدول الشركة المصنعة لضمان الأداء الأمثل",
	descriptionEn: "Complete periodic car maintenance according to manufacturer's schedule for optimal performance",
	heroImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
	priceStartsFrom: 350,
	rating: 4.9,
	reviewsCount: 542,
	features: {
		ar: [
			{ text: "فحص شامل بأجهزة إلكترونية متطورة", included: true },
			{ text: "تغيير زيت المحرك والفلاتر", included: true },
			{ text: "فحص جميع السوائل والمكابح", included: true },
			{ text: "تقرير فني مفصل بحالة السيارة", included: true },
			{ text: "غسيل مجاني للسيارة", included: false },
		],
		en: [
			{ text: "Comprehensive inspection with advanced electronic devices", included: true },
			{ text: "Engine oil and filter change", included: true },
			{ text: "All fluids and brakes inspection", included: true },
			{ text: "Detailed technical report on car condition", included: true },
			{ text: "Free car wash", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "تغيير زيت المحرك والفلتر حسب نوع السيارة" },
			{ text: "فحص وتعبئة سوائل الفرامل والمقود والمبرد" },
			{ text: "فحص البطارية ونظام الشحن" },
			{ text: "فحص الفرامل والبريكات والديسكات" },
			{ text: "فحص الإطارات والضغط والتآكل" },
		],
		en: [
			{ text: "Engine oil and filter change according to car type" },
			{ text: "Brake, steering and coolant fluid inspection and refill" },
			{ text: "Battery and charging system inspection" },
			{ text: "Brakes, pads and discs inspection" },
			{ text: "Tire, pressure and wear inspection" },
		],
	},
},

"car-maintenance/mechanical-repair": {
	slug: "mechanical-repair",
	titleAr: "الإصلاح الميكانيكي المتخصص",
	titleEn: "Specialized Mechanical Repair",
	descriptionAr: "إصلاح شامل لجميع الأعطال الميكانيكية بقطع غيار أصلية وضمان موثوق",
	descriptionEn: "Comprehensive repair of all mechanical faults with original spare parts and reliable warranty",
	heroImage: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop",
	priceStartsFrom: 500,
	rating: 4.8,
	reviewsCount: 423,
	features: {
		ar: [
			{ text: "تشخيص دقيق بأجهزة الكمبيوتر", included: true },
			{ text: "فنيون متخصصون معتمدون", included: true },
			{ text: "قطع غيار أصلية مضمونة", included: true },
			{ text: "ضمان 6 أشهر على الإصلاح", included: true },
			{ text: "خدمة سحب وتوصيل مجانية", included: false },
		],
		en: [
			{ text: "Accurate diagnosis with computer equipment", included: true },
			{ text: "Certified specialized technicians", included: true },
			{ text: "Guaranteed original spare parts", included: true },
			{ text: "6-month repair warranty", included: true },
			{ text: "Free pick-up and delivery service", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "إصلاح وصيانة المحرك الكاملة" },
			{ text: "إصلاح ناقل الحركة (قير عادي وأوتوماتيك)" },
			{ text: "إصلاح نظام التعليق والمساعدات" },
			{ text: "إصلاح نظام العادم والشكمان" },
			{ text: "إصلاح نظام التبريد والرديتر" },
		],
		en: [
			{ text: "Complete engine repair and maintenance" },
			{ text: "Transmission repair (manual and automatic)" },
			{ text: "Suspension system and shock absorbers repair" },
			{ text: "Exhaust system and muffler repair" },
			{ text: "Cooling system and radiator repair" },
		],
	},
},

"car-maintenance/electrical-repair": {
	slug: "electrical-repair",
	titleAr: "الإصلاح الكهربائي والإلكتروني",
	titleEn: "Electrical and Electronic Repair",
	descriptionAr: "إصلاح وصيانة جميع الأنظمة الكهربائية والإلكترونية في السيارة",
	descriptionEn: "Repair and maintenance of all electrical and electronic systems in the car",
	heroImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
	priceStartsFrom: 200,
	rating: 4.7,
	reviewsCount: 367,
	features: {
		ar: [
			{ text: "فحص إلكتروني شامل بأحدث الأجهزة", included: true },
			{ text: "كهربائيون متخصصون في السيارات", included: true },
			{ text: "ضمان 3 أشهر على القطع والعمل", included: true },
			{ text: "برمجة وتحديث أنظمة السيارة", included: true },
			{ text: "خدمة طوارئ على الطريق", included: false },
		],
		en: [
			{ text: "Comprehensive electronic inspection with latest equipment", included: true },
			{ text: "Automotive electrical specialists", included: true },
			{ text: "3-month warranty on parts and labor", included: true },
			{ text: "Car system programming and updating", included: true },
			{ text: "Roadside emergency service", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "فحص واستبدال البطارية والمولد (الدينمو)" },
			{ text: "إصلاح نظام الإضاءة الداخلية والخارجية" },
			{ text: "إصلاح السلف (المارش) ونظام التشغيل" },
			{ text: "إصلاح شاشة السيارة ونظام الملاحة" },
			{ text: "إصلاح نوافذ كهربائية وأقفال مركزية" },
		],
		en: [
			{ text: "Battery and alternator inspection and replacement" },
			{ text: "Interior and exterior lighting system repair" },
			{ text: "Starter motor and ignition system repair" },
			{ text: "Car screen and navigation system repair" },
			{ text: "Power windows and central locking repair" },
		],
	},
},

"car-maintenance/tire-services": {
	slug: "tire-services",
	titleAr: "خدمات الإطارات الشاملة",
	titleEn: "Comprehensive Tire Services",
	descriptionAr: "جميع خدمات الإطارات من بيع وتركيب وترصيص وموازنة بأحدث المعدات",
	descriptionEn: "All tire services from sale, installation, alignment and balancing with latest equipment",
	heroImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop",
	priceStartsFrom: 150,
	rating: 4.8,
	reviewsCount: 489,
	features: {
		ar: [
			{ text: "إطارات من أفضل الماركات العالمية", included: true },
			{ text: "ترصيص وموازنة بأجهزة محوسبة", included: true },
			{ text: "فحص مجاني للإطارات والضغط", included: true },
			{ text: "ضمان على الإطارات الجديدة", included: true },
			{ text: "تركيب إطارات في الموقع", included: false },
		],
		en: [
			{ text: "Tires from top international brands", included: true },
			{ text: "Alignment and balancing with computerized equipment", included: true },
			{ text: "Free tire and pressure inspection", included: true },
			{ text: "Warranty on new tires", included: true },
			{ text: "On-site tire installation", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "بيع وتركيب إطارات جديدة بجميع المقاسات" },
			{ text: "ترصيص وضبط زوايا العجلات (عفريت)" },
			{ text: "موازنة الإطارات بأجهزة حديثة" },
			{ text: "إصلاح الثقوب والبنشر (لحام)" },
			{ text: "تبديل الإطارات الموسمية (صيفي/شتوي)" },
		],
		en: [
			{ text: "New tire sales and installation in all sizes" },
			{ text: "Wheel alignment and angle adjustment" },
			{ text: "Tire balancing with modern equipment" },
			{ text: "Puncture and flat tire repair (welding)" },
			{ text: "Seasonal tire change (summer/winter)" },
		],
	},
},

"car-maintenance/car-care": {
	slug: "car-care",
	titleAr: "العناية الكاملة بالسيارة",
	titleEn: "Complete Car Care",
	descriptionAr: "خدمات عناية شاملة تشمل الغسيل، التلميع، التنظيف الداخلي وحماية الطلاء",
	descriptionEn: "Comprehensive care services including washing, polishing, interior cleaning and paint protection",
	heroImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop",
	priceStartsFrom: 100,
	rating: 4.9,
	reviewsCount: 612,
	features: {
		ar: [
			{ text: "مواد تنظيف وتلميع عالمية", included: true },
			{ text: "عمال متخصصون ومدربون", included: true },
			{ text: "غسيل خارجي وداخلي شامل", included: true },
			{ text: "تلميع وحماية الطلاء", included: true },
			{ text: "خدمة سيراميك وحماية كاملة", included: false },
		],
		en: [
			{ text: "International cleaning and polishing materials", included: true },
			{ text: "Specialized and trained workers", included: true },
			{ text: "Comprehensive exterior and interior washing", included: true },
			{ text: "Paint polishing and protection", included: true },
			{ text: "Ceramic coating and full protection service", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "غسيل خارجي بضغط عالي وتنظيف عميق" },
			{ text: "تنظيف داخلي شامل للمقاعد والفرش" },
			{ text: "تلميع الهيكل الخارجي وإزالة الخدوش البسيطة" },
			{ text: "تنظيف وتلميع الجنوط والإطارات" },
			{ text: "تعطير وتعقيم السيارة من الداخل" },
		],
		en: [
			{ text: "High pressure exterior washing and deep cleaning" },
			{ text: "Comprehensive interior cleaning for seats and upholstery" },
			{ text: "Exterior body polishing and minor scratch removal" },
			{ text: "Rim and tire cleaning and polishing" },
			{ text: "Car interior perfuming and sterilization" },
		],
	},
},

"car-maintenance/spare-parts": {
	slug: "spare-parts",
	titleAr: "قطع الغيار الأصلية",
	titleEn: "Original Spare Parts",
	descriptionAr: "توفير وتركيب قطع غيار أصلية ومضمونة لجميع أنواع وموديلات السيارات",
	descriptionEn: "Supply and installation of original and guaranteed spare parts for all car types and models",
	heroImage: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
	priceStartsFrom: 50,
	rating: 4.8,
	reviewsCount: 445,
	features: {
		ar: [
			{ text: "قطع غيار أصلية 100%", included: true },
			{ text: "ضمان الوكالة على القطع", included: true },
			{ text: "توفر سريع لجميع القطع", included: true },
			{ text: "تركيب احترافي مجاني", included: true },
			{ text: "خدمة توصيل للمنزل", included: false },
		],
		en: [
			{ text: "100% original spare parts", included: true },
			{ text: "Agency warranty on parts", included: true },
			{ text: "Fast availability of all parts", included: true },
			{ text: "Free professional installation", included: true },
			{ text: "Home delivery service", included: false },
		],
	},
	serviceDetails: {
		ar: [
			{ text: "توفير قطع محرك (بساتم، شنابر، سيور)" },
			{ text: "قطع فرامل (بريكات، ديسكات، طنابير)" },
			{ text: "قطع تعليق (مساعدات، مقصات، جلود)" },
			{ text: "قطع كهربائية (بطاريات، دينمو، سلف)" },
			{ text: "إكسسوارات وقطع تجميل السيارة" },
		],
		en: [
			{ text: "Engine parts supply (pistons, rings, belts)" },
			{ text: "Brake parts (pads, discs, drums)" },
			{ text: "Suspension parts (shocks, control arms, bushings)" },
			{ text: "Electrical parts (batteries, alternators, starters)" },
			{ text: "Accessories and car beautification parts" },
		],
	},
},
};

/**
 * Helper Functions
 */

// Get service category by slug
export  function getServiceCategoryBySlug(slug: string): ServiceCategoryData | undefined {
	return  serviceCategoriesData[slug];
}

// Get all service category slugs
export function getAllServiceCategorySlugs(): string[] {
	return Object.keys(serviceCategoriesData);
}

// Check if a service category slug is valid
export function isValidServiceCategorySlug(slug: string): boolean {
	return slug in serviceCategoriesData;
}

// Get individual service by category and service slug
export function getIndividualService(categorySlug: string, serviceSlug: string): IndividualServiceData | undefined {
	const key = `${categorySlug}/${serviceSlug}`;
	return individualServicesData[key];
}

// Get all individual service paths (for generating static paths)
export function getAllIndividualServicePaths(): Array<{ category: string; service: string }> {
	return Object.keys(individualServicesData).map(key => {
		const [category, service] = key.split("/");
		return { category, service };
	});
}

// Check if an individual service exists
export function isValidIndividualService(categorySlug: string, serviceSlug: string): boolean {
	const key = `${categorySlug}/${serviceSlug}`;
	return key in individualServicesData;
}
