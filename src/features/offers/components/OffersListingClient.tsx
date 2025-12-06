"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import { motion } from "framer-motion";
import { Sparkles, Tag, TrendingUp, Clock, TrendingDown, ChevronRight, ShoppingCart, Check, Eye, Heart } from "lucide-react";
import Image from "next/image";
import offerService from "../services/offer.service";
import type { Offer } from "../types";
import { Product } from "@/shared/components";
import { TEST_PRODUCTS, TEST_STORES, TEST_CATEGORIES, TEST_DEPARTMENTS } from "@/lib/data/categories/testData";
import { navigateToProduct } from "@/lib/utils/categories/navigation";
import { useCart } from "@/shared/hooks";
import { useToast, ToastContainer } from "@/shared/components/ui";

// Category filter component
const CategoryFilter = memo(function CategoryFilter({
	categories,
	selectedCategory,
	onCategoryChange,
	isArabic,
}: {
	categories: Array<{ id: string; name: string }>;
	selectedCategory: string;
	onCategoryChange: (id: string) => void;
	isArabic: boolean;
}) {
	return (
		<div className="mb-8 flex flex-wrap gap-3">
			{categories.map((category) => (
				<button
					key={category.id}
					onClick={() => onCategoryChange(category.id)}
					className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
						selectedCategory === category.id
							? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
							: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-105"
					}`}
				>
					{category.name}
				</button>
			))}
		</div>
	);
});

// Offer Card Component
const OfferCard = memo(function OfferCard({
	offer,
	isArabic,
	onClick,
}: {
	offer: Offer;
	isArabic: boolean;
	onClick: () => void;
}) {
	const daysRemaining = useMemo(() => {
		if (!offer.validUntil) return null;
		try {
			const diff = new Date(offer.validUntil).getTime() - new Date().getTime();
			return Math.ceil(diff / (1000 * 60 * 60 * 24));
		} catch (error) {
			console.error("Error calculating days remaining:", error);
			return null;
		}
	}, [offer.validUntil]);

	const isExpired = daysRemaining !== null && daysRemaining < 0;
	const hasDiscount = offer.discount && offer.discount.value > 0;
	const hasPromoCode = offer.promoCode && offer.promoCode.trim().length > 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4 }}
			transition={{ duration: 0.3 }}
			onClick={onClick}
			className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
				isExpired ? "opacity-60" : ""
			}`}
		>
			{/* Image Container */}
			<div className="relative h-48 sm:h-56 overflow-hidden">
				<Image
					src={offer.image}
					alt={isArabic ? offer.title : offer.titleEn}
					fill
					className="object-cover group-hover:scale-110 transition-transform duration-500"
					unoptimized
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

				{/* Discount Badge */}
				{hasDiscount && !isExpired && (
					<div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg z-10">
						<TrendingDown className="w-4 h-4" />
						{offer.discount!.type === "percentage"
							? `${offer.discount!.value}%`
							: `${offer.discount!.value} ${isArabic ? "ر.س" : "SAR"}`}
					</div>
				)}

				{/* Expired Badge */}
				{isExpired && (
					<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
						<span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
							{isArabic ? "انتهى العرض" : "Expired"}
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-5 sm:p-6">
				{/* Title */}
				<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
					{isArabic ? offer.title : offer.titleEn}
				</h3>

				{/* Description */}
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
					{isArabic ? offer.description : offer.descriptionEn}
				</p>

				{/* Promo Code */}
				{hasPromoCode && !isExpired && (
					<div className="flex items-center gap-2 mb-4 p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
						<Tag className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
						<code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
							{offer.promoCode}
						</code>
					</div>
				)}

				{/* Valid Until & Days Remaining */}
				{offer.validUntil && !isExpired && (
					<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
						<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
							<Clock className="w-4 h-4 flex-shrink-0" />
							<span>
								{isArabic ? "صالح حتى" : "Valid until"}{" "}
								{(() => {
									try {
										return new Date(offer.validUntil).toLocaleDateString(
											isArabic ? "ar-SA" : "en-US",
											{ month: "short", day: "numeric", year: "numeric" }
										);
									} catch (error) {
										return offer.validUntil;
									}
								})()}
							</span>
						</div>
						{daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7 && (
							<span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded whitespace-nowrap">
								{daysRemaining} {isArabic ? "أيام" : "days"}
							</span>
						)}
					</div>
				)}

				{/* CTA Button */}
				{!isExpired && (
					<button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors group-hover:shadow-lg group-hover:shadow-emerald-500/30">
						<span>{isArabic ? "عرض التفاصيل" : "View Details"}</span>
						<ChevronRight
							className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
								isArabic ? "rotate-180" : ""
							}`}
						/>
					</button>
				)}
			</div>
		</motion.div>
	);
});

// Loading skeleton
const LoadingSkeleton = memo(function LoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-8">
			<div className="space-y-4">
				<div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-64" />
				<div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-96" />
			</div>
			<div className="flex gap-3">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-24" />
				))}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
				))}
			</div>
		</div>
	);
});

// Empty state
const EmptyState = memo(function EmptyState({ isArabic }: { isArabic: boolean }) {
	return (
		<div className="text-center py-20">
			<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
				<Tag className="w-10 h-10 text-gray-400" />
			</div>
			<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
				{isArabic ? "لا توجد عروض متاحة" : "No Offers Available"}
			</h3>
			<p className="text-gray-600 dark:text-gray-400">
				{isArabic
					? "لا توجد عروض متاحة في هذه الفئة حالياً"
					: "No offers available in this category at the moment"}
			</p>
		</div>
	);
});

// Product Discount Card Component
const ProductDiscountCard = memo(function ProductDiscountCard({
	product,
	isArabic,
	index,
	onClick,
	onAddToCart,
	addedProducts,
	addingProducts,
}: {
	product: Product;
	isArabic: boolean;
	index: number;
	onClick: () => void;
	onAddToCart: (e: React.MouseEvent, product: Product) => void;
	addedProducts: Set<string>;
	addingProducts: Set<string>;
}) {
	const calculateDiscount = (originalPrice: number, price: number) => {
		return Math.round(((originalPrice - price) / originalPrice) * 100);
	};

	const discount =
		product.originalPrice && product.price
			? calculateDiscount(product.originalPrice, product.price)
			: 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
			whileHover={{ y: -4 }}
			className="group relative cursor-pointer"
			onClick={onClick}
		>
			{/* Discount Badge */}
			{discount > 0 && (
				<div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
					-{discount}%
				</div>
			)}

			<div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
				{/* Product Image */}
				<div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
					{product.image ? (
						<Image
							src={product.image}
							alt={product.name || ""}
							fill
							className="object-cover group-hover:scale-110 transition-transform duration-500"
							unoptimized
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
					)}

					{/* Quick Actions */}
					<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition"
							aria-label={isArabic ? "عرض سريع" : "Quick view"}
						>
							<Eye className="w-5 h-5" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition"
							aria-label={isArabic ? "إضافة للمفضلة" : "Add to favorites"}
						>
							<Heart className="w-5 h-5" />
						</motion.button>
					</div>
				</div>

				{/* Content */}
				<div className="p-3 sm:p-4">
					<h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
						{isArabic ? product.nameAr || product.name : product.name}
					</h3>

					<div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
						<span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
							{product.price} {isArabic ? "ريال" : "SAR"}
						</span>
						{product.originalPrice && (
							<span className="text-xs sm:text-sm text-gray-400 line-through">
								{product.originalPrice} {isArabic ? "ريال" : "SAR"}
							</span>
						)}
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={(e) => onAddToCart(e, product)}
						disabled={addingProducts.has(product.id)}
						className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
							addedProducts.has(product.id)
								? "bg-green-500 text-white"
								: "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
						}`}
					>
						{addingProducts.has(product.id) ? (
							<>
								<div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span className="whitespace-nowrap">{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
							</>
						) : addedProducts.has(product.id) ? (
							<>
								<Check className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="whitespace-nowrap">{isArabic ? "تمت الإضافة" : "Added"}</span>
							</>
						) : (
							<>
								<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="whitespace-nowrap">{isArabic ? "أضف للسلة" : "Add to Cart"}</span>
							</>
						)}
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
});

function OffersListingClient() {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { addToCart } = useCart();
	const { toasts, showToast, removeToast } = useToast();

	const [offers, setOffers] = useState<Offer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
	const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set());

	// Get products with discounts - same logic as Discounts component
	const discountedProducts = useMemo(() => {
		try {
			const filtered = TEST_PRODUCTS.filter(
				(p) => p.badge || (p.originalPrice && p.originalPrice > (p.price || 0))
			).slice(0, 10) as Product[];
			return filtered;
		} catch (error) {
			console.error("Error filtering discounted products:", error);
			return [];
		}
	}, []);

	// Load offers
	useEffect(() => {
		async function loadOffers() {
			try {
				const fetchedOffers = await offerService.getAllOffers();
				setOffers(fetchedOffers.filter((offer) => offer.id !== 1));
			} catch (error) {
				console.error("Error loading offers:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadOffers();
	}, []);

	// Categories
	const categories = useMemo(
		() => [
			{ id: "all", name: isArabic ? "الكل" : "All" },
			{ id: "delivery", name: isArabic ? "التوصيل" : "Delivery" },
			{ id: "food", name: isArabic ? "مطاعم" : "Food" },
			{ id: "general", name: isArabic ? "عام" : "General" },
		],
		[isArabic]
	);

	// Filter offers by category
	const filteredOffers = useMemo(
		() =>
			selectedCategory === "all"
				? offers
				: offers.filter((offer) => offer.category === selectedCategory),
		[offers, selectedCategory]
	);

	// Handle offer click
	const handleOfferClick = (offer: Offer) => {
		// Validate offer data
		if (!offer || !offer.id) {
			console.error("Invalid offer data");
			return;
		}

		// Check if expired
		const daysRemaining = offer.validUntil
			? (() => {
					try {
						return Math.ceil(
							(new Date(offer.validUntil).getTime() - new Date().getTime()) /
								(1000 * 60 * 60 * 24)
						);
					} catch (error) {
						console.error("Error parsing validUntil date:", error);
						return null;
					}
			  })()
			: null;
		const isExpired = daysRemaining !== null && daysRemaining < 0;
		if (isExpired) return;

		// Navigate to offer details
		if (offer.link && offer.link.includes("/pickandorder/")) {
			try {
				// New structure: /pickandorder/[transportType]/[type]/order/details
				const pathParts = offer.link.split("/").filter(Boolean);
				const transportType = pathParts[1] || "motorbike"; // transportType
				const orderType = pathParts[2] || "one-way"; // type
				router.push(`/offers/${offer.id}?transport=${transportType}&type=${orderType}`);
			} catch (error) {
				console.error("Error parsing offer link:", error);
				router.push(`/offers/${offer.id}`);
			}
		} else {
			router.push(`/offers/${offer.id}`);
		}
	};

	// Handle product click
	const handleProductClick = useCallback((product: Product) => {
		if (!product.slug || !product.storeId) return;

		// Find the store to get categoryId
		const store = TEST_STORES.find((s) => s.id === product.storeId);
		if (!store || !store.categoryId || !store.slug) return;

		// Find the category to get slug
		const category = TEST_CATEGORIES.find((c) => c.id === store.categoryId);
		if (!category) return;

		// Find the department to get slug
		let departmentSlug = "food"; // default
		if (product.department) {
			const department = TEST_DEPARTMENTS.find(
				(d) => d.name === product.department || d.nameAr === product.department
			);
			if (department && department.slug) {
				departmentSlug = department.slug;
			} else {
				// Fallback: convert department name to slug format
				departmentSlug = product.department.toLowerCase().replace(/\s+/g, "-");
			}
		}

		// Navigate to product details
		navigateToProduct(router, category.slug, store.slug, departmentSlug, product);
	}, [router]);

	// Handle add to cart
	const handleAddToCart = useCallback(
		async (e: React.MouseEvent, product: Product) => {
			e.stopPropagation();

			if (!product.storeId) {
				showToast(
					isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
					"error"
				);
				return;
			}

			// Find store details
			const store = TEST_STORES.find((s) => s.id === product.storeId);
			if (!store) {
				showToast(isArabic ? "خطأ: المتجر غير موجود" : "Error: Store not found", "error");
				return;
			}

			const price =
				typeof product.price === "number"
					? product.price
					: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, ""));

			setAddingProducts((prev) => new Set(prev).add(product.id));

			try {
				const result = await addToCart({
					productId: product.id,
					storeId: product.storeId,
					quantity: 1,
					productName: product.name,
					productNameAr: product.nameAr,
					productImage: product.image,
					priceAtAdd: price,
					storeName: store.name,
					storeNameAr: store.nameAr,
					storeLogo: store.logo || undefined,
					stock: product.stockQuantity,
				});

				if (result.success) {
					setAddedProducts((prev) => new Set(prev).add(product.id));
					showToast(isArabic ? "تم إضافة المنتج للسلة" : "Product added to cart", "success");
				} else if (result.requiresClearCart) {
					showToast(
						isArabic
							? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً"
							: "You have items from a different store in your cart. Please clear cart first",
						"warning"
					);
				} else {
					showToast(
						result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج" : "Error adding product"),
						"error"
					);
				}
			} catch (error) {
				console.error("Error adding to cart:", error);
				showToast(isArabic ? "حدث خطأ في الاتصال" : "Connection error", "error");
			} finally {
				setAddingProducts((prev) => {
					const newSet = new Set(prev);
					newSet.delete(product.id);
					return newSet;
				});
			}
		},
		[addToCart, showToast, isArabic]
	);

	// Loading state
	if (isLoading) {
		return (
			<main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<LoadingSkeleton />
			</main>
		);
	}

	return (
		<main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-12 text-center"
			>
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
					<Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
				</div>
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
					{isArabic ? "العروض الخاصة" : "Special Offers"}
				</h1>
				<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					{isArabic
						? "اكتشف أحدث العروض والخصومات الحصرية واحصل على أفضل الصفقات"
						: "Discover our latest offers and exclusive deals. Save big with limited-time promotions!"}
				</p>
				{/* Stats */}
				<div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
					<div className="flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
						<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{filteredOffers.length} {isArabic ? "عروض متاحة" : "Active Offers"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
						<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{isArabic ? "خصومات حصرية" : "Exclusive Discounts"}
						</span>
					</div>
				</div>
			</motion.div>

			{/* Category Filter */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<CategoryFilter
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					isArabic={isArabic}
				/>
			</motion.div>

			{/* Offers Grid */}
			{filteredOffers.length === 0 ? (
				<EmptyState isArabic={isArabic} />
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
				>
					{filteredOffers.map((offer, index) => (
						<OfferCard
							key={offer.id}
							offer={offer}
							isArabic={isArabic}
							onClick={() => handleOfferClick(offer)}
						/>
					))}
				</motion.div>
			)}

			{/* Product Discounts Section */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="mt-16 sm:mt-20"
			>
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
							<Tag className="h-5 w-5 text-white" />
						</div>
						<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${
							isArabic ? "text-right" : "text-left"
						}`}>
							{isArabic ? "منتجات مخفضة" : "Discounted Products"}
						</h2>
					</div>
				</div>

				{/* Products Grid */}
				{discountedProducts.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{discountedProducts.map((product, index) => (
							<ProductDiscountCard
								key={product.id}
								product={product}
								isArabic={isArabic}
								index={index}
								onClick={() => handleProductClick(product)}
								onAddToCart={handleAddToCart}
								addedProducts={addedProducts}
								addingProducts={addingProducts}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-gray-600 dark:text-gray-400">
							{isArabic ? "لا توجد منتجات مخفضة متاحة حالياً" : "No discounted products available at the moment"}
						</p>
					</div>
				)}
			</motion.section>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</main>
	);
}

export default OffersListingClient;
