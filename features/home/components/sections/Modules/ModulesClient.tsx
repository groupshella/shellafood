"use client";

import { Module } from "@/features/home/types/modules.types";
import { ModuleSpecKey } from "@/features/home/components/shared/home.tokens";
import { ModuleCard, StaticModuleCard, resolveSpecKey } from "./ModuleCard";

function pickModule(modules: Module[], key: ModuleSpecKey): Module | null {
	return modules.find((m) => resolveSpecKey(m) === key) ?? null;
}

export function ModulesClient({ modules }: { modules: Module[] }) {
	const hypermarket = pickModule(modules, "hypermarket");
	const restaurants = pickModule(modules, "restaurants");
	const cafe = pickModule(modules, "cafe");

	const compactSlots: { key: ModuleSpecKey; module: Module | null }[] = [
		{ key: "cafe", module: cafe },
		{ key: "markets", module: pickModule(modules, "markets") },
		{ key: "pharmacy", module: pickModule(modules, "pharmacy") },
	];

	return (
		<section
			aria-label="خدماتنا"
			className="flex w-full flex-col items-start gap-2"
		>
			<h2 className="h-6 text-right text-[20px] font-bold leading-[1.2] text-[#111B18]">
				خدماتنا
			</h2>

			<div className="grid h-[190px] w-full grid-cols-2 gap-4">
				{/* Right column in RTL — hypermarket + restaurants */}
				<div className="flex flex-col gap-2">
					{hypermarket ? (
						<ModuleCard module={hypermarket} specKey="hypermarket" />
					) : (
						<StaticModuleCard specKey="hypermarket" />
					)}
					{restaurants ? (
						<ModuleCard module={restaurants} specKey="restaurants" />
					) : (
						<StaticModuleCard specKey="restaurants" />
					)}
				</div>

				{/* Left column in RTL — café, markets, pharmacy */}
				<div className="flex flex-col gap-2">
					{compactSlots.map(({ key, module }) =>
						module ? (
							<ModuleCard key={module.id} module={module} specKey={key} />
						) : (
							<StaticModuleCard key={key} specKey={key} />
						),
					)}
				</div>
			</div>
		</section>
	);
}
