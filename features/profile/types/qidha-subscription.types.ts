export interface QidhaSubscriptionFormData {
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    familyName: string;
    birthDate: string;
    nationality: string;
    maritalStatus: string;
    familyCount: string;
    idNumber: string;
    idExpiryDate: string;
    phone: string;
    homeType: string;
    city: string;
    neighborhood: string;
    incomeSource: string;
    employerName: string;
    monthlyIncome: string;
    salaryDay: string;
    hasInstallments: string;
    uploadedDoc: { file: File; previewName: string } | null;
}

export interface NafathIdentityPayload {
	national_id: string;
	user_id: number;
}

export interface NafathSignPayload {
	national_id: string;
	city: string;
	neighborhood: string;
	house_type: string;
}

export type NafathStatus =
	| "idle"
	| "initiating"
	| "pending"
	| "approved"
	| "signing"
	| "signed"
	| "rejected"
	| "expired"
	| "cancelled"
	| "error";

export interface NafathResponseData {
	code?: string | number;
	random?: string | number;
	status?: string;
	transaction_id?: string | number;
	request_id?: string | number;
	signature_path?: string;
	[key: string]: unknown;
}
