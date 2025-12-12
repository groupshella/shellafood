import { Wrench, Shield, CircleDot, Hammer, Zap, Sparkles, Scissors, Coffee, ShieldCheck, Heart, Clock, Star } from "lucide-react";
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
				image: "/Work.png", 
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
	heroImage: "/car-maintenance.png",
	videoThumbnail: "/section-car-1.png",
	mainServices: {
		ar: [
			{ 
				slug: "periodic-maintenance", 
				title: "الصيانة الدورية", 
				image: "/check-car.png", 
				path: "/serve-me/car-maintenance/periodic-maintenance",
				description: "صيانة دورية شاملة حسب عداد الكيلومترات مع فحص كامل للسيارة"
			},
			{ 
				slug: "mechanical-repair", 
				title: "إصلاح ميكانيكي", 
				image: "/mechanic-car.jpg", 
				path: "/serve-me/car-maintenance/mechanical-repair",
				description: "إصلاح المحرك، ناقل الحركة، نظام التعليق وجميع الأعطال الميكانيكية"
			},
			{ 
				slug: "electrical-repair", 
				title: "إصلاح كهربائي", 
				image: "/elec-car.png", 
				path: "/serve-me/car-maintenance/electrical-repair",
				description: "إصلاح الأنظمة الكهربائية، البطارية، المولد والإلكترونيات"
			},
			{ 
				slug: "tire-services", 
				title: "خدمات الإطارات", 
				image: "/wheel-car.png", 
				path: "/serve-me/car-maintenance/tire-services",
				description: "بيع وتركيب الإطارات، ترصيص، موازنة وفحص شامل للإطارات"
			},
			{ 
				slug: "car-care", 
				title: "العناية بالسيارة", 
				image: "/check-car.png", 
				path: "/serve-me/car-maintenance/car-care",
				description: "غسيل، تلميع، تنظيف داخلي، معالجة الخدوش والعناية الكاملة"
			},
			{ 
				slug: "spare-parts", 
				title: "قطع الغيار", 
				image: "/chips-car.png", 
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
				image: "/chips-car", 
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
				image: "/section-car-2.png", 
				rating: 4.9, 
				distance: "1.8 كم", 
				availableHours: "متاح اليوم من: 8 ص - 8 م"
			},
			{ 
				name: "مركز الصيانة السريع", 
				image: "/section-car-2.png", 
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
"education-tutoring": {
	slug: "education-tutoring",
	titleAr: "خدمات التعليم والتدريس المتميزة",
	titleEn: "Premium Education & Tutoring Services",
	descriptionAr: "خدمات تعليمية احترافية مع معلمين ومدربين متخصصين لجميع المراحل التعليمية والمهارات",
	descriptionEn: "Professional educational services with specialized teachers and trainers for all educational levels and skills",
	heroImage: "/teaching.jpg",
	videoThumbnail: "/teaching.jpg",
	mainServices: {
		ar: [
			{ 
				slug: "academic-tutoring", 
				title: "التدريس الأكاديمي", 
				description: "دروس خصوصية لجميع المواد الدراسية من الابتدائية حتى الثانوية",
				image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/academic-tutoring" 
			},
			{ 
				slug: "test-preparation", 
				title: "التحضير للاختبارات", 
				description: "برامج تحضيرية متخصصة للاختبارات المعيارية مثل SAT, IELTS, TOEFL",
				image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/test-preparation" 
			},
			{ 
				slug: "language-learning", 
				title: "تعلم اللغات", 
				description: "دورات لغة إنجليزية، عربية، وفرنسية مع معلمين متخصصين",
				image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/language-learning" 
			},
			{ 
				slug: "professional-training", 
				title: "التدريب المهني", 
				description: "دورات تدريبية في مختلف المجالات المهنية والتقنية",
				image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/professional-training" 
			},
			{ 
				slug: "special-education", 
				title: "التعليم الخاص", 
				description: "برامج تعليمية مخصصة لذوي الاحتياجات الخاصة وصعوبات التعلم",
				image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/special-education" 
			},
		],
		en: [
			{ 
				slug: "academic-tutoring", 
				title: "Academic Tutoring", 
				description: "Private lessons for all subjects from elementary to high school",
				image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/academic-tutoring" 
			},
			{ 
				slug: "test-preparation", 
				title: "Test Preparation", 
				description: "Specialized prep programs for standardized tests like SAT, IELTS, TOEFL",
				image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/test-preparation" 
			},
			{ 
				slug: "language-learning", 
				title: "Language Learning", 
				description: "English, Arabic, and French courses with specialized teachers",
				image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/language-learning" 
			},
			{ 
				slug: "professional-training", 
				title: "Professional Training", 
				description: "Training courses in various professional and technical fields",
				image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/professional-training" 
			},
			{ 
				slug: "special-education", 
				title: "Special Education", 
				description: "Customized educational programs for special needs and learning difficulties",
				image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", 
				path: "/serve-me/education-tutoring/special-education" 
			},
		],
	},
	whyChooseUs: {
		ar: [
			{ title: "معلمون معتمدون", description: "فريق من المعلمين المؤهلين وذوي الخبرة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "برامج مخصصة", description: "خطط تعليمية مصممة حسب احتياجات كل طالب", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "نتائج مضمونة", description: "تحسين ملحوظ في الأداء الأكاديمي", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
		en: [
			{ title: "Certified Teachers", description: "Team of qualified and experienced teachers", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "Customized Programs", description: "Educational plans designed for each student's needs", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "Guaranteed Results", description: "Noticeable improvement in academic performance", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
	},
	availableWorkshops: {
		ar: [
			{ 
				name: "مركز التميز التعليمي", 
				image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
				rating: 4.8, 
				distance: "1.2 كم", 
				availableHours: "متاح اليوم من: 3 م - 9 م"
			},
			{ 
				name: "أكاديمية المعرفة", 
				image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", 
				rating: 4.7, 
				distance: "2.5 كم", 
				availableHours: "متاح اليوم من: 4 م - 10 م"
			},
		],
		en: [
			{ 
				name: "Excellence Education Center", 
				image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
				rating: 4.8, 
				distance: "1.2 km", 
				availableHours: "Available today: 3 PM - 9 PM"
			},
			{ 
				name: "Knowledge Academy", 
				image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", 
				rating: 4.7, 
				distance: "2.5 km", 
				availableHours: "Available today: 4 PM - 10 PM"
			},
		],
	},
},
"construction-materials": {
	slug: "construction-materials",
	titleAr: "خدمات مواد البناء",
	titleEn: "Construction Materials Services",
	descriptionAr: "توريد وتوصيل جميع مواد البناء بأعلى جودة وبأفضل الأسعار",
	descriptionEn: "Supply and delivery of all construction materials with top quality and best prices",
	heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
	videoThumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",

	mainServices: {
		ar: [
			{ 
				slug: "cement-bricks",
				title: "أسمنت وطوب",
				description: "توريد جميع أنواع الأسمنت والطوب للمشاريع السكنية والتجارية",
				image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/cement-bricks"
			},
			{ 
				slug: "iron-steel",
				title: "حديد وصلب",
				description: "حديد تسليح وهياكل معدنية بجودة عالية وتوصيل سريع",
				image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/iron-steel"
			},
			{ 
				slug: "tiles-ceramics",
				title: "بلاط وسيراميك",
				description: "أفضل أنواع السيراميك والبلاط بجميع المقاسات والألوان",
				image: "/serveme-hero.png",
				path: "/serve-me/construction-materials/tiles-ceramics"
			},
			{ 
				slug: "sanitary-ware",
				title: "أدوات صحية",
				description: "توريد أدوات صحية عالية الجودة للمنازل والمشاريع",
				image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/sanitary-ware"
			},
			{ 
				slug: "doors-windows",
				title: "أبواب ونوافذ",
				description: "أبواب ونوافذ ألمنيوم وخشب بجميع المقاسات",
				image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/doors-windows"
			},
			{ 
				slug: "paints-insulation",
				title: "دهانات وعوازل",
				description: "دهانات داخلية وخارجية وعوازل مائية وحرارية",
				image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/paints-insulation"
			},
		],

		en: [
			{ 
				slug: "cement-bricks",
				title: "Cement and Bricks",
				description: "Supply of all types of cement and bricks for residential and commercial projects",
				image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/cement-bricks"
			},
			{ 
				slug: "iron-steel",
				title: "Iron and Steel",
				description: "High-quality reinforcement steel and metal structures with fast delivery",
				image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/iron-steel"
			},
			{ 
				slug: "tiles-ceramics",
				title: "Tiles and Ceramics",
				description: "Premium ceramic and tile options in all sizes and colors",
				image: "/serveme-hero.png",
				path: "/serve-me/construction-materials/tiles-ceramics"
			},
			{ 
				slug: "sanitary-ware",
				title: "Sanitary Ware",
				description: "High-quality sanitary products for homes and construction projects",
				image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/sanitary-ware"
			},
			{ 
				slug: "doors-windows",
				title: "Doors and Windows",
				description: "Aluminum and wooden doors and windows in all standard sizes",
				image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/doors-windows"
			},
			{ 
				slug: "paints-insulation",
				title: "Paints and Insulation",
				description: "Interior and exterior paints plus thermal and waterproof insulation",
				image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
				path: "/serve-me/construction-materials/paints-insulation"
			},
		],
	},

	

	whyChooseUs: {
		ar: [
			{ title: "جودة مضمونة", description: "نوفر مواد بناء عالية الجودة ومضمونة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "توصيل للموقع", description: "نوصّل جميع المواد مباشرة إلى موقع البناء", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "أسعار تنافسية", description: "نقدم أفضل الأسعار في السوق بدون منافس", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
		en: [
			{ title: "Guaranteed Quality", description: "We provide high-quality guaranteed construction materials", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
			{ title: "Site Delivery", description: "We deliver all materials directly to the construction site", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
			{ title: "Competitive Prices", description: "We offer the best prices in the market with no competition", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
		],
	},

	availableWorkshops: {
		ar: [
			{
				name: "مستودع مواد البناء الكبير",
				image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
				rating: 4.6,
				distance: "5.0 كم",
				availableHours: "متاح اليوم من: 7 ص - ٦ م"
			},
			{
				name: "معرض مواد البناء المتكامل",
				image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
				rating: 4.7,
				distance: "4.2 كم",
				availableHours: "متاح اليوم من: 8 ص - 7 م"
			},
		],

		en: [
			{
				name: "Large Construction Materials Warehouse",
				image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
				rating: 4.6,
				distance: "5.0 km",
				availableHours: "Available today: 7 AM - 6 PM"
			},
			{
				name: "Complete Construction Materials Showroom",
				image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
				rating: 4.7,
				distance: "4.2 km",
				availableHours: "Available today: 8 AM - 7 PM"
			},
		],
	},
},

"women-salons": {
  slug: "women-salons",
  titleAr: "صالونات وخدمات تجميل نسائية فاخرة",
  titleEn: "Premium Women's Salon & Beauty Services",
  descriptionAr: "اكتشفي أرقى خدمات العناية بالجمال والمكياج وتصفيف الشعر على يد خبيرات معتمدات بأجواء خاصة ومريحة.",
  descriptionEn: "Discover the finest beauty, makeup, and hair styling services delivered by certified specialists in a private and luxurious setting.",
  heroImage: "/w-sallon.png",
  videoThumbnail: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1200&h=800&fit=crop",

  /* ================================================================
     MAIN SERVICES
  ================================================================= */
  mainServices: {
    ar: [
      {
        slug: "hair-cutting-styling",
        title: "قص وتصفيف الشعر الاحترافي",
        description: "قصات عالمية متجددة، تسريحات سريعة، ورفع شعر للمناسبات تناسب شكل وجهك.",
        image: "",
        path: "/serve-me/women-salons/hair-cutting-styling"
      },
      {
        slug: "hair-coloring",
        title: "تلوين ومعالجات الشعر",
        description: "تقنيات صبغ متقدمة (بالياج، هايلايت) وعلاجات عميقة بالكيراتين والبروتين للحفاظ على صحة الشعر.",
        image: "",
        path: "/serve-me/women-salons/hair-coloring"
      },
      {
        slug: "makeup-events",
        title: "مكياج المناسبات والعرائس",
        description: "مكياج يدوم طويلاً بمنتجات عالمية لتتألقي في حفلات الزفاف والخطوبة والسهرات.",
        image: "",
        path: "/serve-me/women-salons/makeup-events"
      },
      {
        slug: "nail-care",
        title: "عناية الأظافر والسبا",
        description: "جلسات منيكير وبديكير سبا مع تعقيم عالي، طلاء جل، وتركيب أظافر حسب الرغبة.",
        image: "",
        path: "/serve-me/women-salons/nail-care"
      },
    ],

    en: [
      {
        slug: "hair-cutting-styling",
        title: "Professional Hair Cut & Styling",
        description: "Modern global cuts, quick styling, and elegant updos for events tailored to your face shape.",
        image: "",
        path: "/serve-me/women-salons/hair-cutting-styling"
      },
      {
        slug: "hair-coloring",
        title: "Coloring & Hair Treatments",
        description: "Advanced coloring techniques (Balayage, Highlights) and deep Keratin/Protein treatments for hair health.",
        image: "",
        path: "/serve-me/women-salons/hair-coloring"
      },
      {
        slug: "makeup-events",
        title: "Event & Bridal Makeup",
        description: "Long-lasting makeup using premium global brands to shine at weddings, engagements, and evening parties.",
        image: "",
        path: "/serve-me/women-salons/makeup-events"
      },
      {
        slug: "nail-care",
        title: "Nail Care & Spa",
        description: "Spa manicure and pedicure sessions with strict hygiene, gel polish, and custom nail extensions.",
        image: "",
        path: "/serve-me/women-salons/nail-care"
      },
    ],
  },

  /* ================================================================
     WHY CHOOSE US
  ================================================================= */
  whyChooseUs: {
    ar: [
      { title: "خبيرات معتمدات", description: "فريق تجميل بخبرة لا تقل عن 5 سنوات في كبرى الصالونات.", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
      { title: "منتجات حصرية", description: "استخدام مستحضرات عضوية وخالية من المواد الضارة (الأمونيا والسلفات).", icon: React.createElement(Sparkles, { className: "w-12 h-12" }) },
      { title: "خصوصية ورفاهية", description: "أجواء هادئة ومقاعد مريحة وغرف خاصة للخدمات.", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
    ],
    en: [
      { title: "Certified Experts", description: "Beauty team with 5+ years experience in top-tier salons.", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
      { title: "Exclusive Products", description: "Use of organic and harmful-substance-free products (Ammonia & Sulfate-free).", icon: React.createElement(Sparkles, { className: "w-12 h-12" }) },
      { title: "Privacy & Luxury", description: "Relaxing ambiance, comfortable seating, and private service rooms.", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
    ],
  },

  /* ================================================================
     AVAILABLE WORKSHOPS
  ================================================================= */
  availableWorkshops: {
    ar: [
      {
        name: "صالون الجمال المتميز",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
        rating: 4.9,
        distance: "1.3 كم",
        availableHours: "متاح اليوم من: 9 ص - 9 م",
      },
      {
        name: "مركز العناية بالجمال",
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
        rating: 4.8,
        distance: "2.4 كم",
        availableHours: "متاح اليوم من: 10 ص - 8 م",
      },
    ],
    en: [
      {
        name: "Excellence Beauty Salon",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
        rating: 4.9,
        distance: "1.3 km",
        availableHours: "Available today: 9 AM - 9 PM",
      },
      {
        name: "Beauty Care Center",
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
        rating: 4.8,
        distance: "2.4 km",
        availableHours: "Available today: 10 AM - 8 PM",
      },
    ],
  },
},

"men-salons": {
  slug: "men-salons",
  titleAr: "الصالونات والعناية الرجالية",
  titleEn: "Men's Grooming & Spa",
  descriptionAr: "عناية رجالية متكاملة من حلاقين محترفين وخبراء في التجميل والعناية بالبشرة.",
  descriptionEn: "Premium men's grooming and beauty care from professional barbers and specialists.",
  
  heroImage: "/m-sallon.jpg",
  videoThumbnail: "https://images.unsplash.com/photo-1503951914875-befbb713346b?w=1200&h=800&fit=crop",

  /* ================================================================
     MAIN SERVICES
  ================================================================= */
  mainServices: {
    ar: [
      { 
        slug: "haircut-styling",
        title: "قص وتصفيف الشعر",
        description: "أحدث القصات العالمية وتصفيف عصري يناسب ملامح وجهك وشخصيتك",
        image: "/m-sallon-2.jpg",
        path: "/serve-me/men-salons/haircut-styling"
      },
      { 
        slug: "hair-coloring",
        title: "صبغ ومعالجة الشعر",
        description: "تغطية الشيب بألوان طبيعية، هايلايت، وعلاجات الكيراتين والبروتين",
        image: "/m-sallon-3.jpg",
        path: "/serve-me/men-salons/hair-coloring"
      },

    ],

    en: [
      { 
        slug: "haircut-styling",
        title: "Precision Haircut & Style",
        description: "Modern global cuts and professional styling tailored to your face shape",
        image: "https://images.unsplash.com/photo-1593526613712-7b4b9a707330?w=600&h=400&fit=crop",
        path: "/serve-me/men-salons/haircut-styling"
      },
      { 
        slug: "hair-coloring",
        title: "Coloring & Treatments",
        description: "Natural gray coverage, highlights, and Keratin/Protein hair treatments",
        image: "https://images.unsplash.com/photo-1634480491893-fa71c341b65e?w=600&h=400&fit=crop",
        path: "/serve-me/men-salons/hair-coloring"
      },
  
    ],
  },

  /* ================================================================
     WHY CHOOSE US
  ================================================================= */
  whyChooseUs: {
    ar: [
      { 
        title: "خبراء تصفيف",
        description: "حلاقون عالميون بخبرة تزيد عن 10 سنوات",
        icon: React.createElement(Scissors, { className: "w-12 h-12" }) // Changed to Scissors
      },
      { 
        title: "تعقيم ونظافة",
        description: "أدوات معقمة وتدابير صحية صارمة لسلامتك",
        icon: React.createElement(Sparkles, { className: "w-12 h-12" }) // Changed to Sparkles
      },
      { 
        title: "أجواء فاخرة",
        description: "صالات انتظار مريحة وخدمة ضيافة مميزة",
        icon: React.createElement(Coffee, { className: "w-12 h-12" }) // Changed to Coffee/Luxury
      },
    ],
    en: [
      { 
        title: "Master Stylists",
        description: "International barbers with over 10 years of experience",
        icon: React.createElement(Scissors, { className: "w-12 h-12" }) 
      },
      { 
        title: "Hygiene & Safety",
        description: "Sterilized tools and strict health protocols",
        icon: React.createElement(Sparkles, { className: "w-12 h-12" }) 
      },
      { 
        title: "Luxury Atmosphere",
        description: "Comfortable lounges and premium hospitality",
        icon: React.createElement(Coffee, { className: "w-12 h-12" }) 
      },
    ],
  },

  /* ================================================================
     AVAILABLE WORKSHOPS
  ================================================================= */
  availableWorkshops: {
    ar: [
      { 
        name: "صالون جنتل مان لاونج",
        image: "https://images.unsplash.com/photo-1503951914875-befbb713346b?w=600&h=400&fit=crop",
        rating: 4.9,
        distance: "1.2 كم",
        availableHours: "متاح: 10 ص - 11 م"
      },
      { 
        name: "ستوديو المقص الذهبي",
        image: "https://images.unsplash.com/photo-1599351431202-6e0005a88bf2?w=600&h=400&fit=crop",
        rating: 4.6,
        distance: "2.8 كم",
        availableHours: "متاح: 9 ص - 10 م"
      },
    ],
    en: [
      { 
        name: "Gentleman's Lounge",
        image: "https://images.unsplash.com/photo-1503951914875-befbb713346b?w=600&h=400&fit=crop",
        rating: 4.9,
        distance: "1.2 km",
        availableHours: "Open: 10 AM - 11 PM"
      },
      { 
        name: "Golden Scissor Studio",
        image: "https://images.unsplash.com/photo-1599351431202-6e0005a88bf2?w=600&h=400&fit=crop",
        rating: 4.6,
        distance: "2.8 km",
        availableHours: "Open: 9 AM - 10 PM"
      },
    ],
  },
},
"babysitting": {
  slug: "babysitting",
  titleAr: "خدمات رعاية الأطفال المحترفة",
  titleEn: "Professional Babysitting & Childcare",
  descriptionAr: "رعاية آمنة وموثوقة لأطفالك مع مربيات مؤهلات وذوات خبرة، متاحة بالساعة أو لفترات طويلة",
  descriptionEn: "Safe and reliable care for your children with qualified and experienced nannies, available hourly or for extended periods",
  
  heroImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
  videoThumbnail: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=800&fit=crop",

  /* ================================================================
     MAIN SERVICES
  ================================================================= */
  mainServices: {
    ar: [
      { 
        slug: "hourly-babysitting",
        title: "رعاية أطفال بالساعة",
        description: "مربية مؤهلة تأتي لمنزلك لرعاية طفلك لساعات محددة (2-8 ساعات)",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/hourly-babysitting"
      },
      { 
        slug: "full-day-care",
        title: "رعاية يوم كامل",
        description: "رعاية شاملة لطفلك طوال اليوم مع أنشطة تعليمية وترفيهية",
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/full-day-care"
      },
      { 
        slug: "event-babysitting",
        title: "رعاية أطفال للمناسبات",
        description: "خدمة رعاية الأطفال أثناء حفلات الزفاف والمناسبات الاجتماعية",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/event-babysitting"
      },
    ],

    en: [
      { 
        slug: "hourly-babysitting",
        title: "Hourly Babysitting",
        description: "Qualified nanny comes to your home for specific hours (2-8 hours)",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/hourly-babysitting"
      },
      { 
        slug: "full-day-care",
        title: "Full Day Care",
        description: "Complete care for your child throughout the day with educational and recreational activities",
        image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/full-day-care"
      },
      { 
        slug: "event-babysitting",
        title: "Event Babysitting",
        description: "Childcare service during weddings and social events",
        image: "https://images.unsplash.com/photo-1530047625168-4b29bfbbe1fc?w=600&h=400&fit=crop",
        path: "/serve-me/babysitting/event-babysitting"
      },
    ],
  },

  /* ================================================================
     WHY CHOOSE US
  ================================================================= */
  whyChooseUs: {
    ar: [
      { 
        title: "مربيات معتمدات ومفحوصات",
        description: "جميع المربيات لدينا خضعن لفحص سجل جنائي وتدريب متخصص",
        icon: React.createElement(ShieldCheck, { className: "w-12 h-12" })
      },
      { 
        title: "مراقبة وتقييم مستمر",
        description: "نظام تقييم دوري لضمان أعلى معايير الجودة والأمان",
        icon: React.createElement(Star, { className: "w-12 h-12" })
      },
      { 
        title: "متاح 24/7",
        description: "خدمة متاحة على مدار الساعة لحالات الطوارئ والاحتياجات العاجلة",
        icon: React.createElement(Clock, { className: "w-12 h-12" })
      },
      { 
        title: "تأمين شامل",
        description: "جميع المربيات مؤمن عليهن بالكامل لراحة بالك",
        icon: React.createElement(Heart, { className: "w-12 h-12" })
      },
    ],
    en: [
      { 
        title: "Certified & Vetted Nannies",
        description: "All our nannies undergo criminal background checks and specialized training",
        icon: React.createElement(ShieldCheck, { className: "w-12 h-12" })
      },
      { 
        title: "Continuous Monitoring & Review",
        description: "Regular evaluation system to ensure highest quality and safety standards",
        icon: React.createElement(Star, { className: "w-12 h-12" })
      },
      { 
        title: "24/7 Availability",
        description: "Service available around the clock for emergencies and urgent needs",
        icon: React.createElement(Clock, { className: "w-12 h-12" })
      },
      { 
        title: "Full Insurance",
        description: "All nannies are fully insured for your peace of mind",
        icon: React.createElement(Heart, { className: "w-12 h-12" })
      },
    ],
  },

  /* ================================================================
     AVAILABLE CAREGIVERS
  ================================================================= */
  availableWorkshops: {
    ar: [
      { 
        name: "فاطمة محمد - مربية معتمدة",
        image: "",
        rating: 4.9,
        availableHours: "متاحة: 8 ص - 6 م",
		distance:'1.2km'
      },
      { 
        name: "مريم أحمد - ممرضة أطفال",
        image: "",
        rating: 5.0,
        availableHours: "متاحة: 24/7",
		distance:'0.8km'
      },
 
    ],
    en: [
      { 
        name: "Fatima Mohammed - Certified Nanny",
        image: "",
        rating: 4.9,
        availableHours: "Available: 8 AM - 6 PM",
		distance:'1.2km'
      },
      { 
        name: "Mariam Ahmed - Pediatric Nurse",
        image: "",
        rating: 5.0,
        availableHours: "Available: 24/7",
		distance:'0.8km'

      },
   
    ],
  },
}



  

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
	heroImage: "/chips-car",
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


/* ================================================================
     MEN'S SALON SUB-SERVICES
  ================================================================= */

  "men-salons/haircut-styling": {
    slug: "haircut-styling",
    titleAr: "قص وتصفيف الشعر",
    titleEn: "Haircut & Styling",
    descriptionAr: "تجربة عناية شخصية تبدأ باستشارة لتحديد القصة الأنسب لملامح وجهك ونوع شعرك",
    descriptionEn: "A personalized grooming experience starting with a consultation to find the perfect cut for your face shape and hair type",
    heroImage: "/m-sallon-2.jpg", // Using image from your main object
    priceStartsFrom: 60,
    rating: 4.9,
    reviewsCount: 524,
    features: {
      ar: [
        { text: "استشارة مجانية قبل القص لتحديد الستايل", included: true },
        { text: "غسيل الشعر بشامبو ومواد عناية فاخرة", included: true },
        { text: "تصفيف نهائي باستخدام منتجات عالية الجودة", included: true },
        { text: "منشفة ساخنة للاسترخاء", included: true },
        { text: "حلاقة وتحديد اللحية", included: false }, // Upsell opportunity
      ],
      en: [
        { text: "Free style consultation before cutting", included: true },
        { text: "Hair wash with premium care products", included: true },
        { text: "Final styling using high-quality products", included: true },
        { text: "Relaxing hot towel service", included: true },
        { text: "Beard trimming and shaping", included: false },
      ],
    },
    serviceDetails: {
      ar: [
        { text: "غسيل وتنظيف فروة الرأس بعمق" },
        { text: "قص الشعر بدقة باستخدام المقص أو الماكينة" },
        { text: "تحديد السوالف والرقبة بدقة عالية" },
        { text: "تنشيف الشعر وتصفيفه حسب الرغبة" },
        { text: "وضع سيروم مغذي للشعر بعد الحلاقة" },
      ],
      en: [
        { text: "Deep scalp cleansing and wash" },
        { text: "Precision cutting using scissors or clippers" },
        { text: "High-definition sideburn and neck detailing" },
        { text: "Blow-drying and styling to preference" },
        { text: "Application of nourishing hair serum" },
      ],
    },
  },

  "men-salons/hair-coloring": {
    slug: "hair-coloring",
    titleAr: "صبغ ومعالجة الشعر",
    titleEn: "Coloring & Treatments",
    descriptionAr: "تجديد مظهرك بصبغات طبيعية خالية من الأمونيا، أو معالجة الشعر التالف بأحدث التقنيات",
    descriptionEn: "Revitalize your look with ammonia-free natural dyes, or treat damaged hair with the latest technologies",
    heroImage: "/m-sallon-3.jpg", // Using image from your main object
    priceStartsFrom: 150,
    rating: 4.7,
    reviewsCount: 312,
    features: {
      ar: [
        { text: "اختبار حساسية البشرة قبل الصبغ", included: true },
        { text: "أصباغ عضوية آمنة على فروة الرأس", included: true },
        { text: "حمام كريم لترطيب الشعر بعد الصبغة", included: true },
        { text: "تغطية كاملة للشيب (اللون الأبيض)", included: true },
        { text: "جلسة علاج كيراتين كاملة", included: false }, // Upsell opportunity
      ],
      en: [
        { text: "Skin sensitivity test before coloring", included: true },
        { text: "Organic dyes safe for the scalp", included: true },
        { text: "Moisturizing cream bath after coloring", included: true },
        { text: "Full gray hair coverage", included: true },
        { text: "Full Keratin treatment session", included: false },
      ],
    },
    serviceDetails: {
      ar: [
        { text: "دمج الألوان لاختيار الدرجة المناسبة للبشرة" },
        { text: "توزيع الصبغة باحترافية لضمان توحيد اللون" },
        { text: "معالجة الشعر بالبروتين لزيادة اللمعان" },
        { text: "غسيل الشعر بمثبتات اللون" },
        { text: "تجفيف وتصفيف لإظهار جمال اللون الجديد" },
      ],
      en: [
        { text: "Color blending to match skin tone perfectly" },
        { text: "Professional application for even coverage" },
        { text: "Protein treatment to enhance shine" },
        { text: "Washing with color-lock shampoo" },
        { text: "Drying and styling to showcase the new color" },
      ],
    },
  },
  /* ================================================================
   WOMEN'S SALON SUB-SERVICES
================================================================= */

"women-salons/hair-cutting-styling": {
	slug: "hair-cutting-styling",
	titleAr: "قص وتصفيف الشعر",
	titleEn: "Hair Cutting & Styling",
	descriptionAr: "ليست مجرد قصة شعر، بل تجربة تغيير مظهر متكاملة تبرز جمال ملامح وجهك",
	descriptionEn: "Not just a haircut, but a complete makeover experience designed to frame your face features",
	heroImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=500&fit=crop",
	priceStartsFrom: 90,
	rating: 4.9,
	reviewsCount: 642,
	features: {
	  ar: [
		{ text: "استشارة لتحديد القصة المناسبة لشكل الوجه", included: true },
		{ text: "غسيل شعر بشامبو خالي من السلفات", included: true },
		{ text: "سشوار وتصفيف (ويفي أو ليس)", included: true },
		{ text: "سيروم حماية من الحرارة", included: true },
		{ text: "علاج أمبولات لترطيب الجذور", included: false },
	  ],
	  en: [
		{ text: "Face shape consultation", included: true },
		{ text: "Sulfate-free hair wash", included: true },
		{ text: "Blow-dry & Styling (Wavy or Straight)", included: true },
		{ text: "Heat protection serum application", included: true },
		{ text: "Root hydration ampoule treatment", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "قص الأطراف المتقصفة بتقنية السليت إند" },
		{ text: "قصات عصرية (بوي، كاريه، مدرج، فكتوريا)" },
		{ text: "تغيير الغرة (Bang trim)" },
		{ text: "تجفيف احترافي لزيادة كثافة الشعر" },
		{ text: "تصفيف المناسبات البسيط" },
	  ],
	  en: [
		{ text: "Split-end trimming using split-end technique" },
		{ text: "Modern cuts (Pixie, Bob, Layered, Victoria)" },
		{ text: "Bang trimming and shaping" },
		{ text: "Professional volume blow-dry" },
		{ text: "Simple occasion styling" },
	  ],
	},
  },
  
  "women-salons/hair-coloring": {
	slug: "hair-coloring",
	titleAr: "صبغ وتلوين الشعر",
	titleEn: "Hair Coloring",
	descriptionAr: "ألوان نابضة بالحياة باستخدام صبغات عالمية تحافظ على صحة شعرك ولمعانه",
	descriptionEn: "Vibrant colors using international brands that maintain your hair's health and shine",
	heroImage: "",
	priceStartsFrom: 350,
	rating: 4.8,
	reviewsCount: 415,
	features: {
	  ar: [
		{ text: "اختبار خصلة للتأكد من اللون", included: true },
		{ text: "استخدام حماية أولابليكس (Olaplex) أثناء الصبغ", included: true },
		{ text: "تثبيت اللون بعد الصبغة", included: true },
		{ text: "تغطية كاملة للشيب", included: true },
		{ text: "سحب لون آمن بدون تلف", included: false },
	  ],
	  en: [
		{ text: "Strand test for color accuracy", included: true },
		{ text: "Olaplex protection during coloring", included: true },
		{ text: "Post-color lock treatment", included: true },
		{ text: "Full gray hair coverage", included: true },
		{ text: "Safe damage-free bleaching", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "صبغ الجذور وتوحيد اللون" },
		{ text: "تقنيات الهايلايت واللولايت" },
		{ text: "صبغات الأومبري والبالياج والبلياج" },
		{ text: "رنساج لتصحيح اللون وإزالة النحاسي" },
		{ text: "ماسكات ترطيب عميق بعد التلوين" },
	  ],
	  en: [
		{ text: "Root touch-up and color balancing" },
		{ text: "Highlights and Lowlights techniques" },
		{ text: "Ombre, Balayage, and Foliage techniques" },
		{ text: "Toner (Rinsage) to correct brassiness" },
		{ text: "Deep conditioning masks after coloring" },
	  ],
	},
  },
  
  "women-salons/makeup-events": {
	slug: "makeup-events",
	titleAr: "مكياج ومناسبات",
	titleEn: "Makeup & Events",
	descriptionAr: "تألقي في مناسباتك الخاصة بمكياج يبرز جمالك، من الناعم إلى الثقيل",
	descriptionEn: "Shine on your special occasions with makeup that highlights your beauty, from soft to glam",
	heroImage: "",
	priceStartsFrom: 250,
	rating: 5.0,
	reviewsCount: 289,
	features: {
	  ar: [
		{ text: "تنظيف وترطيب البشرة قبل المكياج", included: true },
		{ text: "استخدام ماركات عالمية (MAC, Nars, Huda Beauty)", included: true },
		{ text: "تركيب رموش (حسب الطلب)", included: true },
		{ text: "مثبت مكياج يدوم 24 ساعة", included: true },
		{ text: "بكج العروس المتكامل", included: false },
	  ],
	  en: [
		{ text: "Skin cleansing and prepping", included: true },
		{ text: "Premium brands (MAC, Nars, Huda Beauty)", included: true },
		{ text: "Lash application (custom style)", included: true },
		{ text: "24-hour setting spray", included: true },
		{ text: "Full bridal package", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "مكياج سهرة (Soiree)" },
		{ text: "مكياج ناعم / نهاري (Soft Glam)" },
		{ text: "كونتور لإبراز ملامح الوجه" },
		{ text: "رسم الحواجب بطريقة طبيعية (شعرة شعرة)" },
		{ text: "تغطية عيوب البشرة والهالات باحترافية" },
	  ],
	  en: [
		{ text: "Evening Glam (Soiree) makeup" },
		{ text: "Soft / Day makeup (Soft Glam)" },
		{ text: "Face contouring and highlighting" },
		{ text: "Natural brow shaping and filling" },
		{ text: "Professional blemish and dark circle coverage" },
	  ],
	},
  },
  
  "women-salons/nail-care": {
	slug: "nail-care",
	titleAr: "عناية بالأظافر والسبا",
	titleEn: "Nail Care & Spa",
	descriptionAr: "تجربة استرخاء وعناية فائقة ليديك وقدميك مع تعقيم عالي المستوى",
	descriptionEn: "A relaxing and premium care experience for your hands and feet with top-tier sterilization",
	heroImage: "",
	priceStartsFrom: 120,
	rating: 4.7,
	reviewsCount: 530,
	features: {
	  ar: [
		{ text: "أدوات معقمة ومغلفة تفتح أمامك", included: true },
		{ text: "مقشر ومساج لليدين والقدمين", included: true },
		{ text: "تشكيلة واسعة من ألوان طلاء الأظافر", included: true },
		{ text: "إزالة الجلد الميت (Russian Manicure)", included: true },
		{ text: "تركيب أظافر أكريليك / جيل", included: false },
	  ],
	  en: [
		{ text: "Sterilized tools opened in front of you", included: true },
		{ text: "Hand and foot scrub & massage", included: true },
		{ text: "Wide selection of polish colors", included: true },
		{ text: "Dead skin removal (Russian Manicure)", included: true },
		{ text: "Acrylic / Gel extensions", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "بديكير و منيكير كلاسيك" },
		{ text: "بديكير سبا مع شمع البرافين للترطيب" },
		{ text: "طلاء أظافر دائم (Gel Polish)" },
		{ text: "فن الرسم على الأظافر (Nail Art)" },
		{ text: "علاج تقوية الأظافر الضعيفة" },
	  ],
	  en: [
		{ text: "Classic Manicure & Pedicure" },
		{ text: "Spa Pedicure with moisturizing Paraffin wax" },
		{ text: "Long-lasting Gel Polish" },
		{ text: "Custom Nail Art designs" },
		{ text: "Strengthening treatment for weak nails" },
	  ],
	},
  },
  // Hourly Babysitting
"babysitting/hourly-babysitting": {
	slug: "hourly-babysitting",
	titleAr: "رعاية أطفال بالساعة",
	titleEn: "Hourly Babysitting",
	descriptionAr: "مربية مؤهلة تأتي لمنزلك لرعاية طفلك لساعات محددة (2-8 ساعات)",
	descriptionEn: "Qualified nanny comes to your home for specific hours (2-8 hours)",
	heroImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop",
	priceStartsFrom: 80,
	rating: 4.9,
	reviewsCount: 234,
	features: {
	  ar: [
		{ text: "مربية معتمدة مع فحص جنائي", included: true },
		{ text: "حد أدنى ساعتين للحجز", included: true },
		{ text: "مرونة في اختيار الأوقات", included: true },
		{ text: "تقرير يومي عن نشاطات الطفل", included: true },
		{ text: "حجز في نفس اليوم", included: false },
	  ],
	  en: [
		{ text: "Certified nanny with criminal check", included: true },
		{ text: "Minimum 2 hours booking", included: true },
		{ text: "Flexible time selection", included: true },
		{ text: "Daily activity report", included: true },
		{ text: "Same-day booking", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "رعاية ومراقبة مستمرة للطفل" },
		{ text: "ألعاب وأنشطة تفاعلية مناسبة للعمر" },
		{ text: "إعداد وجبات خفيفة صحية" },
		{ text: "المساعدة في الواجبات المدرسية البسيطة" },
		{ text: "تواصل مباشر مع الأهل عبر الواتساب" },
	  ],
	  en: [
		{ text: "Continuous child care and supervision" },
		{ text: "Age-appropriate interactive games and activities" },
		{ text: "Preparation of healthy snacks" },
		{ text: "Help with simple homework" },
		{ text: "Direct communication with parents via WhatsApp" },
	  ],
	},
  },
  
  // Full Day Care
  "babysitting/full-day-care": {
	slug: "full-day-care",
	titleAr: "رعاية يوم كامل",
	titleEn: "Full Day Care",
	descriptionAr: "رعاية شاملة لطفلك طوال اليوم مع أنشطة تعليمية وترفيهية",
	descriptionEn: "Complete care for your child throughout the day with educational and recreational activities",
	heroImage: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop",
	priceStartsFrom: 350,
	rating: 4.8,
	reviewsCount: 187,
	features: {
	  ar: [
		{ text: "مربية متخصصة مقيمة طوال اليوم", included: true },
		{ text: "برنامج أنشطة تعليمية وترفيهية", included: true },
		{ text: "إعداد 3 وجبات صحية متكاملة", included: true },
		{ text: "تقرير مفصل يومي بالصور", included: true },
		{ text: "خدمة التوصيل من وإلى المدرسة", included: false },
	  ],
	  en: [
		{ text: "Specialized nanny present all day", included: true },
		{ text: "Educational and recreational activity program", included: true },
		{ text: "Preparation of 3 complete healthy meals", included: true },
		{ text: "Detailed daily report with photos", included: true },
		{ text: "School pick-up and drop-off service", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "رعاية كاملة من 8 صباحاً حتى 6 مساءً" },
		{ text: "أنشطة تعليمية: قراءة، كتابة، رسم، وحساب" },
		{ text: "أنشطة ترفيهية: ألعاب خارجية وداخلية" },
		{ text: "وقت القيلولة والراحة المنظم" },
		{ text: "تطوير المهارات الاجتماعية والإبداعية" },
	  ],
	  en: [
		{ text: "Full care from 8 AM to 6 PM" },
		{ text: "Educational activities: reading, writing, drawing, math" },
		{ text: "Recreational activities: outdoor and indoor games" },
		{ text: "Organized nap and rest time" },
		{ text: "Social and creative skills development" },
	  ],
	},
  },
  
  // Event Babysitting
  "babysitting/event-babysitting": {
	slug: "event-babysitting",
	titleAr: "رعاية أطفال للمناسبات",
	titleEn: "Event Babysitting",
	descriptionAr: "خدمة رعاية الأطفال أثناء حفلات الزفاف والمناسبات الاجتماعية",
	descriptionEn: "Childcare service during weddings and social events",
	heroImage: "https://images.unsplash.com/photo-1530047625168-4b29bfbbe1fc?w=600&h=400&fit=crop",
	priceStartsFrom: 200,
	rating: 5.0,
	reviewsCount: 156,
	features: {
	  ar: [
		{ text: "فريق من المربيات المدربات", included: true },
		{ text: "زاوية ألعاب وأنشطة خاصة بالأطفال", included: true },
		{ text: "مراقبة مستمرة طوال المناسبة", included: true },
		{ text: "تأمين شامل على جميع الأطفال", included: true },
		{ text: "تصوير فيديو للأطفال", included: false },
	  ],
	  en: [
		{ text: "Team of trained nannies", included: true },
		{ text: "Dedicated play area and activities for children", included: true },
		{ text: "Continuous supervision throughout the event", included: true },
		{ text: "Comprehensive insurance for all children", included: true },
		{ text: "Video recording of children", included: false },
	  ],
	},
	serviceDetails: {
	  ar: [
		{ text: "تجهيز منطقة ألعاب آمنة ومريحة" },
		{ text: "أنشطة وألعاب جماعية مسلية" },
		{ text: "وجبات خفيفة ومشروبات صحية للأطفال" },
		{ text: "مربية واحدة لكل 5 أطفال كحد أقصى" },
		{ text: "تنسيق مع منظمي المناسبة لضمان السلامة" },
	  ],
	  en: [
		{ text: "Setup of safe and comfortable play area" },
		{ text: "Fun group activities and games" },
		{ text: "Healthy snacks and drinks for children" },
		{ text: "One nanny for every 5 children maximum" },
		{ text: "Coordination with event organizers to ensure safety" },
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
