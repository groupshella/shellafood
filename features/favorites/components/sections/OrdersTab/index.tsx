import { getFavoriteOrders } from "@/features/favorites/api/favorites";
import { OrdersTabClient } from "./OrdersTabClient";
import OrdersTabSkeleton from "./skeleton";

export const OrdersTab = Object.assign(
    async function OrdersTab() {
        const data = await getFavoriteOrders();
        const orders = data.orders ?? [];
        return <OrdersTabClient orders={orders} />;
    },
    { skeleton: OrdersTabSkeleton }
);
