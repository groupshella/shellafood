"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useModules } from "@/features/home/hooks/useModules";
import { Module } from "@/features/home/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F" },
    { bg: "#FEF0E6", text: "#D4724A" },
    { bg: "#EAF4F6", text: "#3A96A0" },
    { bg: "#F3E8FF", text: "#7C3AED" },
    { bg: "#FFF4E6", text: "#EA580C" },
    { bg: "#E8F0FE", text: "#2563EB" },
] as const;

function getColor(index: number) {
    return PALETTE[index % PALETTE.length];
}

function chunkByTwo(items: Module[]): Module[][] {
    const rows: Module[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }
    return rows;
}

function ModuleIcon({
    src,
    variant,
}: {
    src: string;
    variant: "tall" | "compact";
}) {
    const [hasError, setHasError] = useState(false);
    if (hasError || !src) return null;

    const className =
        variant === "tall"
            ? "pointer-events-none absolute bottom-0 right-0 h-24 w-24 translate-x-4 translate-y-4 opacity-50"
            : "pointer-events-none relative h-9 w-9 shrink-0 opacity-70";

    return (
        <div className={className} aria-hidden>
            <Image
                src={src}
                alt=""
                fill
                className="object-contain"
                onError={() => setHasError(true)}
                sizes={variant === "tall" ? "96px" : "36px"}
            />
        </div>
    );
}

function ModuleCard({
    module,
    colorIndex,
    variant,
}: {
    module: Module;
    colorIndex: number;
    variant: "tall" | "compact";
}) {
    const { bg, text } = getColor(colorIndex);
    const isTall = variant === "tall";

    return (
        <Link
            href={`/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`}
            className={[
                "relative flex w-full overflow-hidden rounded-2xl outline-none",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                isTall
                    ? "h-full min-h-[168px] flex-col items-start p-4"
                    : "h-full min-h-[80px] flex-row items-center justify-between px-3",
            ].join(" ")}
            style={{ backgroundColor: bg }}
            aria-label={module.module_name}
        >
            <span
                className={`relative z-10 font-bold leading-tight ${isTall ? "text-base" : "text-sm"}`}
                style={{ color: text }}
            >
                {module.module_name}
            </span>
            <ModuleIcon src={module.icon_full_url} variant={variant} />
        </Link>
    );
}

function HeroGrid({
    left,
    right,
    startIndex,
}: {
    left: Module[];
    right: Module | null;
    startIndex: number;
}) {
    if (left.length === 0 && !right) return null;

    if (!right) {
        return (
            <div className="flex flex-col gap-2.5">
                {left.map((module, i) => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        colorIndex={startIndex + i}
                        variant="compact"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid h-[168px] grid-cols-2 grid-rows-2 gap-2.5" >
            {left[0] && (
                <ModuleCard
                    module={left[0]}
                    colorIndex={startIndex}
                    variant="compact"
                />
            )}
            {left[1] && (
                <ModuleCard
                    module={left[1]}
                    colorIndex={startIndex + 1}
                    variant="compact"
                />
            )}
            <div className="col-start-2 row-span-2 row-start-1 h-full">
                <ModuleCard
                    module={right}
                    colorIndex={startIndex + 2}
                    variant="tall"
                />
            </div>
        </div>
    );
}

function ModuleRow({
    modules,
    startIndex,
}: {
    modules: Module[];
    startIndex: number;
}) {
    return (
        <div className="grid grid-cols-2 gap-2.5" >
            {modules.map((module, i) => (
                <ModuleCard
                    key={module.id}
                    module={module}
                    colorIndex={startIndex + i}
                    variant="compact"
                />
            ))}
            {modules.length === 1 && <div aria-hidden />}
        </div>
    );
}

function ModulesSkeleton() {
    return (
        <div className="w-full space-y-2.5">
            <div className="grid h-[168px] grid-cols-2 grid-rows-2 gap-2.5" dir="ltr">
                <div className="animate-pulse rounded-2xl bg-gray-100" />
                <div className="animate-pulse rounded-2xl bg-gray-100" />
                <div className="col-start-2 row-span-2 row-start-1 animate-pulse rounded-2xl bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        </div>
    );
}

export default function Modules() {
    const { modules, isLoading, error } = useModules();

    if (isLoading) return <ModulesSkeleton />;
    if (error) return null;
    if (modules.length === 0) return null;
    const heroLeft = modules.slice(0, 2);
    const heroRight = modules[2] ?? null;
    const rows = chunkByTwo(modules.slice(3));

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            aria-label="الأقسام"
            className=" w-full  space-y-2.5 px-1 "
        >
            <h2 className="text-xl  font-bold">خدماتنا</h2>
            <HeroGrid left={heroLeft} right={heroRight} startIndex={0} />

            {rows.map((row, rowIndex) => (
                <ModuleRow
                    key={row.map((m) => m.id).join("-")}
                    modules={row}
                    startIndex={3 + rowIndex * 2}
                />
            ))}
        </motion.section>
    );
}
