"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@/shared/components/SecureImage";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Heart, Search, Star, Truck } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { StoreDetails, StoreCategory } from "@/features/stores/types/store.types";
import { STORE_CATEGORY_PRODUCTS_ID } from "@/features/stores/components/sections/StoreCategoryProducts/StoreCategoryProductsClient";
import { useNotification } from "@/shared/components/NotificationToast";

const HERO_BTN =
    "flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-background/95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:w-11";

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
    isArabic: boolean;
}

export function StoreHeaderClient({
    store,
    categories,
    activeCategoryId,
    storeId,
    moduleId,
    isArabic,
}: StoreHeaderClientProps) {
    const router = useRouter();
    const { success, error: notifyError } = useNotification();
    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const [favorited, setFavorited] = useState(false);
    const [favoritePending, setFavoritePending] = useState(false);
    const BackIcon = isArabic ? ArrowRight : ArrowLeft;

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
        <div className="bg-background">
            {/* Hero banner — full-bleed; height scales on desktop only */}
            <div className="relative h-36 w-full overflow-hidden sm:h-40 md:h-52 lg:h-64 xl:h-72">
                {heroImage ? (
                    <Image
                        src={heroImage}
                        alt={store.store_name}
                        fill
                        priority
                        className="object-cover md:object-center"
                        sizes="100vw"
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
                            className="pointer-events-none absolute -start-4 -top-4 h-48 w-48 opacity-20 md:h-64 md:w-64"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 30% 30%, #9DFCA3 0%, transparent 60%), radial-gradient(circle at 70% 70%, #3EC856 0%, transparent 55%)",
                            }}
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -end-6 -top-6 h-44 w-44 opacity-25 md:h-60 md:w-60"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 60% 40%, #9DFCA3 0%, transparent 55%), radial-gradient(circle at 30% 70%, #3EC856 0%, transparent 50%)",
                            }}
                        />
                    </div>
                )}

                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent md:from-black/35"
                    aria-hidden
                />

                <div className="absolute inset-x-0 top-3 z-10 sm:top-4 md:top-5 lg:top-6">
                    <div className={`flex items-center justify-between ${contentContainer}`}>
                        <button
                            type="button"
                            onClick={handleBack}
                            aria-label={isArabic ? "رجوع" : "Back"}
                            className={HERO_BTN}
                        >
                            <BackIcon className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                disabled={favoritePending}
                                aria-label={
                                    favorited
                                        ? isArabic
                                            ? "إزالة من المفضلة"
                                            : "Remove from favorites"
                                        : isArabic
                                          ? "إضافة إلى المفضلة"
                                          : "Add to favorites"
                                }
                                className={HERO_BTN}
                            >
                                <Heart
                                    className={[
                                        "h-5 w-5",
                                        favorited
                                            ? "fill-brand text-brand"
                                            : "fill-none",
                                    ].join(" ")}
                                    strokeWidth={favorited ? 0 : 2}
                                    aria-hidden
                                />
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenSearch}
                                aria-label={isArabic ? "بحث" : "Search"}
                                className={HERO_BTN}
                            >
                                <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store info row — mobile layout preserved; desktop gets more breathing room */}
            <div className={`relative z-10 -mt-7 pb-2 sm:-mt-8 md:-mt-10 md:pb-3 lg:-mt-12 ${contentContainer}`}>
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
                    <div className="flex min-w-0 items-end gap-2 sm:gap-2.5 md:gap-3.5 lg:gap-4">
                        <div
                            className="relative h-[72px] w-[64px] shrink-0 overflow-hidden rounded sm:h-[80px] sm:w-[72px] md:h-[96px] md:w-[88px] md:rounded-md md:bg-background md:shadow-sm md:ring-1 md:ring-border lg:h-[104px] lg:w-[96px]"
                            style={{ transform: "rotate(-0.15deg)" }}
                        >
                            {store.store_logo_url ? (
                                <Image
                                    src={store.store_logo_url}
                                    alt={store.store_name}
                                    fill
                                    className="object-contain p-0.5 md:p-1"
                                    sizes="(max-width: 768px) 64px, (max-width: 1024px) 88px, 96px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center px-1">
                                    <span className="text-[9px] font-bold leading-none text-white sm:text-[10px] md:text-xs">
                                        {store.store_name.slice(0, 6)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col items-start gap-1 pb-0.5 sm:gap-1.5 sm:pb-1 md:max-w-xl md:gap-2 lg:max-w-2xl">
                            <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5 md:gap-2">
                                {store.free_delivery && (
                                    <span className="flex h-5 items-center gap-1 rounded-[4px] border border-border bg-background px-1.5 text-[10px] font-medium text-foreground sm:h-[22px] sm:text-xs md:h-6 md:rounded-md md:px-2">
                                        {isArabic ? "توصيل مجاني" : "Free delivery"}
                                        <Truck className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-4" strokeWidth={1.2} aria-hidden />
                                    </span>
                                )}
                                {store.delivery_time && (
                                    <span className="flex h-5 items-center gap-1 rounded-[4px] border border-border bg-background px-1.5 text-[10px] font-medium text-foreground sm:h-[22px] sm:text-xs md:h-6 md:rounded-md md:px-2">
                                        {store.delivery_time}
                                        <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={1.2} aria-hidden />
                                    </span>
                                )}
                            </div>

                            <h1 className="w-full text-start text-base font-bold leading-snug text-foreground sm:text-lg md:text-2xl md:leading-tight lg:text-[1.75rem]">
                                {store.store_name}
                            </h1>

                            {store.store_description && (
                                <p className="line-clamp-2 w-full text-start text-xs leading-snug text-muted sm:text-sm md:line-clamp-3 md:max-w-prose md:leading-relaxed lg:text-[0.9375rem]">
                                    {store.store_description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 pt-7 sm:pt-9 md:pt-12 lg:pt-14">
                        {/* Rating chip — illustration accent green kept as hex */}
                        <span className="flex h-5 min-w-[44px] items-center justify-center gap-1 rounded-lg bg-[#9DFCA3] px-1.5 sm:h-[22px] sm:min-w-[48px] sm:px-2 md:h-7 md:min-w-[52px] md:rounded-xl md:px-2.5 dark:bg-[#1a4d20]">
                            <span className="text-[10px] font-semibold leading-none text-foreground dark:text-[#9DFCA3] sm:text-xs md:text-sm">
                                {store.rating > 0 ? store.rating.toFixed(1) : "5.0"}
                            </span>
                            <Star className="h-2.5 w-2.5 fill-foreground text-foreground sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 dark:fill-[#9DFCA3] dark:text-[#9DFCA3]" strokeWidth={0} aria-hidden />
                        </span>
                    </div>
                </div>
            </div>

            {/* Category tabs — sticky on desktop for easier browsing while scrolling products */}
            {categories.length > 0 && (
                <div
                    className={[
                        "pb-3 pt-3 sm:pt-4",
                        "md:sticky md:top-0 md:z-30 md:border-b md:border-border md:bg-background/95 md:pb-3.5 md:pt-3.5 md:backdrop-blur-md",
                        contentContainer,
                    ].join(" ")}
                >
                    <div
                        ref={categoryScrollRef}
                        dir={isArabic ? "rtl" : "ltr"}
                        className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] sm:gap-2 md:gap-2.5 [&::-webkit-scrollbar]:hidden"
                        role="tablist"
                        aria-label={isArabic ? "تصنيفات المتجر" : "Store categories"}
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
                                        "flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-2.5 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-background sm:h-9 sm:px-3 sm:text-sm md:h-10 md:px-3.5",
                                        isActive
                                            ? "bg-brand/10 text-brand"
                                            : "bg-card text-foreground md:hover:brightness-95",
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
