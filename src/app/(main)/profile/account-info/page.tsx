import { Metadata } from "next";
import { AccountInfoPage } from "@/features/profile";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "معلومات الحساب | شلة فود",
	description:
		"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود. عرض وتعديل بياناتك الشخصية، إعدادات الأمان، والإشعارات.",
	keywords: [
		"معلومات الحساب",
		"شلة فود",
		"الملف الشخصي",
		"تعديل البيانات",
		"إعدادات الحساب",
		"الأمان",
		"الخصوصية",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "معلومات الحساب | شلة فود",
		description:
			"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود. عرض وتعديل بياناتك الشخصية، إعدادات الأمان، والإشعارات.",
		type: "website",
		url: "https://shellafood.com/profile/account-info",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "معلومات الحساب - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "معلومات الحساب | شلة فود",
		description:
			"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود.",
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
		canonical: "https://shellafood.com/profile/account-info",
		languages: {
			"ar-SA": "https://shellafood.com/profile/account-info",
			"en-US": "https://shellafood.com/profile/account-info",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};
async function getAccountInfoData(token: string, guestId: string) {
	try {
		const apiUrl = `https://shellafood.com/api/v1/customer/info`;
		const cacheTag = `account-info-${guestId}`;
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-localization': 'ar',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			console.error('[Account Info] API Error:', response.status);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('[Account Info] Fetch Error:', error);
		return null;
	}
}


export default async function AccountInfoPageRoute() {
	  // Check authentication on server side using the same cookie key as layout
	  const cookieStore = await cookies();
	  const authToken = cookieStore.get("auth_token");
	  const guestId = cookieStore.get("guest_id");
	  console.log("authToken", authToken?.value);
	  console.log("guestId", guestId?.value);
	const accountInfoData = await getAccountInfoData(authToken?.value || '', guestId?.value || '');
	console.log("accountInfoData", accountInfoData);

	// Map the API response to the component's expected format
	const personalInfo = accountInfoData ? {
		id: accountInfoData.id || 0,
		f_name: accountInfoData.f_name || '',
		l_name: accountInfoData.l_name || '',
		fullName: `${accountInfoData.f_name || ''} ${accountInfoData.l_name || ''}`.trim() || '',
		email: accountInfoData.email || '',
		phone: accountInfoData.phone || '',
		image: accountInfoData.image || '',
		wallet_balance: accountInfoData.wallet_balance || 0,
		loyalty_point: accountInfoData.loyalty_point || 0,
		order_count: accountInfoData.order_count || 0,
	} : {
		id: 0,
		f_name: '',
		l_name: '',
		fullName: '',
		email: '',
		phone: '',
		image: '',
		wallet_balance: 0,
		loyalty_point: 0,
		order_count: 0,
	};

	return <AccountInfoPage personalInfo={personalInfo} />
}
