import { Calendar } from "lucide-react";

import { AFACAD, TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function DuePaymentCard({
    label,
    count,
    bg,
    textColor,
    iconBg,
}: {
    label: string;
    count: string;
    bg: string;
    textColor: string;
    iconBg: string;
}) {
    return (
        <div
            className="flex min-h-[72px] min-w-0 flex-1 items-center justify-between gap-2 rounded-[12px] px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:px-4"
            style={{ backgroundColor: bg }}
        >
            {/* First in RTL = right: label + count */}
            <div className="flex flex-col items-start gap-0.5">
                <span
                    className="text-[13px] font-bold sm:text-[14px]"
                    style={{ ...TAJAWAL, color: textColor }}
                >
                    {label}
                </span>
                <span
                    className="text-[18px] font-bold tabular-nums sm:text-[20px]"
                    style={{ ...AFACAD, color: textColor }}
                >
                    {count}
                </span>
            </div>
            {/* Second in RTL = left: calendar icon */}
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
                style={{ backgroundColor: iconBg }}
            >
                <Calendar className="h-5 w-5 text-white" strokeWidth={1.75} />
            </div>
        </div>
    );
}
