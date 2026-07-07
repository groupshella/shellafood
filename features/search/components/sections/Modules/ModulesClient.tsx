"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { SearchModule } from "@/features/search/types/modules.types";
import { ModuleCard } from "./ModuleCard";

const SECTION_HEADING =
    "text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg";

interface ModulesClientProps {
    modules: SearchModule[];
}

export function ModulesClient({ modules }: ModulesClientProps) {
    const moduleCards = modules.map((module, index) => (
        <ModuleCard key={module.id} module={module} colorIndex={index} />
    ));

    return (
        <section aria-label="خدماتنا" className="space-y-3 sm:space-y-4">
            <h2 className={SECTION_HEADING}>خدماتنا</h2>

            <div className="md:hidden">
                <ScrollContainer className="-mx-1 px-1">{moduleCards}</ScrollContainer>
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 2xl:grid-cols-6">
                {moduleCards}
            </div>
        </section>
    );
}
