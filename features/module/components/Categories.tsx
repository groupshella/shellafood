"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/features/module/hooks/useCategories";
import { Category } from "@/features/module/types/categories.types";

function CategoryCard({
    category,
    moduleId,
}: {
    category: Category;
    moduleId: string;
}) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/modules/${moduleId}/category/${category.slug}`}
            className={[
                "group relative block aspect-square w-[132px] shrink-0 overflow-hidden rounded-2xl sm:w-[148px] md:w-[160px]",
                "outline-none transition-transform duration-150 active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={category.name}
        >
            {!imageError && category.image_full_url ? (
                <Image
                    src={category.image_full_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 132px, 160px"
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="absolute inset-0 bg-gray-100" />
            )}

            <div
                className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/30"
                aria-hidden
            />

            <h3 className="absolute inset-0 z-10 flex items-center justify-center px-3 text-center text-sm font-bold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:text-[15px]">
                {category.name}
            </h3>
        </Link>
    );
}

function CategoriesSkeleton() {
    return (
        <div className="flex gap-3 overflow-hidden px-4 sm:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square w-[132px] shrink-0 animate-pulse rounded-2xl bg-gray-100 sm:w-[148px] md:w-[160px]"
                />
            ))}
        </div>
    );
}

interface CategoriesProps {
    moduleId: string;
    moduleName: string;
}

export default function Categories({ moduleId }: CategoriesProps) {
    const { categories, isLoading, error } = useCategories(moduleId);

    if (isLoading) return <CategoriesSkeleton />;
    if (error || categories.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            aria-label="التصنيفات"
            className="w-full space-y-3"
        >
            <div
                className={[
                    "flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6",
                    "snap-x snap-mandatory scroll-smooth",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
            >
                {categories.map((category) => (
                    <div key={category.id} className="snap-start">
                        <CategoryCard category={category} moduleId={moduleId} />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
