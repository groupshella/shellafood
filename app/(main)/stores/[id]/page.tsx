import StorePage from "@/features/store/components/StorePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "المتجر | شلة فود",
    description:
        "تصفح منتجات المتجر والتصنيفات والعروض المتوفرة واطلب بسهولة عبر شلة فود.",

    keywords: [
        "شلة فود",
        "Shella Food",
        "متجر",
        "متاجر إلكترونية",
        "منتجات",
        "عروض",
        "توصيل",
        "سوبر ماركت",
        "تسوق أونلاين",
    ],

    alternates: {
        canonical: "/store",
    },

    openGraph: {
        type: "website",
        locale: "ar_SA",
        url: "https://shellafood.com/store",
        siteName: "شلة فود",
        title: "المتجر | شلة فود",
        description:
            "تصفح منتجات المتجر والتصنيفات والعروض المتوفرة واطلب بسهولة عبر شلة فود.",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "متجر شلة فود",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "المتجر | شلة فود",
        description:
            "تصفح منتجات المتجر والتصنيفات والعروض المتوفرة واطلب بسهولة عبر شلة فود.",
        images: ["/images/og-image.png"],
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
};

interface StorePageRouteProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_id?: string }>;
}

export default async function StorePageRoute({
    params,
    searchParams,
}: StorePageRouteProps) {
    const { id } = await params;
    const { module_id } = await searchParams;

    return <StorePage storeId={id} moduleId={module_id} />;
}