/**
 * Profile Feature Types
 * Type definitions for profile-related entities
 */

export interface User {
	id: string;
	fullName: string;
	email: string;
	phone?: string;
	avatar?: string;
	isPremium?: boolean;
}

export interface Address {
	id: string;
	label: string;
	street: string;
	city: string;
	district?: string;
	buildingNumber?: string;
	apartmentNumber?: string;
	latitude?: number;
	longitude?: number;
	isDefault?: boolean;
}

export interface DashboardStats {
	totalOrders: number;
	totalSpent: number;
	favoriteStores: number;
	points: number;
	recentOrders: OrderSummary[];
}

export interface OrderSummary {
	id: string;
	date: string;
	total: number;
	status: string;
	storeName: string;
}

export interface WalletBalance {
	balance: number;
	currency: string;
	transactions: Transaction[];
}

export interface Transaction {
	id: string;
	type: 'credit' | 'debit';
	amount: number;
	description: string;
	date: string;
	status: 'completed' | 'pending' | 'failed';
}

export interface Point {
	id: string;
	points: number;
	description: string;
	date: string;
	type: 'earned' | 'redeemed';
}

export interface Voucher {
	id: string;
	code: string;
	title: string;
	description: string;
	discount: number;
	discountType: 'percentage' | 'fixed';
	expiryDate: string;
	isUsed: boolean;
}

export interface Favorite {
	id: string;
	type: 'store' | 'product';
	name: string;
	image?: string;
	rating?: number;
	addedAt: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface NotificationState {
	show: boolean;
	message: string;
	type: 'success' | 'error' | 'info';
}

