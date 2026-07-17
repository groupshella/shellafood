"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { SearchModule } from "@/features/search/types/modules.types";
import { ModuleCard } from "./ModuleCard";

interface ModulesClientProps {
    modules: SearchModule[];
    isArabic: boolean;
}

export function ModulesClient({ modules, isArabic }: ModulesClientProps) {
    const { moduleId, setModuleId } = useSearchContext();

    const ALLOWED_MODULE_IDS = new Set([3, 6, 9]);
    const visibleModules = modules.filter((module) =>
        ALLOWED_MODULE_IDS.has(Number(module.id)),
    );

    if (visibleModules.length === 0) return null;

    const moduleCards = visibleModules.map((module, index) => {
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
        <section
            aria-label={isArabic ? "خدماتنا" : "Our services"}
            className="space-y-2.5 sm:space-y-3.5"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="md:hidden">
                <ScrollContainer
                    className="mx-auto"
                    ariaLabel={isArabic ? "قائمة الخدمات" : "Services list"}
                >
                    {moduleCards}
                </ScrollContainer>
            </div>

            <div className="hidden gap-2.5 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4 2xl:grid-cols-6">
                {moduleCards}
            </div>
        </section>
    );
}
