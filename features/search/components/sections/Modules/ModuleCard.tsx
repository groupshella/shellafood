import Image from "next/image";
import Link from "next/link";
import { SearchModule } from "@/features/search/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F", darkBg: "#0d2a1a", darkText: "#6ee89b" },
    { bg: "#FEF0E6", text: "#D4724A", darkBg: "#2a1608", darkText: "#f0956a" },
    { bg: "#EAF4F6", text: "#3A96A0", darkBg: "#071e21", darkText: "#5bc8d4" },
    { bg: "#F3E8FF", text: "#7C3AED", darkBg: "#1a0d30", darkText: "#b47ef5" },
    { bg: "#FFF4E6", text: "#EA580C", darkBg: "#291205", darkText: "#f5894d" },
    { bg: "#E8F0FE", text: "#2563EB", darkBg: "#071228", darkText: "#6b9bf5" },
] as const;

function getModuleHref(module: SearchModule): string {
    if (module.id === 3) return `/hyper-market?module_id=3`;
    return `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;
}

export function ModuleCard({ module, colorIndex }: { module: SearchModule; colorIndex: number }) {
    const { bg, text, darkBg, darkText } = PALETTE[colorIndex % PALETTE.length];

    return (
        <Link
            href={getModuleHref(module)}
            className={[
                "flex shrink-0 snap-start items-center justify-between gap-2.5",
                "min-w-[9rem] rounded-2xl bg-[var(--module-bg)] px-3.5 py-2.5",
                "transition-transform duration-150 active:scale-[0.97]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:bg-[var(--module-dark-bg)] dark:focus-visible:ring-offset-gray-900",
                "sm:min-w-[9.5rem] sm:gap-3 sm:px-4 sm:py-3",
                "md:min-w-0 md:w-full",
            ].join(" ")}
            style={{
                "--module-bg": bg,
                "--module-dark-bg": darkBg,
                "--module-text": text,
                "--module-dark-text": darkText,
            } as React.CSSProperties}
            aria-label={module.module_name}
        >
            <span className="min-w-0 truncate text-sm font-bold leading-tight text-[var(--module-text)] dark:text-[var(--module-dark-text)] sm:text-[15px]">
                {module.module_name}
            </span>

            {module.icon_full_url && (
                <div className="relative h-7 w-7 shrink-0 opacity-80 sm:h-8 sm:w-8" aria-hidden>
                    <Image
                        src={module.icon_full_url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 28px, 32px"
                    />
                </div>
            )}
        </Link>
    );
}
