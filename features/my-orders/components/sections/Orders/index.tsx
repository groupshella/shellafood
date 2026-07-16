import { getAllOrders } from "@/features/my-orders/api/orders";
import { OrdersClient } from "./OrdersClient";
import OrdersSkeleton from "./skeleton";

async function OrdersServer({ isArabic }: { isArabic: boolean }) {
    const lang = isArabic ? "ar" : "en";
    const orders = await getAllOrders(lang);
    return <OrdersClient orders={orders} isArabic={isArabic} />;
}

export const Orders = Object.assign(OrdersServer, { skeleton: OrdersSkeleton });
