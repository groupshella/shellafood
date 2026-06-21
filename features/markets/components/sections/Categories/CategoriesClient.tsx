"use client";

import { Category } from "@/features/markets/types/categories.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { CategoryCard } from "./CategoryCard";

export function CategoriesClient({
    categories,
    moduleId,
}: {
    categories: Category[];
    moduleId: string;
}) {
    return (
        <section aria-label="التصنيفات" className="w-full space-y-3">
            <ScrollContainer className="px-4 sm:px-6">
                {categories.map((category) => (
                    <div key={category.id} className="snap-start">
                        <CategoryCard category={category} moduleId={moduleId} />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}
