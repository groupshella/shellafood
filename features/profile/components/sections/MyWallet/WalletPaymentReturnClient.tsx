"use client";

import { useEffect } from "react";
import Link from "next/link";

import { refreshCustomerInfo } from "@/features/profile/actions/profile.actions";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";

export type WalletPaymentReturnStatus = "pending" | "success" | "failure";

export function WalletPaymentReturnClient({
	isArabic,
	status,
}: {
	isArabic: boolean;
	status: WalletPaymentReturnStatus;
}) {
	useEffect(() => {
		if (status !== "success") return;
		void refreshCustomerInfo(isArabic ? "ar" : "en");
		sessionStorage.removeItem("wallet_invoice_id");
		sessionStorage.removeItem("wallet_payment_id");
	}, [isArabic, status]);

	const copy = {
		pending: {
			title: isArabic ? "الدفع قيد المعالجة" : "Payment is processing",
			body: isArabic
				? "لم نتلقَّ تأكيدًا نهائيًا بعد. تحقق من المحفظة لاحقًا ولا تُعد الدفع تلقائيًا."
				: "No final confirmation was received yet. Check your wallet later and do not automatically pay again.",
		},
		success: {
			title: isArabic ? "تم تأكيد الدفع" : "Payment confirmed",
			body: isArabic
				? "أكدت نتيجة العودة نجاح الدفع، وتم تحديث بيانات المحفظة."
				: "The returned payment result confirmed success and the wallet data was refreshed.",
		},
		failure: {
			title: isArabic ? "لم تكتمل عملية الدفع" : "Payment was not completed",
			body: isArabic
				? "لم يتم تأكيد الدفع. يمكنك العودة والمحاولة مرة أخرى."
				: "Payment was not confirmed. You can return and try again.",
		},
	}[status];

	return (
		<ProfileSubpageShell title={isArabic ? "نتيجة إضافة الرصيد" : "Add-fund result"} isArabic={isArabic}>
			<div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center gap-4 text-center">
				<div className={`h-16 w-16 rounded-full ${status === "success" ? "bg-green-100" : status === "failure" ? "bg-red-100" : "bg-amber-100"}`} />
				<h1 className="text-xl font-bold">{copy.title}</h1>
				<p className="text-sm leading-6 text-muted-foreground">{copy.body}</p>
				<Link href="/profile/wallet" className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-brand font-bold text-brand-foreground">
					{isArabic ? "العودة إلى المحفظة" : "Back to wallet"}
				</Link>
			</div>
		</ProfileSubpageShell>
	);
}
