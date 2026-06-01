/**
 * API client for investor endpoints
 * Fixed to match actual backend response shapes from PortalLogisticeAuthController
 */

import type { InvestorFormData, NafathResponse, ApiResponse } from '../types/investor.types';
import { INVESTOR_CONSTANTS } from '../constants/investor.constants';

const BASE_URL = INVESTOR_CONSTANTS.BASE_URL;
const DEFAULT_LANG = INVESTOR_CONSTANTS.DEFAULT_LANG;

// ─── Internal fetch helper ────────────────────────────────────────────────────

/**
 * Low-level fetch wrapper.
 * Does NOT auto-unwrap `.data` — callers decide how to interpret the body,
 * because some endpoints return flat objects and others wrap in { data: ... }.
 */
async function apiCall<T>(
	endpoint: string,
	options: RequestInit = {},
	lang: string = DEFAULT_LANG,
	responseType: 'json' | 'blob' = 'json'
): Promise<ApiResponse<T>> {
	try {
		const isFormData = options.body instanceof FormData;
		const headers: Record<string, string> = {
			'X-LANG': lang,
			'Accept': responseType === 'blob' ? 'application/pdf' : 'application/json',
			...(options.headers as Record<string, string> || {}),
		};

		// Let the browser set Content-Type boundary for FormData
		if (isFormData) {
			delete headers['Content-Type'];
		}

		const response = await fetch(`${BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Network error' }));
			return {
				error:
					errorData.message ||
					errorData.errors?.[0]?.message ||
					errorData.error ||
					`HTTP ${response.status}`,
				status: response.status,
			};
		}

		if (responseType === 'blob') {
			const blob = await response.blob();
			return { data: blob as T, status: response.status };
		}

		const json = await response.json();
		return { data: json as T, status: response.status };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build FormData from InvestorFormData, skipping the 'agreed' checkbox */
function buildFormData(formData: InvestorFormData): FormData {
	const fd = new FormData();
	Object.entries(formData).forEach(([key, value]) => {
		if (key !== 'agreed') {
			fd.append(key, String(value));
		}
	});
	return fd;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Preview contract PDF.
 *
 * Route: POST /api/v1/portallogistice/nafath/contract-pdf  (or whatever ENDPOINTS.CONTRACT_PDF is)
 * Backend: PortalLogisticeAuthController::contractPdf()
 * Response: raw PDF bytes (blob)
 */
export async function previewContractPDF(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Blob>> {
	return apiCall<Blob>(
		INVESTOR_CONSTANTS.ENDPOINTS.CONTRACT_PDF,
		{
			method: 'POST',
			body: buildFormData(formData),
		},
		lang,
		'blob'
	);
}

/**
 * Initialize Nafath verification.
 *
 * Route: POST /api/v1/portallogistice/nafath/initiate
 * Backend: PortalLogisticeAuthController::initiate()
 *
 * Success response shape (flat — no { data: ... } wrapper):
 * {
 *   status: 'sent',
 *   request_id: string,
 *   code: string,               // 2-digit code shown to user
 *   external_response: [{ random: string, ... }]
 * }
 *
 * The hook reads:
 *   result.data.request_id
 *   result.data.external_response[0].random   ← same as result.data.code
 */
export async function initNafathVerification(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<NafathResponse>> {
	const result = await apiCall<any>(
		INVESTOR_CONSTANTS.ENDPOINTS.NAFATH_INIT,
		{
			method: 'POST',
			body: buildFormData(formData),
		},
		lang
	);

	if (result.error) return result as ApiResponse<NafathResponse>;

	// Backend returns a flat object. Normalise it so the hook can always read
	// result.data.request_id  and  result.data.external_response[0].random
	const body = result.data as any;
	const normalised: NafathResponse = {
		...body,
		// Guarantee external_response array exists with a random field
		external_response: body.external_response ?? [{ random: body.code ?? null }],
	};

	return { data: normalised, status: result.status };
}

/**
 * Check Nafath verification status.
 *
 * Route: GET /api/v1/portallogistice/nafath/checkStatus
 * Backend: PortalLogisticeAuthController::checkStatus()
 *
 * Backend reads query params:  national_id  (required)  +  contract_type  (optional)
 * It does NOT accept request_id — it looks up the latest record for the national_id.
 *
 * Success response shape (flat — no { data: ... } wrapper):
 * {
 *   status: 'approved' | 'pending' | 'failed',
 *   national_id: string,
 *   request_id: string,
 *   full_name_ar: string,
 *   signed_file_url: string | null,
 * }
 */
export async function checkNafathStatus(
	nationalId: string,
	lang: string = DEFAULT_LANG,
	contractType?: string
): Promise<ApiResponse<NafathResponse>> {
	const params = new URLSearchParams({ national_id: nationalId });
	if (contractType) params.set('contract_type', contractType);

	const result = await apiCall<any>(
		`${INVESTOR_CONSTANTS.ENDPOINTS.NAFATH_STATUS}?${params.toString()}`,
		{ method: 'GET' },
		lang
	);

	if (result.error) return result as ApiResponse<NafathResponse>;

	return { data: result.data as NafathResponse, status: result.status };
}

/**
 * Submit investor registration (after Nafath is approved).
 *
 * Route: POST /api/v1/portallogistice/register
 * Backend: PortalLogisticeAuthController::register()
 *
 * Success response shape:
 * {
 *   success: true,
 *   message: string,
 *   data: {
 *     tracking_id: number,      ← the contract ID (hook was reading .id — fixed below)
 *     national_id: string,
 *     contract_type: string,
 *     status: string,
 *     contract_download_url: string,
 *     signed_contract_available: boolean,  ← hook was reading .is_completed — fixed below
 *     application_date: string,
 *   }
 * }
 */
export async function submitInvestorForm(
	formData: InvestorFormData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	const result = await apiCall<any>(
		INVESTOR_CONSTANTS.ENDPOINTS.SUBMIT_FORM,
		{
			method: 'POST',
			body: buildFormData(formData),
		},
		lang
	);

	if (result.error) return result;

	const body = result.data as any;

	// Backend wraps the payload in { success, data: { tracking_id, signed_contract_available, ... } }
	// Normalise so the hook can read result.data.id and result.data.is_completed
	const inner = body?.data ?? body;
	const normalised = {
		...inner,
		id: inner.tracking_id ?? inner.id,                          // hook reads .id
		is_completed: inner.signed_contract_available ?? true,      // hook reads .is_completed
	};

	return { data: normalised, status: result.status };
}