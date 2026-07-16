export function SkeletonBlock({ className }: { className?: string }) {
	return (
		<div
			className={["animate-pulse rounded-[8px] bg-card", className]
				.filter(Boolean)
				.join(" ")}
		/>
	);
}
