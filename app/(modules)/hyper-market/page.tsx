import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { HyperMarketShell } from "@/features/hyper-market/StoreDetails/components/HyperMarketShell";
import { StoreDetails } from "@/features/hyper-market/StoreDetails/components/sections/StoreDetails";

const STORE_ID = "1";
const MODULE_ID = "3";

export const metadata: Metadata = {
	title: "هايبر ماركت | شلة فود",
	description: "تسوق من هايبر ماركت — تصفح المنتجات والتصنيفات والعروض.",
	alternates: { canonical: "/hyper-market" },
};

export default async function HyperMarketPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	const isAuthenticated = !!token;

	return (
		<HyperMarketShell isAuthenticated={isAuthenticated}>
			<Suspense fallback={<StoreDetails.skeleton />}>
				<StoreDetails storeId={STORE_ID} moduleId={MODULE_ID} />
			</Suspense>

		</HyperMarketShell>
	);
}
