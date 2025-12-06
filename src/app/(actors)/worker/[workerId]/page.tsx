import { Metadata } from "next";

import { WorkerDetails } from "@/features/worker";



interface WorkerDetailsPageProps {
	params: Promise<{
		workerId: string;
	}>;
}

/**
 * Generate metadata for worker details page
 */
export async function generateMetadata({ params }: WorkerDetailsPageProps): Promise<Metadata> {
	const { workerId } = await params;

	return {
		title: `تفاصيل الفني | شلة فود`,
		description: `عرض تفاصيل الفني من شلة فود. تعرف على مهارات الفني وتقييماته واختره لخدماتك.`,
		keywords: [
			"تفاصيل الفني",
			"اخدمني",
			"شلة فود",
			"خدمات",
			"فني موثوق",
			"تقييم الفني",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تفاصيل الفني | اخدمني - شلة فود`,
			description: `عرض تفاصيل الفني من شلة فود. تعرف على مهارات الفني وتقييماته واختره لخدماتك.`,
			type: "website",
			url: `https://shellafood.com/worker/${workerId}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-worker.jpg",
					width: 1200,
					height: 630,
					alt: `تفاصيل الفني - شلة فود`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `تفاصيل الفني | اخدمني - شلة فود`,
			description: `عرض تفاصيل الفني من شلة فود. تعرف على مهارات الفني وتقييماته.`,
			images: ["/og-worker.jpg"],
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
			canonical: `https://shellafood.com/worker/${workerId}`,
			languages: {
				"ar-SA": `https://shellafood.com/worker/${workerId}`,
				"en-US": `https://shellafood.com/worker/${workerId}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Worker Details Page
 * Dynamic page that displays detailed information about a specific worker
 * Path: /worker/[workerId]
 * Optimized with dynamic imports for better performance
 */
export default async function WorkerDetailsPage({ params }: WorkerDetailsPageProps) {
	const { workerId } = await params;

	return (
		<WorkerDetails workerId={workerId} />
	);
}

