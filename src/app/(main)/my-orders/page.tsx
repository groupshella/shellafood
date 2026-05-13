import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyOrdersPage } from "@/features/orders";
import type { OrdersResponse } from "@/features/orders/types";
import { STORAGE_KEYS } from "@/features/auth/constants/auth.constants";
import { ORDERS_CONSTANTS } from "@/features/orders/constants/orders.constants";
import { getBaseUrl } from "@/features/auth/constants/auth.constants";
import {
	mapRunningOrdersResponse,
	type RunningOrdersApiResponse,
} from "@/features/orders/lib/mapRunningOrdersResponse";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "طلباتي | شلة فود",
	description: "متابعة طلباتك الجارية.",
	metadataBase: new URL("https://shellafood.com"),
};

async function getRunningOrders(
	page: number = 1,
	limit: number = ORDERS_CONSTANTS.DEFAULT_PAGE_SIZE,
): Promise<OrdersResponse | null> {
	try {
		const baseUrl = getBaseUrl();
		const apiUrl = `${baseUrl}/api/orders?limit=${limit}&offset=${page}`;

		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join("; ");

		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
				...(cookieHeader ? { Cookie: cookieHeader } : {}),
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const apiData = (await response.json()) as RunningOrdersApiResponse;
		const { products, totalSize } = mapRunningOrdersResponse(apiData);

		return {
			products,
			services: [],
			delivery: [],
			totalSize,
		};
	} catch {
		return null;
	}
}

export default async function MyOrdersRoute() {
	const cookieStore = await cookies();
	const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

	if (!authToken?.value?.trim()) {
		redirect("/login");
	}

	const ordersData = await getRunningOrders(
		1,
		ORDERS_CONSTANTS.DEFAULT_PAGE_SIZE,
	);

	return <MyOrdersPage initialOrdersData={ordersData} />;
}
