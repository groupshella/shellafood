import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import { SarIcon } from "../shared/SarIcon";

export function QidhaSpendingCard({
	label,
	amount,
	iconBg,
	icon,
}: {
	label: string;
	amount: string;
	iconBg: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="flex min-h-[100px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-[12px] border border-border bg-background px-1.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:px-2 sm:py-4">
			<div
				className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px]"
				style={{ backgroundColor: iconBg }}
			>
				{icon}
			</div>
			<span
				className="line-clamp-2 text-center text-[8px] font-medium leading-tight text-muted sm:text-[9px]"
				style={TAJAWAL}
			>
				{label}
			</span>
			<div className="flex items-center gap-0.5 text-foreground">
				<SarIcon width={13} height={14.56} />
				<span
					className="text-[clamp(14px,4vw,17px)] font-bold tabular-nums"
					style={TAJAWAL}
				>
					{amount}
				</span>
			</div>
		</div>
	);
}
