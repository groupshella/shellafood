import { getFavoriteOrders } from "@/features/favorites/api/favorites";
import { OrdersTabClient } from "./OrdersTabClient";
import OrdersTabSkeleton from "./skeleton";

export const OrdersTab = Object.assign(
    async function OrdersTab({ isArabic }: { isArabic: boolean }) {
        const data = await getFavoriteOrders(1, 30, isArabic);
        const orders = data.orders ?? [];
        return <OrdersTabClient orders={orders} isArabic={isArabic} />;
    },
    { skeleton: OrdersTabSkeleton }
);
