import { Suspense } from "react";
import type { Metadata } from "next";
import { getCart } from "@/features/cart/api/cart";
import { CheckoutShell } from "@/features/checkout/components/CheckoutShell";
import { CartSummary } from "@/features/checkout/components/sections/CartSummary";
import { DeliveryMethod } from "@/features/checkout/components/sections/DeliveryMethod";
import { PaymentMethod } from "@/features/checkout/components/sections/PaymentMethod";
import { DiscountCode } from "@/features/checkout/components/sections/DiscountCode";
import { AdditionalNote } from "@/features/checkout/components/sections/AdditionalNote";
import { InvoiceDetails } from "@/features/checkout/components/sections/InvoiceDetails";
import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { formatPrice } from "@/features/home/components/shared/PriceTag";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";

export const metadata: Metadata = {
    title: "الدفع | شيلافود",
};

function formatInvoiceAmount(amount: number) {
    return `${formatPrice(amount)} ﷼`;
}

interface CheckoutPageProps {
    searchParams: Promise<{ orderId?: string }>;
}

async function buildCheckoutData(orderIdParam?: string): Promise<CheckoutData> {
    const items = await getCart();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = orderIdParam ? Number(orderIdParam) : MOCK_CHECKOUT.orderId;

    return {
        ...MOCK_CHECKOUT,
        orderId: Number.isFinite(orderId) && orderId > 0 ? orderId : MOCK_CHECKOUT.orderId,
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
    };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const params = await searchParams;
    const checkoutData = await buildCheckoutData(params.orderId);

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
