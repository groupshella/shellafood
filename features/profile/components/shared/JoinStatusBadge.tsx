"use client";

import { CheckCircle2, Clock3, XCircle, CircleDashed } from "lucide-react";
import { JOIN_STATUS_LABEL } from "@/features/profile/constants/join.strings";
import type { JoinRegistrationState } from "@/features/profile/types/join.types";
import type { DelegateStatus } from "@/features/profile/types/join.types";

type BadgeStatus = JoinRegistrationState | DelegateStatus;

const STYLES: Record<
	BadgeStatus,
	{ wrap: string; text: string; Icon: typeof CheckCircle2 }
> = {
	none: {
		wrap: "bg-card",
		text: "text-muted",
		Icon: CircleDashed,
	},
	pending: {
		wrap: "bg-amber-50",
		text: "text-amber-700",
		Icon: Clock3,
	},
	approved: {
		wrap: "bg-brand/10",
		text: "text-brand",
		Icon: CheckCircle2,
	},
	active: {
		wrap: "bg-brand/10",
		text: "text-brand",
		Icon: CheckCircle2,
	},
	registered: {
		wrap: "bg-brand/10",
		text: "text-brand",
		Icon: CheckCircle2,
	},
	rejected: {
		wrap: "bg-red-50",
		text: "text-red-500",
		Icon: XCircle,
	},
};

interface JoinStatusBadgeProps {
	status: BadgeStatus;
	className?: string;
	isArabic?: boolean;
}

export function JoinStatusBadge({
	status,
	className = "",
	isArabic = true,
}: JoinStatusBadgeProps) {
	const style = STYLES[status] ?? STYLES.none;
	const copy =
		JOIN_STATUS_LABEL[status as keyof typeof JOIN_STATUS_LABEL] ??
		JOIN_STATUS_LABEL.none;
	const label = isArabic ? copy.ar : copy.en;
	const { Icon } = style;

	return (
		<span
			className={[
				"inline-flex max-w-[9.5rem] items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold leading-none sm:max-w-[11rem] sm:text-[12px] md:max-w-[12rem]",
				style.wrap,
				style.text,
				className,
			].join(" ")}
			title={label}
		>
			<Icon
				className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
				strokeWidth={2}
				aria-hidden
			/>
			<span className="truncate py-0.5">{label}</span>
		</span>
	);
}
