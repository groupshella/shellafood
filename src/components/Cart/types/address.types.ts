// Address-related type definitions

export interface Address {
	id: string;
	address: string;
	formattedAddress?: string;
	createdAt: string;
	lat?: number;
	lng?: number;
}

