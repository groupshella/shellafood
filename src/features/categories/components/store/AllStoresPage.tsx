"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search, X } from "lucide-react";
import { useStores } from "../../../home/hooks/useStores";
import { StoreCard } from "../../../home/components/StoreSection/StoreCard";
import Link from "next/link";
import { StoreCardSkeleton } from "../shared";

type StoreEndpoint =
    | "all"
    | "latest"
    | "popular"
    | "recommended"
    | "discounted"
    | "top-rated"
    | "top-offer";

interface AllStoresPageProps {
    endpoint: StoreEndpoint;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    accentFrom?: string;
    accentTo?: string;
    pageSize?: number;
}

const SORT_OPTIONS = [
    { value: "recommended", label: "Recommended" },
    { value: "distance", label: "Nearest" },
    { value: "ratings_desc", label: "Top Rated" },
    { value: "delivery_time_asc", label: "Fastest Delivery" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function AllStoresPage({
    endpoint,
    title,
    subtitle,
    icon,
    accentFrom = "from-green-500",
    accentTo = "to-emerald-600",
    pageSize = 12,
}: AllStoresPageProps) {
    const [sortBy, setSortBy] = useState<SortValue>("recommended");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const { stores, totalSize, isLoading, error } = useStores({
        endpoint,
        limit: pageSize,
        offset: currentPage,
        sort_by: sortBy,
    });

    const totalPages = Math.ceil(totalSize / pageSize);

    // Client-side search filter (over the current page)
    const filtered = searchQuery.trim()
        ? stores.filter((s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.address ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        )
        : stores;

    const skeletons = Array.from({ length: pageSize });

    function handlePageChange(next: number) {
        if (next < 0 || next >= totalPages) return;
        setCurrentPage(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* ── Header ── */}
            <div className={`bg-gradient-to-r ${accentFrom} ${accentTo} text-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Link>
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{title}</h1>
                            {subtitle && <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative mt-5 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search within results…"
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/50 text-sm outline-none focus:bg-white/30 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>


            {/* ── Store Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {error ? (
                    <ErrorState message={error} />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {isLoading
                                ? skeletons.map((_, i) => <StoreCardSkeleton key={i} />)
                                : filtered.length === 0
                                    ? null
                                    : filtered.map((store) => <StoreCard key={store.id} store={store} />)}
                        </div>

                        {!isLoading && filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <Search className="w-7 h-7 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No stores found</p>
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="mt-2 text-green-600 text-sm font-semibold hover:underline">
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Pagination ── */}
                        {totalPages > 1 && !isLoading && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                accentFrom={accentFrom}
                                accentTo={accentTo}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterChip({ label }: { label: string }) {
    const [active, setActive] = useState(false);
    return (
        <button
            onClick={() => setActive((a) => !a)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${active
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-400"
                }`}
        >
            {label}
        </button>
    );
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    accentFrom,
    accentTo,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    accentFrom: string;
    accentTo: string;
}) {
    // Show at most 7 page buttons (with ellipsis logic)
    const pages = buildPageRange(currentPage, totalPages);

    return (
        <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-green-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, idx) =>
                p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === currentPage
                            ? `bg-gradient-to-br ${accentFrom} ${accentTo} text-white shadow-md`
                            : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400"
                            }`}
                    >
                        {(p as number) + 1}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-green-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function buildPageRange(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const result: (number | "…")[] = [];
    const addPage = (p: number) => result.push(p);
    const addEllipsis = () => {
        if (result[result.length - 1] !== "…") result.push("…");
    };
    for (let i = 0; i < total; i++) {
        if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) {
            addPage(i);
        } else if (i < current) {
            addEllipsis();
        } else {
            addEllipsis();
        }
    }
    return result;
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <X className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-red-500 font-medium">{message}</p>
        </div>
    );
}