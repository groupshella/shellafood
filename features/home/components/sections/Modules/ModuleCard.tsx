import Image from "next/image";
import Link from "next/link";
import { Module } from "@/features/home/types/modules.types";
import { MODULE_SPEC, ModuleSpecKey } from "@/features/home/components/shared/home.tokens";

export function resolveSpecKey(module: Module): ModuleSpecKey {
	const name = module.module_name.toLowerCase();
	const type = module.module_type.toLowerCase();

	if (module.id === 3 || type.includes("grocery") || name.includes("هايبر")) {
		return "hypermarket";
	}
	if (type.includes("food") || name.includes("مطع")) return "restaurants";
	if (name.includes("مقه") || name.includes("cafe")) return "cafe";
	if (type.includes("pharmacy") || name.includes("صيد")) return "pharmacy";
	if (name.includes("سوق") || name.includes("market")) return "markets";
	return "restaurants";
}

function ModuleIcon({
	src,
	disabled,
	opacity,
	rotate,
	tall,
}: {
	src: string;
	disabled?: boolean;
	opacity: number;
	rotate?: number;
	tall: boolean;
}) {
	if (!src) return null;

	const sizeClass = tall ? "h-[72px] w-[72px]" : "h-10 w-10";
	const nudge = tall ? "translate(8px, 8px)" : "translate(4px, 4px)";
	const transform = rotate ? `${nudge} rotate(${rotate}deg)` : nudge;

	return (
		<div
			className={`pointer-events-none absolute bottom-0 end-0 z-0 ${sizeClass}`}
			style={{ opacity, transform }}
			aria-hidden
		>
			<Image
				src={src}
				alt=""
				fill
				className={`object-contain ${disabled ? "grayscale" : ""}`}
				sizes={tall ? "72px" : "40px"}
			/>
		</div>
	);
}

function CardContent({
	specKey,
	module,
}: {
	specKey: ModuleSpecKey;
	module?: Module;
}) {
	const spec = MODULE_SPEC[specKey];
	const label = module?.module_name || spec.label;
	const isCentered = spec.textAlign === "center";
	const textOpacity = spec.disabled ? 0.5 : 1;

	return (
		<>
			<span
				className={`absolute z-10 font-bold text-[18px] ${isCentered ? "inset-0 flex items-center justify-center leading-[1.4]" : spec.tall ? "start-3 top-3 leading-[1.2] text-right" : "start-3 top-1/2 -translate-y-1/2 leading-[1.83] text-right"}`}
				style={{ color: spec.text, opacity: textOpacity }}
			>
				{label}
			</span>
			{module?.icon_full_url && (
				<ModuleIcon
					src={module.icon_full_url}
					disabled={spec.disabled}
					opacity={spec.iconOpacity}
					rotate={"iconRotate" in spec ? spec.iconRotate : undefined}
					tall={spec.tall}
				/>
			)}
		</>
	);
}

function cardClassName(specKey: ModuleSpecKey) {
	const spec = MODULE_SPEC[specKey];
	return [
		"relative block w-full overflow-hidden rounded-lg outline-none",
		spec.tall ? "h-[91px]" : "h-[58px]",
		spec.disabled
			? "cursor-default"
			: "transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
	].join(" ");
}

export function ModuleCard({
	module,
	specKey,
}: {
	module: Module;
	specKey?: ModuleSpecKey;
}) {
	const key = specKey ?? resolveSpecKey(module);
	const spec = MODULE_SPEC[key];

	const href =
		module.id === 3
			? `/hyper-market?module_id=3`
			: `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;

	const label = module.module_name || spec.label;

	if (spec.disabled) {
		return (
			<div
				className={cardClassName(key)}
				style={{ backgroundColor: spec.bg }}
				aria-disabled
				aria-label={label}
			>
				<CardContent specKey={key} module={module} />
			</div>
		);
	}

	return (
		<Link
			href={href}
			className={cardClassName(key)}
			style={{ backgroundColor: spec.bg }}
			aria-label={label}
		>
			<CardContent specKey={key} module={module} />
		</Link>
	);
}

export function StaticModuleCard({ specKey }: { specKey: ModuleSpecKey }) {
	const spec = MODULE_SPEC[specKey];

	return (
		<div
			className={cardClassName(specKey)}
			style={{ backgroundColor: spec.bg }}
			aria-disabled
			aria-label={spec.label}
		>
			<CardContent specKey={specKey} />
		</div>
	);
}
