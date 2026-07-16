"use client";

import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface SupportInfoCardProps {
	icon: ReactNode;
	title: string;
	body: ReactNode;
	showChevron?: boolean;
	align?: "center" | "start";
	onClick?: () => void;
	href?: string;
	isArabic?: boolean;
}

/**
 * Info card: icon at inline start, text start-aligned,
 * chevron at inline end (rotated for LTR when needed).
 */
export function SupportInfoCard({
	icon,
	title,
	body,
	showChevron = false,
	align = "start",
	onClick,
	href,
	isArabic = true,
}: SupportInfoCardProps) {
	const content = (
		<>
			<div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
				<span className="shrink-0 pt-px text-muted">{icon}</span>
				<div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
					<p className="text-[15px] font-bold leading-[160%] text-foreground sm:text-[16px]">
						{title}
					</p>
					<div className="w-full break-words text-[14px] font-medium leading-[160%] text-foreground sm:text-[16px]">
						{body}
					</div>
				</div>
			</div>
			{showChevron && (
				<ChevronLeft
					className={[
						"h-5 w-5 shrink-0 text-muted",
						isArabic ? "" : "rotate-180",
					].join(" ")}
					strokeWidth={1.5}
					aria-hidden
				/>
			)}
		</>
	);

	const className = `flex min-h-[80px] w-full justify-between gap-3 rounded-xl bg-card px-3 py-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-colors active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-4 sm:px-4 sm:py-4 ${
		align === "center" ? "items-center" : "items-start"
	}`;

	if (href) {
		return (
			<a href={href} className={className}>
				{content}
			</a>
		);
	}

	if (onClick) {
		return (
			<button type="button" onClick={onClick} className={`${className} text-start`}>
				{content}
			</button>
		);
	}

	return <div className={className}>{content}</div>;
}
