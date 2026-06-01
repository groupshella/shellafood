/**
 * API client for worker endpoints
 * Handles zones, modules, worker registration, worker profile, and chat
 */

import type { WorkerFormData, ApiResponse, WorkerRegistrationResponse, WorkerRegistrationData, Zone, Module, Worker, Message } from '../types/worker.types';
import { WORKER_CONSTANTS } from '../constants/worker.constants';

const BASE_URL = WORKER_CONSTANTS.BASE_URL;
const DEFAULT_LANG = WORKER_CONSTANTS.DEFAULT_LANG;

/**
 * Get list of available zones for worker registration
 */
export async function getWorkerZonesList(lang: string = DEFAULT_LANG): Promise<ApiResponse<Zone[]>> {
	try {
		const response = await fetch(`/api/zones/list?lang=${encodeURIComponent(lang)}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'حدث خطأ في تحميل المناطق' }));
			return {
				error: 'حدث خطأ في تحميل المناطق',
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
			error: error instanceof Error ? error.message : 'حدث خطأ في تحميل المناطق',
			status: 500,
		};
	}
}

/**
 * Get modules by zone ID for worker registration
 */
export async function getWorkerModulesByZone(
	zoneId: number,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Module[]>> {
	try {
		const response = await fetch(
			`/api/zones/modules?zone_id=${zoneId}&lang=${encodeURIComponent(lang)}`,
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
			const errorData = await response.json().catch(() => ({ message: 'حدث خطأ في تحميل الموديولات' }));
			return {
				error: 'حدث خطأ في تحميل الموديولات',
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
			error: error instanceof Error ? error.message : 'حدث خطأ في تحميل الموديولات',
			status: 500,
		};
	}
}

/**
 * Register a new worker
 */
export async function registerWorker(
	data: WorkerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<WorkerRegistrationResponse>> {
	try {
		const formData = new FormData();

		// Append required text fields
		formData.append('first_name', data.first_name);
		formData.append('last_name', data.last_name);
		formData.append('email', data.email);
		formData.append('driver_type', data.driver_type);
		formData.append('area', data.area);
		formData.append('vehicle_type', data.vehicle_type);
		formData.append('id_type', data.id_type);
		formData.append('id_number', data.id_number);

		// Append optional fields if provided
		if (data.zone_id) {
			formData.append('zone_id', data.zone_id.toString());
		}
		if (data.module_id) {
			formData.append('module_id', data.module_id.toString());
		}

		// Append file if provided
		if (data.id_image) {
			formData.append('id_image', data.id_image);
		}

		const response = await fetch(`${BASE_URL}/api/v1/workers`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formData,
		});

		console.log(response);
		const responseData = await response.json();
		console.log('Worker registration response:', responseData);

		// Handle error responses
		if (responseData.errors) {
			console.log('Worker registration error:', responseData.errors[0].message);
			return {
				error: responseData.errors[0].message,
				status: response.status || 400,
			};
		}

		// Handle non-OK HTTP status
		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Failed to register worker',
				status: response.status,
			};
		}

		return {
			data: responseData.data || responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Worker registration network error:', error);
		return {
			error: error instanceof Error ? error.message : 'حدث خطأ في تسجيل العامل',
			status: 500,
		};
	}
}

/**
 * Get worker profile by ID
 */
export async function getWorkerProfile(
	workerId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Worker>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/worker/${workerId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch worker profile' }));
			return {
				error: 'حدث خطأ في تحميل الملف الشخصي للعامل',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: data.data || data,
			status: response.status,
		};
	} catch (error) {
		return {
			error: 'حدث خطأ في تحميل الملف الشخصي للعامل',
			status: 500,
		};
	}
}

/**
 * Get chat messages for a worker conversation
 */
export async function getChatMessages(
	workerId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Message[]>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/chat/worker/${workerId}/messages`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'حدث خطأ في تحميل الرسائل' }));
			return {
				error: 'حدث خطأ في تحميل الرسائل',
				status: response.status,
			};
		}

		const data = await response.json();
		// Transform API response to Message format
		const messages: Message[] = (data.data || data.messages || []).map((msg: any) => {
			const senderType = msg.sender_type || (msg.sender_id === workerId || msg.senderId === workerId ? 'worker' : 'user');
			return {
				id: msg.id || msg.message_id,
				sender: senderType === 'worker' ? 'worker' : 'user',
				senderId: msg.sender_id || msg.senderId || (senderType === 'worker' ? workerId : 'me'),
				text: msg.text || msg.message || msg.content,
				timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
				status: msg.status || 'delivered',
				type: msg.type || 'text',
			};
		});

		return {
			data: messages,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'حدث خطأ في إرسال الرسالة',
			status: 500,
		};
	}
}

/**
 * Send a chat message to a worker
 */
export async function sendChatMessage(
	workerId: string,
	message: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<{ response?: string }>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/chat/worker/${workerId}/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({ message }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'حدث خطأ في إرسال الرسالة' }));
			return {
				error: 'حدث خطأ في إرسال الرسالة',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: data.data || data,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'حدث خطأ في إرسال الرسالة',
			status: 500,
		};
	}
}
