import CategoryPage from '@/features/categories/components/category-details/CategoryPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
	const { category } = await params;
	const categoryName = decodeURIComponent(category);

	return {
		title: `${categoryName} | شلة فود`,
		description: `تصفح المتاجر والأقسام في ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
		keywords: [
			categoryName,
			"قسم",
			"متاجر",
			"أقسام",
			"منتجات",
			"تسوق",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${categoryName} | شلة فود`,
			description: `تصفح المتاجر والأقسام في ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
			type: "website",
			url: `https://shellafood.com/categories/${encodeURIComponent(category)}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-categories.jpg",
					width: 1200,
					height: 630,
					alt: categoryName,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${categoryName} | شلة فود`,
			description: `تصفح المتاجر والأقسام في ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
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
			canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}`,
			languages: {
				"ar-SA": `https://shellafood.com/categories/${encodeURIComponent(category)}`,
				"en-US": `https://shellafood.com/categories/${encodeURIComponent(category)}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function CategoryPageRoute({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;

	return <CategoryPage categorySlug={category} />;
}
