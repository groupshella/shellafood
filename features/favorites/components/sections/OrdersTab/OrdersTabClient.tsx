"use client";

import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { OrderCard } from "./OrderCard";
import type { ApiOrder } from "@/features/favorites/types/favorites.types";

const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID = "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";

interface OrdersTabClientProps {
    orders: ApiOrder[];
    isArabic: boolean;
}

export function OrdersTabClient({ orders, isArabic }: OrdersTabClientProps) {
    if (orders.length === 0) {
        return <EmptyFavorites isArabic={isArabic} />;
    }

    return (
        <div className={`${CONTENT_PADDING}`}>
            <div className={ITEMS_GRID}>
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} isArabic={isArabic} />
                ))}
            </div>
        </div>
    );
}
