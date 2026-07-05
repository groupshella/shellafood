"use client";

import Image from "next/image";

type StatCardVariant = "points" | "wallet" | "qidha";

interface StatCardProps {
    title: string;
    value: number;
    variant: StatCardVariant;
    showCurrency?: boolean;
    onClick?: () => void;
}

const CARD_STYLES: Record<StatCardVariant, string> = {
    points: "#EFE6FF",
    wallet: "#EBFEEB",
    qidha: "#D1FDD2",
};

function SarIcon() {
    return (
        <svg width={16} height={18} viewBox="0 0 17 17" fill="none" className="mb-0.5 shrink-0" aria-hidden>
            <path
                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                fill="#111B18"
            />
        </svg>
    );
}

function CardDecoration({ variant }: { variant: StatCardVariant }) {
    if (variant === "points") {
        return (
            <div className="pointer-events-none absolute bottom-[-6px] left-1/2 -translate-x-1/2">
                <Image
                    src="/profile/stat-coins.png"
                    alt=""
                    width={137}
                    height={105}
                    className="h-[88px] w-[115px] object-contain"
                    aria-hidden
                />
            </div>
        );
    }

    if (variant === "wallet") {
        return (
            <div className="pointer-events-none absolute bottom-[-2px] left-1/2 -translate-x-1/2 rotate-[4deg]">
                <Image
                    src="/profile/stat-money.png"
                    alt=""
                    width={83}
                    height={71}
                    className="-rotate-[103deg] h-[62px] w-[72px] object-contain"
                    aria-hidden
                />
            </div>
        );
    }

    return (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rotate-[30deg]">
            <Image
                src="/profile/stat-credit-card.png"
                alt=""
                width={98}
                height={69}
                className="h-[58px] w-[82px] object-contain"
                aria-hidden
            />
        </div>
    );
}

export function StatCard({ title, value, variant, showCurrency = false, onClick }: StatCardProps) {
    const Wrapper = onClick ? "button" : "div";

    return (
        <Wrapper
            type={onClick ? "button" : undefined}
            onClick={onClick}
            className="relative flex h-[145px] w-[109px] shrink-0 flex-col items-center gap-0.5 overflow-hidden rounded-[8px] px-3.5 py-4 text-center shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-opacity active:opacity-90"
            style={{ backgroundColor: CARD_STYLES[variant] }}
        >
            <span className="relative z-10 text-[14px] font-bold leading-[17px] text-[#111B18]">{title}</span>

            <div className="relative z-10 flex items-center justify-center gap-0.5">
                {showCurrency && <SarIcon />}
                <span className="text-[24px] font-bold leading-8 tabular-nums text-[#111B18]" style={{ fontFamily: "'Afacad Flux', sans-serif" }}>
                    {value.toFixed(2)}
                </span>
            </div>

            <CardDecoration variant={variant} />
        </Wrapper>
    );
}
