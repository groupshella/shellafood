"use client";

import { useMemo, useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Grid3x3, X, Store } from "lucide-react";
import { useLanguage } from "@/providers";
import { Breadcrumbs, EmptyState } from "../shared";
import DepartmentCard from "./DepartmentSection";
import Pagination from "../category-details/Pagination";
import useSWR from "swr";
import type { DepartmentsResponse } from "../../api/departments.api";

interface DepartmentsPageProps {
	initialDepartments: DepartmentsResponse;
	initialLimit: number;
	initialPage: number;
	storeId: number;
	moduleId: number;
	zoneId: number;
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch departments');
	return res.json();
};

export default function DepartmentsPage({
	initialDepartments,
	initialLimit,
	initialPage,
	storeId,
	zoneId,
	moduleId,
	
}: DepartmentsPageProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const [searchTerm, setSearchTerm] = useState("");
	const [isPending, startTransition] = useTransition();

	// Get current page from URL
	const currentPage = Number(searchParams.get('page')) || initialPage;
	const currentLimit = initialLimit;

	// Only fetch when user has paginated (page changed from initial)
	const hasPaginated = currentPage !== initialPage;
	const shouldFetch = hasPaginated;


	// SWR for pagination
	const { data: departmentsData, isLoading, error } = useSWR<DepartmentsResponse>(
		shouldFetch 
			? `/api/departments?storeId=${storeId}&limit=${currentLimit}&offset=${currentPage}&locale=${language}&moduleId=${moduleId}&zoneId=${zoneId}`
			: null,
		fetcher,
		{
			fallbackData: initialDepartments,
			revalidateOnMount: false,
			revalidateOnFocus: false,
			keepPreviousData: true,
			dedupingInterval: 10000,
		}
	);

	const currentDepartments = departmentsData || initialDepartments;
console.log(currentDepartments);
	// Filter departments based on search
	const filteredDepartments = useMemo(() => {
		if (!searchTerm.trim()) {
			return currentDepartments.categories;
		}

		const searchLower = searchTerm.toLowerCase();
		return currentDepartments.categories.filter((dept) => {
			const nameMatch = dept.name?.toLowerCase().includes(searchLower);
			const nameArMatch = dept.name_ar?.toLowerCase().includes(searchLower);
			return nameMatch || nameArMatch;
		});
	}, [currentDepartments.categories, searchTerm]);

	const breadcrumbItems = useMemo(
		() => [
			{ label: isArabic ? "الرئيسية" : "Home", href: "/home" },
			{
				label: isArabic ? "الأقسام" : "Categories",
				href: "/categories",
			},
			{
				label: currentDepartments.store_name,
				href: `/categories/${moduleId}/${storeId}`,
			},
			{ label: isArabic ? "كل الأقسام" : "All Departments" },
		],
		[isArabic, currentDepartments.store_name, moduleId, storeId]
	);

	const t = useMemo(() => ({
		searchPlaceholder: isArabic ? "ابحث في الأقسام..." : "Search departments...",
		noResults: isArabic ? "لا توجد أقسام" : "No departments found",
		noResultsDesc: isArabic ? "جرب البحث بكلمات أخرى" : "Try different search terms",
		clearSearch: isArabic ? "مسح" : "Clear",
		showing: isArabic ? "عرض" : "Showing",
		of: isArabic ? "من" : "of",
		departments: isArabic ? "قسم" : "departments",
		back: isArabic ? "رجوع" : "Back",
		allDepartments: isArabic ? "كل الأقسام" : "All Departments",
		loading: isArabic ? "جاري التحميل..." : "Loading...",
	}), [isArabic]);

	const handleClearSearch = useCallback(() => {
		setSearchTerm("");
	}, []);

	const handlePageChange = useCallback((page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
		startTransition(() => {
			router.push(`/categories/${moduleId}/${storeId}/departments?${params.toString()}`, { scroll: true });
		});

		// Scroll to top
	}, [router, searchParams, moduleId, storeId]);

	// Calculate total pages
	const totalPages = currentDepartments.total_categories 
		? Math.ceil(currentDepartments.total_categories / currentLimit)
		: 1;

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={direction}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<EmptyState
						icon="❌"
						title={isArabic ? "خطأ في تحميل الأقسام" : "Error loading departments"}
						description={isArabic ? "يرجى المحاولة مرة أخرى" : "Please try again"}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={direction}>
			{/* Compact Hero Section */}
			<div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
					{/* Breadcrumbs */}
					<div className="mb-4">
						<Breadcrumbs items={breadcrumbItems} />
					</div>

					{/* Store Header */}
					<div className={`flex items-center justify-between gap-3 sm:gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
						<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
							<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
								{t.allDepartments}
							</h1>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Store className="w-4 h-4" />
								<span>{currentDepartments.store_name}</span>
								<span>•</span>
								<span>{currentDepartments.total_categories} {t.departments}</span>
							</div>
						</div>

					
					</div>
				</div>
			</div>

			{/* Search Bar */}
			<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="relative">
						<Search className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400 pointer-events-none`} />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder={t.searchPlaceholder}
							disabled={isPending || isLoading}
							className={`
								w-full ${isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3
								bg-gray-50 dark:bg-gray-800
								border border-gray-200 dark:border-gray-700
								rounded-xl
								text-sm text-gray-900 dark:text-white
								placeholder-gray-500 dark:placeholder-gray-400
								focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
								transition-all duration-200
								disabled:opacity-50 disabled:cursor-not-allowed
							`}
						/>
						<AnimatePresence>
							{searchTerm && (
								<motion.button
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									onClick={handleClearSearch}
									className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors`}
								>
									<X className="w-3.5 h-3.5" />
								</motion.button>
							)}
						</AnimatePresence>
					</div>

					{/* Results Counter */}
					<AnimatePresence>
						{searchTerm && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="pt-3 text-sm text-gray-600 dark:text-gray-400"
							>
								{t.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredDepartments.length}</span> {t.of} <span className="font-semibold">{currentDepartments.categories.length}</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Loading Indicator */}
			<AnimatePresence>
				{(isPending || isLoading) && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-center justify-center py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800"
					>
						<div className="w-5 h-5 border-2 border-green-600 dark:border-green-500 border-t-transparent rounded-full animate-spin" />
						<span className={`${isArabic ? "mr-2" : "ml-2"} text-sm text-green-700 dark:text-green-400 font-medium`}>
							{t.loading}
						</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Departments Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{filteredDepartments.length > 0 ? (
					<>
						<motion.div
							key={currentPage}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
						>
							{filteredDepartments.map((department, index) => {
								// Convert DepartmentItem to CategoryDetail format
								const categoryDetail: any = {
									id: department.id,
									name: department.name,
									name_en: department.name,
									name_ar: department.name_ar,
									description: '',
									description_en: '',
									description_ar: '',
									image: department.image,
									image_full_url: department.image,
									parent_id: department.parent_id,
									position: department.position,
									status: 1,
									created_at: '',
									updated_at: '',
									featured: 0,
									priority: 0,
									module_id: moduleId,
									cat_site_id: '',
									slug: `department-${department.id}`,
									storage: [],
									translations: [],
								};

								return (
									<DepartmentCard
										key={department.id}
										department={categoryDetail}
										index={index}
										categoryId={moduleId}
										storeId={storeId}
									/>
								);
							})}
						</motion.div>

						{/* Pagination */}
						{totalPages > 1 && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								totalItems={currentDepartments.total_categories}
								itemsPerPage={currentLimit}
								maxVisiblePages={7}
								disabled={isPending || isLoading}
							/>
						)}
					</>
				) : (
					<EmptyState
						icon="🏪"
						title={t.noResults}
						description={t.noResultsDesc}
					/>
				)}
			</div>
		</div>
	);
}
