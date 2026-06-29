import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutShell } from "@/features/checkout/components/CheckoutShell";
import { CartSummary } from "@/features/checkout/components/sections/CartSummary";
import { DeliveryMethod } from "@/features/checkout/components/sections/DeliveryMethod";
import { PaymentMethod } from "@/features/checkout/components/sections/PaymentMethod";
import { DiscountCode } from "@/features/checkout/components/sections/DiscountCode";
import { AdditionalNote } from "@/features/checkout/components/sections/AdditionalNote";
import { InvoiceDetails } from "@/features/checkout/components/sections/InvoiceDetails";

export const metadata: Metadata = {
    title: "الدفع | شيلافود",
};

export default function CheckoutPage() {
    return (
        <CheckoutShell>
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
