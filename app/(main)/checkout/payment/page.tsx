import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PaymentShell } from "@/features/payment/components/PaymentShell";
import { HostedPaymentFlow } from "@/features/payment/components/HostedPaymentFlow";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";

export const metadata: Metadata = {
    title: "الدفع | شيلة فود",
    description: "أكمل عملية الدفع عبر MyFatoorah",
};

interface PaymentPageProps {
    searchParams: Promise<{ orderId?: string; amount?: string; currency?: string }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const params = await searchParams;
    const cookieStore = await cookies();

    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    if (!accessToken) {
        redirect("/auth");
    }

    const orderId = params.orderId ? Number(params.orderId) : NaN;
    const amount = params.amount ? Number(params.amount) : NaN;
    const currency = params.currency ?? "SAR";

    if (!Number.isFinite(orderId) || !Number.isFinite(amount)) {
        redirect("/checkout");
    }

    // Read user profile from the non-httpOnly cookie to pre-fill customer fields.
    const userRaw = cookieStore.get(COOKIE_KEYS.USER)?.value;
    let user: AuthUser | null = null;
    try {
        user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
    } catch {
        // malformed cookie — proceed without user data
    }

    const customerName = user ? `${user.f_name} ${user.l_name}`.trim() : "Customer";
    const customerPhone = user?.phone ?? "";
    const customerEmail = user?.email ?? "no-reply@shelafood.com";

    return (
        <PaymentShell>
            <HostedPaymentFlow
                orderId={orderId}
                amount={amount}
                currency={currency}
                customerName={customerName}
                customerPhone={customerPhone}
                customerEmail={customerEmail}
            />
        </PaymentShell>
    );
}
