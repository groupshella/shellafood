import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/features/profile";
import { STORAGE_KEYS, AUTH_ROUTES } from "@/features/auth/constants/auth.constants";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
	title: "الملف الشخصي | شلة فود",
	description:
		"إدارة ملفك الشخصي في شلة فود. عرض معلوماتك، طلباتك، المفضلة، العناوين المحفوظة، وإعدادات الحساب.",
	keywords: [
		"الملف الشخصي",
		"شلة فود",
		"حساب",
		"طلبات",
		"مفضلة",
		"عناوين",
		"إعدادات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الملف الشخصي | شلة فود",
		description:
			"إدارة ملفك الشخصي في شلة فود. عرض معلوماتك، طلباتك، المفضلة، العناوين المحفوظة، وإعدادات الحساب.",
		type: "website",
		url: "https://shellafood.com/profile",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "الملف الشخصي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الملف الشخصي | شلة فود",
		description:
			"إدارة ملفك الشخصي في شلة فود. عرض معلوماتك، طلباتك، المفضلة، العناوين المحفوظة، وإعدادات الحساب.",
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
		canonical: "https://shellafood.com/profile",
		languages: {
			"ar-SA": "https://shellafood.com/profile",
			"en-US": "https://shellafood.com/profile",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default async function ProfilePageRoute() {
	// Check authentication on server side using the same cookie key as layout
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token");
	// Redirect to login if not authenticated
	console.log("authToken", authToken?.value);
	if ( !authToken?.value.trim()) {
		return <LoginForm />;
	}
	else{
		
		return <ProfileDashboard />;
	}
}
