import { StorePage } from '@/features/categories';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string }> }): Promise<Metadata> {
	const { category, store } = await params;
	const categoryName = decodeURIComponent(category);
	const storeName = decodeURIComponent(store);
	
	return {
		title: `${storeName} - ${categoryName} | شلة فود`,
		description: `تصفح الأقسام والمنتجات في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
		keywords: [
			storeName,
			categoryName,
			"متجر",
			"أقسام",
			"منتجات",
			"تسوق",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${storeName} - ${categoryName} | شلة فود`,
			description: `تصفح الأقسام والمنتجات في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
			type: "website",
			url: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-categories.jpg",
					width: 1200,
					height: 630,
					alt: `${storeName} - ${categoryName}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${storeName} - ${categoryName} | شلة فود`,
			description: `تصفح الأقسام والمنتجات في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
			images: ["/og-categories.jpg"],
			creator: "@shellafood",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
			languages: {
				"ar-SA": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
				"en-US": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function StorePageRoute({ params }: { params: Promise<{ category: string; store: string }> }) {
	const { category, store: storeSlug } = await params;



	return (
		<StorePage 
			categorySlug={category}
			storeSlug={storeSlug}
		/>
	);
}
