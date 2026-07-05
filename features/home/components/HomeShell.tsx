"use client";

import { Tajawal } from "next/font/google";
import Link from "next/link";

import Navbar from "@/features/layout/components/Navbar";
import { Topbar } from "@/features/home/components/Topbar";

const tajawal = Tajawal({
	subsets: ["arabic", "latin"],
	weight: ["400", "500", "700", "800"],
});

interface HomeShellProps {
	isAuthenticated: boolean;
	children: React.ReactNode;
}

export function HomeShell({ children }: HomeShellProps) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className={`${tajawal.className} flex min-h-dvh flex-col bg-white text-[#111B18] pb-[calc(58px+env(safe-area-inset-bottom))]`}
		>
			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pb-4 pt-4 sm:pt-5">
				<Topbar />
				{children}
			</div>
			<Navbar />
		</div>
	);
}
