"use client";

import { useState } from "react";
import type { FavoritesTab } from "@/features/favorites/types/favorites.types";

const TABS: { id: FavoritesTab; label: { ar: string; en: string } }[] = [
    { id: "orders", label: { ar: "الطلبات", en: "Orders" } },
    { id: "stores", label: { ar: "المتاجر", en: "Stores" } },
    { id: "products", label: { ar: "المنتجات", en: "Products" } },
];

const SHELL_LAYOUT = [
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background",
    "sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl",
].join(" ");

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

interface FavoritesShellProps {
    isArabic: boolean;
    productsContent: React.ReactNode;
    storesContent: React.ReactNode;
    ordersContent: React.ReactNode;
}

export function FavoritesShell({
    isArabic,
    productsContent,
    storesContent,
    ordersContent,
}: FavoritesShellProps) {
    const [activeTab, setActiveTab] = useState<FavoritesTab>("products");

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className={SHELL_LAYOUT}
        >
            <header className="sticky top-0 z-20 border-b border-border bg-background/95 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md">
                <div className={`flex items-center justify-center py-3.5 sm:py-4 ${HEADER_PADDING}`}>
                    <h1 className="text-base font-bold text-foreground sm:text-lg lg:text-xl">
                        {isArabic ? "مفضلاتي" : "My favorites"}
                    </h1>
                </div>

                <div className={`pb-3 sm:pb-3.5 ${HEADER_PADDING}`}>
                    <div
                        role="tablist"
                        aria-label={isArabic ? "تصفية المفضلة" : "Filter favorites"}
                        className="mx-auto flex w-full items-center rounded-2xl bg-card p-1 sm:p-1.5 md:max-w-xl lg:max-w-2xl"
                    >
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    onClick={() => setActiveTab(tab.id)}
                                    aria-selected={isActive}
                                    className={[
                                        "min-h-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-11 sm:text-[15px]",
                                        isActive
                                            ? "bg-brand text-brand-foreground shadow-sm"
                                            : "text-muted md:hover:bg-background md:hover:text-foreground",
                                    ].join(" ")}
                                >
                                    {isArabic ? tab.label.ar : tab.label.en}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="pb-24 sm:pb-28 md:pb-16">
                <div hidden={activeTab !== "products"}>{productsContent}</div>
                <div hidden={activeTab !== "stores"}>{storesContent}</div>
                <div hidden={activeTab !== "orders"}>{ordersContent}</div>
            </main>
        </div>
    );
}
