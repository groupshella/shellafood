import Image from "next/image";
import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";

export function CategoryCard({
    category,
    moduleId,
}: {
    category: Category;
    moduleId: string;
}) {
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
            {category.image_full_url ? (
                <Image
                    src={category.image_full_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 132px, 160px"
                    loading="lazy"
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
