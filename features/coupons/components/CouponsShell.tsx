"use client";

import { useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import Navbar from "@/features/layout/components/Navbar";

type CouponsShellProps = {
	children: ReactNode;
};

const SHELL_LAYOUT =
	"mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-gray-50 pb-24 dark:bg-gray-950 sm:max-w-2xl sm:pb-28 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";

export function CouponsShell({ children }: CouponsShellProps) {
	const router = useRouter();

	const handleBack = useCallback(() => {
		router.back();
	}, [router]);

	return (
		<div className={SHELL_LAYOUT}>
			<header
				dir="rtl"
				className={`sticky top-0 z-10 flex items-center justify-between bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] ${HEADER_PADDING}`}
			>
				<h1 className="text-base font-extrabold text-gray-900 dark:text-gray-50 sm:text-lg lg:text-xl">
					الكوبونات
				</h1>
				<button
					type="button"
					onClick={handleBack}
					aria-label="رجوع"
					className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:text-gray-400 dark:active:bg-gray-800 sm:h-11 sm:w-11"
				>
					<ChevronRight className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden />
				</button>
			</header>

			<main className="flex flex-1 flex-col">{children}</main>

			<Navbar />
		</div>
	);
}
