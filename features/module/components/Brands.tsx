"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useBrands } from "@/features/module/hooks/useBrands";
import { Brand } from "@/features/module/types/brands.types";

function brandDisplayName(brand: Brand): string {
    return brand.name_ar?.trim() || brand.name?.trim() || brand.name_en?.trim() || "";
}

function chunkByTwo(items: Brand[]): Brand[][] {
    const columns: Brand[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }
    return columns;
}

function BrandCard({ brand, moduleId }: { brand: Brand; moduleId: string }) {
    const [logoError, setLogoError] = useState(false);
    const name = brandDisplayName(brand);

    return (
        <Link
            href={`/modules/${moduleId}?brand=${brand.slug}`}
            className={[
                "group flex items-center gap-3 rounded-2xl bg-white p-3 outline-none",
                "ring-1 ring-black/[0.06] transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-black/[0.04]">
                {!logoError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="line-clamp-1 text-sm font-bold text-gray-900 sm:text-[15px]">
                    {name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {brand.products_count > 0 && (
                        <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                            <Package className="h-3.5 w-3.5 shrink-0" />
                            {brand.products_count} منتج
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

function BrandsSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex w-[calc(50%-0.375rem)] shrink-0 flex-col gap-3">
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface BrandsProps {
    moduleId: string;
    moduleName: string;
}

export default function Brands({ moduleId }: BrandsProps) {
    const { brands, isLoading, error } = useBrands(moduleId);

    if (isLoading) return <BrandsSkeleton />;
    if (error || brands.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.13 }}
            aria-label="أشهر العلامات التجارية"
            className="mx-auto w-full max-w-5xl space-y-3 px-4"
        >
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                أشهر العلامات التجارية
            </h2>

            <div
                className={[
                    "flex gap-3 overflow-x-auto pb-1",
                    "snap-x snap-mandatory scroll-smooth",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
            >
                {chunkByTwo(brands).map((column) => (
                    <div
                        key={column.map((brand) => brand.id).join("-")}
                        className="flex w-[calc(50%-0.375rem)] shrink-0 snap-start flex-col gap-3"
                    >
                        {column.map((brand) => (
                            <BrandCard key={brand.id} brand={brand} moduleId={moduleId} />
                        ))}
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
