/**
 * Kaidha Feature Types
 * Type definitions for kaidha-related entities
 */

export interface KaidhaFormData {
	firstName: string;
	lastName: string;
	fatherName: string;
	grandFatherName: string;
	birthDate: string;
	nationality: string;
	socialStatus: string;
	familyMembersCount: string;
	idType: string;
	personalIdNumber: string;
	idExpirationDate: string;
	phoneNumber: string;
	whatsappNumber: string;
	email: string;
	homeType: string;
	homeNature: string;
	city: string;
	neighborhood: string;
	addressDetails: string;
	locationHouse: string;
	agreed: boolean;
	companyName: string;
	jobTitle: string;
	yearsOfExperience: string;
	grossSalary: string;
	workAddress: string;
	locationWork: string;
	installments: string;
	hasAdditionalIncome: string;
	additionalAmount: string;
	incomeSource: string;
	salaryDay: string; // New field for salary day
}

export interface InstallmentItem {
	[key: string]: string;
	commitmentAmount: string;
	entityName: string;
}

export interface AdditionalIncomeItem {
	[key: string]: string;
	amount: string;
	source: string;
}

export interface DynamicListItem {
	[key: string]: string;
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

export interface KaidhaSubmissionResponse {
	id: string;
}

