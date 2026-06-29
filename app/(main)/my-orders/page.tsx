import { Suspense } from "react";
import { MyOrdersShell } from "@/features/my-orders/components/MyOrdersShell";
import { Orders } from "@/features/my-orders/components/sections/Orders";

export default function MyOrdersPage() {
    return (
        <MyOrdersShell>
            <Suspense fallback={<Orders.skeleton />}>
                <Orders />
            </Suspense>
        </MyOrdersShell>
    );
}
