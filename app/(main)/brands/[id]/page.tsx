import { Suspense } from "react";
import type { Metadata } from "next";
import { getBrands } from "@/features/brands/api/brands";
import { BrandPageShell } from "@/features/brands/components/BrandPageShell";
import { BrandItems } from "@/features/brands/components/sections/BrandItems";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";

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
            ? `${brand.name} | شلة فود`
            : "براند | شلة فود",
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
