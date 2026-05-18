"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers";
import { useSearch } from "../hooks/useSearch";
import { saveToSearchHistory } from "../lib/utils/searchUtils";
import type { StoreType } from "../types/search.types";
import type { ApiStore } from "../types/search.types";
import {
	SearchHeader,
	SearchBar,
	RecentSearches,
	SearchFilters,
	SearchResults,
	SearchEmptyState,
	SearchLoadingState,
} from "./index";

// ─── Search context ───────────────────────────────────────────────────────────
// Adjust these or pull from your app's session/context provider
const SEARCH_CTX = {
	zoneId: "[2]",
	moduleId: "6",
	longitude: "46.6753",
	latitude: "24.7136",
	lang: "en",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language } = useLanguage();
	const isAr = language === "ar";

	const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
	const [storeType, setStoreType] = useState<StoreType>("all");
	const [hasSearched, setHasSearched] = useState(!!searchParams.get("q"));

	const { stores, totalSize, isSearching, error, search, reset } = useSearch({
		...SEARCH_CTX,
		lang: language === "ar" ? "ar" : "en",
	});

	// ── Run search ──────────────────────────────────────────────────────────────
	const runSearch = useCallback(
		(term: string, type: StoreType = storeType) => {
			if (!term.trim()) { reset(); setHasSearched(false); return; }
			setHasSearched(true);
			search(term, type);
		},
		[storeType, search, reset],
	);

	useEffect(() => {
		const q = searchParams.get("q");
		if (q) runSearch(q);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── Handlers ────────────────────────────────────────────────────────────────
	const handleSubmit = useCallback(
		(term: string) => {
			// Sync URL
			const url = new URL(window.location.href);
			url.searchParams.set("q", term);
			router.push(url.pathname + url.search, { scroll: false });

			saveToSearchHistory(term);
			runSearch(term);
		},
		[router, runSearch],
	);

	const handleTypeChange = useCallback(
		(type: StoreType) => {
			setStoreType(type);
			if (searchTerm.trim()) search(searchTerm, type);
		},
		[searchTerm, search],
	);

	const handleStoreClick = useCallback(
		(store: ApiStore) => router.push(`/categories/6/${store.id}?moduleName=${store.name}`),
		[router],
	);

	const handleCategoryClick = useCallback(
		(id: string) => router.push(`/categories/${id}`),
		[router],
	);

	const handleRecentClick = useCallback(
		(term: string) => { setSearchTerm(term); handleSubmit(term); },
		[handleSubmit],
	);

	// ── Derived state ────────────────────────────────────────────────────────────
	const showRecent = !hasSearched && !searchTerm.trim();
	const hasResults = stores.length > 0;

	// ── Render ───────────────────────────────────────────────────────────────────
	return (
		<div
			dir={isAr ? "rtl" : "ltr"}
			className="min-h-screen bg-gray-50 dark:bg-gray-950"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				{/* Header */}
				<SearchHeader />

				{/* Search input */}
				<SearchBar
					value={searchTerm}
					onChange={setSearchTerm}
					onSubmit={handleSubmit}
					isLoading={isSearching}
					autoFocus={!searchParams.get("q")}
				/>

				{/* Recent searches — shown only before any search */}
				<RecentSearches onSearchClick={handleRecentClick} visible={showRecent} />

				{/* Type filter — shown only after a search */}
				<SearchFilters
					activeType={storeType}
					onChange={handleTypeChange}
					visible={hasSearched}
				/>

				{/* Results summary */}
				{hasResults && !isSearching && (
					<p className={`text-sm text-gray-500 dark:text-gray-400 mb-5 ${isAr ? "text-right" : ""}`}>
						{isAr ? "تم العثور على" : "Found"}{" "}
						<strong className="text-amber-600 dark:text-amber-400">{totalSize}</strong>{" "}
						{isAr ? "متجر" : totalSize === 1 ? "store" : "stores"}
						{searchTerm && (
							<> {isAr ? "لـ" : "for"} <q className="font-semibold text-gray-700 dark:text-gray-300">{searchTerm}</q></>
						)}
					</p>
				)}

				{/* Content area */}
				{isSearching ? (
					<SearchLoadingState />
				) : hasResults ? (
					<SearchResults
						stores={stores}
						totalSize={totalSize}
						onStoreClick={handleStoreClick}
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

				{/* Load more */}
				{hasResults && !isSearching && stores.length < totalSize && (
					<div className="mt-8 flex justify-center">
						<button
							onClick={() => search(searchTerm, storeType, Math.floor(stores.length / 10) + 1)}
							className="px-8 py-3 rounded-2xl border-2 border-amber-400 text-amber-600 dark:text-amber-400 font-bold text-sm hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
						>
							{isAr ? "تحميل المزيد" : "Load more"}
						</button>
					</div>
				)}

				{/* Error */}
				{error && !isSearching && (
					<p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
				)}
			</div>
		</div>
	);
}