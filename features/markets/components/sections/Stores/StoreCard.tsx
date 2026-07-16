import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ChevronLeft, Clock, Star, Store as StoreIcon, Truck } from "lucide-react";
import { Store } from "@/features/markets/types/stores.types";

const CARD_CLASSES = [
	"group flex h-full min-w-0 items-center gap-3 rounded-2xl bg-card p-3",
	"shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]",
	"ring-1 ring-border",
	"touch-manipulation",
	"motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-200",
	"active:scale-[0.98] active:brightness-95",
	"sm:gap-3.5 sm:p-3.5",
	"md:hover:-translate-y-px md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

const CHIP_BASE =
	"inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium leading-none sm:h-[26px] sm:px-3 sm:text-xs";

function formatDistance(meters: number, isArabic: boolean): string {
	if (meters < 1000) {
		return isArabic ? `${Math.round(meters)} م` : `${Math.round(meters)} m`;
	}
	const km = (meters / 1000).toFixed(1);
	return isArabic ? `${km} كم` : `${km} km`;
}

function storeSubtitle(store: Store, isArabic: boolean): string {
	if (store.delivery_time) {
		return isArabic
			? `توصيل خلال ${store.delivery_time}`
			: `Delivery in ${store.delivery_time}`;
	}
	if (store.distance > 0) {
		return isArabic
			? `يبعد ${formatDistance(store.distance, isArabic)}`
			: `${formatDistance(store.distance, isArabic)} away`;
	}
	return isArabic ? "متجر متاح للطلب" : "Store available for orders";
}

export const StoreCard = memo(function StoreCard({
	store,
	isArabic,
}: {
	store: Store;
	isArabic: boolean;
}) {
	return (
		<Link
			href={`/stores/${store.id}?module_id=${store.module_id}`}
			className={CARD_CLASSES}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			aria-label={store.name}
		>
			<div
				className={[
					"relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-2xl",
					"bg-background ring-1 ring-border",
					"shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
					"sm:h-[68px] sm:w-[68px]",
				].join(" ")}
			>
				{store.logo_full_url ? (
					<Image
						src={store.logo_full_url}
						alt=""
						fill
						className="object-cover"
						sizes="(max-width: 640px) 60px, 68px"
						loading="lazy"
					/>
				) : (
					<div
						className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]"
						aria-hidden
					>
						<StoreIcon
							className="h-7 w-7 text-brand/50 sm:h-8 sm:w-8"
							strokeWidth={1.4}
						/>
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex items-start justify-between gap-2">
					<h3 className="line-clamp-2 min-w-0 flex-1 text-start text-[15px] font-bold leading-snug tracking-tight text-foreground sm:text-base">
						{store.name}
					</h3>
					<span
						role="status"
						aria-label={
							store.is_open
								? isArabic
									? "مفتوح"
									: "Open"
								: isArabic
									? "مغلق"
									: "Closed"
						}
						className={[
							"inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5",
							"text-[10px] font-semibold leading-none sm:px-2.5 sm:text-[11px]",
							store.is_open
								? "bg-brand/10 text-brand"
								: "bg-card text-muted",
						].join(" ")}
					>
						<span
							aria-hidden
							className={[
								"h-1.5 w-1.5 rounded-full",
								store.is_open ? "bg-brand" : "bg-muted",
							].join(" ")}
						/>
						{store.is_open
							? isArabic
								? "مفتوح"
								: "Open"
							: isArabic
								? "مغلق"
								: "Closed"}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted sm:gap-x-3 sm:text-xs">
					{store.avg_rating > 0 && (
						<span className="inline-flex items-center gap-1 font-semibold text-foreground">
							<Star
								className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
								strokeWidth={0}
								aria-hidden
							/>
							{store.avg_rating.toFixed(1)}
						</span>
					)}
					<span className="inline-flex min-w-0 items-center gap-1">
						<Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
						<span className="truncate">{storeSubtitle(store, isArabic)}</span>
					</span>
				</div>

				{(store.free_delivery || store.has_offer) && (
					<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
						{store.free_delivery && (
							<span className={[CHIP_BASE, "bg-brand/10 text-brand"].join(" ")}>
								<Truck className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
								{isArabic ? "توصيل مجاني" : "Free delivery"}
							</span>
						)}
						{store.has_offer && (
							<span className={[CHIP_BASE, "bg-[#DFD3F5]/60 text-[#7861A6]"].join(" ")}>
								{isArabic ? "عرض" : "Offer"}
							</span>
						)}
					</div>
				)}
			</div>

			<ChevronLeft
				className={[
					"h-4 w-4 shrink-0 text-muted",
					"motion-safe:transition-transform motion-safe:duration-200",
					"group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
					isArabic ? "" : "rotate-180",
					"sm:h-[18px] sm:w-[18px]",
				].join(" ")}
				strokeWidth={2}
				aria-hidden
			/>
		</Link>
	);
});
