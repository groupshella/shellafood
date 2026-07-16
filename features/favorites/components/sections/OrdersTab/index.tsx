import { getFavoriteOrders } from "@/features/favorites/api/favorites";
import { isArabicLocale } from "@/shared/lib/locale";
import { OrdersTabClient } from "./OrdersTabClient";
import OrdersTabSkeleton from "./skeleton";

export const OrdersTab = Object.assign(
    async function OrdersTab() {
        const isArabic = await isArabicLocale();
        const orders = await getFavoriteOrders(isArabic ? "ar" : "en");
        return <OrdersTabClient orders={orders} isArabic={isArabic} />;
    },
    { skeleton: OrdersTabSkeleton }
);
