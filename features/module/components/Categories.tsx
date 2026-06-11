"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/features/module/hooks/useCategories";
import { Category } from "@/features/module/types/categories.types";

const PALETTE = [
    { top: "#F6F5F8", bottom: "#C8E6C9", text: "#1B5E20" },
    { top: "#F6F5F8", bottom: "#BBDEFB", text: "#1565C0" },
    { top: "#F6F5F8", bottom: "#FFE0B2", text: "#E65100" },
    { top: "#F6F5F8", bottom: "#E1BEE7", text: "#6A1B9A" },
    { top: "#F6F5F8", bottom: "#FFCCBC", text: "#BF360C" },
    { top: "#F6F5F8", bottom: "#B2DFDB", text: "#00695C" },
] as const;

function getPalette(index: number) {
    return PALETTE[index % PALETTE.length];
}

function CategoryCard({
    category,
    moduleId,
    colorIndex,
}: {
    category: Category;
    moduleId: string;
    colorIndex: number;
}) {
    const [imageError, setImageError] = useState(false);
    const { top, bottom, text } = getPalette(colorIndex);

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
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, ${bottom} 0%, ${bottom} 50%, ${top} 50%, ${top} 100%)`,
                }}
            />

            <h3
                className="relative z-10 line-clamp-2 px-3 pt-4 text-center text-sm font-bold leading-tight sm:text-[15px]"
                style={{ color: text }}
            >
                {category.name}
            </h3>

            <div className="absolute inset-x-0 bottom-0 h-[58%]">
                {!imageError && category.image_full_url ? (
                    <Image
                        src={category.image_full_url}
                        alt=""
                        fill
                        className="object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 132px, 160px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-end justify-center pb-3 opacity-40">
                        <span className="text-2xl" aria-hidden>
                            🛒
                        </span>
                    </div>
                )}
            </div>
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
                {categories.map((category, index) => (
                    <div key={category.id} className="snap-start">
                        <CategoryCard
                            category={category}
                            moduleId={moduleId}
                            colorIndex={index}
                        />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
