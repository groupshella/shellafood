/**
 * Driver Feature Types
 * Type definitions for driver-related entities
 */

export interface Zone {
	id: number;
	name: string;
	status?: number;
}

export interface DriverRegistrationData {
	f_name: string;
	l_name: string;
	email: string;
	phone: string;
	identity_number: string;
	identity_type: string; // 'national_id' or 'iqama'
	zone_id: number;
	password: string;
	identity_image?: File;
	driving_license_image?: File;
	driver_license_image?: File;
}

export interface Driver {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	pricePerKm: number;
	experience: string;
	vehicleType: "truck" | "motorbike";
	vehicleModel: string;
	licensePlate: string;
	phone: string;
	completedOrders: number;
	joinDate: string;
	specialties: string[];
	bio?: string;
	bioAr?: string;
	verified: boolean;
	responseTime?: string;
	acceptanceRate?: number;
	online?: boolean;
	lastSeen?: Date;
}

export interface DriverFormData {
	// Personal Information
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	
	// Driver Information
	identity_number: string;
	identity_type: string;
	zone_id: string;
	
	// Optional Files
	identity_image: string;
	driving_license_image: string;
	driver_license_image: string;
	
	// Terms
	agreed: boolean;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: Date;
	status: "sent" | "delivered" | "read";
}

export type IdentityType = "nid" | "residence" | "passport" | "driving_license";

export interface BenefitCard {
	id: string;
	image: string;
	route: string;
	titleKey: string;
	descriptionKey: string;
	moreKey: string;
}

export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}

