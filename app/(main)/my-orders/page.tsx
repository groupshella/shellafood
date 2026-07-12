import { Suspense } from "react";
import type { Metadata } from "next";
import { MyOrdersShell } from "@/features/my-orders/components/MyOrdersShell";
import { Orders } from "@/features/my-orders/components/sections/Orders";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
    title: "طلباتي | شيلة فود",
    description: "عرض ومتابعة جميع طلباتك",
};

export default async function MyOrdersPage() {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="orders" />;
    }
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    return (
        <MyOrdersShell isArabic={isArabic}>
            <Suspense fallback={<Orders.skeleton />}>
                <Orders isArabic={isArabic} />
            </Suspense>
        </MyOrdersShell>
    );
}
