export default function Loading() {
	return (
		<div
			dir="rtl"
			lang="ar"
			role="status"
			aria-live="polite"
			aria-busy="true"
			className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#f8fbf9] to-[#eef6f0] dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"
		>
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-0.5 bg-[#30913F]/10 dark:bg-[#30913F]/20"
			>
				<div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-[#30913F]/20 via-[#30913F] to-[#30913F]/20 motion-reduce:animate-none" />
			</div>

			<div className="flex flex-col items-center gap-6 px-6">
				<div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
					<div
						aria-hidden
						className="absolute inset-0 rounded-full border-[3px] border-[#30913F]/15 dark:border-[#30913F]/25"
					/>
					<div
						aria-hidden
						className="absolute inset-0 motion-safe:animate-spin rounded-full border-[3px] border-transparent border-t-[#30913F] border-r-[#30913F]/50 motion-reduce:animate-none"
					/>
				</div>

				<div className="flex flex-col items-center gap-3">
					<p className="text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-100 sm:text-base">
						جاري التحميل...
					</p>

					<div className="flex items-center gap-1.5" aria-hidden>
						{[0, 150, 300].map((delay) => (
							<span
								key={delay}
								className="h-2 w-2 rounded-full bg-[#30913F] motion-safe:animate-bounce motion-reduce:animate-none dark:bg-[#3da84f]"
								style={{ animationDelay: `${delay}ms` }}
							/>
						))}
					</div>
				</div>
			</div>

			<span className="sr-only">جاري التحميل، يرجى الانتظار</span>
		</div>
	);
}
