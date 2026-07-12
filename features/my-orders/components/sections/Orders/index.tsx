import { getAllOrders } from "@/features/my-orders/api/orders";
import { OrdersClient } from "./OrdersClient";
import OrdersSkeleton from "./skeleton";

async function OrdersServer({ isArabic }: { isArabic: boolean }) {
    const orders = await getAllOrders(isArabic);
    return <OrdersClient orders={orders} isArabic={isArabic} />;
}

export const Orders = Object.assign(OrdersServer, { skeleton: OrdersSkeleton });
