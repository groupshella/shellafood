/**
 * API client for serve-me endpoints
 * Handles service booking, worker selection, and related operations
 */

import type { Service, ServiceType, Worker, BookingData, ApiResponse } from '../types/serve-me.types';
import type { ServiceCategoryData, IndividualServiceData } from '@/lib/data/serve-me/services';
import { SERVE_ME_CONSTANTS } from '../constants/serve-me.constants';

const BASE_URL = SERVE_ME_CONSTANTS.BASE_URL;
const DEFAULT_LANG = SERVE_ME_CONSTANTS.DEFAULT_LANG;

/**
 * Get all services
 */
export async function getServices(
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Service[]>> {
	try {
		// TODO: Replace with actual API endpoint when available
		// const response = await fetch(`${BASE_URL}/api/v1/serve-me/services`, {
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
			data: [],
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(
	slug: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Service>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			data: {
				id: '',
				name: '',
				slug: '',
				category: '',
			},
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get service type by slug
 */
export async function getServiceTypeBySlug(
	serviceSlug: string,
	serviceTypeSlug: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<ServiceType>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			data: {
				id: '',
				name: '',
				slug: '',
				serviceId: '',
			},
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get available workers for a service
 */
export async function getAvailableWorkers(
	serviceId: string,
	serviceTypeId: string,
	date?: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Worker[]>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			data: [],
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Submit booking
 */
export async function submitBooking(
	bookingData: BookingData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<{ bookingId: string }>> {
	try {
		// TODO: Replace with actual API endpoint
		return {
			data: {
				bookingId: '',
			},
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get service category by slug
 */
export async function getServiceCategoryBySlug(
	slug: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<ServiceCategoryData>> {
	try {
		// TODO: Replace with actual API endpoint when available
		// const response = await fetch(`${BASE_URL}/api/v1/serve-me/service-categories/${slug}`, {
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
		// 		error: error.message || `HTTP ${response.status}`,
		// 		status: response.status,
		// 	};
		// }

		// const data = await response.json();
		// return {
		// 	data,
		// 	status: 200,
		// };

		// Temporary: Return empty data to trigger fallback to demo data
		return {
			data: undefined,
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get individual service by category slug and service slug
 */
export async function getIndividualService(
	categorySlug: string,
	serviceSlug: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<IndividualServiceData>> {
	try {
		// TODO: Replace with actual API endpoint when available
		// const response = await fetch(`${BASE_URL}/api/v1/serve-me/service-categories/${categorySlug}/services/${serviceSlug}`, {
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
		// 		error: error.message || `HTTP ${response.status}`,
		// 		status: response.status,
		// 	};
		// }

		// const data = await response.json();
		// return {
		// 	data,
		// 	status: 200,
		// };

		// Temporary: Return empty data to trigger fallback to demo data
		return {
			data: undefined,
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

