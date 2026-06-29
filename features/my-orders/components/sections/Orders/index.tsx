import { OrdersClient } from "./OrdersClient";
import OrdersSkeleton from "./skeleton";

export const Orders = Object.assign(
    function Orders() {
        return <OrdersClient />;
    },
    { skeleton: OrdersSkeleton }
);
