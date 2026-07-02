import type {
    ApiOrderDetailItem,
    OrderFees,
    OrderTrack,
} from "@/features/my-orders/types/orders.types";

function itemUnitPrice(item: ApiOrderDetailItem): number {
    return item.price - (item.discount_on_item ?? 0);
}

export function computeOrderFees(
    track: OrderTrack,
    details: ApiOrderDetailItem[]
): OrderFees {
    const itemsSubtotal = details.reduce(
        (sum, item) => sum + itemUnitPrice(item) * item.quantity,
        0
    );

    const deliveryCharge = track.delivery_charge ?? 0;
    const serviceFee = track.additional_charge ?? 0;
    const couponDiscount = track.coupon_discount_amount ?? 0;

    let total = track.order_amount ?? 0;
    if (total === 0 && track.payments?.length) {
        total = track.payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
    }

    return {
        itemsSubtotal,
        deliveryCharge,
        serviceFee,
        couponDiscount,
        total,
    };
}
