import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STORAGE_KEYS, DEFAULT_LANG, getBaseUrl } from "@/features/(actors)/auth/constants/auth.constants";
import NotificationsPage from "@/features/notifications/components/NotificationsPage";
import type { Notification } from "@/features/notifications/types/notifications.types";

export const dynamic = "force-dynamic";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "الإشعارات | شلة فود - إشعارات الطلبات والتحديثات",
	description:
		"عرض جميع إشعاراتك وطلباتك والتحديثات في مكان واحد. ابق على اطلاع بآخر التحديثات والطلبات.",
	keywords: [
		"إشعارات",
		"شلة فود",
		"إشعارات الطلبات",
		"التحديثات",
		"الإشعارات",
		"متابعة الطلبات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الإشعارات | شلة فود",
		description: "عرض جميع إشعاراتك وطلباتك والتحديثات في مكان واحد.",
		type: "website",
		url: "https://shellafood.com/notifications",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-notifications.jpg",
				width: 1200,
				height: 630,
				alt: "الإشعارات - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الإشعارات | شلة فود",
		description: "عرض جميع إشعاراتك وطلباتك والتحديثات في مكان واحد.",
		images: ["/og-notifications.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/notifications",
		languages: {
			"ar-SA": "https://shellafood.com/notifications",
			"en-US": "https://shellafood.com/notifications",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

async function getNotificationsData(): Promise<Notification[] | null> {
	try {
		// Check authentication
		const cookieStore = await cookies();
		const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

		if (!authToken || !authToken.value || authToken.value.trim() === '') {
			return null;
		}

		// Use API route as proxy
		const baseUrl = getBaseUrl();
		const apiUrl = `${baseUrl}/api/notifications?zoneId=2&locale=${DEFAULT_LANG}`;

		// Get cookies to forward to API route
		const cookieHeader = cookieStore.getAll()
			.map(cookie => `${cookie.name}=${cookie.value}`)
			.join('; ');

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': DEFAULT_LANG,
				...(cookieHeader && { 'Cookie': cookieHeader }), // Forward cookies for auth
			},
			cache: 'no-store', // Don't cache this data
		});

		if (!response.ok) {
			console.error('[Notifications] API Error:', response.status, response.statusText);
			const errorText = await response.text().catch(() => 'Unknown error');
			console.error('[Notifications] Error details:', errorText);
			return null;
		}

		const data = await response.json();

		// Handle both array and object responses
		const notifications = Array.isArray(data)
			? data
			: (data.notifications || []);

		console.log('[Notifications] API Data received:', {
			notificationsCount: notifications.length,
		});

		return notifications;
	} catch (error) {
		console.error('[Notifications] Fetch Error:', error);
		return null;
	}
}

export default async function NotificationsRoute() {
	// Check authentication
	const cookieStore = await cookies();
	const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

	if (!authToken || !authToken.value || authToken.value.trim() === '') {
		redirect('/login');
	}

	// Fetch notifications data
	const notifications = await getNotificationsData();

	return <NotificationsPage initialNotifications={notifications} />;
}

