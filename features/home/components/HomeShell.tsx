"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] sm:h-11 sm:w-11 md:h-12 md:w-12";

interface HomeShellProps {
	isAuthenticated: boolean;
	isArabic: boolean;
	children: React.ReactNode;
}

export function HomeShell({ isArabic, children }: HomeShellProps) {
	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-background pb-[calc(58px+env(safe-area-inset-bottom))] text-foreground"
		>
			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-3 px-3 pb-4 pt-2.5 sm:max-w-xl sm:gap-4 sm:px-4 sm:pt-4 md:max-w-2xl md:gap-4 md:px-5 lg:max-w-4xl lg:gap-5 lg:px-6 xl:max-w-5xl 2xl:max-w-6xl 2xl:gap-6 2xl:px-8">
				<header className="flex min-w-0 items-center justify-between gap-2 py-1 sm:gap-3 sm:py-2 md:py-2.5 lg:py-3">
					<h1 className="min-w-0 truncate text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl lg:text-2xl">
						{isArabic ? "مرحباً بك" : "Welcome"}
					</h1>
					<nav
						aria-label={isArabic ? "إجراءات سريعة" : "Quick actions"}
						className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3"
					>
						<Link
							href="/search"
							className={iconButtonClass}
							aria-label={isArabic ? "بحث" : "Search"}
						>
							<Search
								className="h-[18px] w-[18px] text-foreground sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]"
								strokeWidth={1.8}
								aria-hidden
							/>
						</Link>
						<Link
							href="/notifications"
							className={iconButtonClass}
							aria-label={isArabic ? "الإشعارات" : "Notifications"}
						>
							<Bell
								className="h-[18px] w-[18px] text-foreground sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]"
								strokeWidth={1.8}
								aria-hidden
							/>
						</Link>
					</nav>
				</header>
				<div className="flex min-w-0 flex-col gap-3 sm:gap-4 md:gap-4 lg:gap-5 2xl:gap-6">
					{children}
				</div>
			</div>
		</div>
	);
}
