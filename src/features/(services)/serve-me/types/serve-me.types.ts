/**
 * Serve Me Feature Types
 * Type definitions for serve-me related entities
 */

export interface Service {
	id: string;
	name: string;
	nameAr?: string;
	slug: string;
	description?: string;
	descriptionAr?: string;
	icon?: string;
	image?: string;
	category: string;
}
export interface ServiceItem {
	slug: string;
	path: string;
	description: string;
	descriptionAr: string;
	translationKey: string;
	iconName: 'Car' | 'Truck' | 'Wrench' | 'Plane' | 'Baby' | 'Scale' | 'Scissors' | 'Hammer';
	image: string;
}

export interface FeatureItem {
	iconName: 'MapPin' | 'Headphones' | 'CheckCircle';
	titleKey: string;
	descriptionKey: string;
}
export interface ServiceType {
	id: string;
	name: string;
	nameAr?: string;
	slug: string;
	description?: string;
	descriptionAr?: string;
	serviceId: string;
	price?: number;
	duration?: string;
}

export interface Worker {
	id: string;
	name: string;
	nameAr?: string;
	avatar?: string;
	rating: number;
	reviewsCount: number;
	completedJobs: number;
	skills?: string[];
	location?: string;
	pricePerHour?: number;
	isAvailable?: boolean;
}

export interface Address {
	id: string;
	address: string;
	formattedAddress?: string;
	createdAt: string;
	lat?: number;
	lng?: number;
}

export interface BookingData {
	serviceId: string;
	serviceTypeId: string;
	workerId?: string;
	address: Address;
	date: string;
	timeSlot: string;
	description?: string;
	attachments?: File[];
	paymentMethod?: string;
}

export interface PaymentMethod {
	id: string;
	name: string;
	nameAr?: string;
	icon?: string;
	isAvailable: boolean;
}

export interface TimeSlot {
	id: string;
	start: string;
	end: string;
	isAvailable: boolean;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

export interface NotificationState {
	show: boolean;
	message: string;
	type: 'success' | 'error' | 'info';
}

/**
 * Service Grid Item
 * Used for displaying services in the services grid component
 */
export interface ServiceGridItem {
	slug: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	path: string;
	image: string;
}
export interface ReviewItem {
	name: string;
	rating: number;
	comment: string;
	date: string;
	verified: boolean;
}

export interface FAQItem {
	question: string;
	answer: string;
}

// ============================================================================
// Booking Types
// ============================================================================

/**
 * Booking Address
 * Extended address interface for booking components with additional fields
 */
export interface BookingAddress {
	id: string;
	type: string;
	title: string;
	address: string;
	details: string;
	phone: string;
	isDefault: boolean;
	coordinates: { lat: number; lng: number };
}

/**
 * Booking Service Type
 * Type of service booking: instant or scheduled
 */
export type BookingServiceType = "instant" | "scheduled";

/**
 * Booking Step
 * Represents a step in the booking process navigation
 */
export interface BookingStep {
	id: string;
	path: string;
	labelEn: string;
	labelAr: string;
}

/**
 * Recommended Worker
 * Represents a platform-recommended worker with details
 */
export interface RecommendedWorker {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	price: number;
	experience: string;
	experienceAr: string;
	location: string;
	specialization: string;
	specializationAr: string;
	distance: number;
}

/**
 * Rating Modal Props
 */
export interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (rating: number, feedback: string) => Promise<void> | void;
	language?: "en" | "ar";
	serviceName?: string;
	driverName?: string;
	driverPhoto?: string;
}

