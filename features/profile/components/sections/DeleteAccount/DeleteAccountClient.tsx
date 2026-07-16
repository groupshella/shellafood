"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/features/auth/lib/auth.lib";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { deleteAccount } from "@/features/profile/actions/profile.actions";

export function DeleteAccountClient({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();
	const lang = isArabic ? "ar" : "en";
	const [agreed, setAgreed] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		if (!agreed) return;

		setIsDeleting(true);
		setError(null);

		const result = await deleteAccount(lang);
		setIsDeleting(false);

		if (!result.success) {
			setError(result.message);
			return;
		}

		await clearSession();
		router.replace("/auth");
	};

	const canDelete = agreed && !isDeleting;

	return (
		<ProfileSubpageShell
			title={isArabic ? "حذف الحساب" : "Delete account"}
			isArabic={isArabic}
			relaxedHeader
			showHeaderBorder={false}
			showFooterBorder={false}
			footerClassName="pb-6 pt-4"
			mainClassName="pb-6"
			footer={
				<div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl md:max-w-3xl lg:max-w-3xl">
					<label className="flex cursor-pointer items-center justify-start gap-2">
						<button
							type="button"
							role="checkbox"
							aria-checked={agreed}
							onClick={() => setAgreed((prev) => !prev)}
							className={[
								"flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-[1.5px] transition-colors",
								agreed
									? "border-brand bg-brand text-brand-foreground"
									: "border-border bg-background",
							].join(" ")}
						>
							{agreed && <span className="text-[13px] leading-none">✓</span>}
						</button>
						<span className="text-[14px] font-medium leading-[160%] text-muted">
							{isArabic
								? "لقد قرأت البيان أعلاه وأوافق عليه"
								: "I have read the statement above and agree"}
						</span>
					</label>

					<button
						type="button"
						onClick={handleDelete}
						disabled={!canDelete}
						className={[
							"flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 text-[16px] font-bold leading-[160%] transition-colors sm:min-h-[52px]",
							canDelete
								? "bg-red-500 text-white active:brightness-95"
								: "cursor-not-allowed bg-card text-muted",
						].join(" ")}
					>
						{isArabic ? "حذف الحساب" : "Delete account"}
					</button>
				</div>
			}
		>
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl md:max-w-3xl lg:max-w-3xl lg:gap-5">
				<div className="flex flex-col items-start gap-1">
					<p className="w-full text-start text-[16px] font-bold leading-[160%] text-foreground sm:text-[17px]">
						{isArabic
							? "يرجى مراجعة المعلومات التالية بعناية قبل حذف حسابك."
							: "Please review the following information carefully before deleting your account."}
					</p>
					<p className="w-full text-start text-[15px] font-medium leading-[170%] text-foreground sm:text-[16px]">
						{isArabic
							? "سيؤدي هذا الإجراء إلى حذف حسابك بشكل نهائي، بالإضافة إلى إزالة بعض البيانات المرتبطة به، مثل:"
							: "This action will permanently delete your account and remove some related data, such as:"}
					</p>
				</div>

				<div className="flex w-full items-start gap-2">
					<AlertTriangle
						className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
						strokeWidth={1.5}
					/>
					<p className="flex-1 text-start text-[14px] font-bold leading-[160%] text-red-500">
						{isArabic
							? "لا يمكن التراجع عن هذا الإجراء بعد تنفيذه."
							: "This action cannot be undone once completed."}
					</p>
				</div>

				{error && (
					<p className="text-center text-[13px] text-red-500" role="alert">
						{error}
					</p>
				)}
			</div>
		</ProfileSubpageShell>
	);
}
