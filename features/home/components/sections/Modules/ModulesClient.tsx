"use client";

import { Module } from "@/features/home/types/modules.types";
import { ModuleCard } from "./ModuleCard";

function chunkByTwo(items: Module[]): Module[][] {
    const rows: Module[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }
    return rows;
}

function HeroGrid({ left, right, startIndex }: { left: Module[]; right: Module | null; startIndex: number }) {
    if (left.length === 0 && !right) return null;
    if (!right) {
        return (
            <div className="flex flex-col gap-2.5">
                {left.map((module, i) => (
                    <ModuleCard key={module.id} module={module} colorIndex={startIndex + i} variant="compact" />
                ))}
            </div>
        );
    }
    return (
        <div className="grid h-[168px] grid-cols-2 grid-rows-2 gap-2.5">
            <div className="col-start-1 row-span-2 row-start-1 h-full">
                <ModuleCard module={right} colorIndex={startIndex + 2} variant="tall" />
            </div>
            {left[0] && (
                <div className="col-start-2 row-start-1">
                    <ModuleCard module={left[0]} colorIndex={startIndex} variant="compact" />
                </div>
            )}
            {left[1] && (
                <div className="col-start-2 row-start-2">
                    <ModuleCard module={left[1]} colorIndex={startIndex + 1} variant="compact" />
                </div>
            )}
        </div>
    );
}

function ModuleRow({ modules, startIndex }: { modules: Module[]; startIndex: number }) {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            {modules.map((module, i) => (
                <ModuleCard key={module.id} module={module} colorIndex={startIndex + i} variant="compact" />
            ))}
            {modules.length === 1 && <div aria-hidden />}
        </div>
    );
}

export function ModulesClient({ modules }: { modules: Module[] }) {
    const heroLeft = modules.slice(1, 3);
    const heroRight = modules[0] ?? null;
    const rows = chunkByTwo(modules.slice(3));

    return (
        <section aria-label="الأقسام" className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <h2 className="text-lg font-bold text-gray-800">خدماتنا</h2>
            <HeroGrid left={heroLeft} right={heroRight} startIndex={0} />
            {rows.map((row, rowIndex) => (
                <ModuleRow key={row.map((m) => m.id).join("-")} modules={row} startIndex={3 + rowIndex * 2} />
            ))}
        </section>
    );
}
