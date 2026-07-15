import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCart } from "@/features/cart/api/cart";
import { getAddresses } from "@/features/addresses/api/addresses";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import { getCheckoutStoreSummary } from "@/features/checkout/api/store-summary";
import {
    calculateInvoiceTotals,
    formatCheckoutInvoice,
} from "@/features/checkout/lib/invoice";
import { CheckoutShell } from "@/features/checkout/components/CheckoutShell";
import { CartSummary } from "@/features/checkout/components/sections/CartSummary";
import { DeliveryMethod } from "@/features/checkout/components/sections/DeliveryMethod";
import { PaymentMethod } from "@/features/checkout/components/sections/PaymentMethod";
import { DiscountCode } from "@/features/checkout/components/sections/DiscountCode";
import { AdditionalNote } from "@/features/checkout/components/sections/AdditionalNote";
import { InvoiceDetails } from "@/features/checkout/components/sections/InvoiceDetails";
import { COOKIE_KEYS, type AuthUser } from "@/features/auth/types/auth.types";
import { formatSar } from "@/features/checkout/lib/balance";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";

export const metadata: Metadata = {
    title: "الدفع | شيلة فود",
    description: "راجع تفاصيل طلبك واختر طريقة التوصيل والدفع",
};

async function buildCheckoutData(): Promise<CheckoutData> {
    const [items, addresses, cookieStore] = await Promise.all([
        getCart(),
        getAddresses(),
        cookies(),
    ]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const storeId = items.find((i) => i.store_id)?.store_id ?? 0;
    const storeSummary = await getCheckoutStoreSummary(storeId);

    let contactName = "Shella User";
    let contactPhone = "";
    let myWalletAmount = 0;
    let qidhaWalletAmount = 0;
    try {
        const raw = cookieStore.get(COOKIE_KEYS.USER)?.value;
        if (raw) {
            const user: AuthUser = JSON.parse(raw);
            contactName = `${user.f_name} ${user.l_name}`.trim() || contactName;
            contactPhone = user.phone || contactPhone;
            myWalletAmount = Number(user.wallet_balance ?? 0) || 0;
            qidhaWalletAmount = Number(user.qidha_wallet_balance ?? 0) || 0;
        }
    } catch {
        // cookie parse failure — defaults are fine
    }

    const defaultAddress = addresses[0] ?? null;
    const deliveryAddress = defaultAddress ? formatAddressLine(defaultAddress) : "";
    const deliveryAddressShort = defaultAddress?.address_label ?? "";
    const latitude = defaultAddress
        ? String(defaultAddress.latitude)
        : (process.env.NEXT_PUBLIC_LATITUDE ?? "24.7136");
    const longitude = defaultAddress
        ? String(defaultAddress.longitude)
        : (process.env.NEXT_PUBLIC_LONGITUDE ?? "46.6753");

    const deliveryMethod = "delivery" as const;
    const totals = calculateInvoiceTotals({
        subtotal,
        method: deliveryMethod,
        store: storeSummary,
        userLatitude: Number(latitude) || 0,
        userLongitude: Number(longitude) || 0,
    });
    const invoice = formatCheckoutInvoice(totals, deliveryMethod);

    return {
        cartCount: items.length,
        cartItems: items.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.image_full_url,
        })),
        deliveryMethod,
        deliveryAddress,
        deliveryAddressShort,
        walletBalance: formatSar(qidhaWalletAmount),
        myWalletBalance: formatSar(myWalletAmount),
        subtotal,
        invoice,
        storeSummary,
        placeOrderPayload: {
            cart: items.map((item) => ({
                item_id: item.item_id,
                quantity: item.quantity,
                price: item.price,
            })),
            order_amount: totals.total,
            payment_method: "digital_payment",
            order_type: deliveryMethod,
            store_id: storeId,
            distance: totals.distanceKm,
            address: deliveryAddress,
            longitude,
            latitude,
            contact_person_name: contactName,
            contact_person_number: contactPhone,
        },
    };
}

export default async function CheckoutPage() {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="checkout" />;
    }

    const checkoutData = await buildCheckoutData();

    return (
        <CheckoutShell checkoutData={checkoutData}>
            <Suspense fallback={<CartSummary.skeleton />}>
                <CartSummary />
            </Suspense>
            <Suspense fallback={<DeliveryMethod.skeleton />}>
                <DeliveryMethod />
            </Suspense>
            <Suspense fallback={<PaymentMethod.skeleton />}>
                <PaymentMethod />
            </Suspense>
            <Suspense fallback={<DiscountCode.skeleton />}>
                <DiscountCode />
            </Suspense>
            <Suspense fallback={<AdditionalNote.skeleton />}>
                <AdditionalNote />
            </Suspense>
            <Suspense fallback={<InvoiceDetails.skeleton />}>
                <InvoiceDetails />
            </Suspense>
        </CheckoutShell>
    );
}
