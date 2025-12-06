import { Metadata } from "next";
import { ChatInterface } from "@/features/worker";



interface ChatPageProps {
	params: Promise<{
		workerId: string;
	}>;
}

/**
 * Generate metadata for chat page
 */
export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
	const { workerId } = await params;

	return {
		title: `محادثة مع الفني | شلة فود`,
		description: `تواصل مع الفني مباشرة عبر محادثة فورية. رتب تفاصيل الخدمة وتابع حالة طلبك.`,
		keywords: [
			"محادثة",
			"اخدمني",
			"شلة فود",
			"خدمات",
			"تواصل",
			"رسائل",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `محادثة مع الفني | اخدمني - شلة فود`,
			description: `تواصل مع الفني مباشرة عبر محادثة فورية. رتب تفاصيل الخدمة وتابع حالة طلبك.`,
			type: "website",
			url: `https://shellafood.com/worker/${workerId}/chat`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `محادثة مع الفني | اخدمني - شلة فود`,
			description: `تواصل مع الفني مباشرة عبر محادثة فورية.`,
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
			canonical: `https://shellafood.com/worker/${workerId}/chat`,
			languages: {
				"ar-SA": `https://shellafood.com/worker/${workerId}/chat`,
				"en-US": `https://shellafood.com/worker/${workerId}/chat`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Chat Page
 * Dynamic page for chatting with a specific worker
 * Path: /worker/[workerId]/chat
 * Optimized with dynamic imports for better performance
 */
export default async function ChatPageRoute({ params }: ChatPageProps) {
	const { workerId } = await params;

	// For the new route, we don't require service data - components can work without it
	// In a real app, you would fetch worker data and determine service from that
	return (
		<ChatInterface workerId={workerId} />
	);
}

