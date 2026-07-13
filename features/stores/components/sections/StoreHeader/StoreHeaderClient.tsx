"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Heart, Search, Star, Truck } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { StoreDetails, StoreCategory } from "@/features/stores/types/store.types";
import { STORE_CATEGORY_PRODUCTS_ID } from "@/features/stores/components/sections/StoreCategoryProducts/StoreCategoryProductsClient";
import { useNotification } from "@/shared/components/NotificationToast";

const HERO_BTN =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-gray-800 backdrop-blur-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:bg-white/95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900/80 dark:text-gray-100 dark:focus-visible:ring-offset-gray-900 dark:active:bg-gray-800/95 sm:h-11 sm:w-11";

const contentContainer =
    "mx-auto w-full px-3 sm:px-4 md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl";

/** Scroll only the tab strip — avoids page jump from element.scrollIntoView. */
function scrollTabIntoView(container: HTMLElement, tab: HTMLElement) {
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const delta =
        tabRect.left - containerRect.left - (container.clientWidth - tab.offsetWidth) / 2;
    container.scrollBy({ left: delta, behavior: "smooth" });
}

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
    const { success, error: notifyError } = useNotification();
    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const [favorited, setFavorited] = useState(false);
    const [favoritePending, setFavoritePending] = useState(false);

    useEffect(() => {
        if (!activeCategoryId) return;

        const container = categoryScrollRef.current;
        if (!container) return;

        const tab = container.querySelector<HTMLElement>(`[data-id="${activeCategoryId}"]`);
        if (!tab) return;

        // Wait a frame so layout/RTL scroll metrics are ready.
        const frame = requestAnimationFrame(() => scrollTabIntoView(container, tab));
        return () => cancelAnimationFrame(frame);
    }, [activeCategoryId]);

    const handleCategoryClick = useCallback(
        (categoryId: number) => {
            const nextId = String(categoryId);

            // Re-clicking the active category: scroll products into view without navigating.
            if (nextId === activeCategoryId) {
                document
                    .getElementById(STORE_CATEGORY_PRODUCTS_ID)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            router.push(`/stores/${storeId}?module_id=${moduleId}&categoryId=${categoryId}`);
        },
        [router, storeId, moduleId, activeCategoryId],
    );

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleOpenSearch = useCallback(() => {
        router.push(`/search?module_id=${moduleId}`);
    }, [router, moduleId]);

    const toggleFavorite = useCallback(async () => {
        if (favoritePending) return;

        setFavoritePending(true);
        const wasLiked = favorited;
        setFavorited(!wasLiked);

        const numericStoreId = Number(storeId);
        const result = wasLiked
            ? await removeFromWishlist({ storeId: numericStoreId })
            : await addToWishlist({ storeId: numericStoreId });

        if (!result.success) {
            setFavorited(wasLiked);
            notifyError(result.message);
        } else {
            success(result.message);
        }
        setFavoritePending(false);
    }, [favoritePending, favorited, notifyError, storeId, success]);

    const heroImage = store.store_image_url;

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero banner */}
            <div className="relative h-36 w-full overflow-hidden sm:h-40 md:h-48 lg:h-56 xl:h-60">
                {heroImage ? (
                    <Image
                        src={heroImage}
                        alt={store.store_name}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 1152px, 1408px"
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(160deg, #1B5E20 0%, #2E7D32 55%, #388E3C 100%)",
                        }}
                        aria-hidden
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -start-4 -top-4 h-48 w-48 opacity-20"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 30% 30%, #9DFCA3 0%, transparent 60%), radial-gradient(circle at 70% 70%, #3EC856 0%, transparent 55%)",
                            }}
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -end-6 -top-6 h-44 w-44 opacity-25"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 60% 40%, #9DFCA3 0%, transparent 55%), radial-gradient(circle at 30% 70%, #3EC856 0%, transparent 50%)",
                            }}
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" aria-hidden />

                <div className="absolute inset-x-0 top-3 z-10 sm:top-4">
                    <div className={`flex items-center justify-between ${contentContainer}`}>
                        <button type="button" onClick={handleBack} aria-label="رجوع" className={HERO_BTN}>
                            <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                disabled={favoritePending}
                                aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                className={HERO_BTN}
                            >
                                <Heart
                                    className={[
                                        "h-5 w-5",
                                        favorited
                                            ? "fill-[#30913F] text-[#30913F]"
                                            : "fill-none",
                                    ].join(" ")}
                                    strokeWidth={favorited ? 0 : 2}
                                    aria-hidden
                                />
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenSearch}
                                aria-label="بحث"
                                className={HERO_BTN}
                            >
                                <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store info row */}
            <div className={`relative z-10 -mt-7 pb-2 sm:-mt-8 ${contentContainer}`}>
                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                    <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                        <div
                            className="relative h-[72px] w-[64px] shrink-0 overflow-hidden rounded  sm:h-[80px] sm:w-[72px]  md:h-[88px] md:w-[80px]"
                            style={{ transform: "rotate(-0.15deg)" }}
                        >
                            {store.store_logo_url ? (
                                <Image
                                    src={store.store_logo_url}
                                    alt={store.store_name}
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="(max-width: 640px) 64px, 80px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center px-1">
                                    <span className="text-[9px] font-bold leading-none text-white sm:text-[10px]">
                                        {store.store_name.slice(0, 6)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col items-start gap-1 pb-0.5 sm:gap-1.5 sm:pb-1">
                            <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
                                {store.free_delivery && (
                                    <span className="flex h-5 items-center gap-1 rounded-[4px] border border-gray-200 bg-white px-1.5 text-[10px] font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:h-[22px] sm:text-xs">
                                        توصيل مجاني
                                        <Truck className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-4" strokeWidth={1.2} aria-hidden />
                                    </span>
                                )}
                                {store.delivery_time && (
                                    <span className="flex h-5 items-center gap-1 rounded-[4px] border border-gray-200 bg-white px-1.5 text-[10px] font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:h-[22px] sm:text-xs">
                                        {store.delivery_time}
                                        <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={1.2} aria-hidden />
                                    </span>
                                )}
                            </div>

                            <h1 className="w-full text-start text-base font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-lg md:text-xl">
                                {store.store_name}
                            </h1>

                            {store.store_description && (
                                <p className="line-clamp-2 w-full text-start text-xs leading-snug text-gray-500 dark:text-gray-400 sm:text-sm md:line-clamp-3">
                                    {store.store_description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 pt-7 sm:pt-9">
                        <span className="flex h-5 min-w-[44px] items-center justify-center gap-1 rounded-lg bg-[#9DFCA3] px-1.5 sm:h-[22px] sm:min-w-[48px] sm:px-2 dark:bg-[#1a4d20]">
                            <span className="text-[10px] font-semibold leading-none text-gray-900 dark:text-[#9DFCA3] sm:text-xs">
                                {store.rating > 0 ? store.rating.toFixed(1) : "5.0"}
                            </span>
                            <Star className="h-2.5 w-2.5 fill-gray-900 text-gray-900 sm:h-3 sm:w-3 dark:fill-[#9DFCA3] dark:text-[#9DFCA3]" strokeWidth={0} aria-hidden />
                        </span>
                    </div>
                </div>
            </div>

            {/* Category tabs */}
            {categories.length > 0 && (
                <div className={`pb-3 pt-3 sm:pt-4 ${contentContainer}`}>
                    <div
                        ref={categoryScrollRef}
                        dir="rtl"
                        className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
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
                                    data-id={String(cat.id)}
                                    aria-selected={isActive}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={[
                                        "flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-2.5 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 sm:h-9 sm:px-3 sm:text-sm dark:focus-visible:ring-offset-gray-900",
                                        isActive
                                            ? "bg-[#EBFEEB] text-[#267332] dark:bg-[#0d2e12] dark:text-[#4db860]"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
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
