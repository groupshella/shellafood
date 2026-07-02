"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import Navbar from "@/features/layout/components/Navbar";

type CouponsShellProps = {
	children: ReactNode;
};

export function CouponsShell({ children }: CouponsShellProps) {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col gap-4 pb-24">
			<header dir="rtl" className="flex items-center justify-between px-4 pt-4 sm:px-6">
				<h1 className="text-base font-extrabold text-gray-900 sm:text-lg">الكوبونات</h1>
				<button
					type="button"
					onClick={() => router.back()}
					aria-label="رجوع"
					className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors active:bg-gray-50"
				>
					<ChevronRight className="h-5 w-5" />
				</button>
			</header>

			{children}

			<Navbar />
		</div>
	);
}
