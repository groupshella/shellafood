"use client";

import { useCheckout } from "@/features/checkout/context/CheckoutContext";

interface InvoiceRowProps {
	label: string;
	value: string;
	isTotal?: boolean;
	muted?: boolean;
	isArabic: boolean;
}

function InvoiceRow({
	label,
	value,
	isTotal = false,
	muted = false,
	isArabic,
}: InvoiceRowProps) {
	return (
		<div
			className="flex items-center justify-between gap-3"
			dir={isArabic ? "rtl" : "ltr"}
		>
			<span
				className={[
					"text-sm sm:text-[15px]",
					isTotal
						? "font-bold text-brand"
						: muted
							? "text-muted"
							: "text-muted",
				].join(" ")}
			>
				{label}
			</span>
			<span
				className={[
					"shrink-0 text-sm sm:text-[15px]",
					isTotal
						? "font-bold text-brand"
						: muted
							? "font-medium text-muted"
							: "font-medium text-foreground",
				].join(" ")}
			>
				{value}
			</span>
		</div>
	);
}

export function InvoiceDetailsClient({ isArabic }: { isArabic: boolean }) {
	const { invoice, deliveryMethod } = useCheckout();
	const showShippingBreakdown =
		deliveryMethod === "delivery" && invoice.firstKmDistance > 0;
	const kmUnit = isArabic ? "كم" : "km";

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<h2 className="mb-3 text-sm font-bold text-foreground sm:text-[15px]">
				{isArabic ? "تفاصيل الفاتورة" : "Invoice details"}
			</h2>

			<div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 lg:rounded-3xl lg:p-5">
				<div className="space-y-3 sm:space-y-3.5">
					<InvoiceRow
						label={isArabic ? "إجمالي المنتجات" : "Products total"}
						value={invoice.subtotal}
						isArabic={isArabic}
					/>

					<InvoiceRow
						label={isArabic ? "مصاريف الشحن" : "Shipping"}
						value={
							deliveryMethod === "pickup"
								? isArabic
									? "مجاني (استلام)"
									: "Free (pickup)"
								: invoice.deliveryFee
						}
						isArabic={isArabic}
					/>

					{showShippingBreakdown && (
						<div className="space-y-2 rounded-xl bg-background px-3 py-2.5">
							<InvoiceRow
								label={
									isArabic
										? `الرسوم لأول ${invoice.firstKmDistance} ${kmUnit}`
										: `Fee for first ${invoice.firstKmDistance} ${kmUnit}`
								}
								value={invoice.firstKmFee}
								muted
								isArabic={isArabic}
							/>
							<InvoiceRow
								label={
									invoice.extraKm > 0
										? isArabic
											? `رسوم إضافية (${invoice.perKmShippingCharge} / ${kmUnit} × ${invoice.extraKm} ${kmUnit})`
											: `Extra fee (${invoice.perKmShippingCharge} / ${kmUnit} × ${invoice.extraKm} ${kmUnit})`
										: isArabic
											? `رسوم إضافية (${invoice.perKmShippingCharge} / ${kmUnit})`
											: `Extra fee (${invoice.perKmShippingCharge} / ${kmUnit})`
								}
								value={invoice.extraKmFee}
								muted
								isArabic={isArabic}
							/>
							<InvoiceRow
								label={isArabic ? "المسافة التقريبية" : "Approximate distance"}
								value={`${invoice.distanceKm} ${kmUnit}`}
								muted
								isArabic={isArabic}
							/>
						</div>
					)}

					{invoice.showPackaging && (
						<InvoiceRow
							label={
								isArabic ? "رسوم التغليف الإضافي" : "Extra packaging fee"
							}
							value={invoice.packagingFee}
							isArabic={isArabic}
						/>
					)}

					<InvoiceRow
						label={
							isArabic
								? `ضريبة القيمة المضافة (${invoice.taxPercent}%)`
								: `VAT (${invoice.taxPercent}%)`
						}
						value={invoice.vat}
						isArabic={isArabic}
					/>
					<InvoiceRow
						label={isArabic ? "كود خصم" : "Discount code"}
						value={invoice.discount}
						isArabic={isArabic}
					/>

					{invoice.belowMinimumOrder && (
						<p className="text-xs text-amber-500 sm:text-[13px]">
							{isArabic
								? `الحد الأدنى للطلب من هذا المتجر ${invoice.minimumOrder}`
								: `Minimum order for this store is ${invoice.minimumOrder}`}
						</p>
					)}

					<div className="border-t border-border pt-3 sm:pt-3.5">
						<InvoiceRow
							label={isArabic ? "إجمالي الطلب" : "Order total"}
							value={invoice.total}
							isTotal
							isArabic={isArabic}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
