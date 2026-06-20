import { getRecentOrders } from "@/features/markets/api/recent-orders";
import { RecentOrdersClient } from "./RecentOrdersClient";
import RecentOrdersSkeleton from "./skeleton";

export const RecentOrders = Object.assign(
    async function RecentOrders({ moduleId }: { moduleId: string }) {
        const orders = await getRecentOrders(moduleId);
        if (orders.length === 0) return null;

        return <RecentOrdersClient orders={orders} />;
    },
    { skeleton: RecentOrdersSkeleton },
);
