"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type PaymentShellProps = {
	children: ReactNode;
	isArabic: boolean;
};

const BACK_BTN = [
	"flex h-10 w-10 items-center justify-center rounded-full",
	"text-foreground transition-colors active:bg-card",
	"focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function PaymentShell({ children, isArabic }: PaymentShellProps) {
	const router = useRouter();

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="flex min-h-screen flex-col bg-background"
		>
			<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
				<div className="mx-auto flex w-full max-w-lg items-center gap-3 px-4 py-3 sm:max-w-xl sm:px-5 md:max-w-2xl lg:max-w-3xl lg:px-6">
					<button
						type="button"
						aria-label={isArabic ? "رجوع" : "Go back"}
						className={BACK_BTN}
						onClick={() => router.push("/home")}
					>
						<ChevronRight
							className={["h-5 w-5", isArabic ? "" : "rotate-180"].join(" ")}
							aria-hidden
						/>
					</button>
					<h1 className="text-base font-bold text-foreground sm:text-lg lg:text-xl">
						{isArabic ? "إتمام الدفع" : "Complete payment"}
					</h1>
				</div>
			</header>

			<main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 sm:max-w-xl sm:px-5 sm:py-6 md:max-w-2xl lg:max-w-3xl lg:px-6 lg:py-8">
				{children}
			</main>
		</div>
	);
}
