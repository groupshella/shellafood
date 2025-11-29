/**
 * Offer Service
 * Handles all offer-related API calls and data fetching
 */

import { Offer, OfferDriver } from "@/types/offer.types";

// Mock offers data (replace with API calls in production)
const MOCK_OFFERS: Offer[] = [
	{
		id: 1,
		title: "عروض خاصة ومميزة",
		titleEn: "Special Offers & Deals",
		description: "استمتع بأفضل العروض والخصومات الحصرية",
		descriptionEn: "Enjoy the best exclusive offers and discounts",
		cta: "عرض جميع العروض",
		ctaEn: "View All Offers",
		image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200&h=600&fit=crop",
		link: "/offers",
		category: "general",
		featured: true,
	},
	
	
	{
		id: 5,
		title: "نقل البضائع بالشاحنات",
		titleEn: "Truck Cargo Delivery",
		description: "خصم خاص على نقل البضائع والطرود الكبيرة - احصل على 25% خصم",
		descriptionEn: "Special discount on cargo transport - Get 25% OFF on large packages",
		cta: "اطلب شاحنة",
		ctaEn: "Order Truck",
		image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=600&fit=crop",
		link: "/pickandorder/truck/order/details?type=one-way",
		discount: { type: "percentage", value: 25, maxDiscount: 50, minOrder: 100 },
		promoCode: "TRUCK25",
		validUntil: "2025-12-31",
		category: "delivery",
		usageCount: 892,
		maxUsage: 5000,
		featured: true,
	},
	{
		id: 6,
		title: "توصيل فوري في نفس اليوم",
		titleEn: "Same-Day Express Delivery",
		description: "خدمة التوصيل السريع بالدراجات النارية - استلم طلبك في نفس اليوم",
		descriptionEn: "Fast motorcycle delivery service - Receive your order same day",
		cta: "توصيل فوري",
		ctaEn: "Express Delivery",
		image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
		link: "/pickandorder/motorbike/order/details?type=one-way",
		discount: { type: "fixed", value: 15, minOrder: 30 },
		promoCode: "EXPRESS15",
		validUntil: "2025-12-31",
		category: "delivery",
		usageCount: 2341,
		maxUsage: 15000,
		featured: true,
	},
	{
		id: 7,
		title: "خدمة التوصيل المتعدد",
		titleEn: "Multi-Stop Delivery",
		description: "وفر 20% عند التوصيل لأكثر من موقع - عرض حصري للوجهات المتعددة",
		descriptionEn: "Save 20% on multi-location delivery - Exclusive multi-stop offer",
		cta: "ابدأ التوصيل",
		ctaEn: "Start Delivery",
		image: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=1200&h=600&fit=crop",
		link: "/pickandorder/motorbike/order/details?type=multi-direction",
		discount: { type: "percentage", value: 20, maxDiscount: 40, minOrder: 80 },
		promoCode: "MULTI20",
		validUntil: "2025-12-31",
		category: "delivery",
		usageCount: 1567,
		maxUsage: 8000,
	},
	{
		id: 8,
		title: "نقل الأثاث والمعدات الثقيلة",
		titleEn: "Furniture & Heavy Equipment",
		description: "خدمة نقل متخصصة مع فريق محترف ومعدات التحميل - خصم 15%",
		descriptionEn: "Professional moving service with crew and equipment - 15% OFF",
		cta: "احجز الآن",
		ctaEn: "Book Now",
		image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
		link: "/pickandorder/truck/order/details?type=one-way",
		discount: { type: "percentage", value: 15, maxDiscount: 75, minOrder: 150 },
		promoCode: "FURNITURE15",
		validUntil: "2025-12-31",
		category: "delivery",
		usageCount: 634,
		maxUsage: 3000,
		featured: true,
	},
	{
		id: 10,
		title: "نقل مبرد للمواد الغذائية",
		titleEn: "Refrigerated Food Transport",
		description: "شاحنات مجهزة بالتبريد لنقل المواد الغذائية والمنتجات الطازجة بأمان",
		descriptionEn: "Refrigerated trucks for safe transport of food and fresh products",
		cta: "اطلب الخدمة",
		ctaEn: "Order Service",
		image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=600&fit=crop",
		link: "/pickandorder/truck/order/details?type=one-way",
		discount: { type: "percentage", value: 20, maxDiscount: 60, minOrder: 120 },
		promoCode: "COOL20",
		validUntil: "2025-12-31",
		category: "delivery",
		usageCount: 789,
		maxUsage: 4000,
		featured: true,
	},
];

class OfferService {
	/**
	 * Get all offers
	 */
	async getAllOffers(): Promise<Offer[]> {
		// TODO: Replace with actual API call
		// return await fetch('/api/offers').then(res => res.json());
		return Promise.resolve(MOCK_OFFERS);
	}

	/**
	 * Get offer by ID
	 */
	async getOfferById(id: number): Promise<Offer | null> {
		// TODO: Replace with actual API call
		// return await fetch(`/api/offers/${id}`).then(res => res.json());
		return Promise.resolve(MOCK_OFFERS.find((offer) => offer.id === id) || null);
	}

	/**
	 * Get featured offers
	 */
	async getFeaturedOffers(): Promise<Offer[]> {
		// TODO: Replace with actual API call
		return Promise.resolve(MOCK_OFFERS.filter((offer) => offer.featured));
	}

	/**
	 * Get offers by category
	 */
	async getOffersByCategory(category: string): Promise<Offer[]> {
		// TODO: Replace with actual API call
		return Promise.resolve(MOCK_OFFERS.filter((offer) => offer.category === category));
	}

	/**
	 * Generate mock driver for offer
	 */
	getMockDriver(offer: Offer, language: string): OfferDriver {
		const isArabic = language === "ar";
		const isMotorbike = offer.link?.includes("motorbike");

		const drivers = [
			{ id: "01", name: "Mohammed Ahmed", nameAr: "محمد أحمد", rating: 4.9, reviews: 1250, experience: 8 },
			{ id: "02", name: "Abdullah Hassan", nameAr: "عبدالله حسن", rating: 4.8, reviews: 982, experience: 6 },
			{ id: "03", name: "Omar Ali", nameAr: "عمر علي", rating: 4.95, reviews: 1540, experience: 10 },
			{ id: "04", name: "Khalid Ibrahim", nameAr: "خالد إبراهيم", rating: 4.85, reviews: 875, experience: 7 },
		];

		const randomDriver = drivers[offer.id % drivers.length];

		return {
			id: `DRV-${offer.id}${randomDriver.id}`,
			name: randomDriver.name,
			nameAr: randomDriver.nameAr,
			rating: randomDriver.rating,
			reviewsCount: randomDriver.reviews,
			pricePerKm: isMotorbike ? 2.5 : 5.0,
			experience: isArabic ? `${randomDriver.experience} سنوات` : `${randomDriver.experience} years`,
			location: isArabic ? "الرياض" : "Riyadh",
			vehicleType: isMotorbike ? "motorbike" : "truck",
			vehicleModel: isMotorbike
				? isArabic
					? "هوندا 2023"
					: "Honda 2023"
				: isArabic
				? "إيسوزو 5 طن"
				: "Isuzu 5 Ton",
			licensePlate: `ABC ${1000 + offer.id}`,
			phone: `+966 55 ${(Math.random() * 1000000).toFixed(0).padStart(7, '0')}`,
			distance: 2.5 + (offer.id % 5),
			estimatedTime: 10 + (offer.id % 20),
			verified: true,
			insured: true,
			completedDeliveries: randomDriver.reviews,
			yearsOfExperience: randomDriver.experience,
		};
	}
}

export const offerService = new OfferService();
export default offerService;

