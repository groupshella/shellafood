/**
 * API client for kaidha endpoints
 * Handles kaidha registration form submission
 */

import type { KaidhaFormData, ApiResponse, KaidhaSubmissionResponse } from '../types/kaidha.types';
import { KAIDHA_CONSTANTS } from '../constants/kaidha.constants';

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
		const response = await fetch(`${BASE_URL}/api/v1/kaidha/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
				'Accept': 'application/json',
			},
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

