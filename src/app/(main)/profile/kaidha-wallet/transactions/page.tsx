import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STORAGE_KEYS, AUTH_ROUTES, BASE_URL } from "@/features/(actors)/auth/constants/auth.constants";
import Transactions from "@/features/profile/components/KaidhaWallet/Transactions";

export const metadata: Metadata = {
	title: "سجل المعاملات | محفظة قيدها | شلة فود",
	description: "عرض سجل المعاملات المالية لمحفظة قيدها. تتبع جميع عمليات الخصم والإضافة والمدفوعات والمرتجعات.",
	keywords: [
		"قيدها",
		"شلة فود",
		"محفظة قيدها",
		"معاملات",
		"سجل المعاملات",
		"مدفوعات",
		"مرتجعات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "سجل المعاملات | محفظة قيدها | شلة فود",
		description: "عرض سجل المعاملات المالية لمحفظة قيدها",
		type: "website",
		url: "https://shellafood.com/profile/kaidha-wallet/transactions",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "سجل المعاملات - محفظة قيدها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "سجل المعاملات | محفظة قيدها | شلة فود",
		description: "عرض سجل المعاملات المالية لمحفظة قيدها",
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
		canonical: "https://shellafood.com/profile/kaidha-wallet/transactions",
		languages: {
			"ar-SA": "https://shellafood.com/profile/kaidha-wallet/transactions",
			"en-US": "https://shellafood.com/profile/kaidha-wallet/transactions",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

async function getTransactionsData(token: string, limit: number, offset: number, type: string) {
	try {
		const apiUrl = `https://shellafood.com/api/qidha-wallet/transactions?limit=${limit}&offset=${offset}&type=${type}`;

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			cache: 'no-store', // Don't cache this data
		});

		console.log('response', response);


		const data = await response.json();
		console.log('data', data);
		return data;
	} catch (error) {
		console.log('[Transactions] Fetch Error:', error);
		return null;
	}
}

interface PageProps {
	searchParams: Promise<{
		page?: string;
		type?: string;
	}>;
}

export default async function TransactionsPageRoute({ searchParams }: PageProps) {
	// Check authentication
	const cookieStore = await cookies();
	const authToken = cookieStore.get(STORAGE_KEYS.TOKEN);

	if (!authToken || !authToken.value || authToken.value.trim() === '') {
		redirect(AUTH_ROUTES.LOGIN);
	}

	// Get search params
	const search = await searchParams;
	const limit = 10;
	const offset = Math.max(1, Number(search.page) || 1);
	const type = search.type || 'all';

	// Fetch transactions data
	const transactionsData = await getTransactionsData(authToken.value, limit, offset, type);
	console.log('transactionsData', transactionsData);
	return <Transactions initialTransactionsData={transactionsData} initialPage={offset} initialLimit={limit} initialType={type} />;
}

