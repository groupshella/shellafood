"use client";

import { useMemo, useState, useCallback, memo } from "react";
import { Product } from "../../types/category.types";
import { useLanguageDirection } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { navigateToProductFromContext } from "../../lib/utils/navigation";
import PageHeader from "../shared/PageHeader";
import { EmptyState, ProductCard } from "../shared";
import MobileDepartmentView from "./MobileDepartmentView";
import { useMobile } from "@/shared/hooks";
import { findStoreBySlug, getProductsByStoreAndDepartmentSlug } from "../../lib/helpers/testData";
import { decodeParam } from "../../lib/utils/url";

interface DepartmentViewProps {
	categorySlug: string;
	storeSlug: string;
	departmentSlug: string;
}

/**
 * Department View Component
 * Displays products in a specific department with filters, sorting, and bilingual support
 * Route: /categories/[category]/[store]/[department]
 */
function DepartmentView({ categorySlug, storeSlug, departmentSlug }: DepartmentViewProps) {
	// Call all hooks first (hooks rules - must be called in same order)
	const isMobile = useMobile(768);
	const { isArabic, direction } = useLanguageDirection();
	const router = useRouter();

	// Decode URL params
	const decodedStoreSlug = useMemo(() => decodeParam(storeSlug), [storeSlug]);
	const decodedDepartmentSlug = useMemo(() => decodeParam(departmentSlug), [departmentSlug]);

	// Find store by slug
	const store = useMemo(() => findStoreBySlug(decodedStoreSlug), [decodedStoreSlug]);
	
	// Get products for this store and department
	const products = useMemo(() => {
		if (!store) return [];
		return getProductsByStoreAndDepartmentSlug(store.id, decodedDepartmentSlug);
	}, [store, decodedDepartmentSlug]);

	const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
	const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'offers'>('all');

	const filterAndSortProducts = (products: Product[], filterBy: 'all' | 'inStock' | 'offers', sortBy: 'name' | 'price' | 'rating', isArabic: boolean) => {
		return products.filter((product) => {
			if (filterBy === 'all') return true;
			if (filterBy === 'inStock') return product.inStock;
			if (filterBy === 'offers') return product.originalPrice && product.originalPrice && product.originalPrice > (product.price || 0);
			return false;
		}).sort((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name);
			if (sortBy === 'price') return (a.originalPrice && a.originalPrice > (a.price || 0)) ? 1 : -1;
			if (sortBy === 'rating') return (a.rating && b.rating) ? a.rating > b.rating ? 1 : -1 : 0;
			return 0;
		});
	};
	
	const filteredAndSortedProducts = useMemo(
		() => filterAndSortProducts(products, filterBy, sortBy, isArabic),
		[products, sortBy, filterBy, isArabic]
	);

	const filterButtons = useMemo(() => [
		{ key: 'all' as const, label: isArabic ? 'الكل' : 'All' },
		{ key: 'inStock' as const, label: isArabic ? 'متوفر' : 'In Stock' },
		{ key: 'offers' as const, label: isArabic ? 'العروض' : 'Offers' },
	], [isArabic]);

	const sortOptions = useMemo(() => [
		{ value: 'name' as const, label: isArabic ? 'الاسم' : 'Name' },
		{ value: 'price' as const, label: isArabic ? 'السعر' : 'Price' },
		{ value: 'rating' as const, label: isArabic ? 'التقييم' : 'Rating' },
	], [isArabic]);

	const handleProductClick = useCallback((productId: string) => {
		const product = products.find(p => p.id === productId);
		if (product) {
			navigateToProductFromContext(router, product, categorySlug, storeSlug, departmentSlug);
		}
	}, [router, products, categorySlug, storeSlug, departmentSlug]);

	const handleAddToCart = (_productId: string) => {
		// TODO: Implement add to cart logic
	};

	// Use mobile view on mobile devices (after all hooks are called)
	if (isMobile) {
		return <MobileDepartmentView products={products} />;
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<PageHeader
					title={isArabic ? 'الأقسام' : 'Departments'}
					description={isArabic ? 'تصفح جميع المنتجات في هذا القسم' : 'Browse all products in this department'}
				/>

				<div className={`mb-6 flex flex-wrap items-center gap-3 ${isArabic ? ' justify-start' : 'justify-end'}`}>
					<div className={`flex gap-2`}>
						{filterButtons.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setFilterBy(filter.key)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									filterBy === filter.key
										? 'bg-green-600 dark:bg-green-500 text-white shadow-md dark:shadow-green-900/50'
										: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>

					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
						className={`px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
						dir={direction}
					>
						{sortOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{filteredAndSortedProducts.length > 0 ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
						{filteredAndSortedProducts.map((product: Product) => (
							<ProductCard
								key={product.id}
								product={product}
								onClick={handleProductClick}
								onAddToCart={handleAddToCart}
								showRating={true}
								showStock={true}
							/>
						))}
					</div>
				) : (
					<EmptyState
						icon="📦"
						title={isArabic ? 'لا توجد منتجات متاحة' : 'No products available'}
						description={isArabic ? 'يرجى التحقق مرة أخرى لاحقاً' : 'Please check back later'}
					/>
				)}
			</div>
		</div>
	);
}

export default memo(DepartmentView);
