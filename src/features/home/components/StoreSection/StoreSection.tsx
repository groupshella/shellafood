"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreCard, StoreCardSkeleton } from "./StoreCard";
import { ApiStore } from "../../types/store.types";
import { Variants } from "framer-motion";

interface StoreSectionProps {
    title: string;
    subtitle?: string;
    stores: ApiStore[];
    isLoading: boolean;
    error: string | null;
    viewAllHref?: string;
    viewAllLabel?: string;
    emptyMessage?: string;
    skeletonCount?: number;
    storesLength?: number;
    /** horizontal scroll (home page) vs grid (all-page) */
    layout?: "scroll" | "grid";
    cardVariant?: "default" | "compact" | "wide"
    icon?: React.ReactNode;
    accentColor?: string; // tailwind class e.g. "from-green-500 to-emerald-600"
}

export function StoreSection({
    title,
    subtitle,
    stores,
    isLoading,
    error,
    viewAllHref,
    viewAllLabel = "عرض الكل",
    emptyMessage = "لا يوجد متاجر متاحة في الوقت الحالي.",
    skeletonCount = 4,
    layout = "scroll",
    cardVariant = "default",
    icon,
    accentColor = "from-green-500 to-emerald-600",
}: StoreSectionProps) {
    const skeletons = Array.from({ length: skeletonCount });

    if (error) {
        return (
            <section className="my-6">
                <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} viewAllLabel={viewAllLabel} icon={icon} accentColor={accentColor} />
                <div className="flex items-center justify-center h-28 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                    <p className="text-red-500 text-sm font-medium">{'عذراً، حدث خطأ ما بشكل غير متوقع.'}</p>
                </div>
            </section>
        );
    }

    const isEmpty = !isLoading && stores.length === 0;

    if (layout === "grid") {
        return (
            <section className="my-6">
                <SectionHeader title={title} subtitle={subtitle} icon={icon} accentColor={accentColor} />
                {isLoading ? (
                    <div className={gridClass(cardVariant)}>
                        {skeletons.map((_, i) => <StoreCardSkeleton key={i} />)}
                    </div>
                ) : isEmpty ? (
                    <EmptyState message={emptyMessage} />
                ) : (
                    <div className={gridClass(cardVariant)}>
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                )}
            </section>
        );
    }

    // Horizontal scroll
    return (
        <section className="my-6">
            <SectionHeader title={title} subtitle={subtitle} storesLength={stores.length} viewAllHref={viewAllHref} viewAllLabel={viewAllLabel} icon={icon} accentColor={accentColor} />
            <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scroll-smooth hide-scrollbar">
                    {isLoading
                        ? skeletons.map((_, i) => (
                            <div key={i} className="snap-start flex-shrink-0 w-48 sm:w-56">
                                <StoreCardSkeleton />
                            </div>
                        ))
                        : isEmpty
                            ? <EmptyState message={emptyMessage} />
                            : stores.map((store) => (
                                <div key={store.id} className="snap-start flex-shrink-0 w-48 sm:w-56">
                                    <StoreCard store={store} />
                                </div>
                            ))}
                </div>
            </div>
        </section>
    );
}

function gridClass(variant: string) {
    if (variant === "wide") return "flex flex-col gap-3";
    if (variant === "compact") return "grid grid-cols-1 sm:grid-cols-2 gap-3";
    return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4";
}

function SectionHeader({ title, subtitle, storesLength, viewAllHref, viewAllLabel, icon, accentColor }: Partial<StoreSectionProps> & { accentColor?: string }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                {icon && (
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center text-white shadow-sm`}>
                        {icon}
                    </div>
                )}
                <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
                </div>
            </div>
            {
                viewAllHref && storesLength && storesLength > 4 ? (
                    <Link href={viewAllHref} className="flex items-center gap-0.5 text-green-600 dark:text-green-400 text-xs font-semibold hover:underline">
                        {viewAllLabel} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                ) : null
            }
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex items-center justify-center h-28 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    );
}