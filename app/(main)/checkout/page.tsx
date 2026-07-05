import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCart } from "@/features/cart/api/cart";
import { CheckoutShell } from "@/features/checkout/components/CheckoutShell";
import { CartSummary } from "@/features/checkout/components/sections/CartSummary";
import { DeliveryMethod } from "@/features/checkout/components/sections/DeliveryMethod";
import { PaymentMethod } from "@/features/checkout/components/sections/PaymentMethod";
import { DiscountCode } from "@/features/checkout/components/sections/DiscountCode";
import { AdditionalNote } from "@/features/checkout/components/sections/AdditionalNote";
import { InvoiceDetails } from "@/features/checkout/components/sections/InvoiceDetails";
import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { COOKIE_KEYS, type AuthUser } from "@/features/auth/types/auth.types";
import { formatPrice } from "@/features/home/components/shared/PriceTag";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";

export const metadata: Metadata = {
    title: "الدفع | شيلافود",
};

function formatInvoiceAmount(amount: number) {
    return `${formatPrice(amount)} ﷼`;
}

async function buildCheckoutData(): Promise<CheckoutData> {
    const [items, cookieStore] = await Promise.all([getCart(), cookies()]);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let contactName = "Shella User";
    let contactPhone = "";
    try {
        const raw = cookieStore.get(COOKIE_KEYS.USER)?.value;
        if (raw) {
            const user: AuthUser = JSON.parse(raw);
            contactName = `${user.f_name} ${user.l_name}`.trim() || contactName;
            contactPhone = user.phone || contactPhone;
        }
    } catch {
        // cookie parse failure — defaults are fine
    }

    return {
        ...MOCK_CHECKOUT,
        cartCount: items.length,
        cartItems: items.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.image_full_url,
        })),
        invoice: {
            subtotal: formatInvoiceAmount(subtotal),
            deliveryFee: formatInvoiceAmount(0),
            serviceFee: formatInvoiceAmount(0),
            discount: formatInvoiceAmount(0),
            total: formatInvoiceAmount(subtotal),
        },
        placeOrderPayload: {
            cart: items.map((item) => ({
                item_id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            order_amount: subtotal,
            payment_method: "digital_payment",
            order_type: MOCK_CHECKOUT.deliveryMethod,
            store_id: 1, // replaced at runtime by real store_id when available
            distance: 1,
            address: MOCK_CHECKOUT.deliveryAddress,
            longitude: "46.6753",
            latitude: "24.7136",
            contact_person_name: contactName,
            contact_person_number: contactPhone,
        },
    };
}

export default async function CheckoutPage() {
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
