import { formatPrice } from "@/features/home/components/shared/PriceTag";
import type { DeliveryMethodType } from "@/features/checkout/types/checkout.types";
import type { CheckoutStoreSummary } from "@/features/checkout/types/store-summary.types";
import { calculateDistanceKm, roundDistanceKm } from "@/features/checkout/lib/distance";
import { calculateShipping, type ShippingBreakdown } from "@/features/checkout/lib/shipping";

export function formatInvoiceAmount(amount: number): string {
    return `${formatPrice(amount)} ﷼`;
}

function roundMoney(amount: number): number {
    return Math.round(amount * 100) / 100;
}

export interface InvoiceTotalsInput {
    subtotal: number;
    method: DeliveryMethodType;
    store: CheckoutStoreSummary | null;
    userLatitude: number;
    userLongitude: number;
    discount?: number;
}

/**
 * Numeric invoice breakdown.
 * VAT uses store.taxPercent (typically 15% in KSA) on
 * (subtotal + delivery + packaging − discount).
 */
export interface InvoiceTotals {
    subtotal: number;
    deliveryFee: number;
    packagingFee: number;
    vat: number;
    taxPercent: number;
    discount: number;
    total: number;
    distanceKm: number;
    minimumOrder: number;
    belowMinimumOrder: boolean;
    shipping: ShippingBreakdown;
}

export interface FormattedCheckoutInvoice {
    subtotal: string;
    deliveryFee: string;
    packagingFee: string;
    showPackaging: boolean;
    vat: string;
    taxPercent: number;
    discount: string;
    total: string;
    distanceKm: number;
    firstKmFee: string;
    firstKmDistance: number;
    perKmShippingCharge: string;
    extraKm: number;
    extraKmFee: string;
    minimumOrder: string;
    belowMinimumOrder: boolean;
    isPickup: boolean;
}

export function calculateInvoiceTotals(input: InvoiceTotalsInput): InvoiceTotals {
    const subtotal = roundMoney(Math.max(0, input.subtotal));
    const discount = roundMoney(Math.max(0, input.discount ?? 0));
    const taxPercent = input.store?.taxPercent ?? 15;
    const minimumOrder = input.store?.minimumOrder ?? 0;

    const distanceKm =
        input.store && input.method === "delivery"
            ? roundDistanceKm(
                  calculateDistanceKm(
                      {
                          latitude: input.store.latitude,
                          longitude: input.store.longitude,
                      },
                      {
                          latitude: input.userLatitude,
                          longitude: input.userLongitude,
                      }
                  )
              )
            : 0;

    const shipping = calculateShipping({
        method: input.method,
        distanceKm,
        store: input.store,
    });

    const deliveryFee = shipping.deliveryFee;
    const packagingFee =
        input.method === "delivery" &&
        input.store?.extraPackagingStatus &&
        input.store.extraPackagingAmount > 0
            ? roundMoney(input.store.extraPackagingAmount)
            : 0;

    const taxable = Math.max(0, subtotal + deliveryFee + packagingFee - discount);
    const vat = roundMoney(taxable * (taxPercent / 100));
    const total = roundMoney(taxable + vat);

    return {
        subtotal,
        deliveryFee,
        packagingFee,
        vat,
        taxPercent,
        discount,
        total,
        distanceKm: shipping.distanceKm,
        minimumOrder,
        belowMinimumOrder: minimumOrder > 0 && subtotal < minimumOrder,
        shipping,
    };
}

export function formatCheckoutInvoice(
    totals: InvoiceTotals,
    method: DeliveryMethodType = "delivery"
): FormattedCheckoutInvoice {
    return {
        subtotal: formatInvoiceAmount(totals.subtotal),
        deliveryFee: formatInvoiceAmount(totals.deliveryFee),
        packagingFee: formatInvoiceAmount(totals.packagingFee),
        showPackaging: totals.packagingFee > 0,
        vat: formatInvoiceAmount(totals.vat),
        taxPercent: totals.taxPercent,
        discount: formatInvoiceAmount(totals.discount),
        total: formatInvoiceAmount(totals.total),
        distanceKm: totals.distanceKm,
        firstKmFee: formatInvoiceAmount(totals.shipping.firstKmFee),
        firstKmDistance: totals.shipping.firstKmDistance,
        perKmShippingCharge: formatInvoiceAmount(totals.shipping.perKmShippingCharge),
        extraKm: totals.shipping.extraKm,
        extraKmFee: formatInvoiceAmount(totals.shipping.extraKmFee),
        minimumOrder: formatInvoiceAmount(totals.minimumOrder),
        belowMinimumOrder: totals.belowMinimumOrder,
        isPickup: method === "pickup",
    };
}
