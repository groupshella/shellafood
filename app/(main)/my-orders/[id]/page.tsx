import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderDetail } from "@/features/my-orders/components/sections/OrderDetail";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { isArabicLocale } from "@/shared/lib/locale";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const isArabic = await isArabicLocale();
    return {
        title: isArabic ? "تفاصيل طلبك | شيلة فود" : "Order details | Shella Food",
        description: isArabic
            ? "متابعة حالة طلبك وتفاصيله"
            : "Track your order status and details",
    };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const isArabic = await isArabicLocale();
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="orders" isArabic={isArabic} />;
    }

    const { id } = await params;

    return (
        <Suspense fallback={<OrderDetail.skeleton />}>
            <OrderDetail id={id} isArabic={isArabic} />
        </Suspense>
    );
}
