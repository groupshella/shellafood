"use client";

import { useState } from "react";
import Navbar from "@/features/layout/components/Navbar";
import type { FavoritesTab } from "@/features/favorites/types/favorites.types";

const TABS: { id: FavoritesTab; label: string }[] = [
    { id: "orders", label: "الطلبات" },
    { id: "stores", label: "المتاجر" },
    { id: "products", label: "المنتجات" },
];

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
        <div
            dir="rtl"
            className="mx-auto min-h-screen w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-[#F5F5F5]"
        >
            {/* ── Page header ── */}
            <header className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="flex items-center justify-center px-5 py-4">
                    <h1 className="text-[17px] font-bold text-[#111B18]">مفضلاتي</h1>
                </div>

                {/* ── Segmented tab control ── */}
                <div className="px-4 pb-3">
                    <div className="flex items-center rounded-full bg-[#F6F5F8] p-1">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    aria-label={tab.label}
                                    aria-pressed={isActive}
                                    className={[
                                        "flex-1 rounded-full py-2 text-[13px] font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-[#30913F] text-white shadow-sm"
                                            : "text-[#707784]",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── Tab panels ── */}
            <main className="pb-24">
                <div hidden={activeTab !== "products"}>{productsContent}</div>
                <div hidden={activeTab !== "stores"}>{storesContent}</div>
                <div hidden={activeTab !== "orders"}>{ordersContent}</div>
            </main>

            <Navbar />
        </div>
    );
}
