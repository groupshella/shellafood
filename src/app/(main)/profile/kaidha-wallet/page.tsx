import { Metadata } from "next";
import { KaidhaWallet } from "@/features/profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STORAGE_KEYS, AUTH_ROUTES, BASE_URL } from "@/features/auth/constants/auth.constants";

export const metadata: Metadata = {
	title: "محفظة قيدها | شلة فود",
	description:
		"إدارة محفظة قيدها المالية في شلة فود. عرض الرصيد، سجل المعاملات، وإدارة تمويل قيدها.",
	keywords: [
		"قيدها",
		"شلة فود",
		"محفظة قيدها",
		"تمويل",
		"رصيد",
		"معاملات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "محفظة قيدها | شلة فود",
		description:
			"إدارة محفظة قيدها المالية في شلة فود. عرض الرصيد، سجل المعاملات، وإدارة تمويل قيدها.",
		type: "website",
		url: "https://shellafood.com/profile/kaidha-wallet",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "محفظة قيدها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "محفظة قيدها | شلة فود",
		description: "إدارة محفظة قيدها المالية في شلة فود.",
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
		canonical: "https://shellafood.com/profile/kaidha-wallet",
		languages: {
			"ar-SA": "https://shellafood.com/profile/kaidha-wallet",
			"en-US": "https://shellafood.com/profile/kaidha-wallet",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

async function getWalletData(token: string) {
	try {
		const apiUrl = `${BASE_URL}/api/qidha-wallet/get-wallet`;
		const hostHeader = new URL(BASE_URL).hostname;
		
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Host': hostHeader,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			return null;
		}

		const result = await response.json();
		
		if (result.success && result.data) {
			return result;
		}
		
		return null;
	} catch (error) {
		console.error('[Kaidha Wallet] Fetch Error:', error);
		return null;
	}
}

export default async function KaidhaWalletPageRoute() {
	// Check authentication
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token");

	if (!authToken || !authToken.value || authToken.value.trim() === '') {
		redirect(AUTH_ROUTES.LOGIN);
	}

	// Fetch wallet data
	const walletData = await getWalletData(authToken.value);
	return <KaidhaWallet walletData={walletData} />;
}
