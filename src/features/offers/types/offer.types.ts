/**
 * Offers Feature Types
 * Type definitions for offer-related entities
 */

export interface OfferDiscount {
	type: "percentage" | "fixed";
	value: number;
	maxDiscount?: number;
	minOrder?: number;
}

export interface Offer {
	id: number;
	title: string;
	titleEn: string;
	description: string;
	descriptionEn: string;
	cta: string;
	ctaEn: string;
	image: string;
	link: string;
	discount?: OfferDiscount;
	promoCode?: string;
	validUntil?: string;
	category?: "delivery" | "food" | "service" | "general";
	featured?: boolean;
	usageCount?: number;
	maxUsage?: number;
}

export interface OfferDriver {
	id: string;
	name: string;
	nameAr: string;
	avatar?: string;
	rating: number;
	reviewsCount: number;
	pricePerKm: number;
	experience: string;
	location: string;
	vehicleType: "motorbike" | "truck";
	vehicleModel: string;
	licensePlate: string;
	phone: string;
	distance: number;
	estimatedTime: number;
	verified: boolean;
	insured: boolean;
	completedDeliveries?: number;
	yearsOfExperience?: number;
}

export interface OfferBookingData {
	offerId: number;
	offerTitle: string;
	offerTitleEn: string;
	discount: OfferDiscount;
	promoCode: string;
	preSelectedDriver: OfferDriver;
	transportType: string;
	orderType: string;
	validUntil: string;
}

export interface OfferBenefit {
	id: string;
	title: string;
	titleEn: string;
	description: string;
	descriptionEn: string;
	icon: string;
}

export interface OfferTerms {
	id: string;
	text: string;
	textEn: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

