"use client";

import Navbar from "@/features/layout/components/Navbar";
import { Topbar } from "@/features/home/components/Topbar";

// TODO: font-tajawal utility not yet defined in tailwind config — load Tajawal once in root layout

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
				<Topbar />
				<div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">{children}</div>
			</div>
			<Navbar />
		</div>
	);
}
