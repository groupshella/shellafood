"use client";

import Link from "next/link";

interface ProfileRadioRowProps {
	label: string;
	selected: boolean;
	href?: string;
	onSelect?: () => void;
}

export function ProfileRadioRow({ label, selected, href, onSelect }: ProfileRadioRowProps) {
	const className =
		"flex min-h-[52px] w-full items-center justify-between gap-4 border-b border-border px-1 py-4 transition-colors active:bg-card last:border-b-0 sm:min-h-[56px] sm:px-2";

	const content = (
		<>
			<span
				className={`min-w-0 flex-1 text-start text-[15px] sm:text-[16px] ${
					selected ? "font-bold text-foreground" : "text-foreground"
				}`}
			>
				{label}
			</span>
			<span
				className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${
					selected ? "border-brand" : "border-border"
				}`}
			>
				{selected && (
					<span className="h-2.5 w-2.5 rounded-full bg-brand sm:h-3 sm:w-3" />
				)}
			</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} role="radio" aria-checked={selected} className={className}>
				{content}
			</Link>
		);
	}

	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={className}
		>
			{content}
		</button>
	);
}
