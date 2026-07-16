import Image from "next/image";
import Link from "next/link";
import { MODULE_SPEC } from "@/features/home/components/shared/home.tokens";
import { StoreModule } from "@/features/hyper-market/StoreDetails/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F", darkBg: "#163528", darkText: "#7BE0A0" },
    { bg: "#FEF0E6", text: "#D4724A", darkBg: "#3A2214", darkText: "#F0A57A" },
    { bg: "#EAF4F6", text: "#3A96A0", darkBg: "#123338", darkText: "#6FD4DE" },
    { bg: "#F3E8FF", text: "#7C3AED", darkBg: "#2A1848", darkText: "#C4A0F8" },
    { bg: "#FFF4E6", text: "#EA580C", darkBg: "#3A1F10", darkText: "#F59A5C" },
    { bg: "#E8F0FE", text: "#2563EB", darkBg: "#142748", darkText: "#7BA8F7" },
] as const;

function getModuleLabel(module: StoreModule, isArabic: boolean): string {
    if (module.id === MODULE_SPEC.hypermarket.id) {
        return isArabic
            ? MODULE_SPEC.hypermarket.label.ar
            : MODULE_SPEC.hypermarket.label.en;
    }
    return module.module_name;
}

function getModuleHref(module: StoreModule, label: string): string {
    if (module.id === MODULE_SPEC.hypermarket.id) {
        return `/hyper-market?module_id=${MODULE_SPEC.hypermarket.id}`;
    }
    return `/modules/${module.id}?module_name=${encodeURIComponent(label)}`;
}

interface ModuleCardProps {
    module: StoreModule;
    colorIndex: number;
    isActive: boolean;
    isDisabled: boolean;
    isArabic: boolean;
}

export function ModuleCard({
    module,
    colorIndex,
    isActive,
    isDisabled,
    isArabic,
}: ModuleCardProps) {
    const { bg, text, darkBg, darkText } = PALETTE[colorIndex % PALETTE.length];
    const label = getModuleLabel(module, isArabic);

    return (
        <Link
            href={getModuleHref(module, label)}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            className={[
                "flex shrink-0 snap-start items-center justify-between gap-2",
                "min-w-[8.25rem] max-w-[11rem] rounded-xl px-3 py-2.5",
                "bg-[var(--module-bg)] text-[var(--module-text)]",
                "transition-[transform,opacity,filter,box-shadow] duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "dark:bg-[var(--module-dark-bg)] dark:text-[var(--module-dark-text)]",
                "sm:min-w-[9rem] sm:max-w-none sm:gap-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3",
                "md:min-w-0 md:w-full md:max-w-none md:gap-3 md:px-4",
                isActive
                    ? [
                          "ring-2 ring-[var(--module-text)] ring-offset-1 ring-offset-background",
                          "dark:ring-[var(--module-dark-text)]",
                          "shadow-sm",
                      ].join(" ")
                    : "active:scale-[0.97]",
                isDisabled
                    ? "opacity-40 grayscale dark:opacity-35 dark:grayscale"
                    : "opacity-100",
            ].join(" ")}
            style={
                {
                    "--module-bg": bg,
                    "--module-dark-bg": darkBg,
                    "--module-text": text,
                    "--module-dark-text": darkText,
                } as React.CSSProperties
            }
        >
            {module.icon_full_url ? (
                <div
                    className="relative h-6 w-6 shrink-0 opacity-85 sm:h-7 sm:w-7 md:h-8 md:w-8"
                    aria-hidden
                >
                    <Image
                        src={module.icon_full_url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 24px, (max-width: 768px) 28px, 32px"
                    />
                </div>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-start text-xs font-bold leading-tight sm:text-sm md:text-[15px]">
                {label}
            </span>
        </Link>
    );
}
