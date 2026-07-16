import { computeOrderFees } from "@/features/my-orders/lib/order-fees";
import type {
    ApiOrderDetailItem,
    OrderDetailView,
    OrderItem,
    OrderTrack,
} from "@/features/my-orders/types/orders.types";

export function formatOrderMoney(amount: number, isArabic: boolean): string {
    const suffix = isArabic ? " ج.م" : " EGP";
    return `${amount.toFixed(2)}${suffix}`;
}

export function formatPaymentMethod(method: string, isArabic: boolean): string {
    switch (method) {
        case "digital_payment":
            return isArabic ? "بطاقة ائتمان" : "Credit Card";
        case "cash_on_delivery":
            return isArabic ? "الدفع عند الاستلام" : "Cash on delivery";
        case "wallet":
            return isArabic ? "المحفظة" : "Wallet";
        case "offline_payment":
            return isArabic ? "دفع خارجي" : "Offline payment";
        default:
            return method;
    }
}

export function formatOrderDate(createdAt: string, isArabic: boolean): string {
    try {
        return new Date(createdAt).toLocaleString(isArabic ? "ar-SA" : "en-US", {
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

function mapOrderItems(details: ApiOrderDetailItem[], isArabic: boolean): OrderItem[] {
    return details.map((item) => {
        const discount = item.discount_on_item ?? 0;
        const unitPrice = item.price - discount;

        return {
            id: item.id,
            name: item.item_details?.name ?? "—",
            description: item.item_details?.description ?? "",
            price: formatOrderMoney(unitPrice, isArabic),
            originalPrice:
                discount > 0 ? formatOrderMoney(item.price, isArabic) : undefined,
            quantity: item.quantity,
            imageUrl: item.image_full_url,
        };
    });
}

export function mapOrderDetailView(
    track: OrderTrack,
    details: ApiOrderDetailItem[],
    isArabic: boolean
): OrderDetailView {
    const fees = computeOrderFees(track, details);

    return {
        id: track.id,
        storeId: track.store.id,
        storeName: track.store.name ?? "—",
        storeDescription: track.store.address ?? "",
        storeLogoUrl: track.store.logo_full_url,
        items: mapOrderItems(details, isArabic),
        fees,
        paymentMethod: formatPaymentMethod(track.payment_method, isArabic),
        deliveryAddress: resolveDeliveryAddress(track.delivery_address),
        orderDate: formatOrderDate(track.created_at, isArabic),
        orderStatus: track.order_status,
        cancellationReason: track.cancellation_reason,
    };
}
