"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Heart, Search, Star, Truck, Plus } from "lucide-react";
import { useStoreDetails } from "@/features/store/hooks/useStoreDetails";
import {
    Product,
    DiscountedProduct,
    FeaturedStoreDiscounted,
    FeaturedStoreProducts,
    StoreDetails,
} from "@/features/store/types/store-details.types";
import { StoreCategory } from "../types/store-categories.types";

// ─── Style tokens ─────────────────────────────────────────────────────────────

const PAGE_SHELL = "mx-auto w-full max-w-5xl";

const H_SCROLL_TRACK = [
    "flex gap-2 overflow-x-auto pb-1 sm:gap-2.5",
    "snap-x snap-mandatory scroll-smooth",
    "scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
].join(" ");

const CATEGORY_SCROLL_ITEM =
    "w-[calc((100%-1.5rem)/4)] max-w-[5.625rem] shrink-0 snap-start sm:max-w-[6.25rem] md:max-w-[7rem]";

const PRODUCT_SCROLL_ITEM =
    "flex w-[calc((100%-1.5rem)/3.25)] max-w-[6.5rem] shrink-0 snap-start self-stretch sm:w-[calc((100%-1.875rem)/3.25)] sm:max-w-[8rem] md:max-w-[9.5rem] lg:max-w-[10rem]";

const OVERLAP_LOGO_BOX =
    "h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl shadow-lg ring-2 ring-white/80 sm:h-20 sm:w-20";

// ─── Atoms ────────────────────────────────────────────────────────────────────

/** Store logo badge — overlaps its parent container */
function StoreLogo({
    logoUrl,
    logoBg,
    placement = "top",
    onError,
    imageError = false,
}: {
    logoUrl: string;
    logoBg: string;
    placement?: "top" | "bottom";
    onError?: () => void;
    imageError?: boolean;
}) {
    const posClass =
        placement === "bottom"
            ? "absolute -bottom-6 start-4 z-20 sm:-bottom-7 sm:start-5"
            : "absolute -top-6 start-4 z-20 sm:-top-7 sm:end-5";

    return (
        <div className={`${posClass} ${OVERLAP_LOGO_BOX}`} style={{ backgroundColor: logoBg }}>
            {!imageError && logoUrl ? (
                <Image
                    src={logoUrl}
                    alt="شعار المتجر"
                    fill
                    className="object-contain p-1.5 sm:p-2"
                    sizes="(max-width: 640px) 72px, 80px"
                    onError={onError}
                />
            ) : (
                <div className="flex h-full items-center justify-center bg-[#45C553] opacity-90">
                    <span className="text-xl sm:text-2xl" aria-hidden>🏪</span>
                </div>
            )}
        </div>
    );
}

// ─── Store Hero Banner ────────────────────────────────────────────────────────

interface StoreHeroProps {
    store: StoreDetails;
    variant?: "page" | "overlay";
    searchHref?: string;
    onBack: () => void;
    heroImageError: boolean;
    onHeroImageError: () => void;
    logoImageError: boolean;
    onLogoImageError: () => void;
}

function StoreHero({
    store,
    variant = "page",
    searchHref,
    onBack,
    heroImageError,
    onHeroImageError,
    logoImageError,
    onLogoImageError,
}: StoreHeroProps) {
    const showRating = store.rating > 0;

    return (
        <>
            {/* Banner */}
            <div className="relative aspect-[16/10] w-full bg-gray-100 sm:aspect-[16/9]">
                {!heroImageError && store.store_image_url ? (
                    <Image
                        src={store.store_image_url}
                        alt=""
                        fill
                        priority={variant === "page"}
                        className="object-cover"
                        sizes="100vw"
                        onError={onHeroImageError}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />

                {/* Overlapping logo */}
                <StoreLogo
                    logoUrl={store.store_logo_url}
                    logoBg="#ffffff"
                    placement="bottom"
                    imageError={logoImageError}
                    onError={onLogoImageError}
                />

                {/* Top action bar */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
                    {variant === "page" && searchHref ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href={searchHref}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                                aria-label="بحث"
                            >
                                <Search
                                    className="h-4 w-4 text-gray-800 sm:h-[18px] sm:w-[18px]"
                                    strokeWidth={2}
                                />
                            </Link>
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                                aria-label="إضافة إلى المفضلة"
                            >
                                <Heart
                                    className="h-4 w-4 text-gray-800 sm:h-[18px] sm:w-[18px]"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    ) : (
                        <div />
                    )}
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                        aria-label="رجوع"
                    >
                        <ArrowRight className="h-5 w-5 text-gray-800" strokeWidth={2} />
                    </button>
                </div>

                {/* Delivery badges */}
                <div className="absolute inset-x-0 bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 px-4 sm:bottom-5">
                    {store.delivery_time && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-700" strokeWidth={2} />
                            {store.delivery_time}
                        </span>
                    )}
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-sm">
                            <Truck className="h-3.5 w-3.5 text-[#45C553]" strokeWidth={2} />
                            توصيل مجاني
                        </span>
                    )}
                </div>
            </div>

            {/* Store info row */}
            <div className="bg-white px-4 pb-4 pt-10 sm:px-6 sm:pb-5 sm:pt-12">
                <div className="flex items-start gap-3 pe-[5.5rem] sm:gap-4 sm:pe-24">
                    <div className="min-w-0 flex-1 text-center">
                        <h1 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                            {store.store_name}
                        </h1>
                        {store.store_description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                {store.store_description}
                            </p>
                        )}
                    </div>
                    {showRating && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#DFF5E3] px-2.5 py-1.5 text-xs font-bold text-gray-900">
                            {store.rating.toFixed(1)}
                            <Star
                                className="h-3 w-3 fill-[#45C553] text-[#45C553]"
                                strokeWidth={0}
                            />
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
    productId,
    name,
    imageUrl,
    price,
    originalPrice,
}: {
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
}) {
    const [imageError, setImageError] = useState(false);
    const hasDiscount = originalPrice != null && originalPrice > price;

    return (
        <Link
            href={`/items/${productId}`}
            className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.07)] outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            aria-label={name}
        >
            {/* Image */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl bg-[#F7F9F7]">
                <button
                    type="button"
                    className="absolute bottom-1.5 start-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#45C553] shadow-sm transition-transform active:scale-90 sm:bottom-2 sm:start-2 sm:h-7 sm:w-7"
                    aria-label="إضافة"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Plus className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={3} />
                </button>
                {!imageError && imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-contain p-2 sm:p-2.5"
                        sizes="(max-width: 640px) 26vw, 160px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                        <span className="text-2xl sm:text-3xl" aria-hidden>🛍️</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div
                className="flex min-h-[4.25rem] flex-1 flex-col justify-between gap-1 px-2 pb-2.5 pt-1.5 sm:min-h-[4.5rem] sm:px-2.5 sm:pb-3"
                dir="rtl"
            >
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[10px] font-medium leading-[1.2] text-gray-800 sm:min-h-[2.5em] sm:text-xs">
                    {name}
                </p>
                <div className="flex flex-col gap-0.5">
                    <p
                        className={`h-[11px] text-[9px] leading-none sm:h-3 sm:text-[10px] ${hasDiscount ? "text-gray-400 line-through" : "invisible"}`}
                        aria-hidden={!hasDiscount}
                    >
                        {hasDiscount ? `${originalPrice!.toFixed(2)} ﷼` : "0.00 ﷼"}
                    </p>
                    <div className="flex min-h-[14px] items-center sm:min-h-4">
                        <span className="truncate text-[10px] font-bold text-[#2F8F3B] sm:text-xs">
                            {price.toFixed(2)}{" "}
                            <span className="text-[9px] font-semibold sm:text-[10px]">﷼</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function RegularProductCard({ product }: { product: Product }) {
    return (
        <ProductCard
            productId={product.id}
            name={product.name}
            imageUrl={product.full_image_url}
            price={product.price}
        />
    );
}

function DiscountedProductCard({ product }: { product: DiscountedProduct }) {
    return (
        <ProductCard
            productId={product.id}
            name={product.name}
            imageUrl={product.full_image_url}
            price={product.discounted_price}
            originalPrice={product.original_price}
        />
    );
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
    category,
    storeId,
}: {
    category: StoreCategory;
    storeId: string;
}) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/stores/${storeId}/categories?categoryId=${category.id}`}
            className="relative flex aspect-square w-full shrink-0 flex-col overflow-hidden rounded-2xl bg-[#E8F8E8] outline-none transition-transform duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            aria-label={category.name}
        >
            <h3 className="relative z-10 line-clamp-2 px-2 pt-2 text-center text-[10px] font-bold leading-tight text-[#2F8F3B] sm:text-[11px]">
                {category.name}
            </h3>
            <div className="absolute inset-x-0 bottom-0 h-[62%]">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 640px) 22vw, 112px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-end justify-center pb-2 opacity-25">
                        <span className="text-2xl" aria-hidden>🛒</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

function ShowAllCard({ onClick, loading }: { onClick: () => void; loading: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative flex aspect-square w-full shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#E8F8E8] transition-transform duration-150 active:scale-[0.96]"
        >
            {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2F8F3B] border-t-transparent" />
            ) : (
                <>
                    <span className="px-1 text-center text-[10px] font-bold leading-tight text-[#2F8F3B] sm:text-[11px]">
                        تطلع على المزيد
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F8F3B]">
                        <ArrowRight className="h-3 w-3 rotate-180 text-white" strokeWidth={2.5} />
                    </span>
                </>
            )}
        </button>
    );
}

// ─── Categories section ───────────────────────────────────────────────────────

function CategoriesSection({
    categories,
    storeId,
    onShowAll,
    loadingAll,
}: {
    categories: StoreCategory[];
    storeId: string;
    onShowAll: () => void;
    loadingAll: boolean;
}) {
    const row1 = categories.slice(0, 4);
    const row2 = categories.slice(4, 8);
    const hasMore = categories.length > 8;
    const columnCount = Math.max(row1.length, row2.length + (hasMore ? 1 : 0));

    return (
        <section aria-label="تصنيفات المتجر" className="bg-white px-4 pb-5 pt-1 sm:px-6" dir="rtl">
            <div className={H_SCROLL_TRACK}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div
                        key={row1[index]?.id ?? row2[index]?.id ?? `col-${index}`}
                        className={`${CATEGORY_SCROLL_ITEM} flex flex-col gap-2`}
                    >
                        {row1[index] ? (
                            <CategoryCard category={row1[index]} storeId={storeId} />
                        ) : (
                            <div className="aspect-square w-full shrink-0" aria-hidden />
                        )}
                        {row2[index] ? (
                            <CategoryCard category={row2[index]} storeId={storeId} />
                        ) : hasMore && index === columnCount - 1 ? (
                            <ShowAllCard onClick={onShowAll} loading={loadingAll} />
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── All-categories overlay ───────────────────────────────────────────────────

function AllCategoriesOverlay({
    categories,
    store,
    storeId,
    onClose,
}: {
    categories: StoreCategory[];
    store: StoreDetails;
    storeId: string;
    onClose: () => void;
}) {
    const [heroImageError, setHeroImageError] = useState(false);
    const [logoImageError, setLogoImageError] = useState(false);

    return (
        <motion.div
            key="overlay"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute inset-0 z-30 flex flex-col overflow-hidden bg-[#F5F5F5]"
            dir="rtl"
        >
            <div className="shrink-0">
                <StoreHero
                    store={store}
                    variant="overlay"
                    onBack={onClose}
                    heroImageError={heroImageError}
                    onHeroImageError={() => setHeroImageError(true)}
                    logoImageError={logoImageError}
                    onLogoImageError={() => setLogoImageError(true)}
                />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-6">
                <h2 className="mb-3 text-sm font-bold text-gray-900 sm:text-base">جميع الفئات</h2>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} storeId={storeId} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Featured section shell ───────────────────────────────────────────────────

function FeaturedSection({
    slogan,
    logoUrl,
    logoBg,
    bgColor,
    children,
}: {
    slogan: string;
    logoUrl: string;
    logoBg: string;
    bgColor: string;
    children: ReactNode;
}) {
    return (
        <div className="relative mx-3 mb-4 pt-6 sm:mx-4 sm:mb-5 sm:pt-7">
            {/* Overlapping logo at top */}
            <StoreLogo logoUrl={logoUrl} logoBg={logoBg} placement="top" />

            <section
                className="overflow-hidden rounded-2xl"
                style={{ backgroundColor: bgColor }}
                dir="rtl"
            >
                <div className="px-2 pb-2 pt-3 pe-[5.5rem] text-center sm:px-5 sm:pe-24">
                    <p className="text-sm font-bold leading-snug text-white sm:text-base">
                        {slogan}
                    </p>
                </div>
                <div className={`${H_SCROLL_TRACK} px-4 pb-4 sm:px-5`}>{children}</div>
            </section>
        </div>
    );
}

// ─── Featured discounted products ─────────────────────────────────────────────

function FeaturedDiscountedSection({ data }: { data: FeaturedStoreDiscounted }) {
    return (
        <FeaturedSection
            slogan={data.slogan}
            logoUrl={data.logo_url}
            logoBg="rgba(255,255,255,0.15)"
            bgColor="#1B5E20"
        >
            {data.products.map((product) => (
                <div key={product.id} className={PRODUCT_SCROLL_ITEM} dir="ltr">
                    <DiscountedProductCard product={product} />
                </div>
            ))}
        </FeaturedSection>
    );
}

// ─── Featured regular products ────────────────────────────────────────────────

function FeaturedRegularSection({ data }: { data: FeaturedStoreProducts }) {
    return (
        <FeaturedSection
            slogan={data.slogan}
            logoUrl={data.logo_url}
            logoBg="#ffffff"
            bgColor="#C8102E"
        >
            {data.products.map((product) => (
                <div key={product.id} className={PRODUCT_SCROLL_ITEM} dir="ltr">
                    <RegularProductCard product={product} />
                </div>
            ))}
        </FeaturedSection>
    );
}

// ─── Category products section ────────────────────────────────────────────────

function CategoryProductsSection({
    products,
    title,
}: {
    products: Product[];
    title: string;
}) {
    if (!products.length) return null;
    return (
        <section
            className="pb-5 pt-4 sm:pb-6 sm:pt-5"
            style={{ background: "linear-gradient(to top, #EBFEEB, #30913F)" }}
        >
            <div className="flex items-center justify-between px-4 pb-3 sm:px-6">
                <h2 className="text-sm font-bold text-white sm:text-base">{title}</h2>
            </div>
            <div className={`${H_SCROLL_TRACK} px-4 sm:px-6`} dir="ltr">
                {products.map((p) => (
                    <div key={p.id} className={PRODUCT_SCROLL_ITEM}>
                        <RegularProductCard product={p} />
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StorePageSkeleton() {
    return (
        <div className={`animate-pulse ${PAGE_SHELL}`}>
            <div className="aspect-[16/10] w-full bg-gray-200 sm:aspect-[16/9]" />
            <div className="relative -mt-6 space-y-4 bg-white px-4 pb-5 pt-10 sm:px-6 sm:pt-12">
                <div className="flex items-start gap-3 pe-20 sm:pe-24">
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-2/3 rounded bg-gray-100" />
                        <div className="h-4 w-full rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-14 shrink-0 rounded-lg bg-gray-100" />
                </div>
                <div className={H_SCROLL_TRACK}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`${CATEGORY_SCROLL_ITEM} flex flex-col gap-2`}>
                            <div className="aspect-square rounded-2xl bg-gray-100" />
                            <div className="aspect-square rounded-2xl bg-gray-100" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-3 space-y-3 px-3 sm:px-4">
                <div className="h-44 rounded-2xl bg-gray-200 sm:h-52" />
                <div className="h-44 rounded-2xl bg-gray-200 sm:h-52" />
            </div>
        </div>
    );
}

// ─── Main page component ──────────────────────────────────────────────────────

interface StorePageProps {
    storeId: string;
    moduleId?: string;
}

export default function StorePage({ storeId, moduleId }: StorePageProps) {
    const router = useRouter();
    const { store, isLoading, error, fetchCategoires, categories } = useStoreDetails(storeId);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [heroImageError, setHeroImageError] = useState(false);
    const [storeLogoError, setStoreLogoError] = useState(false);

    if (isLoading) return <StorePageSkeleton />;

    if (error || !store) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
                <p className="text-sm font-medium text-gray-600">
                    {error ?? "تعذّر تحميل بيانات المتجر"}
                </p>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-semibold text-[#2F8F3B] hover:underline"
                >
                    العودة
                </button>
            </div>
        );
    }

    const searchHref = moduleId ? `/search?module_id=${moduleId}` : "/search";

    const handleShowAll = async () => {
        if (!categories) {
            setLoadingCategories(true);
            await fetchCategoires();
            setLoadingCategories(false);
        }
        setShowAllCategories(true);
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F5F5F5]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col pb-8 ${PAGE_SHELL}`}
                dir="rtl"
            >
                {/* Hero */}
                <StoreHero
                    store={store}
                    variant="page"
                    searchHref={searchHref}
                    onBack={() => router.back()}
                    heroImageError={heroImageError}
                    onHeroImageError={() => setHeroImageError(true)}
                    logoImageError={storeLogoError}
                    onLogoImageError={() => setStoreLogoError(true)}
                />

                {/* Categories row */}
                {store.categories.length > 0 && (
                    <CategoriesSection
                        categories={store.categories}
                        storeId={storeId}
                        onShowAll={handleShowAll}
                        loadingAll={loadingCategories}
                    />
                )}

                <div className="h-3" />

                {/* Featured – discounted */}
                {store.featured_store_discounted && (
                    <FeaturedDiscountedSection data={store.featured_store_discounted} />
                )}

                {/* Featured – regular */}
                {store.featured_store_products && (
                    <FeaturedRegularSection data={store.featured_store_products} />
                )}

                {/* Category products */}
                {store.category_products?.products?.length > 0 && (
                    <CategoryProductsSection
                        products={store.category_products.products}
                        title={store.category_products.category_name}
                    />
                )}
            </motion.div>

            {/* All-categories overlay */}
            <AnimatePresence>
                {showAllCategories && (
                    <AllCategoriesOverlay
                        categories={categories ?? store.categories}
                        store={store}
                        storeId={storeId}
                        onClose={() => setShowAllCategories(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}