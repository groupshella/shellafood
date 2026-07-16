"use client";

import { useState } from "react";

export function DiscountCodeClient({ isArabic }: { isArabic: boolean }) {
	const [code, setCode] = useState("");

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<h2 className="mb-3 text-sm font-bold text-foreground sm:text-[15px]">
				{isArabic ? "لديك كود خصم؟" : "Have a discount code?"}
			</h2>

			<div className="flex flex-col gap-2 rounded-xl p-1.5 sm:flex-row sm:items-center sm:gap-2 sm:p-2">
				<input
					type="text"
					dir="ltr"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder={isArabic ? "مثال : SHELLA2026" : "e.g. SHELLA2026"}
					aria-label={isArabic ? "كود الخصم" : "Discount code"}
					className="min-h-11 flex-1 bg-transparent px-3 py-2.5 text-start text-sm text-foreground placeholder:text-muted focus:outline-none sm:min-h-12 sm:text-[15px]"
				/>
				<button
					type="button"
					disabled={!code.trim()}
					className="min-h-11 shrink-0 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:px-6 sm:text-[15px]"
				>
					{isArabic ? "تفعيل" : "Apply"}
				</button>
			</div>
		</div>
	);
}
