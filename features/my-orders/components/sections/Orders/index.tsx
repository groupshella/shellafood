import { getAllOrders } from "@/features/my-orders/api/orders";
import { OrdersClient } from "./OrdersClient";
import OrdersSkeleton from "./skeleton";

async function OrdersServer() {
    const orders = await getAllOrders();
    return <OrdersClient orders={orders} />;
}

export const Orders = Object.assign(OrdersServer, { skeleton: OrdersSkeleton });
