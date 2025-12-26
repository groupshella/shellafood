"use client";

import { memo, useCallback, useMemo, useState } from "react";
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
	const [isNavigating, setIsNavigating] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [imageError, setImageError] = useState(false);

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
	const handleClick = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {
		// Prevent double clicks and multiple navigations
		if (isNavigating) return;
		
		if (e) {
			e.preventDefault();
		}
		
		setIsNavigating(true);
		
		// Small delay for visual feedback, then navigate
		setTimeout(() => {
			router.push(`/categories/${product.module_id}/${product.store_id}/${product.category_id}/${product.id}`, { scroll: true });
		}, 150);
	}, [router, product.module_id, product.store_id, product.category_id, product.id, isNavigating]);

	

	

	const handleQuickAdd = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!isAvailable || isAddingToCart) return;
			
			setIsAddingToCart(true);
			
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
			} finally {
				setIsAddingToCart(false);
			}
		},
		[product, storeId, storeName, storeNameAr, addToCart, showToast, isArabic, onQuickAdd, onAddToCart, isAvailable, productImage, isAddingToCart]
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
			isNavigating={isNavigating}
			isAddingToCart={isAddingToCart}
			imageError={imageError}
			setImageError={setImageError}
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
			isNavigating={isNavigating}
			isAddingToCart={isAddingToCart}
			imageError={imageError}
			setImageError={setImageError}
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
		isNavigating={isNavigating}
		isAddingToCart={isAddingToCart}
		imageError={imageError}
		setImageError={setImageError}
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
	isNavigating?: boolean;
	isAddingToCart?: boolean;
	imageError?: boolean;
	setImageError?: (error: boolean) => void;
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
	isNavigating = false,
	isAddingToCart = false,
	imageError = false,
	setImageError,
}: VariantProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.03, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
			onClick={onClick}
			className={cn(
				"relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer",
				"shadow-sm hover:shadow-lg dark:shadow-gray-900/50 dark:hover:shadow-gray-900/80",
				isNavigating 
					? "border-green-500 dark:border-green-400 opacity-75 pointer-events-none" 
					: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600",
				className
			)}
			whileHover={{ scale: 1.02, y: -2 }}
			whileTap={{ scale: 0.98 }}
			role="button"
			tabIndex={0}
			aria-label={isArabic ? `عرض ${displayName}` : `View ${displayName}`}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 overflow-hidden group/image">
				{!imageError && (product.image_full_url || product.image) ? (
					<>
						<Image
							src={product.image_full_url || product.image}
							alt={displayName}
							fill
							sizes={getImageSizes('card')}
							className="object-cover transition-transform duration-500 group-hover/image:scale-110"
							loading="lazy"
							quality={getImageQuality('card')}
							placeholder="blur"
							blurDataURL={getImageBlurDataURL()}
							onError={() => setImageError?.(true)}
						/>
						{/* Subtle gradient overlay for better text readability */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
					</>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500 transition-transform group-hover/image:scale-110 duration-300" />
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
					<motion.button
						onClick={onQuickAdd}
						disabled={isAddingToCart}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={cn(
							"w-full py-2.5 text-white text-sm font-bold rounded-lg transition-all duration-200",
							"flex items-center justify-center gap-2 min-h-[44px]",
							isAddingToCart
								? "bg-green-500 dark:bg-green-600 cursor-wait"
								: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-700 shadow-md hover:shadow-lg"
						)}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						{isAddingToCart ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
							</>
						) : (
							<>
								<ShoppingCart className="w-4 h-4" />
								<span>{isArabic ? "أضف" : "Add"}</span>
							</>
						)}
					</motion.button>
				) : (
					<button
						disabled
						className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed min-h-[44px]"
						aria-label={isArabic ? "غير متوفر" : "Out of Stock"}
					>
						{isArabic ? "غير متوفر" : "Out of Stock"}
					</button>
				)}

				{/* Loading overlay when navigating */}
				{isNavigating && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-30 rounded-xl"
					>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
							<span className="text-white text-xs font-medium">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
						</div>
					</motion.div>
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
	isNavigating = false,
	isAddingToCart = false,
	imageError = false,
	setImageError,
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
				"group relative rounded-lg border bg-white dark:bg-gray-800 p-2",
				"shadow-sm dark:shadow-gray-900/50 transition-all duration-200",
				isNavigating 
					? "border-green-500 dark:border-green-400 opacity-75 pointer-events-none" 
					: "border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-green-300 dark:hover:border-green-600",
				"cursor-pointer",
				className
			)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden rounded-md bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 mb-2 group/image">
				{!imageError && (product.image_full_url || product.image) ? (
					<>
						<Image
							src={product.image_full_url || product.image}
							alt={displayName}
							fill
							className="object-cover transition-transform duration-500 group-hover/image:scale-110"
							loading="lazy"
							sizes={getImageSizes('card')}
							quality={getImageQuality('card')}
							placeholder="blur"
							blurDataURL={getImageBlurDataURL()}
							onError={() => setImageError?.(true)}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
					</>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500 transition-transform group-hover/image:scale-110 duration-300" />
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
					<motion.button
						onClick={onQuickAdd}
						disabled={isAddingToCart}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className={cn(
							"absolute rounded-full text-white shadow-lg transition-all duration-200 z-10",
							"min-w-[36px] min-h-[36px] flex items-center justify-center",
							isAddingToCart
								? "bg-green-500 dark:bg-green-600 cursor-wait"
								: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800",
							isArabic ? "left-1 bottom-1" : "right-1 bottom-1"
						)}
						title={isArabic ? "إضافة للسلة" : "Add to cart"}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						{isAddingToCart ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
							</svg>
						)}
					</motion.button>
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

				{/* Loading overlay when navigating */}
				{isNavigating && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-30 rounded-lg"
					>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
							<span className="text-white text-xs font-medium">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
						</div>
					</motion.div>
				)}
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
	isNavigating = false,
	isAddingToCart = false,
	imageError = false,
	setImageError,
}: VariantProps & { showActions?: boolean; showDelivery?: boolean }) {
	const isLowStock = isAvailable && product.stock !== undefined && product.stock < 10;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.03, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
			onClick={onClick}
			className={cn(
				"relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer",
				"shadow-sm hover:shadow-lg dark:shadow-gray-900/50 dark:hover:shadow-gray-900/80",
				isNavigating 
					? "border-green-500 dark:border-green-400 opacity-75 pointer-events-none" 
					: "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
			)}
			whileHover={{ scale: 1.01, y: -2 }}
			whileTap={{ scale: 0.99 }}
			role="button"
			tabIndex={0}
			aria-label={isArabic ? `عرض ${displayName}` : `View ${displayName}`}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 overflow-hidden group/image">
				{!imageError && product.image ? (
					<>
						<Image
							src={product.image}
							alt={displayName}
							fill
							sizes={getImageSizes('card')}
							className="object-cover transition-transform duration-500 group-hover/image:scale-110"
							loading="lazy"
							quality={getImageQuality('card')}
							placeholder="blur"
							blurDataURL={getImageBlurDataURL()}
							onError={() => setImageError?.(true)}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
					</>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500 transition-transform group-hover/image:scale-110 duration-300" />
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
					<motion.button
						onClick={onQuickAdd}
						disabled={favoriteLoading || isAddingToCart}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={cn(
							"w-full py-2.5 text-white text-sm font-bold rounded-lg transition-all duration-200",
							"disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]",
							"shadow-md hover:shadow-lg",
							isFavorite 
								? "bg-green-500 dark:bg-green-500" 
								: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-700"
						)}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						{isAddingToCart ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
							</>
						) : favoriteLoading ? (
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
							<>
								<ShoppingCart className="w-4 h-4" />
								<span>{isArabic ? "أضف للسلة" : "Add to cart"}</span>
							</>
						)}
					</motion.button>
				) : (
					<button
						disabled
						className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed min-h-[44px]"
						aria-label={isArabic ? "غير متوفر" : "Out of Stock"}
					>
						{isArabic ? "غير متوفر" : "Out of Stock"}
					</button>
				)}
			</div>

			{/* Loading overlay when navigating */}
			{isNavigating && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-30 rounded-xl"
				>
					<div className="flex flex-col items-center gap-2">
						<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
						<span className="text-white text-xs font-medium">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
					</div>
				</motion.div>
			)}

			{/* Toast Container */}
			<ToastContainer toasts={[]} onRemoveToast={() => {}} isArabic={isArabic} />
		</motion.div>					
	);
}

export default memo(UnifiedProductCard);

