"use client";

import { memo, useCallback, useMemo } from "react";
import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FavoriteButton, ToastContainer } from "@/shared/components/ui";
import { useProductFavorites, useCart } from "@/shared/hooks";
import { useToast } from "@/shared/components/ui";
import { fadeInUp } from "../../lib/utils/animations";
import { cn } from "@/shared/utils";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";
import { Item } from "../../types/department.types";

interface UnifiedProductCardProps {
	product: Item;
	variant?: 'default' | 'mobile' | 'compact';
	onClick?: (productId: string) => void;
	onQuickAdd?: (product: Item) => void;
	onAddToCart?: (product: Item) => void;
	showRating?: boolean;
	showStock?: boolean;
	showActions?: boolean;
	showAddButton?: boolean;
	showDelivery?: boolean;
	storeId?: number;
	storeName?: string;
	storeNameAr?: string;
	categoryId?: number;
	index?: number;
	className?: string;
}

/**
 * Unified ProductCard Component
 * Consolidates all ProductCard variants (default, mobile, compact, list) into a single component
 */
function UnifiedProductCard({
	product,
	variant,
	onClick,
	onQuickAdd,
	onAddToCart,
	showRating = true,
	showStock = true,
	showActions = true,
	showAddButton = true,
	showDelivery = false,
	storeId,
	storeName,
	storeNameAr,
	categoryId,
	index = 0,
	className,
}: UnifiedProductCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const { addToCart } = useCart();
	const { showToast } = useToast();

	// Get display name from translations
	const displayName = useMemo(() => {
		if (isArabic) {
			const arTranslation = product.translations?.find(
				(t: any) => t.locale === 'ar' && t.key === 'name'
			);
			return arTranslation?.value || product.name;
		}
		return product.name;
	}, [product, isArabic]);

	// Get display unit from translations
	const displayUnit = useMemo(() => {
		if (isArabic) {
			const arTranslation = product.unit?.translations?.find(
				(t: any) => t.locale === 'ar' && t.key === 'unit'
			);
			return arTranslation?.value || product.unit?.unit || '';
		}
		return product.unit?.unit || '';
	}, [product, isArabic]);

	// Get badge (discount percentage)
	const displayBadge = useMemo(() => {
		if (product.discount > 0 && product.discount_type) {
			const discountValue = product.discount_type === 'percentage' 
				? `${product.discount}%` 
				: `${product.discount} ${isArabic ? 'ريال' : 'SAR'}`;
			return isArabic ? `${discountValue} خصم` : `${discountValue} OFF`;
		}
		return undefined;
	}, [product, isArabic]);

	// Check availability
	const isAvailable = useMemo(() => {
		return product.availability?.is_available ?? (product.stock > 0 && product.status === 1);
	}, [product]);

	// Check if has discount
	const hasDiscountPrice = useMemo(() => {
		return product.original_price > 0 && product.original_price > product.price;
	}, [product]);

	// Get product image
	const productImage = useMemo(() => {
		return product.image_full_url || product.image || '';
	}, [product]);

	// Product favorites hook
	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useProductFavorites(
		product.id.toString(),
		{
			name: product.name,
			nameAr: product.translations?.find((t: any) => t.locale === 'ar' && t.key === 'name')?.value || product.name,
			image: productImage,
			price: product.price,
			originalPrice: product.original_price > 0 ? product.original_price : undefined,
			unit: product.unit?.unit || '',
			unitAr: product.unit?.translations?.find((t: any) => t.locale === 'ar' && t.key === 'unit')?.value || product.unit?.unit || '',
			storeId: (product.store_id || storeId)?.toString(),
		}
	);

	// Handlers
	const handleClick = useCallback(() => {
		// Scroll to top immediately when clicking (before navigation)
		window.scrollTo({ top: 0, behavior: 'instant' });
		router.push(`/categories/${product.module_id}/${product.store_id}/${product.category_id}/${product.id}`, { scroll: false });
	}, [onClick, product, storeId, categoryId, router]);

	

	

	const handleQuickAdd = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!isAvailable) return;
			try {
				const finalStoreId = product.store_id || storeId;
				const result = await addToCart({
					productId: product.id.toString(),
					storeId: finalStoreId?.toString() || '',
					quantity: 1,
					productName: product.name,
					productNameAr: product.translations?.find((t: any) => t.locale === 'ar' && t.key === 'name')?.value || product.name,
					productImage: productImage,
					priceAtAdd: product.price,
					storeName: storeName || product.store_name || "",
					storeNameAr: storeNameAr || "",
					stock: product.stock,
				});

				if (result.success) {
					showToast(
						isArabic ? "تم الإضافة للسلة" : "Added to cart",
						"success"
					);
					onQuickAdd?.(product);
				onAddToCart?.(product);
				} else if (result.requiresClearCart) {
					showToast(
						isArabic
							? "لديك منتجات من متجر آخر في السلة"
							: "You have items from a different store in your cart",
						"warning"
					);
				}
			} catch (error) {
				showToast(
					isArabic ? "حدث خطأ" : "An error occurred",
					"error"
				);
			}
		},
		[product, storeId, storeName, storeNameAr, addToCart, showToast, isArabic, onQuickAdd, onAddToCart, isAvailable, productImage]
	);

	// Auto-detect variant if not specified (backward compatibility)
	const detectedVariant = variant || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'default');

	// Render based on variant
	if (detectedVariant === 'mobile') {
		return <MobileVariant 
			product={product}
			displayName={displayName}
			displayUnit={displayUnit}
			displayBadge={displayBadge}
			isAvailable={isAvailable}
			hasDiscountPrice={hasDiscountPrice}
			isFavorite={isFavorite}
			favoriteLoading={favoriteLoading}
			toggleFavorite={toggleFavorite}
			onClick={handleClick}
			onQuickAdd={handleQuickAdd}
			showRating={showRating}
			showActions={showActions}
			showAddButton={showAddButton}
			isArabic={isArabic}
			index={index}
			className={className}
		/>;
	}

	if (detectedVariant === 'compact') {
		return <CompactVariant 
			product={product}
			displayName={displayName}
			displayUnit={displayUnit}
			displayBadge={displayBadge}
			isAvailable={isAvailable}
			hasDiscountPrice={hasDiscountPrice}
			isFavorite={isFavorite}
			favoriteLoading={favoriteLoading}
			toggleFavorite={toggleFavorite}
			onClick={handleClick}
			onQuickAdd={handleQuickAdd}
			showRating={showRating}
			showStock={showStock}
			showActions={showActions}
			showAddButton={showAddButton}
			isArabic={isArabic}
			direction={direction}
			index={index}
			className={className}
		/>;
	}

	// Default variant
	return <DefaultVariant 
		product={product}
		displayName={displayName}
		displayUnit={displayUnit}
		displayBadge={displayBadge}
		isAvailable={isAvailable}
		hasDiscountPrice={hasDiscountPrice}
		isFavorite={isFavorite}
		favoriteLoading={favoriteLoading}
		toggleFavorite={toggleFavorite}
		onClick={handleClick}
		onQuickAdd={handleQuickAdd}
		showActions={showActions}
		showAddButton={showAddButton}
		showRating={showRating}
		showStock={showStock}
		showDelivery={showDelivery}
		isArabic={isArabic}
		direction={direction}
		index={index}
		className={className}
	/>;
}

// Mobile Variant Component
interface VariantProps {
	product: Item;
	displayName: string;
	displayUnit: string;
	displayBadge?: string;
	isAvailable: boolean;
	hasDiscountPrice: boolean;
	isFavorite: boolean;
	favoriteLoading: boolean;
	toggleFavorite: () => void;
	onClick: () => void;
	onQuickAdd: (e: React.MouseEvent) => void;
	showRating?: boolean;
	showStock?: boolean;
	showActions?: boolean;
	showAddButton?: boolean;
	isArabic: boolean;
	direction?: string;
	index: number;
	className?: string;
}

function MobileVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showRating = true,
	showActions = true,
	showAddButton = true,
	showStock = true,
	isArabic,
	index,
	className,
}: VariantProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.05, duration: 0.2 }}
			onClick={onClick}
			className={cn(
				"relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700",
				"active:scale-98 transition-transform cursor-pointer",
				className
			)}
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
				{product.image_full_url || product.image ? (
					<Image
						src={product.image_full_url || product.image}
						alt={displayName}
						fill
						sizes={getImageSizes('card')}
						className="object-cover"
						loading="lazy"
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-12 h-12 text-gray-400" />
					</div>
				)}

				{/* Badge */}
				{displayBadge && (
					<div
						className={cn(
							"absolute top-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md z-10",
							isArabic ? "right-2" : "left-2"
						)}
					>
						{displayBadge}
					</div>
				)}

				{/* Favorite Button */}
				<div
					className={cn("absolute top-2 z-10", isArabic ? "left-2" : "right-2")}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
						className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
					/>
				</div>

				{/* Out of stock overlay */}
				{!isAvailable && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
						<span className="text-white font-bold text-sm">
							{isArabic ? "غير متوفر" : "Out of Stock"}
						</span>
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-3">
				{/* Name */}
				<h3
					className={cn(
						"text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2.5rem]",
						isArabic ? "text-right" : "text-left"
					)}
				>
					{displayName}
				</h3>

				{/* Price */}
				<div
					className={cn(
						"flex items-baseline gap-1 mb-2",
						isArabic ? " justify-end" : "justify-start"
					)}
				>
					<span className="text-lg font-black text-green-600 dark:text-green-400">
						{product.price}
					</span>
					<span className="text-xs text-gray-600 dark:text-gray-400">{isArabic ? "ريال" : "SAR"}</span>
					{hasDiscountPrice && product.original_price > 0 && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-1">
							{product.original_price}
						</span>
					)}
				</div>

				{/* Rating */}
				{showRating && product.avg_rating > 0 && (
					<div
						className={cn(
							"flex items-center gap-1 mb-3",
							isArabic ? " justify-end" : "justify-start"
						)}
					>
						<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-semibold text-gray-900 dark:text-white">
							{product.avg_rating.toFixed(1)}
						</span>
						{product.rating_count > 0 && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({product.rating_count > 999 ? "999+" : product.rating_count})
							</span>
						)}
					</div>
				)}

				{/* Add to cart button */}
				{isAvailable ? (
					<button
						onClick={onQuickAdd}
						className="w-full py-2.5 bg-green-600 dark:bg-green-500 text-white text-sm font-bold rounded-lg active:scale-95 transition-transform hover:bg-green-700 dark:hover:bg-green-600"
					>
						{isArabic ? "أضف" : "Add"}
					</button>
				) : (
					<button
						disabled
						className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed"
					>
						{isArabic ? "غير متوفر" : "Out of Stock"}
					</button>
				)}
			</div>
		</motion.div>
	);
}

// Compact Variant Component
function CompactVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showRating = true,
	showActions = true,
	showAddButton = true,
	showStock = true,
	isArabic,
	direction,
	index,
	className,
}: VariantProps) {
	const isLowStock = isAvailable && product.stock !== undefined && product.stock < 10;

	return (
		<motion.div
			dir={direction}
			variants={fadeInUp}
			initial="initial"
			animate="animate"
			onClick={onClick}
			className={cn(
				"group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2",
				"shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:shadow-md",
				"hover:border-green-300 dark:hover:border-green-600 cursor-pointer",
				className
			)}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 mb-2">
				{product.image_full_url || product.image ? (
					<Image
						src={product.image_full_url || product.image}
						alt={displayName}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
						sizes={getImageSizes('card')}
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
					</div>
				)}

				{/* Badge */}
				{displayBadge && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white shadow-lg z-10",
							isArabic ? "right-1" : "left-1"
						)}
					>
						{displayBadge}
					</span>
				)}

				{/* Stock Status */}
				{showStock && !isAvailable && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-1" : "right-1"
						)}
					>
						{isArabic ? "نفد" : "Out"}
					</span>
				)}
				{showStock && isLowStock && isAvailable && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-1" : "right-1"
						)}
					>
						{isArabic ? "كمية محدودة" : "Low Stock"}
					</span>
				)}

				{/* Favorite Button */}
				<div
					className={cn("absolute z-10", isArabic ? "left-1 top-1" : "right-1 top-1")}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
					/>
				</div>

				{/* Add to Cart Button */}
				{showActions && showAddButton && isAvailable && (
					<button
						onClick={onQuickAdd}
						className={cn(
							"absolute rounded-full bg-green-600 p-1.5 text-white shadow-lg transition-all duration-200",
							"hover:bg-green-700 hover:scale-110 active:scale-95 z-10",
							isArabic ? "left-1 bottom-1" : "right-1 bottom-1"
						)}
						title={isArabic ? "إضافة للسلة" : "Add to cart"}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
					</button>
				)}
			</div>

			{/* Product Info */}
			<div className={cn(isArabic ? "text-right" : "text-left")}>
				{/* Name */}
				<h3 className="line-clamp-2 text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1 min-h-[2rem] leading-tight">
					{displayName}
				</h3>

				{/* Unit */}
				{displayUnit && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{displayUnit}</p>
				)}

				{/* Rating */}
				{showRating && product.avg_rating > 0 && (
					<div
						className={cn(
							"flex items-center gap-1 mb-1",
							isArabic ? " justify-end" : "justify-start"
						)}
					>
						<Star className="h-2.5 w-2.5 text-yellow-400 flex-shrink-0 fill-yellow-400" />
						<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
							{product.avg_rating.toFixed(1)}
						</span>
					</div>
				)}

				{/* Price */}
				<div
					className={cn(
						"flex items-center gap-1",
						isArabic ? " justify-end" : "justify-start"
					)}
				>
					<span className="text-sm font-bold text-green-600 dark:text-green-400">
						{product.price} {isArabic ? "ريال" : "SAR"}
					</span>
					{hasDiscountPrice && product.original_price > 0 && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through">
							{product.original_price}
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
}

// Default Variant Component
function DefaultVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showActions = true,
	showAddButton = true,
	showRating = true,
	showStock = true,
	showDelivery = false,
	isArabic,
	direction,
	index,
	className,
}: VariantProps & { showActions?: boolean; showDelivery?: boolean }) {
	const isLowStock = isAvailable && product.stock !== undefined && product.stock < 10;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.05, duration: 0.2 }}
			onClick={onClick}
			className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 active:scale-98 transition-transform cursor-pointer"
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
				{product.image ? (
					<Image
						src={product.image}
						alt={displayName}
						fill
						sizes={getImageSizes('card')}
						className="object-cover"
						loading="lazy"
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-12 h-12 text-gray-400" />
					</div>
				)}

				{/* Badge - Top left */}
				{displayBadge && (
					<div
						className={`absolute top-2 ${isArabic ? "right-2" : "left-2"} px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md z-10`}
					>
						{displayBadge}
					</div>
				)}

				{/* Favorite - Top right */}
				<div
					className={`absolute top-2 ${isArabic ? "left-2" : "right-2"} z-10`}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
						className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
					/>
				</div>

				{/* Out of stock overlay */}
				{!isAvailable && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
						<span className="text-white font-bold text-sm">
							{isArabic ? "غير متوفر" : "Out of Stock"}
						</span>
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-3">
				{/* Name - 2 lines max */}
				<h3
					className={`text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2.5rem] ${
						isArabic ? "text-right" : "text-left"
					}`}
				>
					{displayName}
				</h3>

				{/* Price - Large and prominent */}
				<div
					className={`flex items-baseline gap-1 mb-2 ${
						isArabic ? " justify-end" : "justify-start"
					}`}
				>
					<span className="text-lg font-black text-green-600 dark:text-green-400">
						{product.price}
					</span>
					<span className="text-xs text-gray-600 dark:text-gray-400">SAR</span>
					{hasDiscountPrice && product.original_price > 0 && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-1">
							{product.original_price}
						</span>
					)}
				</div>

				{/* Rating - Compact */}
				{showRating && product.avg_rating > 0 && (
					<div
						className={`flex items-center gap-1 mb-3 ${
							isArabic ? " justify-end" : "justify-start"
						}`}
					>
						<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-semibold text-gray-900 dark:text-white">
							{product.avg_rating.toFixed(1)}
						</span>
						{product.rating_count > 0 && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({product.rating_count > 999 ? "999+" : product.rating_count})
							</span>
						)}
					</div>
				)}

				{/* Add to cart - Full width, easy to tap */}
					{isAvailable ? (
					<button
						onClick={onQuickAdd}
						disabled={favoriteLoading}
						className={`w-full py-2.5 text-white text-sm font-bold rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
							isFavorite 
								? "bg-green-500 dark:bg-green-500" 
								: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
						}`}
					>
							{favoriteLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>{isArabic ? "جاري الإضافة للمفضلة..." : "Adding to favorites..."}</span>
							</>
						) : isFavorite ? (
							<>
								<Check className="w-4 h-4" />
								<span>{isArabic ? "تمت الإضافة للمفضلة" : "Added to favorites"}</span>
							</>
						) : (
							<span>{isArabic ? "أضف للمفضلة" : "Add to favorites"}</span>
						)}
					</button>
				) : (
					<button
						disabled
						className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed"
					>
						{isArabic ? "غير متوفر" : "Out of Stock"}
					</button>
				)}
			</div>

			{/* Toast Container */}
			<ToastContainer toasts={[]} onRemoveToast={() => {}} isArabic={isArabic} />
		</motion.div>					
	);
}

export default memo(UnifiedProductCard);

