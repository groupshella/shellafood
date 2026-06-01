import { BASE_URL, DEFAULT_LANG } from "@/features/(actors)/auth/constants/auth.constants";
import { cache } from 'react';
import { Notification, NotificationsResponse, ApiResponse } from '../types/notifications.types';

export const getCachedNotifications = cache(
	async (
		lang: string = DEFAULT_LANG,
		zoneId: string = '2',
		authToken?: string,
	) => {
		const result = await getNotifications(lang, zoneId, authToken);
		return result;
	}
);

/**
 * Get customer notifications
 * @param lang - Language code ('ar' or 'en')
 * @param zoneId - Zone ID
 * @param authToken - Authentication token
 */
export async function getNotifications(
	lang: string = DEFAULT_LANG,
	zoneId: string = '2',
	authToken?: string,
): Promise<ApiResponse<Notification[]>> {
	try {
		const url = `${BASE_URL}/api/v1/customer/notifications`;

		console.log(`[Notifications API] Requesting: ${url}`);

		const fetchStartTime = Date.now();

		const headers: HeadersInit = {
			'Accept': 'application/json',
			'Host': 'shellafood.com',
			'X-localization': lang,
			'zoneId': zoneId,
		};

		if (authToken) {
			headers['Authorization'] = `Bearer ${authToken}`;
		}

		const response = await fetch(url, {
			method: 'GET',
			headers,
			cache: 'no-store',
		});

		const fetchDuration = Date.now() - fetchStartTime;

		console.log(`[Notifications API] Response received in ${fetchDuration}ms:`, {
			status: response.status,
			statusText: response.statusText,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Failed to fetch notifications',
			}));
			console.error('[Notifications API] API Error:', {
				status: response.status,
				message: errorData.message,
			});
			return {
				error: errorData.message || 'Failed to fetch notifications',
				status: response.status,
			};
		}

		const data = await response.json();

		// Handle both array and object responses
		const notifications = Array.isArray(data)
			? data
			: (data.notifications || []);

		console.log(`[Notifications API] Data parsed:`, {
			notificationsCount: notifications.length,
		});

		return {
			data: notifications,
		};
	} catch (error) {
		console.error('[Notifications API] Network Error:', error);
		return {
			error: 'Network error',
			status: 500,
		};
	}
}

