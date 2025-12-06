/**
 * API client for order-tracking endpoints
 * Handles fetching order tracking data and updates
 */

import type { OrderData, ApiResponse } from '../types';
import { ORDER_TRACKING_CONSTANTS } from '../constants/order-tracking.constants';

const BASE_URL = ORDER_TRACKING_CONSTANTS.BASE_URL;
const DEFAULT_LANG = ORDER_TRACKING_CONSTANTS.DEFAULT_LANG;

/**
 * Get order tracking data
 */
export async function getOrderTracking(
	orderId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<OrderData>> {
	try {
		// TODO: Replace with actual API endpoint when available
		// const response = await fetch(`${BASE_URL}/api/v1/orders/${orderId}/tracking`, {
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
			data: undefined,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

/**
 * Cancel order
 */
export async function cancelOrder(
	orderId: string,
	reason?: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<{ success: boolean }>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			success: true,
			data: { success: true },
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

