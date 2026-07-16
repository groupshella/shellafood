"use client";

import { ModuleSpecKey } from "@/features/home/components/shared/home.tokens";
import { StaticModuleCard } from "./ModuleCard";

const FEATURED_MODULE_KEYS: ModuleSpecKey[] = ["hypermarket", "restaurants"];
const COMPACT_MODULE_KEYS: ModuleSpecKey[] = ["cafe", "markets", "pharmacy"];

export function ModulesClient({ isArabic }: { isArabic: boolean }) {
	return (
		<section
			aria-label={isArabic ? "خدماتنا" : "Our services"}
			className="flex w-full min-w-0 flex-col items-start gap-2 sm:gap-3 lg:gap-4"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<h2 className="text-start text-base font-bold leading-tight text-foreground sm:text-lg md:text-xl lg:text-[1.375rem]">
				{isArabic ? "خدماتنا" : "Our services"}
			</h2>

			<div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
				<div className="flex min-h-0 flex-col gap-2 sm:gap-3 lg:gap-4">
					{FEATURED_MODULE_KEYS.map((key) => (
						<StaticModuleCard key={key} specKey={key} isArabic={isArabic} />
					))}
				</div>

				<div className="flex min-h-0 flex-col gap-2 sm:gap-3 lg:gap-4">
					{COMPACT_MODULE_KEYS.map((key) => (
						<StaticModuleCard key={key} specKey={key} isArabic={isArabic} />
					))}
				</div>
			</div>
		</section>
	);
}
