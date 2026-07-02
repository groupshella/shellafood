import { computeOrderFees } from "@/features/my-orders/lib/order-fees";
import type {
    ApiOrderDetailItem,
    OrderDetailView,
    OrderItem,
    OrderTrack,
} from "@/features/my-orders/types/orders.types";

const CURRENCY_SUFFIX = " ج.م";

export function formatOrderMoney(amount: number): string {
    return `${amount.toFixed(2)}${CURRENCY_SUFFIX}`;
}

export function formatPaymentMethod(method: string): string {
    switch (method) {
        case "digital_payment":
            return "Credit Card";
        case "cash_on_delivery":
            return "الدفع عند الاستلام";
        case "wallet":
            return "المحفظة";
        case "offline_payment":
            return "دفع خارجي";
        default:
            return method;
    }
}

export function formatOrderDate(createdAt: string): string {
    try {
        return new Date(createdAt).toLocaleString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return createdAt;
    }
}

function resolveDeliveryAddress(
    deliveryAddress: OrderTrack["delivery_address"]
): string {
    if (!deliveryAddress) return "—";
    if (typeof deliveryAddress === "string") return deliveryAddress;
    return deliveryAddress.address ?? "—";
}

function mapOrderItems(details: ApiOrderDetailItem[]): OrderItem[] {
    return details.map((item) => {
        const discount = item.discount_on_item ?? 0;
        const unitPrice = item.price - discount;

        return {
            id: item.id,
            name: item.item_details?.name ?? "—",
            description: item.item_details?.description ?? "",
            price: formatOrderMoney(unitPrice),
            originalPrice:
                discount > 0 ? formatOrderMoney(item.price) : undefined,
            quantity: item.quantity,
            imageUrl: item.image_full_url,
        };
    });
}

export function mapOrderDetailView(
    track: OrderTrack,
    details: ApiOrderDetailItem[]
): OrderDetailView {
    const fees = computeOrderFees(track, details);

    return {
        id: track.id,
        storeId: track.store.id,
        storeName: track.store.name ?? "—",
        storeDescription: track.store.address ?? "",
        storeLogoUrl: track.store.logo_full_url,
        items: mapOrderItems(details),
        fees,
        paymentMethod: formatPaymentMethod(track.payment_method),
        deliveryAddress: resolveDeliveryAddress(track.delivery_address),
        orderDate: formatOrderDate(track.created_at),
        orderStatus: track.order_status,
        cancellationReason: track.cancellation_reason,
    };
}
