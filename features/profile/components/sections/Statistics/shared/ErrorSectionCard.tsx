import { AlertTriangle, RefreshCw } from "lucide-react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function ErrorSectionCard({
	message,
	onRetry,
	isArabic = true,
}: {
	message?: string;
	onRetry: () => void;
	isArabic?: boolean;
}) {
	const displayMessage =
		message ??
		(isArabic ? "تعذّر تحميل البيانات" : "Could not load data");

	return (
		<div className="flex min-h-[71px] w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-red-200 bg-red-50 px-4 py-6">
			<div className="flex items-center gap-1.5 text-red-500">
				<AlertTriangle className="h-4 w-4" strokeWidth={2} />
				<p className="text-center text-[14px] font-medium" style={TAJAWAL}>
					{displayMessage}
				</p>
			</div>
			<button
				type="button"
				onClick={onRetry}
				className="flex items-center gap-1.5 rounded-[8px] bg-background px-3 py-1.5 text-[13px] font-bold text-foreground shadow-[0px_1px_8px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.97]"
				style={TAJAWAL}
			>
				<RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
				{isArabic ? "إعادة المحاولة" : "Retry"}
			</button>
		</div>
	);
}
