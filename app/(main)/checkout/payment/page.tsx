// app/(main)/checkout/payment/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PaymentShell } from "@/features/payment/components/PaymentShell";
import { MyFatoorahPayment } from "@/features/payment/components/sections/MyFatoorahPayment";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

export const metadata: Metadata = {
    title: "الدفع | شيلافود",
};

interface PaymentPageProps {
    searchParams: Promise<{ orderId?: string; amount?: string; currency?: string }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const params = await searchParams;
    const cookieStore = await cookies();
    const isGuest = !cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const orderId = Number(params.orderId);
    const amount = Number(params.amount);
    const currency = params.currency ?? "SAR";

    // Route stays thin: it only reads the guard/URL data and hands off to the section.
    return (
        <PaymentShell>
            <Suspense fallback={<MyFatoorahPayment.skeleton />}>
                <MyFatoorahPayment
                    orderId={orderId}
                    amount={amount}
                    currency={currency}
                    language="AR"
                    isGuest={isGuest}
                />
            </Suspense>
        </PaymentShell>
    );
}
