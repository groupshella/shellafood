"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Heart, Search, Star, Truck } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/features/favorites/actions/wishlist";
import { StoreDetails, StoreCategory } from "@/features/stores/types/store.types";

const HERO_BTN =
    "flex h-10 w-10 items-center justify-center rounded-[35px] bg-[#F6F5F8]/80 transition-colors active:bg-[#F6F5F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const TAG_CLASS =
    "flex h-[19px] items-center gap-1 rounded-[4px] border border-[#111B18]/15 bg-white px-1 text-xs font-medium text-[#111B18]";

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
    const [favorited, setFavorited] = useState(false);
    const [favoritePending, setFavoritePending] = useState(false);

    const handleCategoryClick = (categoryId: number) => {
        router.push(`/stores/${storeId}?module_id=${moduleId}&categoryId=${categoryId}`);
    };

    const handleBack = () => router.back();
    const handleOpenSearch = () => router.push(`/search?module_id=${moduleId}`);

    async function toggleFavorite() {
        if (favoritePending) return;

        setFavoritePending(true);
        const wasLiked = favorited;
        setFavorited(!wasLiked);

        const numericStoreId = Number(storeId);
        const result = wasLiked
            ? await removeFromWishlist({ storeId: numericStoreId })
            : await addToWishlist({ storeId: numericStoreId });

        if (!result.success) setFavorited(wasLiked);
        setFavoritePending(false);
    }

    const heroImage = store.store_image_url;

    return (
        <div className="bg-white">
            {/* Hero banner */}
            <div className="relative -mt-1.5 h-[155px] w-full overflow-hidden rounded-t-lg">
                {heroImage ? (
                    <Image
                        src={heroImage}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                        sizes="375px"
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(160deg, #1B5E20 0%, #2E7D32 55%, #388E3C 100%)",
                        }}
                    />
                )}

                {!heroImage && (
                    <>
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
                    </>
                )}

                {/* Header actions */}
                <div className="absolute inset-x-0 top-[54px] z-10 flex items-center justify-between px-4">
                    <button type="button" onClick={handleBack} aria-label="رجوع" className={HERO_BTN}>
                        <ArrowRight className="h-6 w-6 text-[#111B18]" strokeWidth={1.5} />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleFavorite}
                            disabled={favoritePending}
                            aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                            className={HERO_BTN}
                        >
                            <Heart
                                className={[
                                    "h-6 w-6",
                                    favorited
                                        ? "fill-[#30913F] text-[#30913F]"
                                        : "fill-none text-[#111B18]",
                                ].join(" ")}
                                strokeWidth={favorited ? 0 : 1.5}
                            />
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenSearch}
                            aria-label="بحث"
                            className={HERO_BTN}
                        >
                            <Search className="h-6 w-6 text-[#111B18]" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Store info row — matches Frame 2085665440 */}
            <div className="relative z-10 -mt-8 px-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Logo + details — visual right */}
                    <div className="flex min-w-0 items-end gap-2">
                        {/* Logo */}
                        <div
                            className="relative h-[80.61px] w-[71.43px] shrink-0 overflow-hidden"
                            style={{
                                background: "#3EC856",
                                border: "4px solid #F6F5F8",
                                borderRadius: "4px",
                                transform: "rotate(-0.15deg)",
                            }}
                        >
                            {store.store_logo_url ? (
                                <Image
                                    src={store.store_logo_url}
                                    alt={store.store_name}
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="72px"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 px-1">
                                    <span className="text-[10px] font-bold leading-none text-white">
                                        {store.store_name.slice(0, 6)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name, cuisine, tags */}
                        <div className="flex min-w-0 flex-col items-end gap-2">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {store.free_delivery && (
                                    <span className={TAG_CLASS}>
                                        توصيل مجاني
                                        <Truck className="h-[11px] w-[18px]" strokeWidth={1} />
                                    </span>
                                )}
                                {store.delivery_time && (
                                    <span className={TAG_CLASS}>
                                        {store.delivery_time}
                                        <Clock className="h-4 w-4" strokeWidth={1} />
                                    </span>
                                )}
                            </div>

                            <h1 className="w-full text-right text-base font-bold leading-snug text-[#111B18]">
                                {store.store_name}
                            </h1>

                            {store.store_description && (
                                <p className="w-full text-right text-base font-bold leading-snug text-[#111B18]">
                                    {store.store_description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Rating badge — visual left */}
                    <div className="shrink-0 pt-[34px]">
                        <span
                            className="flex h-[19px] min-w-[47px] items-center justify-end gap-1 px-1"
                            style={{ background: "#9DFCA3", borderRadius: "0px 8px" }}
                        >
                            <span className="text-xs font-medium leading-none text-[#111B18]">
                                {store.rating > 0 ? store.rating.toFixed(1) : "5.0"}
                            </span>
                            <Star className="h-3 w-3 fill-[#111B18] text-[#111B18]" strokeWidth={0} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Category tabs */}
            {categories.length > 0 && (
                <div className="mt-6 px-4 pb-3">
                    <div
                        className="flex items-center justify-end gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                                        "flex h-[37px] shrink-0 items-center justify-center whitespace-nowrap px-2.5 text-sm font-bold transition-colors",
                                        isActive
                                            ? "bg-[#EBFEEB] text-black"
                                            : "bg-[#F6F5F8] text-black",
                                    ].join(" ")}
                                    style={{ borderRadius: "5px" }}
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
