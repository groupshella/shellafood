import type { DeliveryMethodType } from "@/features/checkout/types/checkout.types";
import type { CheckoutStoreSummary } from "@/features/checkout/types/store-summary.types";

export interface ShippingInput {
    method: DeliveryMethodType;
    distanceKm: number;
    store: CheckoutStoreSummary | null;
}

export interface ShippingBreakdown {
    /** Final delivery fee charged to the customer (first km + extra km). */
    deliveryFee: number;
    distanceKm: number;
    firstKmFee: number;
    firstKmDistance: number;
    extraKm: number;
    extraKmFee: number;
    perKmShippingCharge: number;
    isFree: boolean;
    freeReason: "pickup" | "missing_store" | null;
}

function roundMoney(amount: number): number {
    return Math.round(amount * 100) / 100;
}

/**
 * Applies store min/max shipping caps.
 * `maximum_shipping_charge === 0` means “no maximum” (API convention).
 */
function clampShipping(amount: number, store: CheckoutStoreSummary): number {
    let fee = Math.max(amount, store.minimumShippingCharge);
    if (store.maximumShippingCharge > 0) {
        fee = Math.min(fee, store.maximumShippingCharge);
    }
    return roundMoney(fee);
}

/**
 * Shipping from store-summary rules:
 * - pickup → 0
 * - else: first_km_fee for first_km_distance km
 *         + max(0, distance − first_km_distance) × per_km_shipping_charge
 * - then clamp to min/max shipping charge
 *
 * Note: `free_delivery` is not treated as always-free; fee follows distance rules.
 * Pickup is the only client-side free shipping path.
 */
export function calculateShipping(input: ShippingInput): ShippingBreakdown {
    const distanceKm = Math.max(0, input.distanceKm);

    if (input.method === "pickup") {
        return {
            deliveryFee: 0,
            distanceKm: 0,
            firstKmFee: 0,
            firstKmDistance: input.store?.firstKmDistance ?? 0,
            extraKm: 0,
            extraKmFee: 0,
            perKmShippingCharge: input.store?.perKmShippingCharge ?? 0,
            isFree: true,
            freeReason: "pickup",
        };
    }

    if (!input.store) {
        return {
            deliveryFee: 0,
            distanceKm,
            firstKmFee: 0,
            firstKmDistance: 0,
            extraKm: 0,
            extraKmFee: 0,
            perKmShippingCharge: 0,
            isFree: true,
            freeReason: "missing_store",
        };
    }

    const store = input.store;
    const firstKmDistance = Math.max(0, store.firstKmDistance);
    const firstKmFee = Math.max(0, store.firstKmFee);
    const perKm = Math.max(0, store.perKmShippingCharge);
    const extraKm = roundMoney(Math.max(0, distanceKm - firstKmDistance));
    const extraKmFee = roundMoney(extraKm * perKm);
    const rawFee = roundMoney(firstKmFee + extraKmFee);
    const deliveryFee = clampShipping(rawFee, store);

    return {
        deliveryFee,
        distanceKm,
        firstKmFee,
        firstKmDistance,
        extraKm,
        extraKmFee,
        perKmShippingCharge: perKm,
        isFree: deliveryFee === 0,
        freeReason: null,
    };
}
