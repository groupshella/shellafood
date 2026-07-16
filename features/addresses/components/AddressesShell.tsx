"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";

interface AddressesShellProps {
	title: string;
	isArabic: boolean;
	showAddButton?: boolean;
	children: React.ReactNode;
}

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11 sm:w-11 md:h-12 md:w-12";

export function AddressesShell({
	title,
	isArabic,
	showAddButton = false,
	children,
}: AddressesShellProps) {
	const router = useRouter();

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-card"
		>
			<header className="sticky top-0 z-10 border-b border-border bg-background">
				<div className="mx-auto flex w-full max-w-lg min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:max-w-xl sm:gap-3 sm:px-5 sm:py-4 md:max-w-2xl lg:max-w-3xl lg:px-6 xl:max-w-4xl">
					<button
						type="button"
						onClick={() => router.push("/home")}
						className={`${iconButtonClass} active:bg-card`}
						aria-label={isArabic ? "رجوع" : "Back"}
					>
						<ChevronRight
							className={`h-5 w-5 text-foreground sm:h-6 sm:w-6 ${isArabic ? "" : "-scale-x-100"}`}
							aria-hidden
						/>
					</button>

					<h1 className="min-w-0 truncate text-base font-semibold text-foreground sm:text-lg md:text-xl lg:text-2xl">
						{title}
					</h1>

					{showAddButton ? (
						<button
							type="button"
							onClick={() => router.push("/addresses/add")}
							className={`${iconButtonClass} bg-brand/10 active:bg-brand/20`}
							aria-label={isArabic ? "إضافة عنوان" : "Add address"}
						>
							<Plus className="h-5 w-5 text-brand" aria-hidden />
						</button>
					) : (
						<div className="h-10 w-10 shrink-0 sm:h-11 sm:w-11 md:h-12 md:w-12" aria-hidden />
					)}
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-lg flex-1 flex-col sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
				{children}
			</main>
		</div>
	);
}
