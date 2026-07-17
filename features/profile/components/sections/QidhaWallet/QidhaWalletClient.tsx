"use client";

import { useState } from "react";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import type {
	QidhaPayOption,
	QidhaWalletCard,
} from "@/features/profile/types/qidha.types";
import { QidhaCard } from "./QidhaCard";
import { QidhaPayOptionRow } from "./QidhaPayOptionRow";
import { SarIcon } from "./shared/SarIcon";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

interface QidhaWalletClientProps {
	card: QidhaWalletCard;
	fullAmountDue?: number;
	minimumAmountDue?: number;
	isArabic: boolean;
}

export function QidhaWalletClient({
	card,
	fullAmountDue = 0,
	minimumAmountDue = 0,
	isArabic,
}: QidhaWalletClientProps) {
	const [payOption, setPayOption] = useState<QidhaPayOption>("full");
	const [customAmount, setCustomAmount] = useState("");

	return (
		<ProfileSubpageShell
			title={isArabic ? "محفظة قيدها" : "Qidha wallet"}
			isArabic={isArabic}
			relaxedHeader
			showHeaderBorder={false}
			showFooterBorder={false}
			mainClassName="bg-background pb-4"
			footer={
				<div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
					<button
						type="button"
						disabled
						className="flex h-12 w-full items-center justify-center rounded-[12px] bg-brand text-[15px] font-bold text-brand-foreground transition-opacity enabled:active:opacity-90 disabled:opacity-50 sm:h-[52px] sm:text-[16px]"
						style={TAJAWAL}
					>
						{isArabic ? "السداد غير متاح حالياً" : "Payment currently unavailable"}
					</button>
					<p className="mt-2 text-center text-xs text-muted">
						{isArabic
							? "يلزم ربط الدفعة برقم طلب قبل تفعيل السداد الآمن."
							: "A payment must be linked to an order ID before secure payment can be enabled."}
					</p>
				</div>
			}
		>
			<div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 sm:max-w-md md:max-w-[520px] lg:max-w-xl">
				<QidhaCard card={card} isArabic={isArabic} />

				<section className="flex flex-col gap-3">
					<h2
						className="text-start text-[16px] font-bold text-foreground"
						style={TAJAWAL}
					>
						{isArabic ? "خيارات الدفع" : "Payment options"}
					</h2>
					<div className="flex flex-col gap-2.5">
						<QidhaPayOptionRow
							option="full"
							amount={fullAmountDue}
							selected={payOption === "full"}
							onSelect={() => setPayOption("full")}
							isArabic={isArabic}
						/>
						<QidhaPayOptionRow
							option="minimum"
							amount={minimumAmountDue}
							selected={payOption === "minimum"}
							onSelect={() => setPayOption("minimum")}
							isArabic={isArabic}
						/>
					</div>
				</section>

				<section className="flex flex-col gap-2.5">
					<h2
						className="text-start text-[16px] font-bold text-foreground"
						style={TAJAWAL}
					>
						{isArabic ? "أدخل مبلغ آخر" : "Enter another amount"}
					</h2>
					<label className="flex h-[52px] items-center gap-2 rounded-[12px] border border-border bg-card px-3 sm:h-14 sm:px-4">
						<SarIcon
							width={16}
							height={18}
							className="shrink-0 text-foreground"
						/>
						<input
							type="number"
							inputMode="decimal"
							min={0}
							step="0.01"
							placeholder="00.00"
							value={customAmount}
							onFocus={() => setPayOption("custom")}
							onChange={(e) => {
								setCustomAmount(e.target.value);
								setPayOption("custom");
							}}
							className="w-full bg-transparent text-end text-[18px] font-bold tabular-nums text-foreground outline-none placeholder:text-muted"
							style={AFACAD}
							aria-label={
								isArabic ? "أدخل مبلغ آخر" : "Enter another amount"
							}
						/>
					</label>
				</section>

				<p className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted">
					{isArabic
						? "طرق الدفع ستظهر بعد توفير عقد سداد المستحقات من الخدمة."
						: "Payment methods will appear after the due-payment contract is available."}
				</p>
			</div>
		</ProfileSubpageShell>
	);
}
