"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchModule } from "@/features/search/types/modules.types";
import { ModuleCard } from "./ModuleCard";

const SECTION_HEADING =
    "text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg";

interface ModulesClientProps {
    modules: SearchModule[];
}

export function ModulesClient({ modules }: ModulesClientProps) {
    const { moduleId, setModuleId } = useSearchContext();

    const moduleCards = modules.map((module, index) => {
        const id = String(module.id);
        const isActive = id === moduleId;

        return (
            <ModuleCard
                key={module.id}
                module={module}
                colorIndex={index}
                isActive={isActive}
                isDisabled={!isActive}
                onSelect={setModuleId}
            />
        );
    });

    return (
        <section aria-label="خدماتنا" className="space-y-2.5 sm:space-y-3.5">
            <h2 className={SECTION_HEADING}>خدماتنا</h2>

            <div className="md:hidden">
                <ScrollContainer className="-mx-1 px-1" ariaLabel="قائمة الخدمات">
                    {moduleCards}
                </ScrollContainer>
            </div>

            <div className="hidden gap-2.5 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4 2xl:grid-cols-6">
                {moduleCards}
            </div>
        </section>
    );
}
