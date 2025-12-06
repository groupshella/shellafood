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
 * Get modules by zone ID for worker registration
 */
export async function getWorkerModulesByZone(
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
 * Register a new worker
 */
export async function registerWorker(
	formData: WorkerFormData | WorkerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<WorkerRegistrationResponse>> {
	try {
		const formDataToSend = new FormData();
		
		// Append text fields
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== '') {
				if (key === 'id_image') {
					// Handle File object
					if (value instanceof File) {
						formDataToSend.append(key, value);
					} else if (typeof value === 'string' && value.trim() !== '') {
						// Skip URL strings - should be converted to File before calling
					}
				} else if (key === 'zone_id' || key === 'module_id') {
					// Handle optional number fields
					if (typeof value === 'number') {
						formDataToSend.append(key, value.toString());
					} else if (typeof value === 'string' && value.trim() !== '') {
						formDataToSend.append(key, value);
					}
				} else {
					formDataToSend.append(key, String(value));
				}
			}
		});

		const response = await fetch(`${BASE_URL}/api/v1/worker/register`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formDataToSend,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to register worker' }));
			return {
				error: errorData.message || errorData.error || 'Failed to register worker',
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
			error: error instanceof Error ? error.message : 'Network error',
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
				error: 'Failed to fetch worker profile',
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
			error:  'Network error',
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
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch messages' }));
			return {
				error: errorData.message || 'Failed to fetch messages',
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
			error: error instanceof Error ? error.message : 'Network error',
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
			const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
			return {
				error: errorData.message || 'Failed to send message',
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
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}
