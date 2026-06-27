"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

interface CategoryCardProps {
    category: StoreCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/hyper-market/categories?categoryId=${category.id}`}
            className="
                group relative flex aspect-square w-full shrink-0 flex-col
                overflow-hidden rounded-2xl
                outline-none
                transition-transform duration-150
                active:scale-[0.96]
                focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2
            "
            style={{
                // Two-tone diagonal wave gradient matching the uploaded reference images:
                // Image 1: deep mint top-left → pale mint bottom-right (S-curve split)
                // Image 2: pale mint top-right → deep mint bottom-left (mirror)
                // We use a single consistent direction that reads like the references.
                background: `
                    radial-gradient(ellipse at 15% 15%, #bbf7d0 0%, transparent 55%),
                    radial-gradient(ellipse at 85% 85%, #86efac 0%, transparent 50%),
                    #f0fdf4
                `,
            }}
            aria-label={category.name}
        >
            {/* Subtle top-left shine — mimics the lighter curved region in the reference */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 0%, #dcfce7cc 0%, transparent 60%)",
                }}
            />

            {/* Category name */}
            <h3 className="
                relative z-10
                line-clamp-2
                px-2 pt-2.5
                text-center text-[10px] font-bold leading-tight
                text-[#166534]
                sm:text-[11px]
            ">
                {category.name}
            </h3>

            {/* Product image — takes bottom 62% of the card */}
            <div className="absolute inset-x-0 bottom-0 h-[62%]">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="
                            object-contain object-bottom
                            transition-transform duration-200
                            group-active:scale-95
                        "
                        sizes="(max-width: 640px) 22vw, 112px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="flex h-full items-end justify-center pb-2 text-2xl opacity-20"
                        aria-hidden
                    >
                        🛒
                    </div>
                )}
            </div>
        </Link>
    );
}