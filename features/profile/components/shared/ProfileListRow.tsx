"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ProfileListRowProps {
	icon?: ReactNode;
	label: string;
	subLabel?: string;
	href?: string;
	onClick?: () => void;
	trailing?: ReactNode;
	showChevron?: boolean;
	muted?: boolean;
}

export function ProfileListRow({
	icon,
	label,
	subLabel,
	href,
	onClick,
	trailing,
	showChevron = true,
	muted = false,
}: ProfileListRowProps) {
	const className = [
		"flex min-h-[48px] w-full items-center justify-between gap-3 px-3 text-start transition-colors",
		"active:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40",
		"sm:min-h-[52px] sm:gap-4 sm:px-4 md:min-h-14 md:px-5",
	].join(" ");

	const content = (
		<>
			<div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
				{icon && (
					<span className="flex h-6 w-6 shrink-0 items-center justify-center text-muted sm:h-7 sm:w-7 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
						{icon}
					</span>
				)}
				<div className="min-w-0">
					<p
						className={[
							"truncate text-[15px] font-bold leading-[160%] sm:text-[16px]",
							muted ? "text-muted" : "text-foreground",
						].join(" ")}
					>
						{label}
					</p>
					{subLabel && (
						<p className="truncate text-[12px] font-medium leading-[160%] text-muted sm:text-[13px]">
							{subLabel}
						</p>
					)}
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
				{trailing}
				{showChevron && (
					<ChevronLeft
						className="h-5 w-5 text-muted ltr:rotate-180"
						strokeWidth={1.5}
					/>
				)}
			</div>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={className}>
				{content}
			</Link>
		);
	}

	return (
		<button type="button" onClick={onClick} className={className}>
			{content}
		</button>
	);
}
