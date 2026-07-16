import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import {
	MODULE_SPEC,
	ModuleSpecKey,
} from "@/features/home/components/shared/home.tokens";

const FALLBACK_LABELS: Record<ModuleSpecKey, { ar: string; en: string }> = {
	hypermarket: { ar: "هايبر ماركت شلة", en: "Shella Hypermarket" },
	restaurants: { ar: "المطـــاعم", en: "Restaurants" },
	cafe: { ar: "المقـــاهي", en: "Cafes" },
	markets: { ar: "أسواق الحــي", en: "Neighborhood markets" },
	pharmacy: { ar: "الصيدليات", en: "Pharmacies" },
};

const SOON_LABEL = { ar: "قريباً", en: "Coming soon" } as const;

function getModuleHref(
	moduleId: number,
	moduleName: string,
	key: ModuleSpecKey,
): string {
	if (key === "hypermarket") {
		return `/hyper-market?module_id=${moduleId}`;
	}

	return `/modules/${moduleId}?module_name=${encodeURIComponent(moduleName)}`;
}

export const ModuleCard = memo(function ModuleCard({
	specKey,
	isArabic,
}: {
	specKey: ModuleSpecKey;
	isArabic: boolean;
}) {
	const spec = MODULE_SPEC[specKey];
	const fallback = FALLBACK_LABELS[specKey];
	const label = isArabic ? fallback.ar : fallback.en;
	const href = spec.disabled
		? null
		: getModuleHref(spec.id, label, specKey);
	const iconSrc = spec.iconSrc;
	const soonLabel = "soonLabel" in spec ? (isArabic ? SOON_LABEL.ar : SOON_LABEL.en) : null;
	const ariaLabel = soonLabel ? `${label} ${soonLabel}` : label;
	const content = (
		<>
			<span
				className={[
					"absolute inset-y-0 z-10 flex flex-col items-center justify-center text-center font-bold leading-tight text-[var(--module-text)] dark:text-[var(--module-dark-text)]",
					// Icon sits on the start edge; text inset leaves room for it
					spec.tall
						? "end-2.5 start-[4.25rem] text-sm sm:end-3 sm:start-20 sm:text-base md:text-lg lg:start-[5.5rem] lg:text-xl"
						: "end-2 start-11 text-xs sm:end-3 sm:start-14 sm:text-sm md:text-base",
					spec.disabled ? "opacity-80" : "",
				].join(" ")}
			>
				<span>{label}</span>
				{soonLabel && (
					<span className="mt-0.5 text-[10px] font-semibold leading-none opacity-75 sm:text-xs md:text-sm">
						{soonLabel}
					</span>
				)}
			</span>

			{iconSrc && (
				<span
					className={[
						"pointer-events-none absolute start-0 z-0",
						spec.tall
							? "bottom-3 h-15 w-15 translate-x-1 translate-y-1 sm:h-16 sm:w-16 sm:translate-x-2 sm:translate-y-2 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20"
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
						priority={specKey === "hypermarket" || specKey === "cafe"}
					/>
				</span>
			)}
		</>
	);
	const className = [
		"relative block w-full min-w-0 overflow-hidden rounded-lg bg-[var(--module-bg)] outline-none dark:bg-[var(--module-dark-bg)]",
		spec.tall
			? "min-h-[76px] sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]"
			: "min-h-[48px] sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]",
		href
			? "transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
});

export function StaticModuleCard({
	specKey,
	isArabic,
}: {
	specKey: ModuleSpecKey;
	isArabic: boolean;
}) {
	return <ModuleCard specKey={specKey} isArabic={isArabic} />;
}
