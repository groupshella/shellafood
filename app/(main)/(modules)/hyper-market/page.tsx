import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { HyperMarketShell } from "@/features/hyper-market/StoreDetails/components/HyperMarketShell";
import { Banners } from "@/features/hyper-market/StoreDetails/components/sections/Banners";
import { Modules } from "@/features/hyper-market/StoreDetails/components/sections/Modules";
import { Offers } from "@/features/hyper-market/StoreDetails/components/sections/Offers";
import { PopularBrands } from "@/features/hyper-market/StoreDetails/components/sections/PopularBrands";
import { StoreDetails } from "@/features/hyper-market/StoreDetails/components/sections/StoreDetails";
import { AddressTopbarBanner } from "@/features/addresses/components/sections/AddressTopbarBanner";
import { getServerLocale } from "@/features/language/getServerLocale";

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
	const locale = await getServerLocale();
	const isArabic = locale === "ar";
	return (
		<HyperMarketShell isAuthenticated={isAuthenticated} isArabic={isArabic}>
			<div className="flex flex-col gap-3">


				<Suspense
					fallback={
						<div className="px-4 sm:px-5">
							<AddressTopbarBanner.skeleton />
						</div>
					}
				>

					<AddressTopbarBanner isAuthenticated={isAuthenticated} className="px-4 sm:px-5" isArabic={isArabic} />

				</Suspense>

				<Suspense fallback={<Modules.skeleton />}>
					<Modules moduleId={MODULE_ID} isArabic={isArabic} />
				</Suspense>
				<Suspense fallback={<Banners.skeleton />}>
					<Banners isArabic={isArabic} />
				</Suspense>
				<Suspense fallback={<StoreDetails.skeleton />}>
					<StoreDetails storeId={STORE_ID} moduleId={MODULE_ID} isArabic={isArabic} />
				</Suspense>

				<Suspense fallback={<PopularBrands.skeleton />}>
					<PopularBrands moduleId={MODULE_ID} isArabic={isArabic} />
				</Suspense>

				<Suspense fallback={<Offers.skeleton />}>
					<Offers moduleId={MODULE_ID} isArabic={isArabic} />
				</Suspense>
			</div>
		</HyperMarketShell>
	);
}
