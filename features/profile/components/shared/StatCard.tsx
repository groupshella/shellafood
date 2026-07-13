"use client";

import Image from "next/image";
import Link from "next/link";

type StatCardVariant = "points" | "wallet" | "qidha";

interface StatCardProps {
    title: string;
    value: number;
    variant: StatCardVariant;
    showCurrency?: boolean;
    href?: string;
    onClick?: () => void;
}

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

const CARD_CLASSES: Record<StatCardVariant, string> = {
    points: "bg-[#EFE6FF] dark:bg-[#2D1F47]",
    wallet: "bg-[#EBFEEB] dark:bg-[#1A3520]",
    qidha: "bg-[#D1FDD2] dark:bg-[#1A3B1A]",
};

const DECORATION: Record<
    StatCardVariant,
    { src: string; wrap: string; img: string; rotate?: string }
> = {
    points: {
        src: "/profile/stat-credit-card.png",
        wrap: "inset-x-0 bottom-0 h-[58%] sm:h-[60%]",
        img: "object-contain object-bottom",
    },
    wallet: {
        src: "/profile/stat-money.png",
        wrap: "inset-x-[6%] bottom-[-2%] h-[52%] sm:h-[54%]",
        img: "object-contain object-bottom",
        rotate: "rotate-[4deg]",
    },
    qidha: {
        src: "/profile/stat-coins.png",
        wrap: "inset-x-[12%] bottom-[-4%] h-[52%] sm:h-[55%]",
        img: "object-contain object-bottom",
        rotate: "rotate-[18deg]",
    },
};

function SarIcon() {
    return (
        <svg
            viewBox="0 0 17 17"
            fill="none"
            className="h-3 w-3 shrink-0 text-[#111B18] dark:text-gray-100 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4"
            aria-hidden
        >
            <path
                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                fill="currentColor"
            />
        </svg>
    );
}

function CardDecoration({ variant }: { variant: StatCardVariant }) {
    const config = DECORATION[variant];

    return (
        <div
            className={`pointer-events-none absolute ${config.wrap}`}
            aria-hidden
        >
            <div className={`relative h-full w-full ${config.rotate ?? ""}`}>
                <Image
                    src={config.src}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 640px) 28vw, (max-width: 768px) 120px, 140px"
                    className={config.img}
                />
            </div>
        </div>
    );
}

function StatValue({ value, showCurrency }: { value: number; showCurrency: boolean }) {
    const formatted = Number.isFinite(value) ? value.toFixed(2) : "0.00";

    return (
        <div className="flex min-h-7 w-full max-w-full items-center justify-center gap-0.5 sm:min-h-8 sm:gap-1">
            {showCurrency && <SarIcon />}
            <span
                className="truncate text-center text-[clamp(15px,4.2vw,22px)] font-bold leading-none tabular-nums text-[#111B18] dark:text-gray-100 sm:text-[clamp(18px,2.4vw,26px)]"
                style={AFACAD}
            >
                {formatted}
            </span>
        </div>
    );
}

export function StatCard({
    title,
    value,
    variant,
    href,
    showCurrency = false,
    onClick,
}: StatCardProps) {
    const isInteractive = Boolean(href || onClick);

    const className = [
        "relative flex aspect-[109/145] w-full min-w-0 flex-col items-center overflow-hidden",
        "rounded-lg px-1.5 pb-[42%] pt-3 text-center sm:rounded-xl sm:px-2 sm:pb-[40%] sm:pt-3.5 md:rounded-[10px] md:px-3 md:pt-4",
        "shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-[transform,box-shadow] duration-150",
        "dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.25)]",
        isInteractive
            ? "active:scale-[0.98] md:hover:-translate-y-0.5 md:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111B18] focus-visible:ring-offset-2 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
            : "",
        CARD_CLASSES[variant],
    ].join(" ");

    const content = (
        <>
            <span
                className="relative z-10 line-clamp-1 px-0.5 text-[11px] font-bold leading-tight text-[#111B18] dark:text-gray-100 xs:text-xs sm:text-[13px] md:text-sm"
                style={TAJAWAL}
            >
                {title}
            </span>

            <div className="relative z-10 mt-1 w-full px-0.5 sm:mt-1.5">
                <StatValue value={value} showCurrency={showCurrency} />
            </div>

            <CardDecoration variant={variant} />
        </>
    );

    if (href) {
        return (
            <Link href={href} className={className} aria-label={title}>
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button type="button" onClick={onClick} aria-label={title} className={className}>
                {content}
            </button>
        );
    }

    return <div className={className}>{content}</div>;
}
