import { DepartmentView } from '@/features/categories';
import { Metadata } from 'next';


export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string; department: string }> }): Promise<Metadata> {
	const { category, store, department } = await params;
	const categoryName = decodeURIComponent(category);
	const storeName = decodeURIComponent(store);
	const departmentName = decodeURIComponent(department).replace(/-/g, ' ');

	return {
		title: `${departmentName} - ${storeName} | شلة فود`,
		description: `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
		keywords: [
			departmentName,
			storeName,
			categoryName,
			"منتجات",
			"تسوق",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${departmentName} - ${storeName} | شلة فود`,
			description: `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
			type: "website",
			url: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-categories.jpg",
					width: 1200,
					height: 630,
					alt: `${departmentName} - ${storeName}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${departmentName} - ${storeName} | شلة فود`,
			description: `تصفح المنتجات في قسم ${departmentName} في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
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
			canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}`,
			languages: {
				"ar-SA": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}`,
				"en-US": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function DepartmentPageRoute({ params }: { params: Promise<{ category: string; store: string; department: string }> }) {
	const { category, store: storeSlug, department: departmentSlug } = await params;


	

	return <DepartmentView categorySlug={category} storeSlug={storeSlug} departmentSlug={departmentSlug} />;
}
