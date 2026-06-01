/**
 * API client for kaidha endpoints
 * Handles kaidha registration form submission
 */

import type { KaidhaFormData, ApiResponse, KaidhaSubmissionResponse } from '../types/kaidha.types';
import { KAIDHA_CONSTANTS } from '../constants/kaidha.constants';
import { getBaseUrl } from '@/features/(actors)/auth/constants/auth.constants';

const BASE_URL = KAIDHA_CONSTANTS.BASE_URL;
const DEFAULT_LANG = KAIDHA_CONSTANTS.DEFAULT_LANG;

/**
 * Submit kaidha registration form
 */
export async function submitKaidhaForm(
	formData: KaidhaFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<KaidhaSubmissionResponse>> {
	try {
		const baseUrl = getBaseUrl();
		const response = await fetch(`${baseUrl}/api/qidha-wallet/store`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Include cookies for auth
			body: JSON.stringify(formData),
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Registration failed',
				status: response.status,
			};
		}

		return {
			data: responseData.data || responseData,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

