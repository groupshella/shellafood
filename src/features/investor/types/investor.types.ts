/**
 * Investor Feature Types
 * Type definitions for investor-related entities
 */

export interface InvestorFormData {
	first_name: string;
	father_name: string;
	family_name: string;
	grandfather_name: string;
	birth_date: string;
	national_id: string;
	email: string;
	phone: string;
	national_address_email: string;
	region: string;
	iban: string;
	bank_name: string;
	amount: string;
	agreed: boolean;
}

export interface NafathResponse {
	status: string;
	request_id?: string;
	external_response?: Array<{ random: string }>;
	full_name_ar?: string;
	national_id?: string;
	signed_file_url?: string;
}

export type InvestorFormStep = 'form' | 'verification' | 'complete';

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

