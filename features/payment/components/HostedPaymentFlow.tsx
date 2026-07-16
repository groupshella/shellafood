"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useGetPaymentMethods } from "@/features/payment/hooks/useGetPaymentMethods";
import { useProcessPayment } from "@/features/payment/hooks/useProcessPayment";
import type { PaymentMethod } from "@/features/payment/types/payment.types";

export const INVOICE_STORAGE_KEY = "mf_pending_invoice_id";

interface HostedPaymentFlowProps {
	orderId: number;
	amount: number;
	currency: string;
	customerName: string;
	customerPhone: string;
	customerEmail: string;
	isArabic: boolean;
}

type ScreenState = "loading_methods" | "select_method" | "processing" | "failed";

function MethodLogo({ method }: { method: PaymentMethod }) {
	const shell =
		"flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border";

	if (method.ImageUrl) {
		return (
			<div className={shell}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={method.ImageUrl}
					alt=""
					width={56}
					height={32}
					className="h-8 w-14 object-contain"
					loading="lazy"
				/>
			</div>
		);
	}

	const code = method.PaymentMethodCode?.toLowerCase() ?? "";
	const label =
		code === "vm" || code === "visa"
			? "VISA"
			: code === "md" || code === "mada"
				? "mada"
				: code === "stc"
					? "STC"
					: code === "ap" || code.includes("apple")
						? "Pay"
						: method.PaymentMethodEn.slice(0, 4).toUpperCase();

	return (
		<div className={`${shell} text-[10px] font-bold text-muted`}>{label}</div>
	);
}

function methodLabel(method: PaymentMethod, isArabic: boolean): string {
	return isArabic ? method.PaymentMethodAr : method.PaymentMethodEn;
}

export function HostedPaymentFlow({
	orderId,
	amount,
	currency,
	customerName,
	customerPhone,
	customerEmail,
	isArabic,
}: HostedPaymentFlowProps) {
	const lang = isArabic ? "ar" : "en";
	const { getPaymentMethods } = useGetPaymentMethods();
	const { processPayment } = useProcessPayment();

	const [screen, setScreen] = useState<ScreenState>("loading_methods");
	const [methods, setMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		getPaymentMethods(amount, currency, lang)
			.then((data) => {
				if (cancelled) return;
				const list = Array.isArray(data) ? data : [];
				setMethods(list);
				if (list.length > 0) {
					setSelectedMethodId(list[0].PaymentMethodId);
				}
				setScreen("select_method");
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(
					err instanceof Error
						? err.message
						: isArabic
							? "تعذر تحميل طرق الدفع"
							: "Could not load payment methods",
				);
				setScreen("failed");
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePay = useCallback(async () => {
		if (selectedMethodId === null) return;

		setScreen("processing");
		setError(null);

		try {
			const { payment_url, invoice_id } = await processPayment(
				{
					order_id: orderId,
					amount,
					currency,
					payment_method_id: selectedMethodId,
					customer_name: customerName || "Customer",
					customer_phone: customerPhone,
					customer_email: customerEmail || "no-reply@shelafood.com",
				},
				lang,
			);

			sessionStorage.setItem(INVOICE_STORAGE_KEY, invoice_id);
			window.location.href = payment_url;
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: isArabic
						? "تعذر إتمام الدفع"
						: "Could not complete payment",
			);
			setScreen("select_method");
		}
	}, [
		selectedMethodId,
		processPayment,
		orderId,
		amount,
		currency,
		customerName,
		customerPhone,
		customerEmail,
		lang,
		isArabic,
	]);

	const selectedMethod =
		methods.find((m) => m.PaymentMethodId === selectedMethodId) ?? null;
	const serviceCharge = selectedMethod?.ServiceCharge ?? 0;
	const totalAmount = selectedMethod?.TotalAmount ?? amount + serviceCharge;

	return (
		<div
			className="space-y-4 sm:space-y-5"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="rounded-xl border border-border bg-card p-4 sm:p-5">
				<p className="text-[13px] text-muted sm:text-sm">
					{isArabic ? `طلب رقم #${orderId}` : `Order #${orderId}`}
				</p>
				<p className="mt-1 text-[20px] font-bold tabular-nums text-foreground sm:text-2xl">
					{amount.toFixed(2)}{" "}
					<span className="text-[14px] font-semibold sm:text-base">{currency}</span>
				</p>
			</div>

			{error && (
				<div
					className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 ring-1 ring-red-500/20"
					role="alert"
				>
					<AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
					<p className="text-[13px] text-red-500">{error}</p>
				</div>
			)}

			{screen === "loading_methods" && (
				<div
					className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20"
					aria-busy="true"
				>
					<Loader2 className="h-6 w-6 animate-spin text-muted" />
					<p className="text-sm text-muted">
						{isArabic ? "جاري تحميل طرق الدفع..." : "Loading payment methods..."}
					</p>
				</div>
			)}

			{screen === "processing" && (
				<div
					className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20"
					aria-busy="true"
				>
					<Loader2 className="h-6 w-6 animate-spin text-brand" />
					<p className="text-sm text-muted">
						{isArabic
							? "جاري تجهيز صفحة الدفع..."
							: "Preparing payment page..."}
					</p>
				</div>
			)}

			{screen === "failed" && (
				<div className="flex flex-col items-center gap-3 py-12 text-center">
					<AlertCircle className="h-8 w-8 text-red-500" />
					<p className="text-sm text-foreground">
						{error ??
							(isArabic
								? "تعذر تحميل طرق الدفع"
								: "Could not load payment methods")}
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground"
					>
						{isArabic ? "إعادة المحاولة" : "Try again"}
					</button>
				</div>
			)}

			{screen === "select_method" && (
				<>
					<h2 className="text-[15px] font-semibold text-foreground sm:text-base lg:text-lg">
						{isArabic ? "اختر طريقة الدفع" : "Choose a payment method"}
					</h2>

					{methods.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted">
							{isArabic
								? "لا توجد طرق دفع متاحة حالياً"
								: "No payment methods available right now"}
						</p>
					) : (
						<div
							className="space-y-3"
							role="radiogroup"
							aria-label={isArabic ? "طرق الدفع" : "Payment methods"}
						>
							{methods.map((method) => {
								const isSelected = selectedMethodId === method.PaymentMethodId;
								return (
									<button
										key={method.PaymentMethodId}
										type="button"
										role="radio"
										aria-checked={isSelected}
										onClick={() => setSelectedMethodId(method.PaymentMethodId)}
										className={[
											"flex w-full min-h-[64px] items-center gap-3 rounded-xl border p-3.5 text-start transition-colors sm:p-4",
											"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
											isSelected
												? "border-brand bg-brand/10"
												: "border-border bg-card hover:bg-background active:brightness-95",
										].join(" ")}
									>
										<MethodLogo method={method} />

										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-foreground">
												{methodLabel(method, isArabic)}
											</p>
											<p className="text-xs text-muted">
												{isArabic
													? method.PaymentMethodEn
													: method.PaymentMethodAr}
											</p>
											{(method.ServiceCharge ?? 0) > 0 && (
												<p className="mt-0.5 text-xs text-muted">
													{isArabic
														? `رسوم الخدمة: ${method.ServiceCharge} ${currency}`
														: `Service fee: ${method.ServiceCharge} ${currency}`}
												</p>
											)}
										</div>

										{isSelected && (
											<CheckCircle
												className="h-5 w-5 shrink-0 text-brand"
												aria-hidden
											/>
										)}
									</button>
								);
							})}
						</div>
					)}

					{selectedMethod && (
						<div className="space-y-3 pt-2">
							<div className="space-y-1 rounded-xl border border-border bg-background p-3 text-[13px] text-muted sm:p-4 sm:text-sm">
								<div className="flex justify-between gap-4">
									<span>{isArabic ? "المبلغ" : "Amount"}</span>
									<span className="tabular-nums">
										{amount.toFixed(2)} {currency}
									</span>
								</div>
								{serviceCharge > 0 && (
									<div className="flex justify-between gap-4">
										<span>{isArabic ? "رسوم الخدمة" : "Service fee"}</span>
										<span className="tabular-nums">
											{serviceCharge} {currency}
										</span>
									</div>
								)}
								<div className="flex justify-between gap-4 border-t border-border pt-1 font-semibold text-foreground">
									<span>{isArabic ? "الإجمالي" : "Total"}</span>
									<span className="tabular-nums">
										{Number(totalAmount).toFixed(2)} {currency}
									</span>
								</div>
							</div>

							<button
								type="button"
								onClick={handlePay}
								className="min-h-[48px] w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-brand-foreground transition-opacity active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
							>
								{isArabic
									? `ادفع الآن — ${methodLabel(selectedMethod, isArabic)}`
									: `Pay now — ${methodLabel(selectedMethod, isArabic)}`}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
