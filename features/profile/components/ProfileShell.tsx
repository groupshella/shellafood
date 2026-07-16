"use client";

import type { ReactNode } from "react";

interface ProfileShellProps {
	children: ReactNode;
	isArabic?: boolean;
}

export function ProfileShell({ children, isArabic = true }: ProfileShellProps) {
	return (
		<div
			className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-background"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="sticky top-0 z-10 shrink-0 border-b border-transparent bg-background px-4 pb-3 pt-4 sm:px-5 md:px-6">
				<h1 className="text-center text-lg font-bold leading-[160%] text-foreground sm:text-[18px] md:text-xl">
					{isArabic ? "حسابي" : "My account"}
				</h1>
			</header>

			<div className="flex flex-1 flex-col rounded-t-2xl bg-card px-3 pb-[max(6rem,env(safe-area-inset-bottom))] pt-4 sm:px-4 md:px-5 lg:px-6">
				<div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl md:gap-5 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
					{children}
				</div>
			</div>
		</div>
	);
}
