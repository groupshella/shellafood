interface ScrollContainerProps {
	children: React.ReactNode;
	className?: string;
	ariaLabel?: string;
}

export function ScrollContainer({ children, className, ariaLabel }: ScrollContainerProps) {
	return (
		<div
			role="region"
			aria-label={ariaLabel}
			tabIndex={0}
			className={[
				"w-full min-w-0 overflow-x-auto overflow-y-visible",
				"touch-pan-x overscroll-x-contain snap-x snap-mandatory",
				"[-webkit-overflow-scrolling:touch]",
				"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex w-max min-w-full gap-2 p-1 sm:gap-3 sm:px-5 md:gap-4 md:px-6 lg:gap-5 lg:px-8 [&>*]:snap-start">
				{children}
			</div>
		</div>
	);
}
