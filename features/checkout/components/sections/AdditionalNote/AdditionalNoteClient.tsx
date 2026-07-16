"use client";

import { useState } from "react";

export function AdditionalNoteClient({ isArabic }: { isArabic: boolean }) {
	const [note, setNote] = useState("");
	const maxLength = 300;

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<h2 className="mb-3 text-sm font-bold text-foreground sm:text-[15px]">
				{isArabic ? "ملاحظة إضافية" : "Additional note"}
			</h2>

			<div className="relative">
				<textarea
					dir={isArabic ? "rtl" : "ltr"}
					rows={3}
					value={note}
					onChange={(e) => setNote(e.target.value)}
					maxLength={maxLength}
					placeholder={
						isArabic
							? "مثال : يرجى إضافة منديل إضافي"
							: "e.g. Please add extra napkins"
					}
					aria-label={isArabic ? "ملاحظة إضافية" : "Additional note"}
					className="min-h-[6.5rem] w-full resize-none rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand sm:min-h-28 sm:px-4 sm:py-3.5 sm:text-[15px] lg:min-h-32"
				/>
				{note.length > 0 && (
					<span className="absolute bottom-2 start-3 text-[11px] text-muted sm:text-xs">
						{note.length}/{maxLength}
					</span>
				)}
			</div>
		</div>
	);
}
