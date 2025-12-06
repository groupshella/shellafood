"use client";

import { Store } from "../../types/category.types";
import { useMemo, memo } from "react";
import { Product, Department } from "../../types/category.types";
import StoreView from "./StoreView";
import MobileStoreView from "./MobileStoreView";
import { useMobile } from "@/shared/hooks";
import { findStoreBySlug, getProductsByStore } from "../../lib/helpers/testData";
import { getDepartmentsByStore } from "../../lib/helpers/storeHelpers";

interface StorePageProps {
	categorySlug: string;
	storeSlug: string;
}

function StorePage({
	categorySlug,
	storeSlug,
}: StorePageProps) {
	const isMobile = useMobile(768);

	// Find store by slug
	const store = findStoreBySlug(storeSlug);
	
	// If store not found, return error state
	if (!store) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Store Not Found
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						The store you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	// Get products for this store
	const allStoreProducts = getProductsByStore(store.id);
	
	// Get departments that have products in this store
	const departments = getDepartmentsByStore(store.id);
	
	// Split products into recommended and popular for display purposes
	// Recommended: products with badges or discounts
	const recommendedProducts = allStoreProducts
		.filter(p => p.badge || (p.originalPrice && p.price && p.originalPrice > p.price))
		.slice(0, 8);
	
	// Pass all products for proper grouping by department
	// The component will handle deduplication and grouping
	const allProducts = allStoreProducts;

	// Group products by department
	const productsByDepartment = useMemo(() => {
		const grouped: Record<string, Product[]> = {};
		
		// Remove duplicates by ID
		const productMap = new Map<string, Product>();
		allProducts.forEach((product) => {
			if (!productMap.has(product.id)) {
				productMap.set(product.id, product);
			}
		});
		const uniqueProducts = Array.from(productMap.values());

		// Group products by department
		uniqueProducts.forEach((product) => {
			if (!product.department) return;
			
			// Find the department that matches this product's department
			const department = departments.find(
				(dept) => dept.name === product.department || dept.nameAr === product.department
			);
			
			// Use department slug as key, or department name as fallback
			const deptKey = department?.slug || department?.name || product.department;
			
			if (!grouped[deptKey]) {
				grouped[deptKey] = [];
			}
			grouped[deptKey].push(product);
		});

		// Ensure all departments have entries (even if empty)
		departments.forEach((dept) => {
			const deptKey = dept.slug || dept.name || "";
			if (!grouped[deptKey]) {
				grouped[deptKey] = [];
			}
		});

		return grouped;
	}, [allProducts, departments]);

	const commonProps = {
		store,
		departments,
		productsByDepartment,
		categorySlug,
		storeSlug,
	};

	// Use mobile view on mobile devices, desktop view on larger screens
	return isMobile ? (
		<MobileStoreView {...commonProps} />
	) : (
		<StoreView {...commonProps} />
	);
}

export default memo(StorePage);
