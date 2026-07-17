import { MarketsStoreProvider } from "@/features/markets/context/MarketsStoreContext";
import { Topbar } from "./Topbar";

export function MarketsShell({
	children,
	moduleId,
	moduleName,
	isAuthenticated,
	isArabic,
	initialCategoryId = null,
}: {
	children: React.ReactNode;
	moduleId: string;
	moduleName: string;
	isAuthenticated: boolean;
	isArabic: boolean;
	initialCategoryId?: number | null;
}) {
	const lang = isArabic ? "ar" : "en";

	return (
		<div
			className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-3 overflow-x-hidden bg-background pb-[calc(68px+env(safe-area-inset-bottom))] sm:max-w-2xl sm:gap-4 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
			dir={isArabic ? "rtl" : "ltr"}
			lang={lang}
		>
			<Topbar
				moduleName={moduleName}
				moduleId={moduleId}
				isAuthenticated={isAuthenticated}
				isArabic={isArabic}
			/>

			<MarketsStoreProvider
				moduleId={moduleId}
				lang={lang}
				initialCategoryId={initialCategoryId}
			>
				{children}
			</MarketsStoreProvider>
		</div>
	);
}
