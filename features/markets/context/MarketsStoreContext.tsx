"use client";

import { createContext, useContext } from "react";
import { useStores } from "@/features/markets/hooks/useStores";

type MarketsStoreContextValue = ReturnType<typeof useStores>;

const MarketsStoreContext = createContext<MarketsStoreContextValue | null>(null);

export function MarketsStoreProvider({
	moduleId,
	lang,
	initialCategoryId = null,
	children,
}: {
	moduleId: string;
	lang: "ar" | "en";
	initialCategoryId?: number | null;
	children: React.ReactNode;
}) {
	const value = useStores(moduleId, lang, initialCategoryId);

	return (
		<MarketsStoreContext.Provider value={value}>{children}</MarketsStoreContext.Provider>
	);
}

export function useMarketsStore(): MarketsStoreContextValue {
	const context = useContext(MarketsStoreContext);
	if (!context) {
		throw new Error("useMarketsStore must be used within MarketsStoreProvider");
	}
	return context;
}

/** Safe for components that may render outside the module page (e.g. AllCategories). */
export function useMarketsStoreOptional(): MarketsStoreContextValue | null {
	return useContext(MarketsStoreContext);
}
