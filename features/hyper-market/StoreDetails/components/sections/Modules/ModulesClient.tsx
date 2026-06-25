"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { StoreModule } from "@/features/hyper-market/StoreDetails/types/modules.types";
import { ModuleCard } from "./ModuleCard";

interface ModulesClientProps {
    modules: StoreModule[];
}

export function ModulesClient({ modules }: ModulesClientProps) {
    if (modules.length === 0) return null;

    return (
        <section aria-label="خدماتنا" className="bg-white px-4 pb-4 pt-4 sm:px-6">
            <h2 className="mb-3 text-sm font-bold text-[#111B18] sm:text-base">خدماتنا</h2>

            <ScrollContainer className="-mx-1 px-1">
                {modules.map((module, index) => (
                    <ModuleCard key={module.id} module={module} colorIndex={index} />
                ))}
            </ScrollContainer>
        </section>
    );
}
