import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderDetail } from "@/features/my-orders/components/sections/OrderDetail";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: "تفاصيل طلبك | شيلافود",
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<OrderDetail.skeleton />}>
            <OrderDetail id={id} />
        </Suspense>
    );
}
