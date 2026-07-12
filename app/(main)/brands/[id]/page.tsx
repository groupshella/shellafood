import { Suspense } from "react";
import type { Metadata } from "next";
import { getBrands } from "@/features/brands/api/brands";
import { BrandPageShell } from "@/features/brands/components/BrandPageShell";
import { BrandItems } from "@/features/brands/components/sections/BrandItems";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { getServerLocale } from "@/features/language/getServerLocale";

const MODULE_ID = "3";

interface BrandPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
    const { id } = await params;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    const brands = await getBrands({ moduleId: MODULE_ID, isArabic: isArabic }).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id);

    return {
        title: brand
            ? `${brand.name} | شلة فود`
            : "Brand | شلة فود",
    };
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { id } = await params;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    const brands = await getBrands({ moduleId: MODULE_ID, isArabic: isArabic }).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id) ?? {
        id: Number(id),
        name: "براند",
        image_full_url: "",
    };

    return (
        <BrandPageShell brand={brand} isArabic={isArabic}>
            <Suspense fallback={<BrandItems.skeleton />}>
                <BrandItems brandId={id} isArabic={isArabic} />
            </Suspense>

            <AddToCart moduleId={MODULE_ID} isArabic={isArabic} />
        </BrandPageShell>
    );
}
