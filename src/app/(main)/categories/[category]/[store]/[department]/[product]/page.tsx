import { ProductView } from '@/features/categories';
import { Metadata } from 'next';


export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string; department: string; product: string }> }): Promise<Metadata> {
	const { category, store, department, product } = await params;
	const categoryName = decodeURIComponent(category);
	const storeName = decodeURIComponent(store);
	const departmentName = decodeURIComponent(department).replace(/-/g, ' ');
	const productName = decodeURIComponent(product).replace(/-/g, ' ');

	return {
		title: `${productName} - ${storeName} | شلة فود`,
		description: `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}. أضف إلى السلة واكمل الطلب في شلة فود.`,
		keywords: [
			productName,
			departmentName,
			storeName,
			categoryName,
			"تفاصيل المنتج",
			"تسوق",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${productName} - ${storeName} | شلة فود`,
			description: `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}. أضف إلى السلة واكمل الطلب في شلة فود.`,
			type: "website",
			url: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}/${encodeURIComponent(product)}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-categories.jpg",
					width: 1200,
					height: 630,
					alt: `${productName} - ${storeName}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${productName} - ${storeName} | شلة فود`,
			description: `عرض تفاصيل ${productName} من ${departmentName} في ${storeName} ضمن ${categoryName}. أضف إلى السلة واكمل الطلب في شلة فود.`,
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
			canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}/${encodeURIComponent(product)}`,
			languages: {
				"ar-SA": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}/${encodeURIComponent(product)}`,
				"en-US": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/${encodeURIComponent(department)}/${encodeURIComponent(product)}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ProductPageRoute({ params }: { params: Promise<{ category: string; store: string; department: string; product: string }> }) {
	const { category, store: storeSlug, department: departmentSlug, product: productSlug } = await params;

	

	// Find store by slug or by product's storeId


	return (
		<ProductView
			categorySlug={category}
			storeSlug={storeSlug}
			departmentSlug={departmentSlug}
			productSlug={productSlug}
		/>
	);
}
