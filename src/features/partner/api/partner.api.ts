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
// api/partner.api.ts
export async function registerPartner(
	data: PartnerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<PartnerRegistrationResponse>> {
	try {
		const formData = new FormData();
		
		// Append required text fields
		formData.append('f_name', data.f_name);
		formData.append('l_name', data.l_name);
		formData.append('phone', data.phone);
		formData.append('email', data.email);
		formData.append('password', data.password);
		formData.append('zone_id', data.zone_id.toString());
		formData.append('module_id', data.module_id.toString());
		formData.append('store_name', data.store_name);
		formData.append('address', data.address);
		formData.append('latitude', data.latitude.toString());
		formData.append('longitude', data.longitude.toString());

		// Append files if provided
		if (data.logo) {
			formData.append('logo', data.logo);
		}
		if (data.cover_photo) {
			formData.append('cover_photo', data.cover_photo);
		}

		const response = await fetch(`${BASE_URL}/api/v1/vendor/register`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formData,
		});

		const responseData = await response.json();
		console.log('Partner registration response:', responseData);

		// Handle error responses
		if (responseData.errors) {
			console.log('Partner registration error:', responseData.errors[0].message);
			return {
				error: responseData.errors[0].message,
				status: response.status || 400,
			};
		}


		return {
			data: responseData.data || responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Partner registration network error:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

