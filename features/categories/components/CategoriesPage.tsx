"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, ShoppingBag } from "lucide-react";
import {
    useCategories,
} from "@/features/categories/hooks/useCategories";
import { Product, SubCategory } from "../types/category-details.types";

// ─── Shared style tokens ──────────────────────────────────────────────────────

const PAGE_BG = "min-h-screen bg-[#F5F5F5]";

const H_SCROLL_TRACK = [
    "flex gap-2 overflow-x-auto",
    "snap-x scroll-smooth",
    "scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
].join(" ");

// ─── Discount badge ───────────────────────────────────────────────────────────

function DiscountBadge({ pct }: { pct: number }) {
    return (
        <span className="absolute start-1.5 top-1.5 z-10 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
            -{pct}%
        </span>
    );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
    const [imgErr, setImgErr] = useState(false);
    const hasDiscount =
        product.discounted_price != null && product.discounted_price < product.price;
    const displayPrice = hasDiscount ? product.discounted_price! : product.price;

    return (
        <Link
            href={`/items/${product.id}`}
            className="relative flex w-[calc((100%-1rem)/3)] max-w-[7.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-transform duration-150 active:scale-[0.97]"
            dir="rtl"
        >
            {/* Image area */}
            <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-[#F7F9F7]">
                {hasDiscount && <DiscountBadge pct={product.discount_percentage!} />}

                {/* Add button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="إضافة"
                    className="absolute bottom-1.5 end-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#45C553] shadow transition-transform active:scale-90"
                >
                    <Plus className="h-3 w-3 text-white" strokeWidth={3} />
                </button>

                {!imgErr && product.full_image_url ? (
                    <Image
                        src={product.full_image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        sizes="120px"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center opacity-20">
                        <ShoppingBag className="h-7 w-7 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col gap-0.5 px-2 pb-2.5 pt-1.5">
                <p className="line-clamp-2 min-h-[2.4em] text-right text-[10px] font-medium leading-[1.2] text-gray-800">
                    {product.name}
                </p>

                {/* Strikethrough original price */}
                <p
                    className={`h-[11px] text-[9px] leading-none text-gray-400 ${hasDiscount ? "line-through" : "invisible"}`}
                    aria-hidden={!hasDiscount}
                >
                    {hasDiscount ? `${product.price.toFixed(2)} ﷼` : "0.00 ﷼"}
                </p>

                <span className="text-[10px] font-bold text-[#2F8F3B]">
                    {displayPrice.toFixed(2)}{" "}
                    <span className="text-[9px] font-semibold">﷼</span>
                </span>
            </div>
        </Link>
    );
}

// ─── Sub-category section ─────────────────────────────────────────────────────

function SubCategorySection({
    subCategory,
    sectionRef,
    onLoadMore,
}: {
    subCategory: SubCategory;
    sectionRef?: (el: HTMLElement | null) => void;
    onLoadMore: () => void;
}) {
    return (
        <section ref={sectionRef} data-subcategory-id={subCategory.id} className="mb-2">
            <h2 className="px-4 pb-2 pt-4 text-sm font-bold text-gray-900 sm:px-5">
                {subCategory.name}
            </h2>

            <div className={`${H_SCROLL_TRACK} px-4 pb-3 sm:px-5`} dir="ltr">
                {subCategory.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {subCategory.has_more && (
                <div className="flex justify-center pb-2">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={subCategory.isLoadingMore}
                        className="flex items-center gap-1.5 rounded-full border border-[#45C553] px-4 py-1.5 text-xs font-semibold text-[#2F8F3B] transition-opacity active:opacity-70 disabled:opacity-50"
                    >
                        {subCategory.isLoadingMore ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2F8F3B] border-t-transparent" />
                        ) : (
                            "عرض المزيد"
                        )}
                    </button>
                </div>
            )}
        </section>
    );
}

// ─── Top category tab bar ─────────────────────────────────────────────────────

function CategoryTabBar({
    tabs,
    activeId,
    onSelect,
}: {
    tabs: { id: string | number; name: string; is_discount_category: boolean }[];
    activeId: string | number | null;
    onSelect: (id: string | number) => void;
}) {
    const tabRef = useRef<HTMLDivElement>(null);

    // Scroll the active tab into view when it changes
    useEffect(() => {
        if (!tabRef.current || activeId == null) return;
        const active = tabRef.current.querySelector<HTMLButtonElement>(
            `[data-tab-id="${activeId}"]`,
        );
        active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeId]);

    return (
        <div
            ref={tabRef}
            className={`${H_SCROLL_TRACK} bg-white px-4 py-2.5 shadow-sm sm:px-5`}
            dir="rtl"
        >
            {tabs.map((tab) => {
                const isActive = tab.id === activeId;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        data-tab-id={tab.id}
                        onClick={() => onSelect(tab.id)}
                        className={[
                            "shrink-0 snap-start rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap",
                            isActive
                                ? "bg-[#45C553] text-white"
                                : "bg-[#F0F0F0] text-gray-600 hover:bg-[#E0F5E1] hover:text-[#2F8F3B]",
                        ].join(" ")}
                    >
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Sub-category sticky tab bar ─────────────────────────────────────────────

function SubCategoryTabBar({
    subCategories,
    activeSubId,
    onSelect,
}: {
    subCategories: SubCategory[];
    activeSubId: number | null;
    onSelect: (id: number) => void;
}) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!barRef.current || activeSubId == null) return;
        const el = barRef.current.querySelector<HTMLButtonElement>(
            `[data-sub-tab-id="${activeSubId}"]`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeSubId]);

    return (
        <div
            ref={barRef}
            className={`${H_SCROLL_TRACK} sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-2 sm:px-5`}
            dir="rtl"
        >
            {subCategories.map((sc) => {
                const isActive = sc.id === activeSubId;
                return (
                    <button
                        key={sc.id}
                        type="button"
                        data-sub-tab-id={sc.id}
                        onClick={() => onSelect(sc.id)}
                        className={[
                            "shrink-0 snap-start whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold transition-colors duration-150",
                            isActive
                                ? "bg-[#2F8F3B] text-white"
                                : "text-gray-500 hover:text-[#2F8F3B]",
                        ].join(" ")}
                    >
                        {sc.name}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CategoriesPageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Tab bar */}
            <div className="flex gap-2 bg-white px-4 py-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-20 shrink-0 rounded-full bg-gray-200" />
                ))}
            </div>
            {/* Sub-category tabs */}
            <div className="flex gap-2 bg-white px-4 py-2 shadow-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-6 w-16 shrink-0 rounded-full bg-gray-100" />
                ))}
            </div>
            {/* Product rows */}
            {Array.from({ length: 2 }).map((_, s) => (
                <div key={s} className="mb-2 bg-white">
                    <div className="mx-4 my-3 h-4 w-24 rounded bg-gray-200" />
                    <div className="flex gap-2 px-4 pb-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-36 w-28 shrink-0 rounded-xl bg-gray-100" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface CategoriesPageProps {
    storeId: string;
    initialCategoryId?: string | null;
}

export default function CategoriesPage({ storeId, initialCategoryId }: CategoriesPageProps) {
    const router = useRouter();

    const {
        tabs,
        isLoadingTabs,
        tabsError,
        activeCategoryId,
        setActiveCategoryId,
        activeDetail,
        isLoadingDetail,
        detailError,
        loadMoreProducts,
    } = useCategories(storeId, initialCategoryId);

    // Track which sub-category is currently visible (for sticky sub-tab highlight)
    const [activeSubId, setActiveSubId] = useState<number | null>(null);
    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isScrollingProgrammatically = useRef(false);

    // Initialise activeSubId when detail loads
    useEffect(() => {
        if (activeDetail?.sub_categories.length) {
            setActiveSubId(activeDetail.sub_categories[0].id);
        }
    }, [activeDetail]);

    // IntersectionObserver: update active sub-tab as user scrolls
    useEffect(() => {
        if (!activeDetail) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrollingProgrammatically.current) return;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const id = Number((entry.target as HTMLElement).dataset.subcategoryId);
                        setActiveSubId(id);
                        break;
                    }
                }
            },
            { threshold: 0.3 },
        );

        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [activeDetail]);

    // Scroll to a sub-category section programmatically
    const scrollToSubCategory = (id: number) => {
        const el = sectionRefs.current.get(id);
        if (!el) return;
        isScrollingProgrammatically.current = true;
        setActiveSubId(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
            isScrollingProgrammatically.current = false;
        }, 600);
    };

    // ── Render ───────────────────────────────────────────────────────────────

    const hasError = tabsError || detailError;

    return (
        <div className={PAGE_BG} dir="rtl">
            {/* ── Page header ── */}
            <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-4 sm:px-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] transition-transform active:scale-90"
                    aria-label="رجوع"
                >
                    <ArrowRight className="h-4 w-4 text-gray-700" strokeWidth={2} />
                </button>
                <h1 className="flex-1 text-center text-sm font-bold text-gray-900">
                    {activeDetail?.category_name ?? "الفئات"}
                </h1>
                {/* Spacer to keep title centred */}
                <div className="h-9 w-9" aria-hidden />
            </header>

            {/* ── Category tabs ── */}
            {!isLoadingTabs && !hasError && (
                <CategoryTabBar
                    tabs={tabs}
                    activeId={activeCategoryId}
                    onSelect={(id) => {
                        setActiveCategoryId(id);
                        setActiveSubId(null);
                        sectionRefs.current.clear();
                    }}
                />
            )}

            {/* ── Content area ── */}
            {isLoadingTabs || isLoadingDetail ? (
                <CategoriesPageSkeleton />
            ) : hasError ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
                    <p className="text-sm text-gray-500">{hasError}</p>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-sm font-semibold text-[#2F8F3B] underline"
                    >
                        العودة
                    </button>
                </div>
            ) : activeDetail ? (
                <div ref={scrollContainerRef}>
                    {/* ── Sub-category sticky tabs ── */}
                    {activeDetail.sub_categories.length > 1 && (
                        <SubCategoryTabBar
                            subCategories={activeDetail.sub_categories}
                            activeSubId={activeSubId}
                            onSelect={scrollToSubCategory}
                        />
                    )}

                    {/* ── Sub-category sections ── */}
                    <div className="bg-white pb-8">
                        {activeDetail.sub_categories.map((sc) => (
                            <SubCategorySection
                                key={sc.id}
                                subCategory={sc}
                                sectionRef={(el) => {
                                    if (el) sectionRefs.current.set(sc.id, el);
                                    else sectionRefs.current.delete(sc.id);
                                }}
                                onLoadMore={() => loadMoreProducts(sc.id)}
                            />
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}