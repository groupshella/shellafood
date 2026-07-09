import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ChevronLeft } from "lucide-react";
import { RecentOrder } from "@/features/home/types/recent-orders.types";

function timeAgo(dateStr: string): string {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;

	const diffMs = Date.now() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffMonths = Math.floor(diffDays / 30);

	if (diffMins < 1) return "منذ لحظات";
	if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? "دقيقة" : "دقائق"}`;
	if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`;
	if (diffDays < 30) return `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`;
	return `منذ ${diffMonths} ${diffMonths === 1 ? "شهر" : "أشهر"}`;
}

export const OrderCard = memo(function OrderCard({ order }: { order: RecentOrder }) {
	return (
		<Link
			href={`/my-orders?reorder=${order.id}`}
			className={[
				"flex w-full min-w-0 items-center gap-2.5 rounded-xl bg-white px-3 py-2.5",
				"shadow-sm ring-1 ring-black/[0.05] outline-none",
				"transition-transform duration-150 active:scale-[0.99]",
				"focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
				"dark:bg-gray-800 dark:ring-white/[0.06]",
				"sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3",
				"md:px-5 md:py-3.5",
				"lg:gap-4 lg:px-6 lg:py-4",
			].join(" ")}
			aria-label={`أعد طلبك من ${order.store_name}`}
			dir="rtl"
		>
			<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 sm:h-[52px] sm:w-[52px] sm:rounded-xl">
				<Image
					src={order.store_logo}
					alt={order.store_name}
					fill
					className="object-cover"
					sizes="52px"
					loading="lazy"
				/>
			</div>
			<div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
				<h3 className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px] md:text-base">
					{order.store_name}
				</h3>
				<div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
					{order.module_name && (
						<span className="rounded-full bg-[#E0F7FA] px-2 py-0.5 text-[10px] font-medium text-[#00796B] dark:bg-teal-950 dark:text-teal-300 sm:px-2.5 sm:text-xs">
							{order.module_name}
						</span>
					)}
					{order.module_name && (
						<span className="text-gray-300 dark:text-gray-600" aria-hidden>
							•
						</span>
					)}
					<span className="text-[10px] text-gray-400 dark:text-gray-500 sm:text-xs">
						{timeAgo(order.order_date)}
					</span>
				</div>
			</div>
			<ChevronLeft
				className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-500 sm:h-[18px] sm:w-[18px]"
				aria-hidden
			/>
		</Link>
	);
});
