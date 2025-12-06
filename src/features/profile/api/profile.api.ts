/**
 * API client for profile endpoints
 * Handles user profile, addresses, wallet, and related operations
 */

import type { User, Address, DashboardStats, WalletBalance, Point, Voucher, Favorite, ApiResponse } from '../types';
import { PROFILE_CONSTANTS } from '../constants/profile.constants';

const BASE_URL = PROFILE_CONSTANTS.BASE_URL;
const DEFAULT_LANG = PROFILE_CONSTANTS.DEFAULT_LANG;

/**
 * Get user profile
 */
export async function getUserProfile(
	userId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<User>> {
	try {
		// TODO: Replace with actual API endpoint when available
		// const response = await fetch(`${BASE_URL}/api/v1/profile/${userId}`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'X-LANG': lang,
		// 		'Accept': 'application/json',
		// 	},
		// });

		// if (!response.ok) {
		// 	const error = await response.json().catch(() => ({ message: 'Network error' }));
		// 	return {
		// 		success: false,
		// 		error: error.message || `HTTP ${response.status}`,
		// 	};
		// }

		// const data = await response.json();
		// return {
		// 	success: true,
		// 	data,
		// };

		// Temporary mock response
		return {
			success: true,
			data: {
				id: userId,
				fullName: 'أحمد محمد',
				email: 'ahmed@example.com',
				isPremium: true,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats(
	userId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<DashboardStats>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			success: true,
			data: {
				totalOrders: 0,
				totalSpent: 0,
				favoriteStores: 0,
				points: 0,
				recentOrders: [],
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

/**
 * Get user addresses
 */
export async function getUserAddresses(
	userId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Address[]>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			success: true,
			data: [],
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(
	userId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<WalletBalance>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			success: true,
			data: {
				balance: 0,
				currency: 'SAR',
				transactions: [],
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

