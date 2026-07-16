"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface PrimaryButtonProps {
	children: ReactNode;
	href?: string;
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
	variant?: "primary" | "danger-muted";
	className?: string;
}

export function PrimaryButton({
	children,
	href,
	onClick,
	type = "button",
	disabled = false,
	variant = "primary",
	className = "",
}: PrimaryButtonProps) {
	const base = [
		"inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors",
		"sm:min-h-[52px] sm:text-[15px] md:min-h-14 md:text-base",
		"disabled:cursor-not-allowed",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	].join(" ");

	const styles =
		variant === "primary"
			? "bg-brand text-brand-foreground active:brightness-95 disabled:bg-card disabled:text-muted"
			: "bg-card text-red-500 active:brightness-95";

	const classNames = `${base} ${styles} ${className}`;

	if (href && !disabled) {
		return (
			<Link href={href} className={classNames}>
				{children}
			</Link>
		);
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={classNames}
		>
			{children}
		</button>
	);
}
