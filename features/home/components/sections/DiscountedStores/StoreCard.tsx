import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Star, Clock, Bike } from "lucide-react";
import { DiscountedStore } from "@/features/home/types/discounted-stores.types";

function formatDiscount(store: DiscountedStore): string | null {
	if (!store.discount_status) return null;
	return "عرض خاص";
}

export const StoreCard = memo(function StoreCard({ store }: { store: DiscountedStore }) {
	const discountLabel = formatDiscount(store);
	const isOpen = store.is_open;

	return (
		<Link
			href={`/stores/${store.id}`}
			className={[
				"group flex w-[min(72vw,300px)] min-w-[220px] shrink-0 flex-col overflow-hidden rounded-xl bg-white",
				"shadow-sm ring-1 ring-black/[0.04] outline-none",
				"transition-transform duration-150 active:scale-[0.98]",
				"focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
				"dark:bg-gray-800 dark:ring-white/[0.06]",
				"sm:w-[260px] sm:min-w-[260px] md:w-[280px] lg:w-[300px] xl:w-[320px]",
				"sm:rounded-2xl",
			].join(" ")}
			aria-label={store.name}
		>
			<div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-700">
				<Image
					src={store.cover_photo_full_url}
					alt={store.name}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					sizes="(max-width: 640px) 72vw, 320px"
					loading="lazy"
					placeholder="blur"
					blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMTQ2Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
				/>
				{discountLabel && (
					<span className="absolute start-2 top-2 rounded-full bg-[#30913F] px-2 py-0.5 text-[10px] font-bold text-white sm:px-2.5 sm:py-1 sm:text-xs">
						{discountLabel}
					</span>
				)}
				{!isOpen && (
					<span className="absolute end-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white sm:px-2.5 sm:py-1 sm:text-xs">
						مغلق
					</span>
				)}
			</div>

			<div className="relative flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-3">
				<div className="absolute -top-4 start-2.5 h-9 w-9 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/[0.06] dark:bg-gray-700 dark:ring-white/[0.08] sm:-top-5 sm:start-3 sm:h-10 sm:w-10 sm:rounded-xl">
					<Image
						src={store.logo_full_url}
						alt=""
						fill
						className="object-cover"
						sizes="40px"
						loading="lazy"
					/>
				</div>
				<h3 className="line-clamp-1 pe-10 text-xs font-bold text-gray-900 dark:text-gray-50 sm:pe-12 sm:text-sm">
					{store.name}
				</h3>
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-500 dark:text-gray-400 sm:gap-x-3 sm:text-xs">
					{store.avg_rating > 0 && (
						<span className="inline-flex items-center gap-0.5 font-medium text-gray-700 dark:text-gray-300">
							<Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" aria-hidden />
							{store.avg_rating.toFixed(1)}
							{store.rating_count > 0 && (
								<span className="text-gray-400 dark:text-gray-500">({store.rating_count})</span>
							)}
						</span>
					)}
					{store.delivery_time && (
						<span className="inline-flex items-center gap-0.5">
							<Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
							{store.delivery_time}
						</span>
					)}
					{store.free_delivery && (
						<span className="inline-flex items-center gap-0.5 font-medium text-[#30913F] dark:text-[#4db860]">
							<Bike className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
							توصيل مجاني
						</span>
					)}
				</div>
			</div>
		</Link>
	);
});
