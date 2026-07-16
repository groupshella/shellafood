"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type CouponsShellProps = {
	children: ReactNode;
	isArabic: boolean;
};

const SHELL_LAYOUT =
	"mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-background pb-24 sm:max-w-2xl sm:pb-28 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";

export function CouponsShell({ children, isArabic }: CouponsShellProps) {
	return (
		<div
			className={SHELL_LAYOUT}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header
				className={`sticky top-0 z-10 flex items-center justify-between bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.06)] ${HEADER_PADDING}`}
			>
				<h1 className="text-base font-extrabold text-foreground sm:text-lg lg:text-xl">
					{isArabic ? "الكوبونات" : "Coupons"}
				</h1>
				<Link
					href="/profile"
					aria-label={isArabic ? "رجوع" : "Go back"}
					className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors active:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11 sm:w-11"
				>
					<ChevronRight
						className={[
							"h-5 w-5 sm:h-[22px] sm:w-[22px]",
							isArabic ? "" : "rotate-180",
						].join(" ")}
						aria-hidden
					/>
				</Link>
			</header>

			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
