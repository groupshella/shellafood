import { getRecentOrders } from "@/features/home/api/recent-orders";
import { RecentOrdersClient } from "./RecentOrdersClient";
import RecentOrderSkeleton from "./skeleton";

export const RecentOrders = Object.assign(
    async function RecentOrders() {
        const orders = await getRecentOrders();
        if (orders.length === 0) return null;

        return <RecentOrdersClient orders={orders} />;
    },
    { skeleton: RecentOrderSkeleton }
);
