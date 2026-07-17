import { Heart, Plus } from "lucide-react";
import Image from "@/shared/components/SecureImage";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { StatisticsProduct } from "@/features/profile/types/statistics.types";
import { SarIcon } from "./shared/SarIcon";

export function ListProductCard({
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
		<article className="relative flex w-full items-center gap-2 rounded-[8px] bg-background p-2 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95 sm:gap-[9px] sm:p-0">
			{product.discountPercent != null && (
				<span className="absolute start-[3px] top-[3px] flex h-[15px] min-w-[31px] items-center justify-center rounded-s-[6.64px] rounded-e-none bg-red-50 px-1">
					<span
						className="text-[11px] font-bold leading-none text-red-500 sm:text-[13px]"
						style={TAJAWAL}
					>
						-{product.discountPercent}%
					</span>
				</span>
			)}
			<div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[8px] bg-card sm:h-[66px] sm:w-[71px]">
				<Image
					src={product.imageUrl}
					alt=""
					width={61}
					height={61}
					unoptimized={product.imageUrl.startsWith("data:")}
					className="h-[56px] w-[56px] object-contain sm:h-[61px] sm:w-[61px]"
				/>
			</div>
			<div className="flex min-w-0 flex-1 flex-col items-start">
				<p
					className="line-clamp-2 w-full text-start text-[13px] font-bold leading-[140%] text-foreground sm:text-[14px]"
					style={TAJAWAL}
				>
					{product.title}
				</p>
				<p
					className="text-start text-[13px] font-medium leading-snug text-foreground sm:text-[14px]"
					style={TAJAWAL}
				>
					{product.weight}
				</p>
				<div className="flex items-center justify-start gap-0.5 px-1 py-0.5">
					{product.oldPrice && (
						<div className="relative flex items-center gap-0.5 text-muted">
							<SarIcon width={8.89} height={9.96} />
							<span
								className="text-[11px] font-medium leading-[120%] sm:text-[12px]"
								style={TAJAWAL}
							>
								{product.oldPrice}
							</span>
							<span className="absolute inset-x-0 top-1/2 h-px bg-red-500" />
						</div>
					)}
					<div className="flex items-center gap-0.5 text-foreground">
						<SarIcon width={14.22} height={15.93} />
						<span
							className="text-[15px] font-medium leading-[140%] sm:text-[16px]"
							style={TAJAWAL}
						>
							{product.currentPrice}
						</span>
					</div>
				</div>
			</div>
			<div className="flex shrink-0 flex-col items-center gap-1 sm:gap-4">
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
					className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11"
				>
					<span
						className={[
							"flex h-8 w-8 items-center justify-center rounded-[35px] bg-card/80 transition-[transform] duration-200 sm:h-9 sm:w-9",
							pulsing ? "scale-[1.15]" : "scale-100",
						].join(" ")}
					>
						<Heart
							className={[
								"h-5 w-5 transition-[fill,color] duration-200",
								favorited
									? "fill-brand text-brand"
									: "fill-none text-foreground",
							].join(" ")}
							strokeWidth={favorited ? 0 : 1.5}
						/>
					</span>
				</button>
				<button
					type="button"
					aria-label={
						isArabic ? "إضافة إلى السلة" : "Add to cart"
					}
					className="flex h-10 w-10 items-center justify-center active:scale-[0.92] sm:h-11 sm:w-11"
				>
					<span className="flex h-8 w-8 items-center justify-center rounded-[74.55px] bg-brand/10 sm:h-9 sm:w-9">
						<Plus className="h-5 w-5 text-brand" strokeWidth={2.5} />
					</span>
				</button>
			</div>
		</article>
	);
}
