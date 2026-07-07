import Image from "next/image";
import Link from "next/link";
import { StoreModule } from "@/features/hyper-market/StoreDetails/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F" },
    { bg: "#FEF0E6", text: "#D4724A" },
    { bg: "#EAF4F6", text: "#3A96A0" },
    { bg: "#F3E8FF", text: "#7C3AED" },
    { bg: "#FFF4E6", text: "#EA580C" },
    { bg: "#E8F0FE", text: "#2563EB" },
] as const;

function getModuleHref(module: StoreModule): string {
    if (module.id === 3) return `/hyper-market?module_id=3`;
    return `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;
}

interface ModuleCardProps {
    module: StoreModule;
    colorIndex: number;
    moduleId: string;
}

export function ModuleCard({ module, colorIndex, moduleId }: ModuleCardProps) {
    const isActive = module.id === Number(moduleId);
    const { bg, text } = PALETTE[colorIndex % PALETTE.length];

    const baseClassName = [
        "relative flex shrink-0 snap-start items-center overflow-hidden",
        "min-w-[8.5rem] rounded-2xl px-3.5 py-2.5 sm:min-w-[9.5rem] sm:px-4 sm:py-3",
    ].join(" ");

    if (!isActive) {
        return (
            <div
                className={[
                    baseClassName,
                    "cursor-default bg-white saturate-0 dark:bg-gray-800",
                    "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
                ].join(" ")}
                aria-disabled="true"
                aria-label={`${module.module_name} — قريباً`}
            >
                <span className="relative z-10 whitespace-nowrap text-xs font-bold leading-tight text-gray-500 blur-[0.4px] dark:text-gray-400 sm:text-sm">
                    {module.module_name}
                </span>

                {module.icon_full_url && (
                    <div
                        className="pointer-events-none absolute -end-1 top-1/2 h-12 w-12 -translate-y-1/2 opacity-[0.18] grayscale blur-[1px] sm:h-14 sm:w-14"
                        aria-hidden
                    >
                        <Image
                            src={module.icon_full_url}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="56px"
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={getModuleHref(module)}
            className={[
                baseClassName,
                "justify-between gap-2 sm:gap-3",
                "transition-transform duration-150 active:scale-[0.98]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
            ].join(" ")}
            style={{ backgroundColor: bg }}
            aria-label={module.module_name}
            aria-current="page"
        >
            <span
                className="whitespace-nowrap text-xs font-bold leading-tight sm:text-sm"
                style={{ color: text }}
            >
                {module.module_name}
            </span>

            {module.icon_full_url && (
                <div className="relative h-7 w-7 shrink-0 opacity-80 sm:h-8 sm:w-8" aria-hidden>
                    <Image
                        src={module.icon_full_url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="32px"
                    />
                </div>
            )}
        </Link>
    );
}
