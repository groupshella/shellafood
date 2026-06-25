"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { SearchModule } from "@/features/search/types/modules.types";
import { ModuleCard } from "./ModuleCard";

interface ModulesClientProps {
    modules: SearchModule[];
}

export function ModulesClient({ modules }: ModulesClientProps) {
    return (
        <section aria-label="خدماتنا" className="space-y-3">
            <h2 className="text-base font-medium text-neutral-500">خدماتنا</h2>

            <ScrollContainer className="-mx-1 px-1">
                {modules.map((module, index) => (
                    <ModuleCard key={module.id} module={module} colorIndex={index} />
                ))}
            </ScrollContainer>
        </section>
    );
}
