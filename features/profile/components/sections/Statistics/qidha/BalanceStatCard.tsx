import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import { SarIcon } from "../shared/SarIcon";

export function BalanceStatCard({
	label,
	amount,
	sublabel,
}: {
	label: string;
	amount: string;
	sublabel: string;
}) {
	return (
		<div className="flex min-h-[92px] min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] border border-border bg-background px-1.5 py-2.5 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
			<span
				className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-muted sm:text-[11px]"
				style={TAJAWAL}
			>
				{label}
			</span>
			<div className="flex items-center gap-0.5 text-foreground">
				<SarIcon width={14} height={15.7} />
				<span
					className="text-[clamp(15px,4.2vw,18px)] font-bold tabular-nums"
					style={TAJAWAL}
				>
					{amount}
				</span>
			</div>
			<span
				className="line-clamp-2 text-center text-[8px] font-medium leading-tight text-muted sm:text-[9px]"
				style={TAJAWAL}
			>
				{sublabel}
			</span>
		</div>
	);
}
