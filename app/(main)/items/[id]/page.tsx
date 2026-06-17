import ItemPage from "@/features/item/components/ItemPage";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_id: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;

    return {
        title: "تفاصيل المنتج | شلة فود",
        description:
            "تعرّف على تفاصيل المنتج، الأسعار، العروض، والمزيد من المنتجات المشابهة عبر شلة فود.",

        keywords: [
            "شلة فود",
            "Shella Food",
            "منتجات",
            "تسوق أونلاين",
            "توصيل",
            "سوبر ماركت",
            "عروض",
            "خصومات",
            "تفاصيل المنتج",
        ],

        alternates: {
            canonical: `/item/${id}`,
        },

        openGraph: {
            type: "website",
            locale: "ar_SA",
            title: "تفاصيل المنتج | شلة فود",
            description:
                "استعرض تفاصيل المنتج، الأسعار، والعروض والمنتجات المشابهة عبر شلة فود.",
            url: `https://shellafood.com/item/${id}`,
            siteName: "شلة فود",
            images: [
                {
                    url: "/images/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Shella Food Product",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: "تفاصيل المنتج | شلة فود",
            description:
                "استعرض تفاصيل المنتج والأسعار والعروض والمنتجات المشابهة عبر شلة فود.",
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
}

export default async function Page({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const { module_id } = await searchParams;

    return <ItemPage itemId={id} moduleId={module_id} />;
}