"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertTone = "error" | "success" | "warning" | "info";

const TONE: Record<
	AlertTone,
	{ wrap: string; icon: string; text: string; Icon: typeof AlertCircle }
> = {
	error: {
		wrap: "border-red-500/20 bg-red-500/5",
		icon: "text-red-500",
		text: "text-red-500",
		Icon: AlertCircle,
	},
	success: {
		wrap: "border-brand/25 bg-brand/10",
		icon: "text-brand",
		text: "text-brand",
		Icon: CheckCircle2,
	},
	warning: {
		wrap: "border-amber-500/30 bg-amber-500/10",
		icon: "text-amber-600",
		text: "text-amber-800",
		Icon: AlertCircle,
	},
	info: {
		wrap: "border-border bg-card",
		icon: "text-muted",
		text: "text-muted",
		Icon: Info,
	},
};

interface FormAlertProps {
	tone?: AlertTone;
	message: string;
	action?: ReactNode;
	role?: "alert" | "status";
	className?: string;
}

export function FormAlert({
	tone = "error",
	message,
	action,
	role = "alert",
	className = "",
}: FormAlertProps) {
	const style = TONE[tone];
	const { Icon } = style;

	return (
		<div
			role={role}
			aria-live={tone === "error" ? "assertive" : "polite"}
			className={[
				"flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
				style.wrap,
				className,
			].join(" ")}
		>
			<div className="flex items-start gap-2">
				<Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.icon}`} aria-hidden />
				<p className={`text-[13px] font-medium leading-relaxed ${style.text}`}>
					{message}
				</p>
			</div>
			{action}
		</div>
	);
}
