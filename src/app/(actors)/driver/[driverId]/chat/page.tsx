import { Metadata } from "next";
import { DriverChatPage } from "@/features/driver";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ driverId: string }>;
}): Promise<Metadata> {
	const { driverId } = await params;

	return {
		title: `محادثة مع السائق | شلة فود`,
		description: `تواصل مع السائق مباشرة عبر محادثة فورية. رتب تفاصيل التوصيل وتابع حالة طلبك.`,
		keywords: [
			"محادثة",
			"سائق",
			"تواصل",
			"شلة فود",
			"توصيل",
			"رسائل",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `محادثة مع السائق | شلة فود`,
			description: `تواصل مع السائق مباشرة عبر محادثة فورية. رتب تفاصيل التوصيل وتابع حالة طلبك.`,
			type: "website",
			url: `https://shellafood.com/driver/${driverId}/chat`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `محادثة مع السائق | شلة فود`,
			description: `تواصل مع السائق مباشرة عبر محادثة فورية.`,
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
			canonical: `https://shellafood.com/driver/${driverId}/chat`,
			languages: {
				"ar-SA": `https://shellafood.com/driver/${driverId}/chat`,
				"en-US": `https://shellafood.com/driver/${driverId}/chat`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ChatPageRoute({
	params,
}: {
	params: Promise<{ driverId: string }>;
}) {
	const { driverId } = await params;

	return <DriverChatPage driverId={driverId} />;
}

