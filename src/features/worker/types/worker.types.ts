/**
 * Worker Feature Types
 * Type definitions for worker-related entities
 */

export interface WorkerFormData {
	// Personal Information
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	
	// Work Information
	driver_type: string;
	area: string;
	vehicle_type: string;
	
	// ID Information
	id_type: string;
	id_number: string;
	id_image: string;
	
	// Optional Fields
	zone_id: string;
	module_id: string;
}

export interface NotificationState {
	message: string;
	type: "success" | "error";
	isVisible: boolean;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

export interface WorkerRegistrationData {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	driver_type: string;
	area: string;
	vehicle_type: string;
	id_type: string;
	id_number: string;
	id_image?: File;
	zone_id?: number;
	module_id?: number;
}

export interface Zone {
	id: number;
	name: string;
	status?: number;
}

export interface Module {
	id: number;
	name: string;
	module_name?: string;
	zone_id?: number;
	status?: number;
}

export interface WorkerRegistrationResponse {
	id: string;
	message?: string;
}

export interface Worker {
	id: string;
	name: string;
	nameAr?: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	experience: string;
	location: string;
	responseTime: string;
	phone: string;
	about?: string;
	aboutAr?: string;
	skills: string[];
	education?: string[];
	certifications?: string[];
	verified?: boolean;
	online?: boolean;
	lastSeen?: Date;
}

export interface Message {
	id: string;
	sender: 'user' | 'worker';
	senderId?: string; // Optional: can be used for API compatibility
	text: string;
	timestamp: Date;
	status: "sent" | "delivered" | "read";
	type: "text" | "image" | "file";
	imageUrl?: string;
	fileName?: string;
}

export interface BenefitCard {
	id: string;
	image: string;
	titleKey: string;
	descriptionKey: string;
}

