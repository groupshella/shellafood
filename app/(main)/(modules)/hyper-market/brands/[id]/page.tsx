import { Suspense } from "react";
import type { Metadata } from "next";
import { getBrands } from "@/features/hyper-market/Brands/api/brands";
import { BrandPageShell } from "@/features/hyper-market/Brands/components/BrandPageShell";
import { BrandItems } from "@/features/hyper-market/Brands/components/sections/BrandItems";
import { AddToCart } from "@/features/hyper-market/Categories/components/sections/AddToCart";

const MODULE_ID = "3";

interface BrandPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
    const { id } = await params;
    const brands = await getBrands(MODULE_ID).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id);

    return {
        title: brand
            ? `${brand.name} | هايبر ماركت | شلة فود`
            : "براند | هايبر ماركت | شلة فود",
    };
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { id } = await params;
    const brands = await getBrands(MODULE_ID).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id) ?? {
        id: Number(id),
        name: "براند",
        image_full_url: "",
    };

    return (
        <BrandPageShell brand={brand}>
            <Suspense fallback={<BrandItems.skeleton />}>
                <BrandItems brandId={id} />
            </Suspense>

            <AddToCart moduleId={MODULE_ID} />
        </BrandPageShell>
    );
}
