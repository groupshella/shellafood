// Main barrel export for categories components
export * from './category-list';
export * from './store';
export * from './product';
export * from './department';
// Export from shared, but exclude ProductCard to avoid conflict with product/ProductCard
export { 
	UnifiedProductCard,
	MobileProductCard,
	FilterSection,
	FiltersSidebar,
	EmptyState,
	PageHeader,
	BottomSheet,
	FilterChip,
	ExpandableSection,
	QuickViewModal,
	Breadcrumbs,
	InfiniteScrollTrigger,
	MobileStorePageSkeleton,
	MobileProductPageSkeleton,
	ProductCardSkeleton,
	MobileProductCardSkeleton,
	MobileDepartmentPageSkeleton,
	StoreCardSkeleton,
	SkeletonCard,
	SkeletonGrid,
	SkeletonPage,
	SkeletonText
} from './shared';

// Category Details Components (direct exports since index.ts was removed)
export { default as CategoryPage } from './category-details/CategoryPage';
export { default as CategoryView } from './category-details/CategoryView';
export { default as CategoryCard } from './category-details/CategoryCard';
export { default as Pagination } from './category-details/Pagination';
export { default as DailyNeeded } from './category-details/DailyNeeded';

