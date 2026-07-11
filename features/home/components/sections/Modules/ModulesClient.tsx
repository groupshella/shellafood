"use client";

import { Module } from "@/features/home/types/modules.types";
import { MODULE_SPEC, ModuleSpecKey } from "@/features/home/components/shared/home.tokens";
import { ModuleCard, StaticModuleCard } from "./ModuleCard";

const FEATURED_MODULE_KEYS: ModuleSpecKey[] = ["hypermarket", "restaurants"];
const COMPACT_MODULE_KEYS: ModuleSpecKey[] = ["cafe", "markets", "pharmacy"];

function pickModule(modules: Module[], key: ModuleSpecKey): Module | null {
	const moduleId = MODULE_SPEC[key].id;
	return modules.find((m) => m.id === moduleId) ?? null;
}

export function ModulesClient({ modules }: { modules: Module[] }) {
	return (
		<section aria-label="خدماتنا" className="flex w-full min-w-0 flex-col items-start gap-2 sm:gap-3 lg:gap-4">
			<h2 className="text-start text-base font-bold leading-tight text-[#111B18] dark:text-gray-100 sm:text-lg md:text-xl lg:text-[1.375rem]">
				خدماتنا
			</h2>

			<div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
				<div className="flex min-h-0 flex-col gap-2 sm:gap-3 lg:gap-4">
					{FEATURED_MODULE_KEYS.map((key) => {
						const module = pickModule(modules, key);

						return module ? (
							<ModuleCard key={module.id} module={module} specKey={key} />
						) : (
							<StaticModuleCard key={key} specKey={key} />
						);
					})}
				</div>

				<div className="flex min-h-0 flex-col gap-2 sm:gap-3 lg:gap-4">
					{COMPACT_MODULE_KEYS.map((key) => {
						const module = pickModule(modules, key);

						return module ? (
							<ModuleCard key={module.id} module={module} specKey={key} />
						) : (
							<StaticModuleCard key={key} specKey={key} />
						);
					})}
				</div>
			</div>
		</section>
	);
}
