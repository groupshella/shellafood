import { Suspense } from "react";
import type { Metadata } from "next";
import { ItemShell } from "@/features/item/components/ItemShell";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { ItemInfo } from "@/features/item/components/sections/ItemInfo";
import { RelatedItems } from "@/features/item/components/sections/RelatedItems";
import { isArabicLocale } from "@/shared/lib/locale";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_id?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const isArabic = await isArabicLocale();

    return {
        title: isArabic ? "تفاصيل المنتج | شلة فود" : "Product details | Shella Food",
        description: isArabic
            ? "تعرّف على تفاصيل المنتج، الأسعار، العروض، والمزيد من المنتجات المشابهة عبر شلة فود."
            : "View product details, prices, offers, and similar items on Shella Food.",
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
            "products",
            "online shopping",
            "delivery",
        ],
        alternates: {
            canonical: `/items/${id}`,
        },
        openGraph: {
            type: "website",
            locale: isArabic ? "ar_SA" : "en_US",
            title: isArabic
                ? "تفاصيل المنتج | شلة فود"
                : "Product details | Shella Food",
            description: isArabic
                ? "استعرض تفاصيل المنتج، الأسعار، والعروض والمنتجات المشابهة عبر شلة فود."
                : "Browse product details, prices, offers, and related items on Shella Food.",
            url: `https://shellafood.com/items/${id}`,
            siteName: isArabic ? "شلة فود" : "Shella Food",
            images: [
                {
                    url: "/images/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: isArabic ? "شلة فود — منتج" : "Shella Food Product",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isArabic
                ? "تفاصيل المنتج | شلة فود"
                : "Product details | Shella Food",
            description: isArabic
                ? "استعرض تفاصيل المنتج والأسعار والعروض والمنتجات المشابهة عبر شلة فود."
                : "Browse product details, prices, offers, and related items on Shella Food.",
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

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const isArabic = await isArabicLocale();

    return (
        <ItemShell isArabic={isArabic}>
            <Suspense fallback={<ItemInfo.skeleton />}>
                <ItemInfo itemId={id} isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<RelatedItems.skeleton />}>
                <RelatedItems itemId={id} isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<AddToCart.skeleton />}>
                <AddToCart moduleId="3" />
            </Suspense>
        </ItemShell>
    );
}
