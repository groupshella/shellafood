"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/features/layout/actions/set-locale";
import type { Locale } from "@/shared/lib/locale";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";

const LANGUAGE_OPTIONS: { code: Locale; label: { ar: string; en: string } }[] = [
	{ code: "ar", label: { ar: "العربية", en: "Arabic" } },
	{ code: "en", label: { ar: "English (US)", en: "English (US)" } },
];

export function LanguageClient({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const current: Locale = isArabic ? "ar" : "en";

	const handleSelect = (code: Locale) => {
		if (code === current || isPending) return;
		startTransition(async () => {
			await setLocale(code);
			router.refresh();
		});
	};

	return (
		<ProfileSubpageShell
			title={isArabic ? "اللغة" : "Language"}
			isArabic={isArabic}
		>
			<div className="mx-auto w-full max-w-lg rounded-2xl bg-card px-3 sm:max-w-2xl sm:px-4 md:max-w-3xl lg:max-w-4xl">
				{LANGUAGE_OPTIONS.map((opt) => (
					<ProfileRadioRow
						key={opt.code}
						label={isArabic ? opt.label.ar : opt.label.en}
						selected={current === opt.code}
						onSelect={() => handleSelect(opt.code)}
					/>
				))}
			</div>
		</ProfileSubpageShell>
	);
}
