import Image from "next/image";
import Link from "next/link";
import { Module } from "@/features/home/types/modules.types";
import { MODULE_SPEC, ModuleSpecKey } from "@/features/home/components/shared/home.tokens";

type ModuleCardModule = Pick<Module, "id" | "module_name" | "module_type" | "icon_full_url">;

export function resolveSpecKey(module: ModuleCardModule): ModuleSpecKey {
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

function getModuleHref(module: ModuleCardModule): string {
	return module.id === 3
		? "/hyper-market?module_id=3"
		: `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;
}

export function ModuleCard({
	module,
	specKey,
}: {
	module?: ModuleCardModule;
	specKey?: ModuleSpecKey;
}) {
	const key = specKey ?? (module ? resolveSpecKey(module) : "restaurants");
	const spec = MODULE_SPEC[key];
	const href = module && !spec.disabled ? getModuleHref(module) : null;
	const iconSrc = ("iconSrc" in spec ? spec.iconSrc : undefined) ?? module?.icon_full_url;
	const label = module?.module_name || spec.label;
	const ariaLabel = "soonLabel" in spec ? `${label} ${spec.soonLabel}` : label;
	const content = (
		<>
			<span
				className={[
					"absolute inset-y-0 z-10 flex flex-col items-center justify-center text-center font-bold leading-tight text-[var(--module-text)] dark:text-[var(--module-dark-text)]",
					spec.tall
						? "left-2.5 right-[4.25rem] text-sm sm:left-3 sm:right-20 sm:text-base md:text-lg lg:right-[5.5rem] lg:text-xl"
						: "left-2 right-11 text-xs sm:left-3 sm:right-14 sm:text-sm md:text-base",
					spec.disabled ? "opacity-80" : "",
				].join(" ")}
			>
				<span>{label}</span>
				{"soonLabel" in spec && (
					<span className="mt-0.5 text-[10px] font-semibold leading-none opacity-75 sm:text-xs md:text-sm">
						{spec.soonLabel}
					</span>
				)}
			</span>

			{iconSrc && (
				<span
					className={[
						"pointer-events-none absolute right-0 z-0",
						spec.tall
							? "bottom-0 h-12 w-12 translate-x-1 translate-y-1 sm:h-16 sm:w-16 sm:translate-x-2 sm:translate-y-2 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20"
							: "top-1/2 h-9 w-9 -translate-y-1/2 translate-x-0.5 sm:h-11 sm:w-11 sm:translate-x-1 md:h-12 md:w-12",
					].join(" ")}
					style={{ opacity: spec.iconOpacity }}
					aria-hidden
				>
					<Image
						src={iconSrc}
						alt=""
						fill
						className={`object-contain ${spec.disabled ? "grayscale" : ""}`}
						sizes={spec.tall ? "(max-width: 640px) 48px, 80px" : "(max-width: 640px) 36px, 48px"}
						priority={key === "cafe"}
					/>
				</span>
			)}
		</>
	);
	const className = [
		"relative block w-full min-w-0 overflow-hidden rounded-lg bg-[var(--module-bg)] outline-none dark:bg-[var(--module-dark-bg)]",
		spec.tall ? "min-h-[76px] sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]" : "min-h-[48px] sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]",
		href
			? "transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
			: "cursor-default select-none",
	].join(" ");
	const style = {
		"--module-bg": spec.bg,
		"--module-dark-bg": spec.darkBg,
		"--module-text": spec.text,
		"--module-dark-text": spec.darkText,
	} as React.CSSProperties;

	if (!href) {
		return (
			<div
				className={className}
				style={style}
				aria-disabled
				aria-label={ariaLabel}
			>
				{content}
			</div>
		);
	}

	return (
		<Link
			href={href}
			className={className}
			style={style}
			aria-label={label}
		>
			{content}
		</Link>
	);
}

export function StaticModuleCard({ specKey }: { specKey: ModuleSpecKey }) {
	return <ModuleCard specKey={specKey} />;
}
