/**
 * API client for investor endpoints
 * Handles investor registration, contract generation, and Nafath verification
 */

import type { InvestorFormData, NafathResponse, ApiResponse } from '../types/investor.types';
import { INVESTOR_CONSTANTS } from '../constants/investor.constants';

const BASE_URL = INVESTOR_CONSTANTS.BASE_URL;
const DEFAULT_LANG = INVESTOR_CONSTANTS.DEFAULT_LANG;

/**
 * Make API call with proper headers
 * Returns ApiResponse instead of throwing errors
 */
async function apiCall<T>(
	endpoint: string,
	options: RequestInit = {},
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<T>> {
	try {
		const isFormData = options.body instanceof FormData;
		const headers: HeadersInit = {
			'X-LANG': lang,
			'Accept': 'application/json',
			...(options.headers || {}),
		};

		// Remove Content-Type for FormData requests to let browser set it automatically
		if (isFormData && 'Content-Type' in headers) {
			delete (headers as any)['Content-Type'];
		}

		const response = await fetch(`${BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Network error' }));
			return {
				error: errorData.message || errorData.error || `HTTP ${response.status}`,
				status: response.status,
			};
		}

		// Handle different response types
		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			const data = await response.json();
			return {
				data: data.data || data,
				status: response.status,
			};
		} else {
			// For blob responses (like PDF)
			const blob = await response.blob();
			return {
				data: blob as T,
				status: response.status,
			};
		}
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Preview contract PDF
 */
export async function previewContractPDF(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Blob>> {
	const formDataToSend = new FormData();
	Object.entries(formData).forEach(([key, value]) => {
		if (key !== 'agreed') {
			formDataToSend.append(key, value.toString());
		}
	});

	return apiCall<Blob>(
		`${INVESTOR_CONSTANTS.ENDPOINTS.CONTRACT_PDF}?pdf=1`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/pdf',
			},
			body: formDataToSend,
		},
		lang
	);
}

/**
 * Submit investor form
 */
export async function submitInvestorForm(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	const formDataToSend = new FormData();
	Object.entries(formData).forEach(([key, value]) => {
		if (key !== 'agreed') {
			formDataToSend.append(key, value.toString());
		}
	});

	return apiCall<any>(
		INVESTOR_CONSTANTS.ENDPOINTS.SUBMIT_FORM,
		{
			method: 'POST',
			body: formDataToSend,
		},
		lang
	);
}

/**
 * Initialize Nafath verification
 */
export async function initNafathVerification(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<NafathResponse>> {
	const formDataToSend = new FormData();
	Object.entries(formData).forEach(([key, value]) => {
		if (key !== 'agreed') {
			formDataToSend.append(key, value.toString());
		}
	});

	return apiCall<NafathResponse>(
		INVESTOR_CONSTANTS.ENDPOINTS.NAFATH_INIT,
		{
			method: 'POST',
			body: formDataToSend,
		},
		lang
	);
}

/**
 * Check Nafath verification status
 */
export async function checkNafathStatus(
	requestId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<NafathResponse>> {
	return apiCall<NafathResponse>(
		`${INVESTOR_CONSTANTS.ENDPOINTS.NAFATH_STATUS}?request_id=${requestId}`,
		{
			method: 'GET',
		},
		lang
	);
}
