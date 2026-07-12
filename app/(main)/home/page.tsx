import { Suspense } from "react";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { Banners } from "@/features/home/components/sections/Banners";
import { Modules } from "@/features/home/components/sections/Modules";
import { PromoBanners } from "@/features/home/components/sections/PromoBanner";
import { HomeShell } from "@/features/home/components/HomeShell";
import { AddressTopbarBanner } from "@/features/addresses/components/sections/AddressTopbarBanner";
import { Offers } from "@/features/hyper-market/StoreDetails/components/sections/Offers";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata = {
	title: "الرئيسية | شيلة فود",
	description: "اكتشف أفضل المطاعم والمتاجر في منطقتك",
};

export default async function HomePage() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
	const isAuthenticated = !!token;

	const locale = await getServerLocale()
	const isArabic = locale === "ar";

	return (
		<HomeShell isAuthenticated={isAuthenticated} isArabic={isArabic}>
			<Suspense
				fallback={
					<div className="mx-4">
						<AddressTopbarBanner.skeleton />
					</div>
				}
			>
				<AddressTopbarBanner isAuthenticated={isAuthenticated} isArabic={isArabic} />
			</Suspense>
			<Suspense fallback={<Banners.skeleton />}>
				<Banners isArabic={isArabic} />
			</Suspense>

			<Suspense fallback={<Modules.skeleton />}>
				<Modules isArabic={isArabic} />
			</Suspense>

			{/* <Suspense fallback={<DiscountedStores.skeleton />}>
				<DiscountedStores />
			</Suspense> */}

			{/* <Suspense fallback={<CurrentOffers.skeleton />}>
				<CurrentOffers />
			</Suspense> */}
			<Suspense fallback={<Offers.skeleton />}>
				<Offers moduleId="3" isArabic={isArabic} />
			</Suspense>
			<PromoBanners isArabic={isArabic} />

			{/* <Suspense fallback={<RecentOrders.skeleton />}>
				<RecentOrders />
			</Suspense> */}
		</HomeShell>
	);
}
