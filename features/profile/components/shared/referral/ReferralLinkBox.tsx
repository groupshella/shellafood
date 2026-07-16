"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ReferralLinkBoxProps {
	link: string;
	isArabic: boolean;
}

export function ReferralLinkBox({ link, isArabic }: ReferralLinkBoxProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard can fail silently
		}
	};

	return (
		<div className="flex w-full flex-col gap-2">
			<span className="text-start text-[14px] font-bold leading-none text-foreground">
				{isArabic ? "الرمز الشخصي الخاص بك" : "Your personal code"}
			</span>
			<div className="flex min-h-[56px] w-full items-center justify-between rounded-[12px] border border-dashed border-border bg-card px-4 py-2">
				<span
					className="min-w-0 flex-1 truncate text-start text-[16px] font-bold text-foreground"
					dir="ltr"
				>
					{link}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={
						copied
							? isArabic
								? "تم النسخ"
								: "Copied"
							: isArabic
								? "نسخ الرابط"
								: "Copy link"
					}
					className="ms-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors active:bg-background"
				>
					{copied ? (
						<Check className="h-6 w-6 text-brand" strokeWidth={1.75} />
					) : (
						<Copy className="h-6 w-6 text-muted" strokeWidth={1.75} />
					)}
				</button>
			</div>
		</div>
	);
}
