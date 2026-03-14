import type { Metadata } from "next";
import { TrackOrderPage } from "@/features/order-tracking";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/features/auth/constants/auth.constants";
import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { notFound } from "next/navigation";
import { transformOrderDetailsToOrderData } from "@/features/order-tracking/lib/utils/transformOrderDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
	const { orderId } = await params;
	
	return {
		title: `تتبع الطلب ${orderId} | شلة فود`,
		description: `تتبع طلبك ${orderId} في الوقت الفعلي. عرض حالة التوصيل، الخط الزمني، والخريطة المباشرة.`,
		keywords: [
			"تتبع الطلب",
			"تتبع الطلبات",
			"حالة التوصيل",
			"تتبع الشحنة",
			"شلة فود",
			`الطلب ${orderId}`,
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تتبع الطلب ${orderId} | شلة فود`,
			description: `تتبع طلبك ${orderId} في الوقت الفعلي. عرض حالة التوصيل والخط الزمني.`,
			type: "website",
			url: `https://shellafood.com/my-orders/${orderId}/track`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `تتبع الطلب ${orderId} | شلة فود`,
			description: `تتبع طلبك ${orderId} في الوقت الفعلي.`,
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
			canonical: `https://shellafood.com/my-orders/${orderId}/track`,
			languages: {
				"ar-SA": `https://shellafood.com/my-orders/${orderId}/track`,
				"en-US": `https://shellafood.com/my-orders/${orderId}/track`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

interface TrackOrderPageRouteProps {
	params: Promise<{ orderId: string }>;
}

export default async function TrackOrderPageRoute({ params }: TrackOrderPageRouteProps) {
	const { orderId } = await params;
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token")?.value || '';

	// Validate orderId
	if (!orderId || isNaN(Number(orderId))) {
		notFound();
	}

	// ✅ Use API route as proxy
	try {
		const baseUrl = getBaseUrl();
		const url = `${baseUrl}/api/order-details?order_id=${orderId}&locale=${DEFAULT_LANG}`;
		
		// Format cookies as header string
		const cookieHeader = cookieStore.getAll()
			.map(cookie => `${cookie.name}=${cookie.value}`)
			.join('; ');
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				...(cookieHeader && { 'Cookie': cookieHeader }),
			},
			cache: 'no-store',
		});
		
		if (!response.ok) {
			console.error('[Track Order Page] API route error:', response.status);
			notFound();
		}
		
		const orderDetails = await response.json();
		
		// Validate response structure
		if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
			console.error('[Track Order Page] Invalid or empty order details:', orderDetails);
			notFound();
		}

		// Transform API response to OrderData format
		try {
			const orderData = transformOrderDetailsToOrderData(orderDetails, orderId, DEFAULT_LANG);
			
			return (
				<TrackOrderPage 
					orderId={orderId}
					initialData={orderData}
				/>
			);
		} catch (error: any) {
			console.error('[Track Order Page] Error transforming order data:', {
				message: error?.message || 'Unknown error',
				name: error?.name,
			});
			notFound();
		}
	} catch (error: any) {
		console.error('[Track Order Page] Error fetching order details:', {
			message: error?.message || 'Unknown error',
			name: error?.name,
		});
		
		notFound();
	}
}

