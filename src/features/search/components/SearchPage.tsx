"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
	SearchFilters as SearchFiltersComponent,
	SearchEmptyState,
	SearchLoadingState,
} from "./index";
import type { SearchFilters, SearchTab, Store as SearchStore, Product as SearchProduct } from "../types";
import type { Store, Product } from "@/shared/components";
import { SEARCH_CONSTANTS } from "../constants/search.constants";

const defaultFilters: SearchFilters = {
	sortBy: "relevance",
	minRating: null,
	priceRange: null,
	categories: [],
};

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const query = searchParams.get("q") || "";
	const [searchTerm, setSearchTerm] = useState(query);
	const [stores, setStores] = useState<SearchStore[]>([]);
	const [products, setProducts] = useState<SearchProduct[]>([]);
	const [activeTab, setActiveTab] = useState<SearchTab>("all");
	const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
	const [hasSearched, setHasSearched] = useState(false);

	const { performSearch, isSearching } = useSearch();
	const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_CONSTANTS.DEBOUNCE_DELAY);

	// Search when query changes from URL
	useEffect(() => {
		if (query) {
			setSearchTerm(query);
			handleSearch(query);
		}
	}, [query]);

	// Perform search
	const handleSearch = useCallback(
		async (term: string) => {
			if (!term.trim()) {
				setStores([]);
				setProducts([]);
				setHasSearched(false);
				return;
			}

			setHasSearched(true);
			const results = await performSearch({
				query: term,
				filters: {
					sortBy: filters.sortBy,
					minRating: filters.minRating ?? undefined,
					priceRange: filters.priceRange ?? undefined,
					categories: filters.categories,
				},
			});
			
			// Add type markers for filtering
			const storesWithType = results.stores.map((store) => ({
				...store,
				_searchType: "store" as const,
			}));
			const productsWithType = results.products.map((product) => ({
				...product,
				_searchType: "product" as const,
			}));

			setStores(storesWithType as SearchStore[]);
			setProducts(productsWithType as SearchProduct[]);

			// Save to history
			saveToSearchHistory(term);
		},
		[performSearch, filters]
	);

	// Handle search submission
	const handleSearchSubmit = useCallback(
		(term: string) => {
			const url = new URL(window.location.href);
			url.searchParams.set("q", term);
			router.push(url.pathname + url.search);
			handleSearch(term);
		},
		[router, handleSearch]
	);

	// Handle search term change
	const handleSearchChange = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	// Handle filter changes
	const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
		setFilters(newFilters);
		if (searchTerm.trim()) {
			handleSearch(searchTerm);
		}
	}, [searchTerm, handleSearch]);

	const handleFiltersReset = useCallback(() => {
		setFilters(defaultFilters);
		if (searchTerm.trim()) {
			handleSearch(searchTerm);
		}
	}, [searchTerm, handleSearch]);

	// Handle store click
	const handleStoreClick = useCallback(
		(store: Store) => {
			if (store.hasProducts === false) return;
			router.push(`/categories/${store.id}`);
		},
		[router]
	);

	// Handle product click
	const handleProductClick = useCallback(
		(productId: string) => {
			router.push(`/product/${productId}`);
		},
		[router]
	);

	// Handle category click
	const handleCategoryClick = useCallback(
		(categoryId: string) => {
			router.push(`/categories/${categoryId}`);
		},
		[router]
	);

	// Handle recent search click
	const handleRecentSearchClick = useCallback(
		(term: string) => {
			setSearchTerm(term);
			handleSearchSubmit(term);
		},
		[handleSearchSubmit]
	);

	// Filter results by active tab and map to shared Store/Product types
	const filteredStores = useMemo(() => {
		if (activeTab === "all" || activeTab === "stores") {
			return stores.map((store): Store => ({
				id: store.id,
				name: store.name,
				nameAr: store.nameAr,
				logo: store.logo ?? null,
				rating: store.rating?.toString(),
				reviewsCount: store.reviewsCount,
				deliveryTime: store.deliveryTime,
				minimumOrder: store.minimumOrder?.toString(),
				fee: store.deliveryFee?.toString(),
				type: "store", // Required by shared Store type
				hasProducts: true, // Default to true, can be adjusted based on your logic
			}));
		}
		return [];
	}, [stores, activeTab]);

	const filteredProducts = useMemo(() => {
		if (activeTab === "all" || activeTab === "products") return products;
		return [];
	}, [products, activeTab]);

	// Counts
	const counts = useMemo(
		() => ({
			all: stores.length + products.length,
			stores: stores.length,
			products: products.length,
		}),
		[stores.length, products.length]
	);

	const hasResults = filteredStores.length > 0 || filteredProducts.length > 0;
	const showRecentSearches = !hasSearched && !searchTerm.trim();
	const showTabs = hasResults && hasSearched;

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{/* Header */}
				<SearchHeader />

				{/* Search Bar */}
				<SearchBar
					value={searchTerm}
					onChange={handleSearchChange}
					onSubmit={handleSearchSubmit}
					isLoading={isSearching}
					autoFocus={!query}
				/>

				{/* Recent Searches */}
				<RecentSearches onSearchClick={handleRecentSearchClick} visible={showRecentSearches} />

				{/* Main Content Layout */}
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Filters Sidebar */}
					<div className="lg:w-64 lg:flex-shrink-0">
						<SearchFiltersComponent
							filters={filters}
							onFiltersChange={handleFiltersChange}
							onReset={handleFiltersReset}
							visible={hasSearched}
						/>
					</div>

					{/* Results Section */}
					<div className="flex-1 min-w-0">
						{/* Tabs */}
						<SearchTabs
							activeTab={activeTab}
							onTabChange={setActiveTab}
							counts={counts}
							visible={showTabs}
						/>

						{/* Results Count */}
						{hasResults && (
							<div className="mb-6 text-center">
								<p className={`text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "تم العثور على" : "Found"}{" "}
									<span className="font-bold text-green-600 dark:text-green-400">
										{filteredStores.length + filteredProducts.length}
									</span>{" "}
									{isArabic ? "نتيجة" : "results"}
									{searchTerm && (
										<span>
											{" "}
											{isArabic ? "لـ" : "for"}{" "}
											<span className="font-semibold">&quot;{searchTerm}&quot;</span>
										</span>
									)}
								</p>
							</div>
						)}

						{/* Content */}
						{isSearching ? (
							<SearchLoadingState />
						) : hasResults ? (
							<SearchResults
								stores={filteredStores}
								products={filteredProducts}
								onStoreClick={handleStoreClick}
								onProductClick={handleProductClick}
							/>
						) : hasSearched ? (
							<SearchEmptyState
								type="no-results"
								searchTerm={searchTerm}
								onCategoryClick={handleCategoryClick}
							/>
						) : (
							<SearchEmptyState type="start-search" onCategoryClick={handleCategoryClick} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
