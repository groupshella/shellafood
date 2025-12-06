/**
 * Partner Feature Types
 * Type definitions for partner-related entities
 */

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

export interface PartnerFormData {
	// Personal Information
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	
	// Store Information
	zoneId: string;
	moduleId: string;
	store_name: string;
	address: string;
	latitude: string;
	longitude: string;
	
	// Optional Files
	logo: string;
	cover_photo: string;
	
	// Terms
	agreed: boolean;
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

export interface PartnerRegistrationData {
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	zone_id: number;
	module_id: number;
	store_name: string;
	address: string;
	latitude: string;
	longitude: string;
	logo?: File;
	cover_photo?: File;
}

export interface PartnerRegistrationResponse {
	id: string;
	message?: string;
}

