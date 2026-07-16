import { Suspense } from "react";
import type { Metadata } from "next";
import { MyOrdersShell } from "@/features/my-orders/components/MyOrdersShell";
import { Orders } from "@/features/my-orders/components/sections/Orders";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
    const isArabic = await isArabicLocale();
    return {
        title: isArabic ? "طلباتي | شيلة فود" : "My orders | Shella Food",
        description: isArabic
            ? "عرض ومتابعة جميع طلباتك"
            : "View and track all your orders",
    };
}

export default async function MyOrdersPage() {
    const isArabic = await isArabicLocale();
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="orders" isArabic={isArabic} />;
    }

    return (
        <MyOrdersShell isArabic={isArabic}>
            <Suspense fallback={<Orders.skeleton />}>
                <Orders isArabic={isArabic} />
            </Suspense>
        </MyOrdersShell>
    );
}
