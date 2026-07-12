interface ScrollContainerProps {
	children: React.ReactNode;
	className?: string;
	ariaLabel?: string;
	isArabic?: boolean;
}

export function ScrollContainer({ children, className, ariaLabel, isArabic }: ScrollContainerProps) {
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
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex w-max min-w-full  p-1  sm:px-5  md:px-6  lg:px-8 [&>*]:snap-start">
				{children}
			</div>
		</div>
	);
}
