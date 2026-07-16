"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface ProfileSubpageShellProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	footer?: ReactNode;
	onBack?: () => void;
	showHeaderBorder?: boolean;
	showFooterBorder?: boolean;
	relaxedHeader?: boolean;
	subtitleAlign?: "center" | "start";
	mainClassName?: string;
	elevatedHeader?: boolean;
	footerClassName?: string;
	/** Defaults to Arabic for legacy callers not yet migrated. */
	isArabic?: boolean;
}

const BACK_BTN = [
	"flex items-center justify-center rounded-full transition-colors",
	"text-foreground active:bg-card",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function ProfileSubpageShell({
	title,
	subtitle,
	children,
	footer,
	onBack,
	showHeaderBorder = true,
	showFooterBorder = true,
	relaxedHeader = false,
	subtitleAlign = "center",
	mainClassName = "",
	elevatedHeader = false,
	footerClassName = "",
	isArabic = true,
}: ProfileSubpageShellProps) {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) onBack();
		else router.back();
	};

	return (
		<div
			className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header
				className={`z-10 grid shrink-0 grid-cols-[auto_1fr_auto] items-center bg-background ${
					elevatedHeader
						? "h-[70px] border-b border-border px-4 shadow-[0px_6px_25.1px_rgba(0,0,0,0.05)] sm:px-5 md:px-6"
						: relaxedHeader
							? "px-4 pb-2 pt-6 sm:px-5 md:px-6 lg:px-8"
							: "px-4 py-5 sm:px-5 md:px-6 lg:px-8"
				} ${!elevatedHeader && showHeaderBorder ? "border-b border-border" : ""}`}
			>
				<button
					type="button"
					onClick={handleBack}
					aria-label={isArabic ? "رجوع" : "Go back"}
					className={`${BACK_BTN} -me-1 ${elevatedHeader || relaxedHeader ? "h-10 w-10" : "h-9 w-9"}`}
				>
					<ChevronRight
						className={[
							"h-6 w-6 text-foreground",
							isArabic ? "" : "rotate-180",
						].join(" ")}
						strokeWidth={elevatedHeader ? 1.5 : 1.75}
						aria-hidden
					/>
				</button>
				<h1
					className={`truncate text-center font-bold leading-[160%] text-foreground ${
						elevatedHeader || relaxedHeader ? "text-lg sm:text-[18px]" : "text-base sm:text-[16px]"
					}`}
				>
					{title}
				</h1>
				<div className={relaxedHeader ? "w-10" : "w-9"} aria-hidden />
			</header>

			{subtitle && (
				<p
					className={`mx-auto w-full max-w-lg shrink-0 px-4 pt-4 text-sm font-bold leading-[160%] text-foreground sm:max-w-2xl sm:px-5 sm:text-[14px] md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl ${
						subtitleAlign === "start" ? "text-start" : "text-center"
					}`}
				>
					{subtitle}
				</p>
			)}

			<main
				className={`min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 lg:px-6 ${
					subtitle ? "pb-6 pt-3" : relaxedHeader ? "pb-8 pt-2" : "py-4"
				} ${mainClassName}`}
			>
				{children}
			</main>

			{footer && (
				<footer
					className={`shrink-0 bg-background px-4 pb-2 sm:px-5 md:px-6 lg:px-8 ${
						showFooterBorder ? "border-t border-border" : ""
					} ${footerClassName}`}
				>
					<div className="mx-auto w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
						{footer}
					</div>
				</footer>
			)}
		</div>
	);
}
