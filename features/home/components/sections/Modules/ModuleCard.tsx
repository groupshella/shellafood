import Image from "next/image";
import Link from "next/link";
import { Module } from "@/features/home/types/modules.types";

const PALETTE = [
    { bg: "#E8F5EE", text: "#2D7A4F" },
    { bg: "#FEF0E6", text: "#D4724A" },
    { bg: "#EAF4F6", text: "#3A96A0" },
    { bg: "#F3E8FF", text: "#7C3AED" },
    { bg: "#FFF4E6", text: "#EA580C" },
    { bg: "#E8F0FE", text: "#2563EB" },
] as const;

function getColor(index: number) {
    return PALETTE[index % PALETTE.length];
}

function ModuleIcon({ src, variant }: { src: string; variant: "tall" | "compact" }) {
    if (!src) return null;
    const className = variant === "tall"
        ? "pointer-events-none absolute bottom-0 right-0 h-24 w-24 translate-x-4 translate-y-4 opacity-50"
        : "pointer-events-none relative h-9 w-9 shrink-0 opacity-70";

    return (
        <div className={className} aria-hidden>
            <Image src={src} alt="" fill className="object-contain" sizes={variant === "tall" ? "96px" : "36px"} />
        </div>
    );
}

function DisabledModuleIcon({ src }: { src: string }) {
    if (!src) return null;

    return (
        <div className="relative h-10 w-10 shrink-0" aria-hidden>
            <Image
                src={src}
                alt=""
                fill
                className="object-contain opacity-40 grayscale"
                sizes="40px"
            />
        </div>
    );
}

function DisabledModuleCard({ module, variant }: { module: Module; variant: "tall" | "compact" }) {
    const isTall = variant === "tall";

    return (
        <div
            className={[
                "relative flex w-full cursor-default items-center gap-3 overflow-hidden rounded-2xl bg-[#F3F4F6] outline-none",
                isTall ? "h-full min-h-[168px] justify-between px-4 py-4" : "h-full min-h-[80px] px-4 py-3",
            ].join(" ")}
            aria-label={`${module.module_name} — قريباً`}
        >
            <DisabledModuleIcon src={module.icon_full_url} />
            <div className="min-w-0 flex flex-1 flex-col gap-0.5">
                <span
                    className={[
                        "truncate font-bold leading-tight text-gray-900",
                        isTall ? "text-base" : "text-sm",
                    ].join(" ")}
                >
                    {module.module_name}
                </span>
                <span className={isTall ? "text-sm font-normal text-gray-700" : "text-xs font-normal text-gray-700"}>
                    (قريباً)
                </span>
            </div>
        </div>
    );
}

export function ModuleCard({
    module,
    colorIndex,
    variant,
    disabled = false,
}: {
    module: Module;
    colorIndex: number;
    variant: "tall" | "compact";
    disabled?: boolean;
}) {
    if (disabled) {
        return <DisabledModuleCard module={module} variant={variant} />;
    }

    const { bg, text } = getColor(colorIndex);
    const isTall = variant === "tall";
    const href = module.id === 3
        ? `/hyper-market?module_id=3`
        : module.id === 7
            ? `/markets?module_id=7`
            : `/modules/${module.id}?module_name=${encodeURIComponent(module.module_name)}`;

    return (
        <Link
            href={href}
            className={[
                "relative flex w-full overflow-hidden rounded-2xl outline-none",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                isTall ? "h-full min-h-[168px] flex-col items-start p-4" : "h-full min-h-[80px] flex-row items-center justify-between px-3",
            ].join(" ")}
            style={{ backgroundColor: bg }}
            aria-label={module.module_name}
        >
            <span className={`relative z-10 font-bold leading-tight ${isTall ? "text-base" : "text-sm"}`} style={{ color: text }}>
                {module.module_name}
            </span>
            <ModuleIcon src={module.icon_full_url} variant={variant} />
        </Link>
    );
}
