import { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

import { getAllStores } from '@/features/(modules)/stores/api/stores.api';

import StoresPage from '@/features/(modules)/stores/components/StoresPage';

import { MODULES_CONFIG } from '@/features/(modules)/modules/constants/modules.constants';

export async function generateMetadata(): Promise<Metadata> {

  const moduleName = "المتاجر";


  return {

    title: `${moduleName} | شلة فود`,

    description: `تصفح المتاجر والأقسام في ${moduleName}. اكتشف أفضل المنتجات والعروض في شلة فود.`,

    keywords: [moduleName, "قسم", "متاجر", "أقسام", "منتجات", "تسوق", "شلة فود"],

    openGraph: {

      title: `${moduleName} | شلة فود`,

      description: `تصفح المتاجر والأقسام في ${moduleName}.`,

      type: "website",

      url: `https://shellafood.com/stores`,

      siteName: "شلة فود",

      locale: "ar_SA",

      images: [{ url: "/og-categories.jpg", width: 1200, height: 630, alt: moduleName }],

    },

    alternates: {

      canonical: `https://shellafood.com/stores`,

    },

  };

}
interface PageProps {

  searchParams: Promise<{

    page?: string;

    module_id?: string;

    moduleName?: string;

  }>;

}
export default async function StoresPageRoute({ searchParams }: PageProps) {

  const search = await searchParams;

  const moduleId = Number(search.module_id);

  if (!moduleId || Number.isNaN(moduleId)) {

    notFound();

  }

  const limit = 12;

  const page = Math.max(1, Number(search.page) || 1);

  const language = DEFAULT_LANG;

  const zoneId = 2;

  const longitude = String(MODULES_CONFIG.DEFAULT_LNG);

  const latitude = String(MODULES_CONFIG.DEFAULT_LAT);

  const moduleName = search.moduleName ?? "";



  const stores = await getAllStores(limit, page, language, moduleId, zoneId, longitude, latitude);



  return (

    <StoresPage

      stores={stores}

      moduleName={moduleName}

      language={language}

      moduleId={moduleId}

      initialPage={page}

      initialLimit={limit}

      zoneId={zoneId}

      longitude={longitude}

      latitude={latitude}

    />

  );

}

