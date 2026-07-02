import { getOrderDetailData } from "@/features/my-orders/api/order-detail";
import { mapOrderDetailView } from "@/features/my-orders/lib/order-detail-mapper";
import { OrderDetailClient } from "./OrderDetailClient";
import OrderDetailSkeleton from "./skeleton";

export const OrderDetail = Object.assign(
    async function OrderDetail({ id }: { id: string }) {
        const data = await getOrderDetailData(id);

        if (!data) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6" dir="rtl">
                    <p className="text-[15px] font-semibold text-gray-700">لم يتم العثور على الطلب</p>
                </div>
            );
        }

        const order = mapOrderDetailView(data.track, data.details);
        return <OrderDetailClient order={order} />;
    },
    { skeleton: OrderDetailSkeleton }
);
