"use client";

import { useState } from "react";
import Navbar from "@/features/layout/components/Navbar";
import type { FavoritesTab } from "@/features/favorites/types/favorites.types";

const TABS: { id: FavoritesTab; label: string }[] = [
    { id: "orders", label: "الطلبات" },
    { id: "stores", label: "المتاجر" },
    { id: "products", label: "المنتجات" },
];

const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-gray-50 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

interface FavoritesShellProps {
    productsContent: React.ReactNode;
    storesContent: React.ReactNode;
    ordersContent: React.ReactNode;
}

export function FavoritesShell({
    productsContent,
    storesContent,
    ordersContent,
}: FavoritesShellProps) {
    const [activeTab, setActiveTab] = useState<FavoritesTab>("products");

    return (
        <div dir="rtl" className={SHELL_LAYOUT}>
            <header className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className={`flex items-center justify-center py-3.5 sm:py-4 ${HEADER_PADDING}`}>
                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">مفضلاتي</h1>
                </div>

                <div className={`pb-3 sm:pb-3.5 ${HEADER_PADDING}`}>
                    <div
                        role="tablist"
                        aria-label="تصفية المفضلة"
                        className="flex items-center rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 sm:p-1.5 lg:max-w-xl"
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
                                        "min-h-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-all duration-200 sm:min-h-11 sm:text-[15px]",
                                        isActive
                                            ? "bg-[#30913F] text-white shadow-sm"
                                            : "text-gray-500 dark:text-gray-400",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="pb-24 sm:pb-28">
                <div hidden={activeTab !== "products"}>{productsContent}</div>
                <div hidden={activeTab !== "stores"}>{storesContent}</div>
                <div hidden={activeTab !== "orders"}>{ordersContent}</div>
            </main>

            <Navbar />
        </div>
    );
}
