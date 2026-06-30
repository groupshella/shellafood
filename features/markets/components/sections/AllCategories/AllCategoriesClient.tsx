"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/features/markets/types/categories.types";
import { CategoryCard } from "../Categories/CategoryCard";

const ICON_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface AllCategoriesClientProps {
    categories: Category[];
    moduleId: string;
    moduleName?: string;
}

function buildBackHref(moduleId: string, moduleName?: string) {
    const params = new URLSearchParams();
    if (moduleName) params.set("module_name", moduleName);
    const query = params.toString();
    return `/modules/${moduleId}${query ? `?${query}` : ""}`;
}

export function AllCategoriesClient({
    categories,
    moduleId,
    moduleName,
}: AllCategoriesClientProps) {
    if (categories.length === 0) return null;

    const backHref = buildBackHref(moduleId, moduleName);

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-white/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-4 py-2.5">
                    <Link
                        href={backHref}
                        className={`${ICON_BTN} absolute right-4`}
                        aria-label="العودة"
                    >
                        <ChevronRight className="h-5 w-5 text-[#30913F]" strokeWidth={2} />
                    </Link>

                    <h1 className="text-base font-semibold text-gray-500 sm:text-lg">الأقسام</h1>
                </div>
            </header>

            <section aria-label="جميع الأقسام" className="px-4 pb-8 pt-5 sm:px-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            moduleId={moduleId}
                            layout="grid"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
