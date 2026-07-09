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
				"w-full min-w-0 overflow-x-auto overflow-y-visible p-2 mx-[-1rem]",
				"touch-pan-x overscroll-x-contain snap-x snap-mandatory",
				"[-webkit-overflow-scrolling:touch]",
				"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex min-w-full gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 [&>*]:snap-start">{children}</div>
		</div>
	);
}
