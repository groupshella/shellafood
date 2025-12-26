import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyOrdersPage } from "@/features/orders";
import type { OrdersResponse, ProductOrder, PaymentStatus, ProductOrderStatus } from "@/features/orders/types";
import { STORAGE_KEYS, DEFAULT_LANG, BASE_URL } from "@/features/auth/constants/auth.constants";
import { ORDERS_CONSTANTS } from "@/features/orders/constants/orders.constants";

export const dynamic = "force-dynamic";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "طلباتي | شلة فود - إدارة الطلبات والتتبع",
	description:
		"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك. متابعة شاملة لجميع طلباتك مع تحديثات فورية لحالة الطلب.",
	keywords: [
		"طلباتي",
		"شلة فود",
		"تتبع الطلب",
		"تاريخ الطلبات",
		"طلبات الخدمة",
		"إدارة الطلبات",
		"طلبات المنتجات",
		"متابعة الطلبات",
		"تقييم الطلبات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "طلباتي | شلة فود",
		description:
			"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك.",
		type: "website",
		url: "https://shellafood.com/my-orders",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-my-orders.jpg",
				width: 1200,
				height: 630,
				alt: "طلباتي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "طلباتي | شلة فود",
		description:
			"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك.",
		images: ["/og-my-orders.jpg"],
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
		canonical: "https://shellafood.com/my-orders",
		languages: {
			"ar-SA": "https://shellafood.com/my-orders",
			"en-US": "https://shellafood.com/my-orders",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

interface ApiOrderResponse {
	total_size: number;
	limit: string;
	offset: string;
	orders: Array<{
		id: number;
		order_amount: number;
		order_status: string;
		order_type: string;
		payment_status: string;
		payment_method: string;
		created_at: string;
		item_count: number;
		delivery_address: {
			address: string;
			longitude: string;
			latitude: string;
			contact_person_name: string;
			contact_person_number: string;
		};
		store: {
			id: number;
			name: string;
			logo: string;
			latitude: string;
			longitude: string;
		};
	}>;
}

// Map API order status to ProductOrderStatus
function mapOrderStatus(apiStatus: string): ProductOrderStatus {
	const statusMap: Record<string, ProductOrderStatus> = {
		'pending': 'pending',
		'accepted': 'preparing',
		'confirmed': 'preparing',
		'processing': 'preparing',
		'handover': 'ready',
		'picked_up': 'delivering',
		'delivered': 'completed',
		'canceled': 'cancelled',
		'cancelled': 'cancelled',
		'refund_requested': 'cancelled',
		'refunded': 'cancelled',
		'failed': 'cancelled',
	};
	return statusMap[apiStatus.toLowerCase()] || 'pending';
}

// Map API payment status to PaymentStatus
function mapPaymentStatus(apiStatus: string): PaymentStatus {
	const statusMap: Record<string, PaymentStatus> = {
		'paid': 'paid',
		'unpaid': 'pending',
		'pending': 'pending',
		'failed': 'failed',
	};
	return statusMap[apiStatus.toLowerCase()] || 'pending';
}

async function getOrdersData(
	token: string,
	page: number = 1,
	limit: number = ORDERS_CONSTANTS.DEFAULT_PAGE_SIZE
): Promise<OrdersResponse | null> {
	try {
		const apiUrl = `${BASE_URL}/api/v1/customer/order/list?limit=${limit}&offset=${page}`;
		
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': DEFAULT_LANG,
				'Authorization': `Bearer ${token}`,
			},
			cache: 'no-store', // Don't cache this data
		});

		if (!response.ok) {
			console.error('[Orders] API Error:', response.status);
			return null;
		}

		const apiData = await response.json() as ApiOrderResponse;
		
		// Map API response to ProductOrder[]
		const products: ProductOrder[] = apiData.orders.map(order => ({
			id: order.id.toString(),
			orderNumber: `ORD-${order.id}`,
			storeName: order.store.name,
			storeNameAr: order.store.name, // API doesn't provide Arabic name, using same
			storeLogo: order.store.logo,
			status: mapOrderStatus(order.order_status),
			createdAt: order.created_at,
			items: [], // API doesn't provide items in list, will be empty
			totalAmount: order.order_amount,
			paymentMethod: order.payment_method,
			paymentStatus: mapPaymentStatus(order.payment_status),
			address: order.delivery_address?.address,
		}));

		return {
			products,
			services: [], // Keep empty for now, will use mock data
			delivery: [], // Keep empty for now, will use mock data
		};
	} catch (error) {
		console.error('[Orders] Fetch Error:', error);
		return null;
	}
}

export default async function MyOrdersRoute() {
	// Check authentication
	const cookieStore = await cookies();
	const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

	if (!authToken || !authToken.value || authToken.value.trim() === '') {
		redirect('/login');
	}

	// Fetch orders data
	const ordersData = await getOrdersData(authToken.value, 1, ORDERS_CONSTANTS.DEFAULT_PAGE_SIZE);
	
	return <MyOrdersPage initialOrdersData={ordersData} />;
}


