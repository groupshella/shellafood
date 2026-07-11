"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:scale-[0.97] dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-900 sm:h-11 sm:w-11";

interface HomeShellProps {
	isAuthenticated: boolean;
	children: React.ReactNode;
}

export function HomeShell({ children }: HomeShellProps) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-white pb-[calc(58px+env(safe-area-inset-bottom))] text-[#111B18] dark:bg-gray-900 dark:text-gray-100"
		>
			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-3 px-3 pb-4 pt-2.5 sm:max-w-xl sm:gap-4 sm:px-4 sm:pt-4 md:max-w-2xl lg:max-w-4xl lg:gap-5 lg:px-6 xl:max-w-5xl 2xl:max-w-6xl 2xl:gap-6 2xl:px-8">
				<header className="flex min-w-0 items-center justify-between gap-2 py-1 sm:gap-3 sm:py-2 lg:py-2.5">
					<h1 className="min-w-0 truncate text-base font-bold tracking-tight text-gray-900 dark:text-gray-100  md:text-xl lg:text-2xl">
						مرحباً بك
					</h1>
					<nav aria-label="إجراءات سريعة" className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
						<Link href="/search" className={iconButtonClass} aria-label="بحث">
							<Search className="h-[18px] w-[18px] text-gray-700 dark:text-gray-300 sm:h-5 sm:w-5" strokeWidth={1.8} aria-hidden />
						</Link>
						<Link href="/notifications" className={iconButtonClass} aria-label="الإشعارات">
							<Bell className="h-[18px] w-[18px] text-gray-700 dark:text-gray-300 sm:h-5 sm:w-5" strokeWidth={1.8} aria-hidden />
						</Link>
					</nav>
				</header>
				<div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">{children}</div>
			</div>
		</div>
	);
}
