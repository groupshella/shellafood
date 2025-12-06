/**
 * API client for partner endpoints
 * Handles partner registration and zone/module fetching
 */

import type { PartnerFormData, ApiResponse, PartnerRegistrationResponse, PartnerRegistrationData, Zone, Module } from '../types/partner.types';
import { PARTNER_CONSTANTS } from '../constants/partner.constants';

const BASE_URL = PARTNER_CONSTANTS.BASE_URL;
const DEFAULT_LANG = PARTNER_CONSTANTS.DEFAULT_LANG;

/**
 * Get list of available zones for partner registration
 */
export async function getPartnerZonesList(lang: string = DEFAULT_LANG): Promise<ApiResponse<Zone[]>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/zone/list`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch zones' }));
			return {
				error: errorData.message || 'Failed to fetch zones',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: Array.isArray(data) ? data : data.data || data.zones || [],
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get modules by zone ID for partner registration
 */
export async function getPartnerModulesByZone(
	zoneId: number,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Module[]>> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/module?zone_id=${zoneId}`,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'X-LANG': lang,
				},
				cache: 'no-store',
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch modules' }));
			return {
				error: errorData.message || 'Failed to fetch modules',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: Array.isArray(data) ? data : data.data || data.modules || [],
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Register a new partner
 */
export async function registerPartner(
	formData: PartnerFormData | PartnerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<PartnerRegistrationResponse>> {
	try {
		const formDataToSend = new FormData();
		
		// Append text fields
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== '') {
				if (key === 'logo' || key === 'cover_photo') {
					if (value instanceof File) {
						formDataToSend.append(key, value);
					}
				} else if (key !== 'agreed') {
					formDataToSend.append(key, String(value));
				}
			}
		});

		// Append agreed as string
		if ('agreed' in formData) {
			formDataToSend.append('agreed', String(formData.agreed));
		}

		const response = await fetch(`${BASE_URL}/api/v1/partner/register`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formDataToSend,
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Registration failed',
				status: response.status,
			};
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

