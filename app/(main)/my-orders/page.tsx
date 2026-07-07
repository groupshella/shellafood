import { Suspense } from "react";
import { MyOrdersShell } from "@/features/my-orders/components/MyOrdersShell";
import { Orders } from "@/features/my-orders/components/sections/Orders";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";

export default async function MyOrdersPage() {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="orders" />;
    }

    return (
        <MyOrdersShell>
            <Suspense fallback={<Orders.skeleton />}>
                <Orders />
            </Suspense>
        </MyOrdersShell>
    );
}
