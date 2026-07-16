"use client";

import { MapPin } from "lucide-react";

interface OutOfServiceAreaProps {
	onAutoRedirect: () => void;
	onGoHome: () => void;
	isArabic: boolean;
}

export function OutOfServiceArea({
	onAutoRedirect,
	onGoHome,
	isArabic,
}: OutOfServiceAreaProps) {
	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			role="alertdialog"
			aria-labelledby="out-of-zone-title"
			aria-describedby="out-of-zone-desc"
			className="mx-auto flex w-full max-w-sm flex-col items-center px-4 pb-6 pt-8 text-center sm:max-w-md sm:px-5 sm:pt-10 md:max-w-lg md:pt-12 lg:max-w-xl"
		>
			<div className="relative mb-5 flex h-24 w-24 items-center justify-center sm:mb-6 sm:h-28 sm:w-28 md:mb-8 md:h-32 md:w-32">
				<span
					className="absolute inset-0 rounded-full border border-dashed border-border"
					aria-hidden
				/>
				<span
					className="absolute inset-3 rounded-full border border-dashed border-border"
					aria-hidden
				/>

				<MapPin
					className="relative h-11 w-11 text-border sm:h-12 sm:w-12 md:h-14 md:w-14"
					strokeWidth={1.5}
					fill="currentColor"
					aria-hidden
				/>
				<span className="absolute top-6 flex h-5 w-5 items-center justify-center rounded-full bg-background sm:top-7 md:top-8">
					<svg
						viewBox="0 0 20 20"
						className="h-3.5 w-3.5 text-muted"
						fill="none"
						aria-hidden
					>
						<circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
						<path
							d="M7 7l6 6M13 7l-6 6"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</span>

				<span
					className="absolute bottom-3 h-2.5 w-14 rounded-full bg-card sm:w-16"
					aria-hidden
				/>
			</div>

			<h2
				id="out-of-zone-title"
				className="text-base font-bold leading-snug text-foreground sm:text-lg md:text-xl"
			>
				{isArabic
					? "هذه المنطقة خارج نطاق خدمتنا"
					: "This area is outside our service range"}
			</h2>
			<p
				id="out-of-zone-desc"
				className="mt-2 text-sm leading-relaxed text-muted sm:text-[14px] md:text-base"
			>
				{isArabic
					? "هل ترغب بالتوجه تلقائياً إلى أقرب منطقة متوفر فيها الخدمة؟"
					: "Would you like to go automatically to the nearest available service area?"}
			</p>

			<div className="mt-5 flex w-full max-w-sm flex-col gap-2.5 sm:mt-6 sm:max-w-md sm:gap-3 md:mt-8">
				<button
					type="button"
					onClick={onAutoRedirect}
					className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-brand-foreground transition-colors hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[52px] sm:text-[15px]"
				>
					{isArabic ? "نعم ، وجههني" : "Yes, take me there"}
				</button>
				<button
					type="button"
					onClick={onGoHome}
					className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-card text-sm font-bold text-muted transition-colors hover:brightness-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:min-h-[52px] sm:text-[15px]"
				>
					{isArabic ? "لا ، الرجوع الرئيسية" : "No, go back home"}
				</button>
			</div>
		</div>
	);
}
