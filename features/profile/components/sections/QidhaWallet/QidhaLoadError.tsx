"use client";

import { useRouter } from "next/navigation";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";

export function QidhaLoadError({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();
	return (
		<ProfileSubpageShell
			title={isArabic ? "محفظة قيدها" : "Qidha wallet"}
			isArabic={isArabic}
		>
			<div className="mx-auto flex min-h-64 max-w-md flex-col items-center justify-center gap-4 text-center">
				<p className="text-base font-bold text-foreground">
					{isArabic
						? "تعذر تحميل محفظة قيدها"
						: "Could not load your Qidha wallet"}
				</p>
				<p className="text-sm text-muted">
					{isArabic
						? "تحقق من اتصالك ثم أعد المحاولة."
						: "Check your connection and try again."}
				</p>
				<button
					type="button"
					onClick={() => router.refresh()}
					className="rounded-xl bg-brand px-6 py-3 font-bold text-brand-foreground"
				>
					{isArabic ? "إعادة المحاولة" : "Retry"}
				</button>
			</div>
		</ProfileSubpageShell>
	);
}
