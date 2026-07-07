"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Home, Search } from "lucide-react";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
	subsets: ["arabic", "latin"],
	weight: ["400", "500", "700"],
});

export function NotFoundContent() {
	const router = useRouter();

	return (
		<div
			dir="rtl"
			lang="ar"
			className={`${tajawal.className} relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#f8fbf9] to-[#eef6f0] px-4 py-10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950`}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#30913F]/8 blur-3xl dark:bg-[#30913F]/12"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-[#30913F]/5 blur-2xl dark:bg-[#30913F]/8"
			/>

			<div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
				<div
					aria-hidden
					className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(48,145,63,0.12)] ring-1 ring-[#30913F]/10 sm:h-28 sm:w-28 dark:bg-gray-800 dark:shadow-[0_8px_30px_rgba(48,145,63,0.08)] dark:ring-[#30913F]/20"
				>
					<span className="text-4xl font-black tracking-tighter text-[#30913F] sm:text-5xl md:text-6xl">
						404
					</span>
				</div>

				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
					الصفحة غير موجودة
				</h1>
				<p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
					يبدو أن الرابط الذي اتبعته غير صحيح أو أن الصفحة نُقلت. يمكنك العودة للرئيسية أو
					البحث عما تحتاجه.
				</p>

				<div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/home"
						className={[
							"inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
							"bg-[#30913F] px-6 text-sm font-bold text-white shadow-sm",
							"transition-colors active:scale-[0.98] hover:bg-[#287a35]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
							"dark:focus-visible:ring-offset-gray-900",
							"sm:w-auto sm:min-w-[10rem]",
						].join(" ")}
					>
						<Home className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
						الرئيسية
					</Link>

					<button
						type="button"
						onClick={() => router.back()}
						className={[
							"inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
							"bg-white px-6 text-sm font-bold text-gray-800 ring-1 ring-gray-200",
							"transition-colors active:scale-[0.98] hover:bg-gray-50",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
							"dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700",
							"dark:focus-visible:ring-offset-gray-900",
							"sm:w-auto sm:min-w-[10rem]",
						].join(" ")}
					>
						<ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
						رجوع
					</button>
				</div>

				<Link
					href="/search"
					className={[
						"mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2",
						"text-sm font-semibold text-[#30913F] transition-colors hover:bg-[#30913F]/8",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/40",
						"dark:hover:bg-[#30913F]/15",
					].join(" ")}
				>
					<Search className="h-4 w-4" strokeWidth={2} aria-hidden />
					ابحث عن منتج أو متجر
				</Link>
			</div>
		</div>
	);
}
