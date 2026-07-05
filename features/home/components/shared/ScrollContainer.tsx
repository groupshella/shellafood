interface ScrollContainerProps {
	children: React.ReactNode;
	className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
	return (
		<div
			className={[
				"w-full min-w-0 overflow-x-scroll overflow-y-visible pb-1",
				"touch-pan-x overscroll-x-contain",
				"[-webkit-overflow-scrolling:touch]",
				"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex w-max min-w-full gap-3">{children}</div>
		</div>
	);
}
