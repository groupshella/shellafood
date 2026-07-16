import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const ICON_BTN = [
	"flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
	"text-foreground transition-colors hover:bg-card active:scale-95",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function Topbar({
	moduleName,
	moduleId,
	isArabic,
}: {
	moduleName: string;
	moduleId: string;
	isAuthenticated: boolean;
	isArabic: boolean;
}) {
	return (
		<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
			<div className="relative mx-auto flex min-h-11 w-full max-w-lg items-center justify-center px-3 py-2.5 sm:min-h-12 sm:max-w-2xl sm:px-5 sm:py-3.5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
				<Link
					href="/home"
					className={`${ICON_BTN} absolute start-3 sm:start-5 lg:start-6`}
					aria-label={isArabic ? "العودة إلى الرئيسية" : "Back to home"}
				>
					<ArrowRight
						className={["h-5 w-5", isArabic ? "" : "rotate-180"].join(" ")}
						strokeWidth={2}
						aria-hidden
					/>
				</Link>

				<h1 className="max-w-[62%] truncate px-10 text-center text-base font-bold text-foreground sm:max-w-[60%] sm:px-12 sm:text-lg md:text-xl">
					{moduleName}
				</h1>

				<Link
					href={`/search?module_id=${moduleId}`}
					className={`${ICON_BTN} absolute end-3 sm:end-5 lg:end-6`}
					aria-label={isArabic ? "بحث" : "Search"}
				>
					<Search className="h-5 w-5" strokeWidth={2} aria-hidden />
				</Link>
			</div>
		</header>
	);
}
