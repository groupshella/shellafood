/**
 * API client for driver endpoints
 * Handles zones, driver registration, driver profile, and chat
 */

import type { Zone, DriverRegistrationData, Driver, Message, ApiResponse } from '../types/driver.types';

const BASE_URL = 'https://shellafood.com';
const DEFAULT_LANG = 'ar';

/**
 * Get list of available zones for driver registration
 */
export async function getDriverZonesList(lang: string = DEFAULT_LANG): Promise<ApiResponse<Zone[]>> {
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
			error: 'حدث خطأ في تحميل المناطق',
			status: 500,
		};
	}
}

/**
 * Register a new delivery driver
 */
export async function registerDriver(
	data: DriverRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	try {
		const formData = new FormData();

		// Append text fields
		formData.append('f_name', data.f_name);
		formData.append('l_name', data.l_name);
		formData.append('email', data.email);
		formData.append('phone', data.phone);
		formData.append('identity_number', data.identity_number);
		formData.append('identity_type', data.identity_type);
		formData.append('zone_id', data.zone_id.toString());
		formData.append('password', data.password);

		// Append files if provided
		if (data.identity_image) {
			formData.append('identity_image', data.identity_image);
		}
		if (data.driving_license_image) {
			formData.append('driving_license_image', data.driving_license_image);
		}
		if (data.driver_license_image) {
			formData.append('driver_license_image', data.driver_license_image);
		}

		const response = await fetch(`${BASE_URL}/api/v1/delivery-man/store`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formData,
		});

		const responseData = await response.json();
		console.log(responseData);


		if (responseData.errors) {
			console.log(responseData.errors[0].message);
			return {
				error: responseData.errors[0].message,
				status: 404,
			};
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.log(error);
		return {
			error: 'حدث خطأ في تسجيل السائق',
			status: 500,
		};
	}
}

/**
 * Get driver profile by ID
 */
export async function getDriverProfile(
	driverId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Driver>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/delivery-man/${driverId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch driver profile' }));
			return {
				error: 'حدث خطأ في تحميل الملف الشخصي للسائق',
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
			error: error instanceof Error ? error.message : 'حدث خطأ في تحميل الملف الشخصي للسائق',
			status: 500,
		};
	}
}

/**
 * Get chat messages for a driver conversation
 */
export async function getChatMessages(
	driverId: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Message[]>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/chat/driver/${driverId}/messages`, {
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
		const messages: Message[] = (data.data || data.messages || []).map((msg: any) => ({
			id: msg.id || msg.message_id,
			senderId: msg.sender_id || msg.senderId || (msg.sender_type === 'driver' ? driverId : 'me'),
			text: msg.text || msg.message || msg.content,
			timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
			status: msg.status || 'delivered',
		}));

		return {
			data: messages,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'حدث خطأ في تحميل الرسائل',
			status: 500,
		};
	}
}

/**
 * Send a chat message to a driver
 */
export async function sendChatMessage(
	driverId: string,
	message: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<{ response?: string }>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/chat/driver/${driverId}/send`, {
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

