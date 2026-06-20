import Image from "next/image";
import Link from "next/link";
import { RecentOrder } from "@/features/markets/types/recent-orders.types";

export function OrderCard({ order }: { order: RecentOrder }) {
    return (
        <Link
            href={`/my-orders?reorder=${order.id}`}
            className={[
                "flex w-[88px] shrink-0 flex-col items-center gap-2 rounded-xl outline-none",
                "transition-transform duration-150 active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={`أعد طلبك من ${order.store_name}`}
            dir="rtl"
        >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                {order.store_logo ? (
                    <Image
                        src={order.store_logo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#30913F]/20 to-[#30913F]/40" />
                )}
            </div>

            <h3 className="line-clamp-2 w-full text-center text-xs font-bold leading-tight text-gray-900">
                {order.store_name}
            </h3>
        </Link>
    );
}
