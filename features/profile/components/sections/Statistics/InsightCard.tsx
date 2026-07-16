import { Lightbulb } from "lucide-react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { AnalyticsInsight } from "@/features/profile/types/statistics.types";

export function InsightCard({ insight }: { insight: AnalyticsInsight }) {
	const palette = {
		positive: {
			bg: "bg-brand/10",
			icon: "text-brand",
		},
		warning: {
			bg: "bg-[#FFF6E5]",
			icon: "text-[#ED9206]",
		},
		info: {
			bg: "bg-[#EFE6FF]",
			icon: "text-[#7861A6]",
		},
	}[insight.tone];

	return (
		<div className="flex w-full items-start gap-3 rounded-[14px] border border-border bg-background px-4 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
			<div
				className={[
					"flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]",
					palette.bg,
				].join(" ")}
			>
				<Lightbulb
					className={["h-4 w-4", palette.icon].join(" ")}
					strokeWidth={2}
				/>
			</div>
			<div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
				{insight.title && (
					<span
						className="text-[13px] font-bold text-foreground"
						style={TAJAWAL}
					>
						{insight.title}
					</span>
				)}
				<span
					className="text-start text-[13px] font-medium leading-[150%] text-muted"
					style={TAJAWAL}
				>
					{insight.message}
				</span>
			</div>
		</div>
	);
}
