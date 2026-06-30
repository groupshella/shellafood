"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart, Search, Clock, Truck, Star } from "lucide-react";
import { StoreDetails, StoreCategory } from "@/features/stores/types/store.types";

interface StoreHeaderClientProps {
    store: StoreDetails;
    categories: StoreCategory[];
    activeCategoryId: string;
    storeId: string;
    moduleId: string;
}

export function StoreHeaderClient({
    store,
    categories,
    activeCategoryId,
    storeId,
    moduleId,
}: StoreHeaderClientProps) {
    const router = useRouter();

    const handleCategoryClick = (categoryId: number) => {
        router.push(`/stores/${storeId}?module_id=${moduleId}&categoryId=${categoryId}`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div>
            {/* ── Green hero header ─────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden pb-5"
                style={{ background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)" }}
            >
                {/* Decorative leaf pattern — top-right quadrant */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-4 -left-4 h-48 w-48 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 30% 30%, #9DFCA3 0%, transparent 60%), radial-gradient(circle at 70% 70%, #3EC856 0%, transparent 55%)",
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-6 h-44 w-44 opacity-[0.11]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 60% 40%, #9DFCA3 0%, transparent 55%), radial-gradient(circle at 30% 70%, #3EC856 0%, transparent 50%)",
                    }}
                />

                {/* Icon row */}
                <div className="relative z-10 flex items-center justify-between px-4 pt-4">
                    {/* Right: heart + search */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="إضافة إلى المفضلة"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors active:bg-white/30"
                        >
                            <Heart className="h-5 w-5 text-white" strokeWidth={1.8} />
                        </button>
                        <button
                            type="button"
                            aria-label="بحث"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors active:bg-white/30"
                        >
                            <Search className="h-5 w-5 text-white" strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* Left: back chevron */}
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="رجوع"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors active:bg-white/30"
                    >
                        <ChevronRight className="h-5 w-5 text-white" strokeWidth={2} />
                    </button>
                </div>

                {/* Delivery badges */}
                <div className="relative z-10 mt-3 flex items-center gap-2 px-4">
                    {store.delivery_time && (
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                            {store.delivery_time}
                        </span>
                    )}
                    {store.free_delivery && (
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <Truck className="h-3.5 w-3.5" strokeWidth={1.8} />
                            توصيل مجاني
                        </span>
                    )}
                </div>

                {/* Store logo card — floats on the end (right in RTL) */}
                <div className="relative z-10 mt-4 flex justify-end px-4">
                    <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg">
                        {store.store_logo_url ? (
                            <Image
                                src={store.store_logo_url}
                                alt={store.store_name}
                                width={68}
                                height={68}
                                className="h-full w-full rounded-xl object-contain"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#EBFEEB]">
                                <span className="text-lg font-bold text-[#30913F]">
                                    {store.store_name.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── White store info area ──────────────────────────────────────── */}
            <div className="bg-white px-4 pb-3 pt-3">
                {/* Rating pill */}
                <div className="mb-2 flex items-center justify-end">
                    <span className="flex items-center gap-1 rounded-full bg-[#EBFEEB] px-2.5 py-1 text-sm font-bold text-[#30913F]">
                        <Star className="h-3.5 w-3.5 fill-[#30913F] text-[#30913F]" strokeWidth={0} />
                        {store.rating > 0 ? store.rating.toFixed(1) : "جديد"}
                    </span>
                </div>

                {/* Store name */}
                <p className="text-right text-xl font-bold leading-snug text-[#111B18]">
                    {store.store_name}
                </p>

                {/* Description */}
                {store.store_description && (
                    <p className="mt-0.5 text-right text-sm text-[#707784]">
                        {store.store_description}
                    </p>
                )}
            </div>

            {/* ── Category tabs ──────────────────────────────────────────────── */}
            {categories.length > 0 && (
                <div className="bg-white px-4 pb-3">
                    <div
                        className="flex gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        dir="rtl"
                        role="tablist"
                        aria-label="تصنيفات المتجر"
                    >
                        {categories.map((cat) => {
                            const isActive = String(cat.id) === activeCategoryId;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={[
                                        "shrink-0 whitespace-nowrap rounded-[20px] px-4 py-2 text-sm font-semibold transition-colors",
                                        isActive
                                            ? "bg-[#EBFEEB] text-[#30913F]"
                                            : "bg-[#F6F5F8] text-[#707784]",
                                    ].join(" ")}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
