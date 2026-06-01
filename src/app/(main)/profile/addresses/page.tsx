import { Metadata } from "next";
import { AddressesPage } from "@/features/profile";
import { cookies } from "next/headers";
import { STORAGE_KEYS } from "@/features/(actors)/auth/constants/auth.constants";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "العناوين المحفوظة | شلة فود",
	description:
		"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود. حفظ وتعديل عناوينك المفضلة لتسهيل عملية التوصيل.",
	keywords: [
		"العناوين المحفوظة",
		"شلة فود",
		"إدارة العناوين",
		"عناوين التوصيل",
		"عناوين الاستلام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "العناوين المحفوظة | شلة فود",
		description:
			"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود. حفظ وتعديل عناوينك المفضلة لتسهيل عملية التوصيل.",
		type: "website",
		url: "https://shellafood.com/profile/addresses",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "العناوين المحفوظة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "العناوين المحفوظة | شلة فود",
		description:
			"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود.",
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
		canonical: "https://shellafood.com/profile/addresses",
		languages: {
			"ar-SA": "https://shellafood.com/profile/addresses",
			"en-US": "https://shellafood.com/profile/addresses",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};
async function getAddressesData(token: string, limit: number, offset: number) {
	try {
		const apiUrl = `https://shellafood.com/api/v1/customer/address/list?limit=${limit}&offset=${offset}`;

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			cache: 'no-store', // Don't cache this data
		});

		if (!response.ok) {
			console.error('[Addresses] API Error:', response.status);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('[Addresses] Fetch Error:', error);
		return null;
	}
}


export default async function AddressesPageRoute() {
	// Check authentication
	const cookieStore = await cookies();
	const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

	if (!authToken || !authToken.value || authToken.value.trim() === '') {
		redirect('/login');
	}

	// Fetch wallet data
	const addressesData = await getAddressesData(authToken.value, 10, 1);
	return <AddressesPage initialAddressesData={addressesData} initialPage={1} initialLimit={10} token={authToken.value} />
}
