"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers";
import { useDebounce } from "@/shared/hooks";
import { useSearch } from "../hooks/useSearch";
import { saveToSearchHistory } from "../lib/utils/searchUtils";
import {
	SearchHeader,
	SearchBar,
	RecentSearches,
	SearchTabs,
	SearchResults,
	SearchFilters as SearchFiltersPanel,
	SearchEmptyState,
	SearchLoadingState,
} from "./index";
import type { SearchFilters } from "../types";
import { SEARCH_CONSTANTS } from "../constants/search.constants";
import type { Product } from "@/shared/components";
import type { ApiStore } from "@/features/home/types/store.types";

// ─── types ────────────────────────────────────────────────────────────────────

type Tab = "all" | "products" | "stores";

// ─── defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: SearchFilters = {
	sortBy: "popularity",
	minRating: null,
	priceRange: null,
	dietary: undefined,
	availableNow: false,
	inStock: false,
	categories: [],
};

// ─── component ────────────────────────────────────────────────────────────────

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isAr = language === "ar";

	// ── state ──────────────────────────────────────────────────────────────────
	const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
	const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [hasSearched, setHasSearched] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [stores, setStores] = useState<ApiStore[]>([]);

	const { performSearch, isSearching, error } = useSearch({
		lang: language,
	});
	const debouncedTerm = useDebounce(searchTerm, SEARCH_CONSTANTS.DEBOUNCE_DELAY ?? 400);

	// ── run search ─────────────────────────────────────────────────────────────
	const runSearch = useCallback(
		async (term: string) => {
			if (!term.trim()) {
				setProducts([]);
				setStores([]);
				setHasSearched(false);
				return;
			}

			setHasSearched(true);
			const result = await performSearch(term);
			setProducts(result.products);
			setStores(result.stores);
		},
		[performSearch],
	);

	// Bootstrap from URL query
	useEffect(() => {
		const q = searchParams.get("q");
		if (q) {
			setSearchTerm(q);
			runSearch(q);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── handlers ───────────────────────────────────────────────────────────────
	const handleSubmit = useCallback(
		(term: string) => {
			const url = new URL(window.location.href);
			url.searchParams.set("q", term);
			router.push(url.pathname + url.search);
			saveToSearchHistory(term);
			runSearch(term);
		},
		[router, runSearch],
	);

	const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
		setFilters(newFilters);
		// Filters are UI-only until the API supports them on item-or-store-search
	}, []);

	const handleFiltersReset = useCallback(() => {
		setFilters(DEFAULT_FILTERS);
	}, []);

	const handleProductClick = useCallback(
		(id: string) => router.push(`/product/${id}`),
		[router],
	);

	const handleRecentClick = useCallback(
		(term: string) => {
			setSearchTerm(term);
			handleSubmit(term);
		},
		[handleSubmit],
	);

	// ── derived state ──────────────────────────────────────────────────────────
	const visibleProducts = useMemo(
		() => (activeTab === "all" || activeTab === "products" ? products : []),
		[products, activeTab],
	);
	const visibleStores = useMemo(
		() => (activeTab === "all" || activeTab === "stores" ? stores : []),
		[stores, activeTab],
	);

	const counts = useMemo(
		() => ({
			all: products.length + stores.length,
			products: products.length,
			stores: stores.length,
		}),
		[products.length, stores.length],
	);

	const hasResults = visibleProducts.length > 0 || visibleStores.length > 0;
	const showRecent = !hasSearched && !searchTerm.trim();
	const showTabs = hasSearched && counts.all > 0;

	// ── render ─────────────────────────────────────────────────────────────────
	return (
		<div
			dir={isAr ? "rtl" : "ltr"}
			className="min-h-screen bg-gray-50 dark:bg-gray-950"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				<SearchHeader />

				<SearchBar
					value={searchTerm}
					onChange={setSearchTerm}
					onSubmit={handleSubmit}
					isLoading={isSearching}
					autoFocus={!searchParams.get("q")}
				/>

				<RecentSearches onSearchClick={handleRecentClick} visible={showRecent} />

				{/* Main layout */}
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Filters sidebar */}
					<aside className="lg:w-60 lg:flex-shrink-0">
						<SearchFiltersPanel
							filters={filters}
							onFiltersChange={handleFiltersChange}
							onReset={handleFiltersReset}
							visible={hasSearched}
						/>
					</aside>

					{/* Results area */}
					<main className="flex-1 min-w-0">
						{/* Tabs */}
						<SearchTabs
							activeTab={activeTab}
							onTabChange={setActiveTab}
							counts={counts}
							visible={showTabs}
						/>

						{/* Results summary */}
						{hasResults && (
							<p className={`text-sm text-gray-500 dark:text-gray-400 mb-5 ${isAr ? "text-right" : ""}`}>
								{isAr ? "تم العثور على" : "Found"}{" "}
								<strong className="text-amber-600 dark:text-amber-400">
									{counts.all}
								</strong>{" "}
								{isAr ? "نتيجة" : "results"}
								{searchTerm && (
									<> {isAr ? "لـ" : "for"} <q className="font-semibold text-gray-700 dark:text-gray-300">{searchTerm}</q></>
								)}
							</p>
						)}

						{/* Content */}
						{isSearching ? (
							<SearchLoadingState />
						) : hasResults ? (
							<SearchResults
								products={visibleProducts}
								stores={visibleStores}
								onProductClick={handleProductClick}
							/>
						) : hasSearched ? (
							<SearchEmptyState type="no-results" searchTerm={searchTerm} />
						) : (
							<SearchEmptyState type="start-search" />
						)}

						{/* Error banner */}
						{error && !isSearching && (
							<p className="mt-6 text-center text-sm text-red-500 dark:text-red-400">
								{error}
							</p>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}