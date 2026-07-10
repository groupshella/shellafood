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

// Figma spec is 109x145 on mobile. Desktop scales everything by ~1.25x
// so the design stays proportionally identical, just larger/easier to read.
const CARD_CLASSES: Record<StatCardVariant, string> = {
    points: "bg-[#EFE6FF] dark:bg-[#2D1F47]",
    wallet: "bg-[#EBFEEB] dark:bg-[#1A3520]",
    qidha: "bg-[#D1FDD2] dark:bg-[#1A3B1A]",
};

function SarIcon() {
    return (
        <svg
            viewBox="0 0 17 17"
            fill="none"
            className="h-[14px] w-[13px] shrink-0 text-[#111B18] dark:text-gray-100 md:h-[17.5px] md:w-[16px]"
            aria-hidden
        >
            <path
                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                fill="currentColor"
            />
        </svg>
    );
}

function PointsDecoration() {
    return (
        <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-[104.8px] w-[137px] -translate-x-1/2 md:h-[131px] md:w-[171px]"
            aria-hidden
        >
            <Image
                src="/profile/stat-credit-card.png"

                alt=""
                width={171}
                height={131}
                className="h-full w-full object-contain object-bottom"
                sizes="(min-width: 768px) 171px, 137px"
            />
        </div>
    );
}

function WalletDecoration() {
    return (
        <div
            className="pointer-events-none absolute bottom-0 left-1/2 flex h-[84.88px] w-[129px] -translate-x-1/2 rotate-[3.98deg] flex-row items-center justify-end gap-[10px] md:h-[106px] md:w-[161px]"
            aria-hidden
        >
            <Image
                src="/profile/stat-money.png"
                alt=""
                width={104}
                height={89}
                className="h-[71.49px] w-[83.22px] -rotate-[102.86deg] object-contain md:h-[89px] md:w-[104px]"
                sizes="(min-width: 768px) 104px, 83px"
            />
        </div>
    );
}

function QidhaDecoration() {
    return (
        <div
            className="pointer-events-none absolute bottom-1 left-1/2 flex h-[87px] w-[59px] -translate-x-1/2 flex-col items-start justify-center gap-[10px] md:bottom-1.5 md:h-[109px] md:w-[74px]"
            aria-hidden
        >
            <Image
                src="/profile/stat-coins.png"
                alt=""
                width={123}
                height={86}
                className="h-[69px] w-[98px] rotate-[29.81deg] object-contain md:h-[86px] md:w-[123px]"
                sizes="(min-width: 768px) 123px, 98px"
            />
        </div>
    );
}

function CardDecoration({ variant }: { variant: StatCardVariant }) {
    if (variant === "points") return <PointsDecoration />;
    if (variant === "wallet") return <WalletDecoration />;
    return <QidhaDecoration />;
}

function StatValue({ value, showCurrency }: { value: number; showCurrency: boolean }) {
    const formatted = value.toFixed(2);

    if (!showCurrency) {
        return (
            <div className="flex h-8 w-full max-w-20 items-center justify-center gap-[7px] md:h-10 md:max-w-[100px]">
                <span
                    className="flex items-center text-center text-[clamp(20px,6vw,24px)] font-bold leading-8 tabular-nums text-[#111B18] dark:text-gray-100 md:text-[30px] md:leading-10"
                    style={AFACAD}
                >
                    {formatted}
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-[31px] w-full max-w-[99px] items-center justify-center gap-0.5 rounded-lg md:h-[39px] md:max-w-[124px] md:gap-1">
            <div className="flex h-[14px] w-[15px] items-center justify-center pb-0.5 md:h-[17.5px] md:w-[19px]">
                <SarIcon />
            </div>
            <div className="flex h-8 min-w-0 flex-1 items-center justify-center gap-[7px] md:h-10">
                <span
                    className="flex items-center text-center text-[clamp(20px,6vw,24px)] font-bold leading-8 tabular-nums text-[#111B18] dark:text-gray-100 md:text-[30px] md:leading-10"
                    style={AFACAD}
                >
                    {formatted}
                </span>
            </div>
        </div>
    );
}

export function StatCard({ title, value, variant, href, showCurrency = false, onClick }: StatCardProps) {
    const isInteractive = Boolean(href || onClick);

    const className = [
        "relative flex h-[145px] w-full min-w-0 max-w-[109px] shrink-0 flex-col items-center gap-0.5 overflow-visible rounded-[8px] px-2 py-4 text-center",
        "md:h-[181px] md:max-w-[136px] md:gap-1 md:rounded-[10px] md:px-[18px] md:py-5",
        "shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-transform duration-150",
        "dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.25)]",
        isInteractive
            ? "active:scale-[0.98] md:hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111B18] dark:focus-visible:ring-gray-100"
            : "",
        CARD_CLASSES[variant],
    ].join(" ");

    const content = (
        <>
            <span
                className="relative z-10 flex h-[17px] items-center text-center text-[13px] font-bold leading-[17px] text-[#111B18] dark:text-gray-100 sm:text-[14px] md:h-[21px] md:text-[17.5px] md:leading-[21px]"
                style={TAJAWAL}
            >
                {title}
            </span>

            <div className="relative z-10">
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