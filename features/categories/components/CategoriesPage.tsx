"use client";

import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, Search, ShoppingBag } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Product, SubCategory } from "../types/category-details.types";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Exact colors from the spec
// ═══════════════════════════════════════════════════════════════════════════════

const DS = {
    colors: {
        primary: "#30913F",
        primaryLight: "#EBFEEB",
        primaryLightAlt: "#D1FDD2",
        primaryLighter: "#9DFCA3",
        bgPage: "#F6F5F8",
        bgWhite: "#FFFFFF",
        discountBg: "#FFDCDC",
        discountText: "#DB2626",
        strikePrice: "#CD1625",
        bodyText: "#111B18",
        secondaryText: "#707784",
        mutedText: "#555555",
        black: "#000000",
        borderLight: "#E5E5E5",
        chipInactiveBg: "#F6F5F8",
    },
    radius: {
        card: "6px",
        badge: "13.5px",
        chip: "13.5px",
        addBtn: "13px",
        fab: "16px",
    },
    spacing: {
        pageX: "16px",
        cardGap: "8px",
        sectionGap: "12px",
    },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Horizontal Scroll Container
// ═══════════════════════════════════════════════════════════════════════════════

const HScroll = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { gap?: number }
>(({ className = "", gap = 8, children, style, ...props }, ref) => (
    <div
        ref={ref}
        className={[
            "flex overflow-x-auto scroll-smooth snap-x",
            "scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            className,
        ].join(" ")}
        style={{ gap, ...style }}
        {...props}
    >
        {children}
    </div>
));
HScroll.displayName = "HScroll";

// ═══════════════════════════════════════════════════════════════════════════════
// ATOMIC COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Discount Badge: "-6%" style — red pill top-left */
const DiscountBadge = memo(function DiscountBadge({ pct }: { pct: number }) {
    return (
        <span
            className="absolute start-1.5 top-1.5 z-10 px-1.5 py-0.5 text-[10px] font-bold leading-none"
            style={{
                backgroundColor: DS.colors.discountBg,
                color: DS.colors.discountText,
                borderRadius: "4px",
            }}
        >
            -{pct}%
        </span>
    );
});

/** Offer Ribbon: angular clip style for "اشتر 2+1 مجانا" */
const OfferRibbon = memo(function OfferRibbon({ label }: { label: string }) {
    const isBulkDiscount = label.includes("خصم");
    return (
        <div className="absolute start-0 top-0 z-10 overflow-hidden">
            <span
                className="block px-2 py-0.5 text-[9px] font-bold leading-none"
                style={{
                    backgroundColor: isBulkDiscount ? "#E8F5E9" : DS.colors.discountBg,
                    color: isBulkDiscount ? DS.colors.primary : DS.colors.discountText,
                    borderTopLeftRadius: DS.radius.card,
                    borderBottomRightRadius: "6px",
                    clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
                    minWidth: "60px",
                }}
            >
                {label}
            </span>
        </div>
    );
});

/** Add to Cart Button — 26×26px green circle, bottom-left */
const AddButton = memo(function AddButton({
    onClick,
    quantity,
}: {
    onClick?: (e: React.MouseEvent) => void;
    quantity?: number;
}) {
    if (quantity && quantity > 0) {
        return (
            <div
                className="absolute bottom-1.5 start-1.5 z-10 flex h-[26px] items-center gap-1.5 rounded-full px-2"
                style={{ backgroundColor: DS.colors.primary }}
            >
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="flex h-4 w-4 items-center justify-center text-white"
                >
                    <Minus className="h-3 w-3" strokeWidth={2.5} />
                </button>
                <span className="text-[11px] font-bold text-white">{quantity}</span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="flex h-4 w-4 items-center justify-center text-white"
                >
                    <Plus className="h-3 w-3" strokeWidth={2.5} />
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="إضافة إلى السلة"
            className="absolute bottom-1.5 start-1.5 z-10 flex h-[26px] w-[26px] items-center justify-center transition-transform duration-150 active:scale-90"
            style={{
                backgroundColor: DS.colors.primaryLightAlt,
                borderRadius: DS.radius.addBtn,
            }}
        >
            <Plus
                className="h-3.5 w-3.5"
                strokeWidth={2}
                style={{ color: DS.colors.primary }}
            />
        </button>
    );
});

/** Section Title — white bar, bold black text, right-aligned */
const SectionTitle = memo(function SectionTitle({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="px-4 py-3 sm:px-5"
            style={{ backgroundColor: DS.colors.bgWhite }}
        >
            <h2
                className="text-right text-base font-bold leading-tight"
                style={{ color: DS.colors.bodyText }}
            >
                {children}
            </h2>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD — Exact spec: 104×130px, white, 6px radius, light shadow
// ═══════════════════════════════════════════════════════════════════════════════

interface ProductCardProps {
    product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
    const [imgErr, setImgErr] = useState(false);

    const hasDiscount = useMemo(
        () =>
            product.discounted_price != null &&
            product.discounted_price < product.price,
        [product.discounted_price, product.price]
    );

    const displayPrice = hasDiscount ? product.discounted_price! : product.price;
    const offerLabel = (product as any).offer_label as string | undefined;
    const quantity = (product as any).quantity as number | undefined;

    const handleAddClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    return (
        <Link
            href={`/items/${product.id}`}
            className="group relative flex flex-col overflow-hidden active:scale-[0.97]"
            style={{
                backgroundColor: DS.colors.bgWhite,
                borderRadius: DS.radius.card,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
            dir="rtl"
        >
            {/* ── Image Area ── */}
            <div
                className="relative mx-auto mt-2 flex items-center justify-center"
                style={{ width: 66, height: 66 }}
            >
                {hasDiscount && (
                    <DiscountBadge pct={product.discount_percentage!} />
                )}

                {offerLabel && <OfferRibbon label={offerLabel} />}

                <AddButton onClick={handleAddClick} quantity={quantity} />

                {!imgErr && product.full_image_url ? (
                    <Image
                        src={product.full_image_url}
                        alt={product.name}
                        width={66}
                        height={66}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <ShoppingBag
                        className="h-8 w-8 opacity-15"
                        style={{ color: DS.colors.secondaryText }}
                    />
                )}
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 flex-col justify-between px-2 pb-2 pt-1">
                <p
                    className="line-clamp-2 text-right text-[10px] font-medium leading-[1.3]"
                    style={{ color: DS.colors.bodyText, minHeight: "2.6em" }}
                >
                    {product.name}
                </p>

                <div className="mt-1 flex flex-col items-end gap-0">
                    {/* Strikethrough original price */}
                    {hasDiscount && (
                        <span
                            className="text-[9px] line-through"
                            style={{ color: DS.colors.strikePrice }}
                        >
                            {product.price.toFixed(2)} ر
                        </span>
                    )}

                    {/* Current price */}
                    <span
                        className="text-[13px] font-bold"
                        style={{ color: DS.colors.black }}
                    >
                        {displayPrice.toFixed(2)}{" "}
                        <span className="text-[10px] font-normal">﷼</span>
                    </span>
                </div>
            </div>
        </Link>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT GRID — 3 columns, 8px gap, 16px page padding
// ═══════════════════════════════════════════════════════════════════════════════

interface ProductGridProps {
    products: Product[];
}

const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
    return (
        <div
            className="grid grid-cols-3 px-4 sm:grid-cols-4 sm:px-5 md:grid-cols-5"
            style={{ gap: DS.spacing.cardGap }}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-CATEGORY SECTION
// ═══════════════════════════════════════════════════════════════════════════════

interface SubCategorySectionProps {
    subCategory: SubCategory;
    sectionRef?: (el: HTMLElement | null) => void;
    onLoadMore: () => void;
}

const SubCategorySection = memo(function SubCategorySection({
    subCategory,
    sectionRef,
    onLoadMore,
}: SubCategorySectionProps) {
    return (
        <section
            ref={sectionRef}
            data-subcategory-id={subCategory.id}
            className="pb-3"
            style={{ backgroundColor: DS.colors.bgPage }}
        >
            <SectionTitle>{subCategory.name}</SectionTitle>

            <div className="px-4 pt-2 sm:px-5">
                <ProductGrid products={subCategory.products} />
            </div>

            {subCategory.has_more && (
                <div className="flex justify-center pb-2 pt-3">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={subCategory.isLoadingMore}
                        className="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 active:opacity-70 disabled:opacity-50"
                        style={{
                            border: `1px solid ${DS.colors.primary}`,
                            color: DS.colors.primary,
                            backgroundColor: DS.colors.bgWhite,
                        }}
                    >
                        {subCategory.isLoadingMore ? (
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                                style={{ borderColor: DS.colors.primary, borderTopColor: "transparent" }}
                            />
                        ) : (
                            "عرض المزيد"
                        )}
                    </button>
                </div>
            )}
        </section>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY TABS (Top Level — Sticky)
// Text-only with green underline indicator, NOT pill shape
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryTab {
    id: string | number;
    name: string;
    is_discount_category: boolean;
}

interface CategoryTabsProps {
    tabs: CategoryTab[];
    activeId: string | number | null;
    onSelect: (id: string | number) => void;
}

const CategoryTabs = memo(function CategoryTabs({
    tabs,
    activeId,
    onSelect,
}: CategoryTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current || activeId == null) return;
        const activeEl = scrollRef.current.querySelector<HTMLButtonElement>(
            `[data-tab-id="${activeId}"]`
        );
        activeEl?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [activeId]);

    return (
        <div
            ref={scrollRef}
            className="sticky top-0 z-30 border-b px-4 py-2.5 sm:px-5"
            style={{
                backgroundColor: DS.colors.primary,
                borderColor: "rgba(255,255,255,0.15)",
            }}
            dir="rtl"
        >
            <HScroll gap={16} className="items-center">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeId;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            data-tab-id={tab.id}
                            onClick={() => onSelect(tab.id)}
                            className="relative shrink-0 snap-start pb-2 pt-1 text-sm font-semibold transition-colors duration-200"
                            style={{
                                color: isActive ? DS.colors.bgWhite : "rgba(255,255,255,0.75)",
                            }}
                        >
                            {tab.name}
                            {isActive && (
                                <span
                                    className="absolute bottom-0 start-0 end-0 h-[3px] rounded-full"
                                    style={{ backgroundColor: DS.colors.primaryLighter }}
                                />
                            )}
                        </button>
                    );
                })}
            </HScroll>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FILTER CHIPS (Inside green header — pill shape)
// Active: #EBFEEB bg, #30913F text | Inactive: #F6F5F8 bg, #555555 text
// ═══════════════════════════════════════════════════════════════════════════════

interface FilterChip {
    id: string | number;
    label: string;
}

interface FilterChipsProps {
    chips: FilterChip[];
    activeId: string | number | null;
    onSelect: (id: string | number) => void;
}

const FilterChips = memo(function FilterChips({
    chips,
    activeId,
    onSelect,
}: FilterChipsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current || activeId == null) return;
        const el = scrollRef.current.querySelector<HTMLButtonElement>(
            `[data-chip-id="${activeId}"]`
        );
        el?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [activeId]);

    return (
        <div
            ref={scrollRef}
            className=" px-4 pb-3 pt-2 sm:px-5"
            style={{ backgroundColor: DS.colors.bgWhite }}
            dir="rtl"
        >
            <HScroll gap={8}>
                {chips.map((chip) => {
                    const isActive = chip.id === activeId;
                    return (
                        <button
                            key={chip.id}
                            type="button"
                            data-chip-id={chip.id}
                            onClick={() => onSelect(chip.id)}
                            className="shrink-0 snap-start whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: isActive
                                    ? DS.colors.primaryLight
                                    : DS.colors.chipInactiveBg,
                                color: isActive ? DS.colors.primary : DS.colors.mutedText,
                                borderRadius: DS.radius.chip,
                                height: 27,
                            }}
                        >
                            {chip.label}
                        </button>
                    );
                })}
            </HScroll>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-CATEGORY TABS (Chips — Sticky below header)
// Active: #E8F8EC bg + green text | Inactive: #F3F3F3 bg + #666 text
// ═══════════════════════════════════════════════════════════════════════════════

interface SubCategoryTabsProps {
    subCategories: SubCategory[];
    activeSubId: number | null;
    onSelect: (id: number) => void;
}

const SubCategoryTabs = memo(function SubCategoryTabs({
    subCategories,
    activeSubId,
    onSelect,
}: SubCategoryTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current || activeSubId == null) return;
        const el = scrollRef.current.querySelector<HTMLButtonElement>(
            `[data-sub-tab-id="${activeSubId}"]`
        );
        el?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [activeSubId]);

    return (
        <div
            ref={scrollRef}
            className="sticky z-20 border-b border-gray-100 px-4 py-1 sm:px-5"
            style={{
                backgroundColor: DS.colors.bgWhite,
                top: "52px", // Height of header + category tabs
            }}
            dir="rtl"
        >
            <HScroll gap={8}>
                {subCategories.map((sc) => {
                    const isActive = sc.id === activeSubId;
                    return (
                        <button
                            key={sc.id}
                            type="button"
                            data-sub-tab-id={sc.id}
                            onClick={() => onSelect(sc.id)}
                            className="shrink-0 snap-start whitespace-nowrap px-4 py-2 text-xs font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: isActive
                                    ? DS.colors.primaryLight
                                    : DS.colors.chipInactiveBg,
                                color: isActive ? DS.colors.primary : DS.colors.secondaryText,
                                borderRadius: DS.radius.chip,
                            }}
                        >
                            {sc.name}
                        </button>
                    );
                })}
            </HScroll>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

const SkeletonPulse = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

const CategoriesPageSkeleton = memo(function CategoriesPageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="px-4 pb-3 pt-4" style={{ backgroundColor: DS.colors.primary }}>
                <div className="mx-auto h-5 w-32 rounded bg-white/20" />
            </div>
            {/* Category tabs skeleton */}
            <div className="flex gap-4 px-4 py-2.5" style={{ backgroundColor: DS.colors.primary }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonPulse key={i} className="h-6 w-20 shrink-0 rounded-lg bg-white/20" />
                ))}
            </div>
            {/* Filter chips skeleton */}
            <div className="flex gap-2 px-4 pb-3 pt-2" style={{ backgroundColor: DS.colors.primary }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonPulse key={i} className="h-[27px] w-24 shrink-0 rounded-full bg-white/15" />
                ))}
            </div>
            {/* Section skeletons */}
            {Array.from({ length: 2 }).map((_, s) => (
                <div key={s} className="pb-3" style={{ backgroundColor: DS.colors.bgPage }}>
                    <div className="px-4 py-3" style={{ backgroundColor: DS.colors.bgWhite }}>
                        <SkeletonPulse className="h-5 w-40" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-4 pt-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <SkeletonPulse
                                    className="w-full rounded-md"
                                // style={{ aspectRatio: "104/130" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING BOTTOM BAR — Centered green pill, cart + search
// ═══════════════════════════════════════════════════════════════════════════════

const FloatingBottomBar = memo(function FloatingBottomBar() {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-5 pt-12 sm:bottom-2 sm:pt-0">
            <div
                className="pointer-events-auto flex items-center justify-between rounded-2xl px-4 py-3"
                style={{
                    backgroundColor: DS.colors.primary,
                    boxShadow: "0 8px 32px rgba(48,145,63,0.35)",
                    borderRadius: DS.radius.fab,
                }}
            >
                <button
                    type="button"
                    className="text-white transition-transform duration-150 active:scale-90"
                    aria-label="سلة التسوق"
                >
                    <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                </button>
                <div
                    className="h-5 w-px opacity-25"
                    style={{ backgroundColor: "white" }}
                />
                <button
                    type="button"
                    className="text-white transition-transform duration-150 active:scale-90"
                    aria-label="بحث"
                >
                    <Search className="h-5 w-5" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE HEADER — Green bg, white text, back arrow, title with arrow icon
// ═══════════════════════════════════════════════════════════════════════════════

interface PageHeaderProps {
    title: string;
    onBack: () => void;
}

const PageHeader = memo(function PageHeader({ title, onBack }: PageHeaderProps) {
    return (
        <header
            className="flex items-center gap-3 px-4 pb-2 pt-3 sm:px-5"
            style={{ backgroundColor: DS.colors.primary }}
        >
            <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-150 active:scale-90"
                aria-label="رجوع"
            >
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden">
                <h1 className="truncate text-sm font-bold text-white sm:text-base">
                    {title}
                </h1>
                <ArrowRight
                    className="h-4 w-4 shrink-0 rotate-180 text-white/80"
                    strokeWidth={2}
                />
            </div>

            <div className="h-9 w-9 shrink-0" aria-hidden />
        </header>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryContentProps {
    subCategories: SubCategory[];
    activeSubId: number | null;
    onSubCategoryRef: (id: number, el: HTMLElement | null) => void;
    onLoadMore: (subCategoryId: number) => void;
    onSubCategorySelect: (id: number) => void;
}

const CategoryContent = memo(function CategoryContent({
    subCategories,
    activeSubId,
    onSubCategoryRef,
    onLoadMore,
    onSubCategorySelect,
}: CategoryContentProps) {
    return (
        <div>
            {subCategories.length > 1 && (
                <SubCategoryTabs
                    subCategories={subCategories}
                    activeSubId={activeSubId}
                    onSelect={onSubCategorySelect}
                />
            )}

            <div className="pb-8" style={{ backgroundColor: DS.colors.bgPage }}>
                {subCategories.map((sc) => (
                    <SubCategorySection
                        key={sc.id}
                        subCategory={sc}
                        sectionRef={(el) => onSubCategoryRef(sc.id, el)}
                        onLoadMore={() => onLoadMore(sc.id)}
                    />
                ))}
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoriesPageProps {
    storeId: string;
    initialCategoryId?: string | null;
}

export default function CategoriesPage({
    storeId,
    initialCategoryId,
}: CategoriesPageProps) {
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

    // ── Scroll spy state ──
    const [activeSubId, setActiveSubId] = useState<number | null>(null);
    const [activeFilterId, setActiveFilterId] = useState<string | number>("all");
    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const isScrollingProgrammatically = useRef(false);

    // Mock filter chips — map from subCategories or use defaults
    const filterChips = useMemo<FilterChip[]>(() => {
        if (!activeDetail?.sub_categories) return [];
        return [
            { id: "all", label: "الكل" },
            ...activeDetail.sub_categories.map((sc) => ({
                id: sc.id,
                label: sc.name,
            })),
        ];
    }, [activeDetail]);

    // ── Initialize activeSubId when detail loads ──
    useEffect(() => {
        if (activeDetail?.sub_categories.length) {
            setActiveSubId(activeDetail.sub_categories[0].id);
            setActiveFilterId(activeDetail.sub_categories[0].id);
        }
    }, [activeDetail]);

    // ── IntersectionObserver for scroll spy ──
    useEffect(() => {
        if (!activeDetail) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrollingProgrammatically.current) return;

                let bestEntry: IntersectionObserverEntry | null = null;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        if (
                            !bestEntry ||
                            entry.intersectionRatio > bestEntry.intersectionRatio
                        ) {
                            bestEntry = entry;
                        }
                    }
                }

                if (bestEntry) {
                    const id = Number(
                        (bestEntry.target as HTMLElement).dataset.subcategoryId
                    );
                    setActiveSubId(id);
                    setActiveFilterId(id);
                }
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: "-120px 0px -40% 0px",
            }
        );

        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [activeDetail]);

    // ── Handlers ──
    const handleCategorySelect = useCallback(
        (id: string | number) => {
            setActiveCategoryId(id);
            setActiveSubId(null);
            setActiveFilterId("all");
            sectionRefs.current.clear();
        },
        [setActiveCategoryId]
    );

    const handleFilterSelect = useCallback((id: string | number) => {
        setActiveFilterId(id);
        if (id !== "all") {
            const numId = Number(id);
            setActiveSubId(numId);
            // Scroll to section
            const el = sectionRefs.current.get(numId);
            if (el) {
                isScrollingProgrammatically.current = true;
                const offset = 140;
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
                setTimeout(() => {
                    isScrollingProgrammatically.current = false;
                }, 700);
            }
        }
    }, []);

    const handleSubCategoryRef = useCallback(
        (id: number, el: HTMLElement | null) => {
            if (el) sectionRefs.current.set(id, el);
            else sectionRefs.current.delete(id);
        },
        []
    );

    const scrollToSubCategory = useCallback((id: number) => {
        const el = sectionRefs.current.get(id);
        if (!el) return;

        isScrollingProgrammatically.current = true;
        setActiveSubId(id);
        setActiveFilterId(id);

        const offset = 140;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: "smooth" });

        setTimeout(() => {
            isScrollingProgrammatically.current = false;
        }, 700);
    }, []);

    const handleLoadMore = useCallback(
        (subCategoryId: number) => {
            loadMoreProducts(subCategoryId);
        },
        [loadMoreProducts]
    );

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    // ── Derived state ──
    const hasError = tabsError || detailError;
    const pageTitle = activeDetail?.category_name ?? "أفضل العروض";

    return (
        <div
            className="relative min-h-screen pb-24"
            style={{ backgroundColor: DS.colors.bgPage }}
            dir="rtl"
        >
            {/* ── Header ── */}
            {/* <PageHeader title={pageTitle} onBack={handleBack} /> */}

            {/* ── Category Tabs (text with underline) ── */}
            {!isLoadingTabs && !hasError && (
                <CategoryTabs
                    tabs={tabs}
                    activeId={activeCategoryId}
                    onSelect={handleCategorySelect}
                />
            )}

            {/* ── Filter Chips (pills inside green header) ── */}
            {/* {!isLoadingTabs && !hasError && filterChips.length > 0 && (
                <FilterChips
                    chips={filterChips}
                    activeId={activeFilterId}
                    onSelect={handleFilterSelect}
                />
            )} */}

            {/* ── Content ── */}
            {isLoadingTabs || isLoadingDetail ? (
                <CategoriesPageSkeleton />
            ) : hasError ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
                    <ShoppingBag
                        className="h-12 w-12 opacity-20"
                        style={{ color: DS.colors.secondaryText }}
                    />
                    <p className="text-sm" style={{ color: DS.colors.secondaryText }}>
                        {hasError}
                    </p>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="text-sm font-semibold underline"
                        style={{ color: DS.colors.primary }}
                    >
                        العودة
                    </button>
                </div>
            ) : activeDetail ? (
                <CategoryContent
                    subCategories={activeDetail.sub_categories}
                    activeSubId={activeSubId}
                    onSubCategoryRef={handleSubCategoryRef}
                    onLoadMore={handleLoadMore}
                    onSubCategorySelect={scrollToSubCategory}
                />
            ) : null}

            {/* ── Floating Bottom Bar ── */}
            <FloatingBottomBar />
        </div>
    );
}