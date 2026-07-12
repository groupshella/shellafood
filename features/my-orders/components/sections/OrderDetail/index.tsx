import { getOrderDetailData } from "@/features/my-orders/api/order-detail";
import { mapOrderDetailView } from "@/features/my-orders/lib/order-detail-mapper";
import { OrderDetailClient } from "./OrderDetailClient";
import OrderDetailSkeleton from "./skeleton";

export const OrderDetail = Object.assign(
    async function OrderDetail({ id, isArabic }: { id: string; isArabic: boolean }) {
        const data = await getOrderDetailData(id, isArabic);

        if (!data) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6" dir="rtl">
                    <p className="text-[15px] font-semibold text-gray-700">لم يتم العثور على الطلب</p>
                </div>
            );
        }

        const order = mapOrderDetailView(data.track, data.details);
        return <OrderDetailClient order={order} isArabic={isArabic} />;
    },
    { skeleton: OrderDetailSkeleton }
);
