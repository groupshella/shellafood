"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Home, Search } from "lucide-react";

export function NotFoundContent({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card px-4 py-10 sm:px-6 md:px-8"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl sm:h-72 sm:w-72 md:h-80 md:w-80"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-brand/5 blur-2xl sm:h-56 sm:w-56"
			/>

			<div className="relative z-10 flex w-full max-w-md flex-col items-center text-center sm:max-w-lg md:max-w-xl">
				<div
					aria-hidden
					className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-[0_8px_30px_rgba(48,145,63,0.12)] ring-1 ring-brand/10 sm:h-28 sm:w-28 md:h-32 md:w-32"
				>
					<span className="text-4xl font-black tracking-tighter text-brand sm:text-5xl md:text-6xl">
						404
					</span>
				</div>

				<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
					{isArabic ? "الصفحة غير موجودة" : "Page not found"}
				</h1>
				<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted sm:max-w-md sm:text-base md:max-w-lg">
					{isArabic
						? "يبدو أن الرابط الذي اتبعته غير صحيح أو أن الصفحة نُقلت. يمكنك العودة للرئيسية أو البحث عما تحتاجه."
						: "The link you followed may be broken or the page may have moved. Go home or search for what you need."}
				</p>

				<div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/home"
						className={[
							"inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
							"bg-brand px-6 text-sm font-bold text-brand-foreground shadow-sm",
							"transition-colors active:scale-[0.98] hover:brightness-95",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
							"sm:w-auto sm:min-w-[10rem] md:h-13 md:text-base",
						].join(" ")}
					>
						<Home className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
						{isArabic ? "الرئيسية" : "Home"}
					</Link>

					<button
						type="button"
						onClick={() => router.back()}
						className={[
							"inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
							"bg-card px-6 text-sm font-bold text-foreground ring-1 ring-border",
							"transition-colors active:scale-[0.98] hover:brightness-95",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
							"sm:w-auto sm:min-w-[10rem] md:h-13 md:text-base",
						].join(" ")}
					>
						<ArrowRight
							className={[
								"h-4 w-4 shrink-0",
								isArabic ? "" : "rotate-180",
							].join(" ")}
							strokeWidth={2.2}
							aria-hidden
						/>
						{isArabic ? "رجوع" : "Go back"}
					</button>
				</div>

				<Link
					href="/search"
					className={[
						"mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2",
						"text-sm font-semibold text-brand transition-colors hover:bg-brand/10",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
						"md:text-base",
					].join(" ")}
				>
					<Search className="h-4 w-4" strokeWidth={2} aria-hidden />
					{isArabic ? "ابحث عن منتج أو متجر" : "Search for a product or store"}
				</Link>
			</div>
		</div>
	);
}
