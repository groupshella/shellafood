"use client";

import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { OrderCard } from "./OrderCard";
import type { FavoriteOrder } from "@/features/favorites/types/favorites.types";

const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4 xl:grid-cols-3 xl:gap-4";
const SECTION_HEADING =
    "mb-2.5 text-start text-sm font-semibold text-muted sm:mb-3 sm:text-[15px] md:text-base";

interface OrdersTabClientProps {
    orders: FavoriteOrder[];
    isArabic: boolean;
}

export function OrdersTabClient({ orders, isArabic }: OrdersTabClientProps) {
    if (orders.length === 0) {
        return <EmptyFavorites isArabic={isArabic} />;
    }

    const groups = groupByDate(orders, isArabic);

    return (
        <div
            className={`space-y-5 sm:space-y-6 ${CONTENT_PADDING}`}
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            {groups.map((group) => (
                <section key={group.key}>
                    <p className={SECTION_HEADING}>{group.label}</p>
                    <div className={ITEMS_GRID}>
                        {group.items.map((order) => (
                            <OrderCard key={order.id} order={order} isArabic={isArabic} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
