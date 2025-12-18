// Public API for categories feature

// Components
export * from './components';

// Explicit exports to ensure components are available (bypassing index.ts/index.tsx conflicts)

// Category List Components
// Export CategoriesPage - using the export from category-list/index.ts which re-exports from index.tsx
// The export * from './components' should already include it, but we add explicit export for safety
export { CategoriesPage } from './components/category-list';
export { default as CategoriesSlider } from './components/category-list/CategoriesSlider';
export { default as CategoriesHero } from './components/category-list/CategoriesHero';
export { default as CategoriesGrid } from './components/category-list/CategoriesGrid';
export { default as CategoriesGridSkeleton } from './components/category-list/CategoriesSkeleton';
export { default as StatsBar } from './components/category-list/StatsBar';
export { default as ServicesSection } from './components/category-list/ServicesSection';
export { default as TopSupermarketSection } from './components/category-list/TopSupermarketSection';

// Category Details Components
export { default as CategoryPage } from './components/category-details/CategoryPage';
export { default as CategoryView } from './components/category-details/CategoryView';
export { default as CategoryCard } from './components/category-details/CategoryCard';
export { default as Pagination } from './components/category-details/Pagination';
export { default as DailyNeeded } from './components/category-details/DailyNeeded';

// Store Components
export { default as StorePage } from './components/store/StorePage';
export { default as StoreView } from './components/store/StoreView';
export { default as StoreCard } from './components/store/StoreCard';
export { default as StoreHero } from './components/store/StoreHero';
export { default as DepartmentsPage } from './components/store/DepartmentsPage';
export { default as DepartmentsSidebar } from './components/store/DepartmentsSidebar';
export { default as DepartmentSection } from './components/store/DepartmentSection';
export { default as StickyTabs } from './components/store/StickyTabs';

// Product Components
export { default as ProductPage } from './components/product/ProductPage';
export { default as ProductView } from './components/product/ProductView';
export { default as MobileProductView } from './components/product/MobileProductView';
// Note: ProductCard from product is available via export *, but UnifiedProductCard (as ProductCard) from shared is recommended
export { default as ProductGallery } from './components/product/ProductGallery';
export { default as ProductInfo } from './components/product/ProductInfo';
export { default as RelatedProducts } from './components/product/RelatedProducts';

// Department Components
export { default as DepartmentPage } from './components/department/DepartmentPage';
export { default as DepartmentView } from './components/department/DepartmentView';
export { default as MobileDepartmentView } from './components/department/MobileDepartmentView';

// Shared Components
export { default as FiltersSidebar } from './components/shared/FiltersSidebar';
export { default as Breadcrumbs } from './components/shared/Breadcrumbs';
export { default as EmptyState } from './components/shared/EmptyState';
export { default as UnifiedProductCard } from './components/shared/UnifiedProductCard';
export { default as MobileProductCard } from './components/shared/MobileProductCard';
export { default as FilterSection } from './components/shared/FilterSection';
export { default as PageHeader } from './components/shared/PageHeader';
export { default as BottomSheet } from './components/shared/BottomSheet';
export { default as FilterChip } from './components/shared/FilterChip';
export { default as ExpandableSection } from './components/shared/ExpandableSection';
export { default as QuickViewModal } from './components/shared/QuickViewModal';
export { default as InfiniteScrollTrigger } from './components/shared/InfiniteScrollTrigger';

// Skeleton Components
export { default as MobileProductPageSkeleton } from './components/shared/MobileProductPageSkeleton';
export { default as MobileProductCardSkeleton } from './components/shared/ProductCardSkeleton';
export { default as MobileStorePageSkeleton } from './components/shared/MobileStorePageSkeleton';
export { default as MobileDepartmentPageSkeleton } from './components/shared/MobileDepartmentPageSkeleton';
export { default as ProductCardSkeleton } from './components/shared/ProductCardSkeleton';
export { default as StoreCardSkeleton } from './components/shared/StoreCardSkeleton';
export { SkeletonCard, SkeletonGrid, SkeletonPage, SkeletonText } from './components/shared/Skeletons';

// Types
export * from './types';

// Hooks
export { useCategoryView } from './hooks/useCategoryView';
export type { UseCategoryViewProps, UseCategoryViewReturn, MobileViewMode } from './hooks/useCategoryView';

// API (if needed)
export * from './api/categories.api';

