import Image from "next/image";
import Link from "next/link";
import { SearchModule } from "@/features/search/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F" },
    { bg: "#FEF0E6", text: "#D4724A" },
    { bg: "#EAF4F6", text: "#3A96A0" },
    { bg: "#F3E8FF", text: "#7C3AED" },
    { bg: "#FFF4E6", text: "#EA580C" },
    { bg: "#E8F0FE", text: "#2563EB" },
] as const;

function getModuleHref(module: SearchModule): string {
    if (module.id === 3) return `/hyper-market?module_id=3`;
    if (module.id === 7) return `/markets?module_id=7`;
    return `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;
}

export function ModuleCard({ module, colorIndex }: { module: SearchModule; colorIndex: number }) {
    const { bg, text } = PALETTE[colorIndex % PALETTE.length];

    return (
        <Link
            href={getModuleHref(module)}
            className={[
                "flex shrink-0 snap-start items-center justify-between gap-3",
                "min-w-[9.5rem] rounded-2xl px-4 py-3",
                "transition-transform duration-150 active:scale-[0.98]",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            style={{ backgroundColor: bg }}
            aria-label={module.module_name}
        >
            <span className="whitespace-nowrap text-sm font-bold leading-tight" style={{ color: text }}>
                {module.module_name}
            </span>

            {module.icon_full_url && (
                <div className="relative h-8 w-8 shrink-0 opacity-80" aria-hidden>
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
