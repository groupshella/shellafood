"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { StoreModule } from "@/features/hyper-market/StoreDetails/types/modules.types";
import { ModuleCard } from "./ModuleCard";

interface ModulesClientProps {
    modules: StoreModule[];
    moduleId: string;
    isArabic: boolean;
}

export function ModulesClient({ modules, moduleId, isArabic }: ModulesClientProps) {
    if (modules.length === 0) return null;

    const moduleCards = modules.map((module, index) => {
        const isActive = String(module.id) === moduleId;

        return (
            <ModuleCard
                key={module.id}
                module={module}
                colorIndex={index}
                isActive={isActive}
                isDisabled={!isActive}
                isArabic={isArabic}
            />
        );
    });

    return (
        <section
            aria-label={isArabic ? "خدماتنا" : "Our services"}
            className="space-y-2.5 bg-transparent px-3 pb-3 pt-3 sm:space-y-3.5 sm:px-5 sm:pb-4 sm:pt-4 lg:px-6"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <h2 className="text-base font-bold text-foreground sm:text-lg">
                {isArabic ? "خدماتنا" : "Our services"}
            </h2>

            {/* Mobile / tablet: horizontal snap scroll */}
            <div className="md:hidden">
                <ScrollContainer
                    ariaLabel={isArabic ? "قائمة الخدمات" : "Services list"}
                >
                    {moduleCards}
                </ScrollContainer>
            </div>

            {/* Desktop: responsive grid */}
            <div className="hidden gap-2.5 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4 2xl:grid-cols-6">
                {moduleCards}
            </div>
        </section>
    );
}
