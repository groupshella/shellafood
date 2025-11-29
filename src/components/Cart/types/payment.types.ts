// Payment-related type definitions

export type PaymentMethod = 'apple_pay' | 'stc_pay' | 'card' | 'cash' | 'kaidha';

export interface CardDetails {
	number: string;
	expiry: string;
	cvv: string;
	name: string;
}

export interface PaymentOption {
	id: PaymentMethod;
	labelEn: string;
	labelAr: string;
	icon: string;
	descriptionEn?: string;
	descriptionAr?: string;
	requiresDetails: boolean;
}

