// ============================================================================
// OPTIMIZED DEPARTMENT VIEW - PRODUCTION READY
// ============================================================================
// features/categories/components/department-details/DepartmentView.tsx

"use client";

import { useMemo, useState, useTransition, memo, useCallback, useEffect } from "react";
import { useLanguageDirection, useMobile } from "@/shared/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { DepartmentResponse, Item } from "../../types/department.types";
import { EmptyState, ProductCard, SkeletonPage } from "../shared";
import PageHeader from "../shared/PageHeader";
import Pagination from "../category-details/Pagination";
import { SlidersHorizontal, Grid3x3, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import UnifiedProductCard from "../shared/UnifiedProductCard";
import { transformSearchProductToItem, SearchResponse } from "../../api/search.api";
import DepartmentLoading from "@/app/(main)/categories/[category]/[store]/[department]/loading";

interface DepartmentViewProps {
  departmentResponse: DepartmentResponse;
  storeId: number;
  departmentId: number;
  initialPage: number;
  initialLimit: number;
  moduleId: number;
  zoneId: number;
}

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type FilterType = 'all' | 'inStock' | 'offers';
type SortType = 'name' | 'price' | 'rating' | 'discount';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48] as const;

// ============================================================================
// FETCHER
// ============================================================================

const fetcher = async (url: string) => {
  console.log(url);
  const res = await fetch(url);
  console.log(res);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function DepartmentView({
  departmentResponse,
  storeId,
  departmentId,
  initialPage,
  initialLimit,
  moduleId,
  zoneId,
}: DepartmentViewProps) {
  // ============================================================================
  // HOOKS
  // ============================================================================

  const { isArabic, direction } = useLanguageDirection();
  const isMobile = useMobile(768);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ============================================================================
  // STATE
  // ============================================================================

  const [sortBy, setSortBy] = useState<SortType>('name');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // ✅ Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Get current page and limit from URL
  const currentOffset = Number(searchParams.get('page')) || initialPage;
  const currentLimit = initialLimit;

  // ============================================================================
  // SWR DATA FETCHING
  // ============================================================================

  // ✅ SWR for search (use debounced term)
  const searchKey = debouncedSearchTerm.trim() 
    ? `/api/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}&limit=${currentLimit}&offset=${currentOffset}&moduleId=${moduleId}&zoneId=${zoneId}&locale=${isArabic ? 'ar' : 'en'}`
    : null;

  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSWR<SearchResponse>(
    searchKey,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  // ✅ SWR for client-side pagination (only when not searching)
  const { data: departmentData, isLoading: isDepartmentLoading, error: departmentError } = useSWR<DepartmentResponse>(
    !debouncedSearchTerm.trim() 
      ? `/api/department-details?departmentId=${departmentId}&storeId=${storeId}&moduleId=${moduleId}&zoneId=${zoneId}&limit=${currentLimit}&offset=${currentOffset}&locale=${isArabic ? 'ar' : 'en'}`
      : null,
    fetcher,
    {
      fallbackData: departmentResponse, // ✅ Use server data initially
      revalidateOnMount: false, // ✅ Don't refetch on mount
      revalidateOnFocus: false,
      keepPreviousData: true, // ✅ Show old data while fetching new
      dedupingInterval: 10000, // Cache for 10 seconds
    }
  );

  // ✅ Prefetch next page on current page load (only when not searching)
  useSWR(
    !debouncedSearchTerm.trim() && departmentData && currentOffset < Math.ceil(departmentData.total_size / currentLimit)
      ? `/api/department-details?departmentId=${departmentId}&storeId=${storeId}&moduleId=${moduleId}&zoneId=${zoneId}&limit=${currentLimit}&offset=${currentOffset + 1}&locale=${isArabic ? 'ar' : 'en'}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  // ✅ Prefetch previous page (only when not searching)
  useSWR(
    !debouncedSearchTerm.trim() && currentOffset > 1
      ? `/api/department-details?departmentId=${departmentId}&storeId=${storeId}&moduleId=${moduleId}&zoneId=${zoneId}&limit=${currentLimit}&offset=${currentOffset - 1}&locale=${isArabic ? 'ar' : 'en'}`
      : null,
    fetcher,
    { revalidateOnMount: false }
  );

  // ✅ Determine which data to use
  const isLoading = debouncedSearchTerm.trim() ? isSearchLoading : isDepartmentLoading;
  const error = debouncedSearchTerm.trim() ? searchError : departmentError;

  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // ✅ Transform search results to Item format if searching
  const searchItems = useMemo(() => {
    if (!debouncedSearchTerm.trim() || !searchData?.products) return [];
    return searchData.products.map(transformSearchProductToItem);
  }, [debouncedSearchTerm, searchData]);

  // ✅ Use search results when searching, otherwise use department data (API returns products or items)
  const currentDepartment = debouncedSearchTerm.trim()
    ? {
        products: searchItems,
        total_size: searchData?.total_size ?? 0,
        offset: searchData?.offset ?? currentOffset.toString(),
        limit: currentLimit,
        has_more: false,
      }
    : (departmentData || departmentResponse);

  // ✅ Support both API shapes: { products: [...] } and { items: [...] }
  const departmentItems: Item[] = Array.isArray(currentDepartment?.products)
    ? currentDepartment.products
    : Array.isArray((currentDepartment as any)?.items)
      ? (currentDepartment as any).items
      : [];

  const totalItems = currentDepartment?.total_size ?? 0;
  const totalPages = currentDepartment ? Math.ceil(totalItems / currentLimit) : 1;

  // Client-side filtering and sorting on current page
  const filteredAndSortedProducts = useMemo(() => {
    if (!departmentItems.length) return [];

    let filtered = departmentItems;

    // Apply filters
    switch (filterBy) {
      case 'inStock':
        filtered = filtered.filter((item: Item) => (item.stock ?? 0) > 0);
        break;
      case 'offers':
        filtered = filtered.filter((item: Item) => 
          item.discount_type || (item.original_price && item.original_price > (item.price || 0))
        );
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '', isArabic ? 'ar' : 'en');
        
        case 'price': {
          const priceA = a.price ?? 0;
          const priceB = b.price ?? 0;
          return priceA - priceB;
        }
        
        case 'rating': {
          const ratingA = a.avg_rating ?? 0;
          const ratingB = b.avg_rating ?? 0;
          return ratingB - ratingA; // Higher rating first
        }
        
        case 'discount': {
          const discountA = a.original_price && a.price 
            ? ((a.original_price - a.price) / a.original_price) * 100 
            : 0;
          const discountB = b.original_price && b.price 
            ? ((b.original_price - b.price) / b.original_price) * 100 
            : 0;
          return discountB - discountA; // Higher discount first
        }
        
        default:
          return 0;
      }
    });

    return sorted;
  }, [departmentItems, filterBy, sortBy, isArabic]);

  // ============================================================================
  // TRANSLATIONS
  // ============================================================================

  const t = useMemo(() => ({
    title: isArabic ? 'المنتجات' : 'Products',
    description: isArabic 
      ? 'تصفح جميع المنتجات في هذا القسم' 
      : 'Browse all products in this department',
    filters: isArabic ? 'التصفية' : 'Filters',
    sort: isArabic ? 'الترتيب' : 'Sort',
    all: isArabic ? 'الكل' : 'All',
    inStock: isArabic ? 'متوفر' : 'In Stock',
    offers: isArabic ? 'العروض' : 'Offers',
    name: isArabic ? 'الاسم' : 'Name',
    price: isArabic ? 'السعر' : 'Price',
    rating: isArabic ? 'التقييم' : 'Rating',
    discount: isArabic ? 'الخصم' : 'Discount',
    items: isArabic ? 'عنصر' : 'items',
    showing: isArabic ? 'عرض' : 'Showing',
    of: isArabic ? 'من' : 'of',
    noProducts: isArabic ? 'لا توجد منتجات متاحة' : 'No products available',
    checkLater: isArabic ? 'يرجى التحقق مرة أخرى لاحقاً' : 'Please check back later',
    loading: isArabic ? 'جاري التحميل...' : 'Loading...',
    errorLoading: isArabic ? 'خطأ في تحميل المنتجات' : 'Error loading products',
    tryAgain: isArabic ? 'حاول مرة أخرى' : 'Try again',
  }), [isArabic]);

  const filterButtons = useMemo(() => [
    { key: 'all' as const, label: t.all, count: departmentItems?.length || 0 },
    { 
      key: 'inStock' as const, 
      label: t.inStock, 
      count: departmentItems?.filter((item: Item) => (item.stock ?? 0) > 0).length || 0 
    },
    { 
      key: 'offers' as const, 
      label: t.offers, 
      count: departmentItems?.filter((item: Item) => 
        item.discount_type || (item.original_price && item.original_price > (item.price || 0))
      ).length || 0 
    },
  ], [t, departmentItems]);
  const sortOptions = useMemo(() => [
    { value: 'name' as const, label: t.name },
    { value: 'price' as const, label: t.price },
    { value: 'rating' as const, label: t.rating },
    { value: 'discount' as const, label: t.discount },
  ], [t]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    // ✅ Update URL without full page reload
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: true });
    });
  }

  // ✅ Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    // Reset to page 1 when clearing search
    if (value.trim() === '' && debouncedSearchTerm.trim() !== '') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }
  }, [debouncedSearchTerm, searchParams, router]);

 


  const handleFilterChange = useCallback((filter: FilterType) => {
    setFilterBy(filter);
  }, []);

  const handleSortChange = useCallback((sort: SortType) => {
    setSortBy(sort);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
if(isLoading) {
  return  <DepartmentLoading />
}
 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Page Header */}
        <PageHeader
		title={t.title}	
		description={t.description}
        />

        {/* Controls Bar */}
        <div className="mb-6 space-y-4 sm:space-y-0">
          
          {/* Search Bar - Responsive */}
				<div className="mb-4 sm:mb-6">
					<div className="relative">
						<Search className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} w-4 h-4 sm:w-5 sm:h-5 text-gray-400`} />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							placeholder={isArabic ? 'ابحث عن منتجات...' : 'Search products...'}
							className={`w-full ${isArabic ? 'pr-10 sm:pr-11 pl-3 sm:pl-4' : 'pl-10 sm:pl-11 pr-3 sm:pr-4'} py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
							>
								<X className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						)}
					</div>
				</div>

				{/* Filters and Sort - Responsive */}
				<div className={`mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 ${isArabic ? 'sm:justify-start' : 'sm:justify-end'}`}>
					{/* Filter Buttons - Responsive */}
					<div className="flex flex-wrap gap-2 sm:gap-2">
						{filterButtons.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setFilterBy(filter.key)}
								className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
									filterBy === filter.key
										? 'bg-green-600 dark:bg-green-500 text-white shadow-md dark:shadow-green-900/50'
										: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>

					{/* Sort Dropdown - Responsive */}
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortType)}
						className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto`}
						dir={direction}
					>
						{sortOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>  

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-2">
            <span>
              {t.showing} {filteredAndSortedProducts.length} {t.of} {totalItems} {t.items}
            </span>
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                <span>{totalItems} {t.items}</span>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              key={`products-page-${currentOffset}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="products-list"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredAndSortedProducts.map((product, index) => (
                  <UnifiedProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={() => router.push(`/products/${product.id}`)}
                    onQuickAdd={() => {}}
                    onAddToCart={() => {}}
                    showRating={true}
                    showStock={true}
                    showActions={true}
                    showAddButton={true}
                    showDelivery={false}
                    storeId={storeId}
                    storeName={product.store_name}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentOffset}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={currentLimit}
                  maxVisiblePages={isMobile ? 5 : 7}
                  disabled={isPending || isLoading}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState
                icon="📦"
                title={t.noProducts}
                description={t.checkLater}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(DepartmentView);

// ============================================================================
// PERFORMANCE OPTIMIZATIONS APPLIED
// ============================================================================

