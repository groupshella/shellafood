import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderDetail } from "@/features/my-orders/components/sections/OrderDetail";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { getServerLocale } from "@/features/language/getServerLocale";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: "تفاصيل طلبك | شيلة فود",
    description: "متابعة حالة طلبك وتفاصيله",
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="orders" />;
    }

    const { id } = await params;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    return (
        <Suspense fallback={<OrderDetail.skeleton />}>
            <OrderDetail id={id} isArabic={isArabic} />
        </Suspense>
    );
}
