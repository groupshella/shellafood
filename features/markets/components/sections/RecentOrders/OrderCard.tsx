import Image from "next/image";
import Link from "next/link";
import { RecentOrder } from "@/features/markets/types/recent-orders.types";

export function OrderCard({ order }: { order: RecentOrder }) {
    return (
        <Link
            href={`/my-orders?reorder=${order.id}`}
            className={[
                "flex w-[4.75rem] shrink-0 flex-col items-center gap-2 rounded-xl outline-none sm:w-[5.5rem] lg:w-24",
                "transition-transform duration-150 active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
            ].join(" ")}
            aria-label={`أعد طلبك من ${order.store_name}`}
            dir="rtl"
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06] dark:bg-gray-800 dark:ring-white/[0.08] sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]">
                {order.store_logo ? (
                    <Image
                        src={order.store_logo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, 72px"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#30913F]/20 to-[#30913F]/40 dark:from-[#30913F]/30 dark:to-[#30913F]/50" />
                )}
            </div>

            <h3 className="line-clamp-2 w-full text-center text-[11px] font-bold leading-tight text-gray-900 dark:text-gray-50 sm:text-xs lg:text-[13px]">
                {order.store_name}
            </h3>
        </Link>
    );
}
