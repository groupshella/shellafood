import { getOrderDetailData } from "@/features/my-orders/api/order-detail";
import { mapOrderDetailView } from "@/features/my-orders/lib/order-detail-mapper";
import { OrderDetailClient } from "./OrderDetailClient";
import OrderDetailSkeleton from "./skeleton";

export const OrderDetail = Object.assign(
    async function OrderDetail({
        id,
        isArabic,
    }: {
        id: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const data = await getOrderDetailData(id, lang);

        if (!data) {
            return (
                <div
                    className="flex min-h-screen flex-col items-center justify-center bg-background px-6"
                    dir={isArabic ? "rtl" : "ltr"}
                    lang={isArabic ? "ar" : "en"}
                >
                    <p className="text-[15px] font-semibold text-foreground">
                        {isArabic ? "لم يتم العثور على الطلب" : "Order not found"}
                    </p>
                </div>
            );
        }

        const order = mapOrderDetailView(data.track, data.details, isArabic);
        return <OrderDetailClient order={order} isArabic={isArabic} />;
    },
    { skeleton: OrderDetailSkeleton }
);
