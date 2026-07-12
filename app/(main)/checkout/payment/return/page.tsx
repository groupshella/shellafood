import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PaymentShell } from "@/features/payment/components/PaymentShell";
import { PaymentReturnView } from "@/features/payment/components/PaymentReturnView";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
    title: "نتيجة الدفع | شيلة فود",
    description: "عرض نتيجة عملية الدفع",
};

interface ReturnPageProps {
    /**
     * MyFatoorah may append paymentId/Id query params on their return redirect.
     * The backend may also forward invoiceId here.
     * Both are optional — PaymentReturnView falls back to sessionStorage.
     */
    searchParams: Promise<{ invoiceId?: string; paymentId?: string }>;
}

export default async function PaymentReturnPage({ searchParams }: ReturnPageProps) {
    const cookieStore = await cookies();

    if (!cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value) {
        redirect("/auth");
    }

    const params = await searchParams;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";

    return (
        <PaymentShell isArabic={isArabic}>
            <PaymentReturnView
                invoiceIdParam={params.invoiceId}
                paymentIdParam={params.paymentId}
                isArabic={isArabic}
            />
        </PaymentShell>
    );
}
