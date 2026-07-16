"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type NotificationsShellProps = {
	children: ReactNode;
	isArabic: boolean;
};

const SHELL_LAYOUT =
	"mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-24 sm:px-4 sm:py-5 sm:pb-28 md:px-5 lg:px-6";

export function NotificationsShell({ children, isArabic }: NotificationsShellProps) {
	const router = useRouter();

	return (
		<div
			className={SHELL_LAYOUT}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
				<div className={`relative flex items-center justify-center ${HEADER_PADDING}`}>
					<button
						type="button"
						onClick={() => router.back()}
						className="absolute start-3 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors active:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:start-4 sm:h-11 sm:w-11"
						aria-label={isArabic ? "رجوع" : "Go back"}
					>
						<ChevronRight
							className={[
								"h-6 w-6 sm:h-[22px] sm:w-[22px]",
								isArabic ? "" : "rotate-180",
							].join(" ")}
							strokeWidth={2}
							aria-hidden
						/>
					</button>
					<h1 className="text-base font-bold text-foreground sm:text-lg lg:text-xl">
						{isArabic ? "الإشعارات" : "Notifications"}
					</h1>
				</div>
			</header>
			<div className={CONTENT_PADDING}>{children}</div>
		</div>
	);
}
