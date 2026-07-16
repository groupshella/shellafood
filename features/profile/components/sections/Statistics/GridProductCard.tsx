import { Heart, Plus } from "lucide-react";
import Image from "next/image";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsProduct } from "@/features/profile/types/statistics.types";

export function GridProductCard({
	product,
	favorited,
	pulsing,
	onToggleHeart,
	isArabic = true,
}: {
	product: StatisticsProduct;
	favorited: boolean;
	pulsing: boolean;
	onToggleHeart: () => void;
	isArabic?: boolean;
}) {
	return (
		<article className="relative rounded-[8px] bg-background p-3 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95">
			<button
				type="button"
				aria-label={
					favorited
						? isArabic
							? "إزالة من المفضلة"
							: "Remove from favorites"
						: isArabic
							? "إضافة إلى المفضلة"
							: "Add to favorites"
				}
				onClick={onToggleHeart}
				className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center"
			>
				<span
					className={[
						"flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm transition-transform duration-200",
						pulsing ? "scale-[1.15]" : "scale-100",
					].join(" ")}
				>
					<Heart
						className={[
							"h-[18px] w-[18px] transition-[fill,color] duration-200",
							favorited
								? "fill-brand text-brand"
								: "fill-none text-muted",
						].join(" ")}
						strokeWidth={favorited ? 0 : 1.5}
					/>
				</span>
			</button>
			{product.discountPercent != null && (
				<span className="absolute start-3 top-3 rounded bg-red-50 px-1.5 py-0.5 text-[12px] font-bold text-red-500">
					-{product.discountPercent}%
				</span>
			)}
			<div className="mx-auto flex h-[100px] w-full items-center justify-center">
				<Image
					src={product.imageUrl}
					alt=""
					width={100}
					height={100}
					unoptimized={product.imageUrl.startsWith("data:")}
					className="h-full w-full object-contain"
				/>
			</div>
			<div className="mt-2 text-start">
				<p
					className="line-clamp-2 text-[14px] font-bold text-foreground"
					style={TAJAWAL}
				>
					{product.title}
				</p>
				<p className="text-[12px] text-muted" style={TAJAWAL}>
					{product.weight}
				</p>
			</div>
			<div className="mt-2 flex items-end justify-between">
				<div className="text-start">
					{product.oldPrice && (
						<p
							className="text-[12px] text-muted line-through"
							style={TAJAWAL}
						>
							{product.oldPrice}
						</p>
					)}
					<p
						className="text-[16px] font-bold text-foreground"
						style={TAJAWAL}
					>
						{product.currentPrice}
					</p>
				</div>
				<button
					type="button"
					aria-label={
						isArabic ? "إضافة إلى السلة" : "Add to cart"
					}
					className="flex h-9 w-9 items-center justify-center rounded-full bg-brand active:scale-[0.92]"
				>
					<Plus
						className="h-4 w-4 text-brand-foreground"
						strokeWidth={2}
					/>
				</button>
			</div>
		</article>
	);
}
