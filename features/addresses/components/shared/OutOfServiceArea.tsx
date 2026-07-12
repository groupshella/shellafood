"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/features/language/useLanguage";

interface OutOfServiceAreaProps {
	onAutoRedirect: () => void;
	onGoHome: () => void;
}

export function OutOfServiceArea({
	onAutoRedirect,
	onGoHome,
}: OutOfServiceAreaProps) {
	const { isArabic, locale } = useLanguage();

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={locale}
			role="alertdialog"
			aria-labelledby="out-of-zone-title"
			aria-describedby="out-of-zone-desc"
			className="mx-auto flex w-full max-w-sm flex-col items-center px-4 pb-6 pt-8 text-center sm:px-5 sm:pt-10 md:max-w-md"
		>
			<div className="relative mb-5 flex h-24 w-24 items-center justify-center sm:mb-6 sm:h-28 sm:w-28 md:mb-8 md:h-32 md:w-32">
				<span className="absolute inset-0 rounded-full border border-dashed border-[#E5E5E5] dark:border-gray-600" aria-hidden />
				<span className="absolute inset-3 rounded-full border border-dashed border-[#E5E5E5] dark:border-gray-600" aria-hidden />

				<MapPin
					className="relative h-11 w-11 text-[#E5E5E5] dark:text-gray-600 sm:h-12 sm:w-12 md:h-14 md:w-14"
					strokeWidth={1.5}
					fill="currentColor"
					aria-hidden
				/>
				<span className="absolute top-6 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-800 sm:top-7 md:top-8">
					<svg
						viewBox="0 0 20 20"
						className="h-3.5 w-3.5 text-[#9CA3AF] dark:text-gray-500"
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

				<span className="absolute bottom-3 h-2.5 w-14 rounded-full bg-[#F0F0F0] dark:bg-gray-700 sm:w-16" aria-hidden />
			</div>

			<h2
				id="out-of-zone-title"
				className="text-base font-bold leading-snug text-[#111B18] dark:text-gray-100 sm:text-lg"
			>
				{isArabic ? "هذه المنطقة خارج نطاق خدمتنا" : "This area is outside our service range"}
			</h2>
			<p
				id="out-of-zone-desc"
				className="mt-2 text-sm leading-relaxed text-[#43474F] dark:text-gray-400 sm:text-[14px]"
			>
				{isArabic
					? "هل ترغب بالتوجه تلقائياً إلى أقرب منطقة متوفر فيها الخدمة؟"
					: "Would you like to go automatically to the nearest area where service is available?"}
			</p>

			<div className="mt-5 flex w-full max-w-sm flex-col gap-2.5 sm:mt-6 sm:gap-3 md:mt-8">
				<button
					type="button"
					onClick={onAutoRedirect}
					className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#30913F] text-sm font-bold text-white transition-colors hover:bg-[#2a8036] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:min-h-[52px] sm:text-[15px]"
				>
					{isArabic ? "نعم، وجهني" : "Yes, guide me"}
				</button>
				<button
					type="button"
					onClick={onGoHome}
					className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#F6F6F6] text-sm font-bold text-[#43474F] transition-colors hover:bg-[#ECECEC] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:min-h-[52px] sm:text-[15px]"
				>
					{isArabic ? "لا، الرجوع للرئيسية" : "No, go back home"}
				</button>
			</div>
		</div>
	);
}
