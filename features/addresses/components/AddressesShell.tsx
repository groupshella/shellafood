"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";

interface AddressesShellProps {
	title: string;
	showAddButton?: boolean;
	children: React.ReactNode;
}

const iconButtonClass =
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:h-11 sm:w-11";

export function AddressesShell({
	title,
	showAddButton = false,
	children,
}: AddressesShellProps) {
	const router = useRouter();

	return (
		<div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-900">
			<header className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
				<div className="mx-auto flex w-full max-w-lg min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:max-w-xl sm:gap-3 sm:px-5 sm:py-4 md:max-w-2xl lg:max-w-3xl lg:px-6 xl:max-w-4xl">
					<button
						type="button"
						onClick={() => router.push("/home")}
						className={`${iconButtonClass} active:bg-gray-100 dark:active:bg-gray-800`}
						aria-label="رجوع"
					>
						<ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300 sm:h-6 sm:w-6" aria-hidden />
					</button>

					<h1 className="min-w-0 truncate text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg md:text-xl">
						{title}
					</h1>

					{showAddButton ? (
						<button
							type="button"
							onClick={() => router.push("/addresses/add")}
							className={`${iconButtonClass} bg-[#30913F]/10 active:bg-[#30913F]/20 dark:bg-[#30913F]/20 dark:active:bg-[#30913F]/30`}
							aria-label="إضافة عنوان"
						>
							<Plus className="h-5 w-5 text-[#30913F] dark:text-[#3da84f]" aria-hidden />
						</button>
					) : (
						<div className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden />
					)}
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-lg flex-1 flex-col sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
				{children}
			</main>
		</div>
	);
}
