import { Metadata } from 'next';
import { DepartmentsPage } from '@/features/categories';
import { getCachedDepartments } from '@/features/categories/api/departments.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string; store: string }> }): Promise<Metadata> {
	const { category, store } = await params;
	const categoryName = decodeURIComponent(category);
	const storeName = decodeURIComponent(store);

	return {
		title: `الأقسام - ${storeName} | شلة فود`,
		description: `تصفح جميع الأقسام في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
		keywords: [
			"الأقسام",
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
			title: `الأقسام - ${storeName} | شلة فود`,
			description: `تصفح جميع الأقسام في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
			type: "website",
			url: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/departments`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-categories.jpg",
					width: 1200,
					height: 630,
					alt: `الأقسام - ${storeName}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `الأقسام - ${storeName} | شلة فود`,
			description: `تصفح جميع الأقسام في ${storeName} ضمن ${categoryName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,
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
			canonical: `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/departments`,
			languages: {
				"ar-SA": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/departments`,
				"en-US": `https://shellafood.com/categories/${encodeURIComponent(category)}/${encodeURIComponent(store)}/departments`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}
interface PageProps {
	params: Promise<{
	  category: string;
	  store: string;
	}>;
	searchParams: Promise<{
	  page?: string;
	}>;
  }
export default async function AllDepartmentsPageRoute(
		{ params, searchParams }: PageProps
	  ) {
		const { category, store } = await params;
		const search = await searchParams;
	  
		const storeId = Number(store);
		const moduleId = Number(category);
	  const zoneId = 2; // TODO: replace  with real zone resolver
		// ✅ Validate IDs
		if (
		  isNaN(storeId) || storeId <= 0 ||
		  isNaN(moduleId) || moduleId <= 0
		) {
		   notFound();   
		}
	  
		const limit = 20;
		const offset = Math.max(2, Number(search.page) || 2);
		const locale = DEFAULT_LANG;
	  
		// ✅ Fetch departments (cached)
		const departmentsResponse = await getCachedDepartments(
		  storeId,
		  limit,
		  offset,
		  locale,
		  moduleId,
		  zoneId,
	
		);
	  
		if (!departmentsResponse?.data) {
		  notFound();
		}
	  
console.log(departmentsResponse.data);
	return (
		<DepartmentsPage 
			initialDepartments={departmentsResponse.data}
			initialLimit={limit}
			initialPage={offset}
			storeId={storeId}
			zoneId={zoneId}
			moduleId={moduleId}
    />
	);
}

