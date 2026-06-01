import { Metadata } from "next";
import { FavoritesPage } from "@/features/profile";
import { cookies } from "next/headers";
import { BASE_URL } from "@/features/(actors)/auth/constants/auth.constants";

export const metadata: Metadata = {
	title: "المفضلة | شلة فود",
	description:
		"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود. احفظ منتجاتك ومتاجرك المفضلة للوصول السريع إليها.",
	keywords: [
		"المفضلة",
		"شلة فود",
		"منتجات مفضلة",
		"متاجر مفضلة",
		"مطاعم مفضلة",
		"قائمة المفضلة",
		"حفظ المنتجات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المفضلة | شلة فود",
		description:
			"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود.",
		type: "website",
		url: "https://shellafood.com/profile/favorites",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "المفضلة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المفضلة | شلة فود",
		description:
			"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود.",
		images: ["/og-profile.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: false,
		follow: true,
		googleBot: {
			index: false,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/profile/favorites",
		languages: {
			"ar-SA": "https://shellafood.com/profile/favorites",
			"en-US": "https://shellafood.com/profile/favorites",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

async function getWishListData(token: string) {
	try {
		const apiUrl = `${BASE_URL}/api/v1/customer/wish-list`;
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-localization': 'ar',
				'X-Response-Mode': 'minimal',
				"Host": "shellafood.com",
				'zoneId': '[2]',
			},
			cache: 'no-store',
		});



		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error('[Wish List] Fetch Error:', error);
		return null;
	}
}

export default async function FavoritesPageRoute() {
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token");

	if (!authToken?.value) {
		return <FavoritesPage initialProducts={[]} initialStores={[]} />;
	}

	const wishListData = await getWishListData(authToken.value);

	// Map API response to FavoriteProduct and FavoriteStore format
	const items = wishListData?.item || wishListData?.data?.item || [];
	const stores = wishListData?.store || wishListData?.data?.store || [];

	const mappedProducts = items.map((item: any) => ({
		id: item.id?.toString() || '',
		name: item.name || '',
		nameAr: item.name || '',
		image: item.image_full_url || item.image || '',
		price: item.discounted_price || item.price || 0,
		originalPrice: item.original_price || item.price || 0,
		unit: item.unit?.unit || item.unit_type || '',
		unitAr: item.unit?.unit || item.unit_type || '',
		storeId: item.store_id?.toString() || '',
		storeName: item.store_name || '',
		storeNameAr: item.store_name || '',
		addedAt: item.created_at || new Date().toISOString(),
	}));

	const mappedStores = stores.map((store: any) => ({
		id: store.id?.toString() || '',
		name: store.name || '',
		nameAr: store.name || '',
		image: store.image_full_url || store.image || '',
		logo: store.logo_full_url || store.logo || '',
		type: store.module_type || '',
		typeAr: store.module?.module_name || '',
		rating: store.avg_rating?.toString() || '0',
		addedAt: store.created_at || new Date().toISOString(),
	}));

	return <FavoritesPage initialProducts={mappedProducts} initialStores={mappedStores} />;
}