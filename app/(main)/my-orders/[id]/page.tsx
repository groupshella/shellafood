import { OrderDetailClient } from "@/features/my-orders/components/OrderDetailClient";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    return <OrderDetailClient orderId={id} />;
}
