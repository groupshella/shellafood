"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useCheckPaymentStatus } from "@/features/payment/hooks/useCheckPaymentStatus";
import { INVOICE_STORAGE_KEY } from "@/features/payment/components/HostedPaymentFlow";
import { classifyPaymentResult } from "@/features/payment/types/payment.types";
import type { PaymentResult } from "@/features/payment/types/payment.types";

interface PaymentReturnViewProps {
	invoiceIdParam?: string;
	paymentIdParam?: string;
	isArabic: boolean;
}

const ACTION_BTN = [
	"inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity active:opacity-80",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function PaymentReturnView({
	invoiceIdParam,
	paymentIdParam,
	isArabic,
}: PaymentReturnViewProps) {
	const lang = isArabic ? "ar" : "en";
	const router = useRouter();
	const { checkStatus } = useCheckPaymentStatus();

	const [result, setResult] = useState<PaymentResult | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const verify = useCallback(async () => {
		const storedInvoiceId =
			typeof window !== "undefined"
				? sessionStorage.getItem(INVOICE_STORAGE_KEY)
				: null;

		const invoiceId = invoiceIdParam ?? storedInvoiceId ?? null;
		const paymentId = paymentIdParam ?? null;

		const key = invoiceId ?? paymentId;
		const keyType: "InvoiceId" | "PaymentId" = invoiceId ? "InvoiceId" : "PaymentId";

		if (!key) {
			setError(
				isArabic
					? "لم يتم العثور على معرف الدفع. يرجى مراجعة طلباتك."
					: "Payment ID not found. Please check your orders.",
			);
			setIsChecking(false);
			return;
		}

		try {
			const data = await checkStatus({ key_type: keyType, key }, lang);
			sessionStorage.removeItem(INVOICE_STORAGE_KEY);
			setResult(classifyPaymentResult(data));
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: isArabic
						? "تعذر التحقق من حالة الدفع"
						: "Could not verify payment status",
			);
		} finally {
			setIsChecking(false);
		}
	}, [checkStatus, invoiceIdParam, paymentIdParam, lang, isArabic]);

	useEffect(() => {
		verify();
	}, [verify]);

	if (isChecking) {
		return (
			<div
				className="flex flex-col items-center justify-center gap-3 py-20 sm:py-24"
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				aria-busy="true"
			>
				<Loader2 className="h-8 w-8 animate-spin text-brand" />
				<p className="text-sm text-muted">
					{isArabic
						? "جاري التحقق من حالة الدفع..."
						: "Verifying payment status..."}
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8"
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				role="alert"
			>
				<AlertCircle className="h-12 w-12 text-red-500" />
				<p className="text-center text-sm text-red-500">{error}</p>
				<Link
					href="/"
					className={`${ACTION_BTN} bg-brand text-brand-foreground focus-visible:ring-brand`}
				>
					{isArabic ? "الرئيسية" : "Home"}
				</Link>
			</div>
		);
	}

	if (result === "success") {
		return (
			<div
				className="flex flex-col items-center gap-4 rounded-2xl border border-brand/20 bg-brand/10 p-6 sm:p-8"
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
			>
				<CheckCircle className="h-14 w-14 text-brand" />
				<h2 className="text-lg font-bold text-brand sm:text-xl">
					{isArabic ? "تمت عملية الدفع بنجاح" : "Payment completed successfully"}
				</h2>
				<p className="text-center text-[13px] text-muted sm:text-sm">
					{isArabic
						? "تم تأكيد طلبك وسيتم معالجته قريباً"
						: "Your order has been confirmed and will be processed soon"}
				</p>
				<Link
					href="/orders"
					className={`${ACTION_BTN} mt-2 bg-brand text-brand-foreground focus-visible:ring-brand`}
				>
					{isArabic ? "تتبع طلبك" : "Track your order"}
				</Link>
			</div>
		);
	}

	if (result === "pending") {
		return (
			<div
				className="flex flex-col items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 sm:p-8"
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
			>
				<Clock className="h-14 w-14 text-amber-500" />
				<h2 className="text-lg font-bold text-amber-500 sm:text-xl">
					{isArabic ? "الدفع قيد المعالجة" : "Payment is being processed"}
				</h2>
				<p className="text-center text-[13px] text-muted sm:text-sm">
					{isArabic
						? "جاري معالجة عملية الدفع. سيتم تحديث حالة طلبك تلقائياً"
						: "Your payment is being processed. Your order status will update automatically"}
				</p>
				<Link
					href="/orders"
					className={`${ACTION_BTN} mt-2 bg-amber-500 text-white focus-visible:ring-amber-500`}
				>
					{isArabic ? "عرض الطلبات" : "View orders"}
				</Link>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<AlertCircle className="h-14 w-14 text-red-500" />
			<h2 className="text-lg font-bold text-red-500 sm:text-xl">
				{isArabic ? "فشلت عملية الدفع" : "Payment failed"}
			</h2>
			<p className="text-center text-[13px] text-muted sm:text-sm">
				{isArabic
					? "لم تكتمل عملية الدفع. يرجى المحاولة مرة أخرى"
					: "The payment was not completed. Please try again"}
			</p>
			<button
				type="button"
				onClick={() => router.back()}
				className={`${ACTION_BTN} mt-2 bg-red-500 text-white focus-visible:ring-red-500`}
			>
				{isArabic ? "حاول مجدداً" : "Try again"}
			</button>
		</div>
	);
}
