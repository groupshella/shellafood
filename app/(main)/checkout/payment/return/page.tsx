import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PaymentShell } from "@/features/payment/components/PaymentShell";
import { PaymentReturnView } from "@/features/payment/components/PaymentReturnView";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "نتيجة الدفع | شيلة فود" : "Payment result | Shella Food",
		description: isArabic
			? "عرض نتيجة عملية الدفع"
			: "View your payment result",
	};
}

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
	const isArabic = await isArabicLocale();

	if (!cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value) {
		redirect("/auth");
	}

	const params = await searchParams;

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
