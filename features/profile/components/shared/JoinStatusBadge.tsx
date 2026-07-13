"use client";

import { CheckCircle2, Clock3, XCircle, CircleDashed } from "lucide-react";
import {
    JOIN_STATUS_LABEL,
} from "@/features/profile/constants/join.strings";
import type { JoinRegistrationState } from "@/features/profile/types/join.types";
import type { DelegateStatus } from "@/features/profile/types/join.types";

type BadgeStatus = JoinRegistrationState | DelegateStatus;

const STYLES: Record<
    BadgeStatus,
    { wrap: string; text: string; Icon: typeof CheckCircle2 }
> = {
    none: {
        wrap: "bg-gray-100 dark:bg-gray-700/80",
        text: "text-[#555555] dark:text-gray-300",
        Icon: CircleDashed,
    },
    pending: {
        wrap: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        Icon: Clock3,
    },
    approved: {
        wrap: "bg-[#EBFEEB] dark:bg-[#0d2e12]",
        text: "text-[#30913F] dark:text-[#4db860]",
        Icon: CheckCircle2,
    },
    active: {
        wrap: "bg-[#EBFEEB] dark:bg-[#0d2e12]",
        text: "text-[#30913F] dark:text-[#4db860]",
        Icon: CheckCircle2,
    },
    registered: {
        wrap: "bg-[#EBFEEB] dark:bg-[#0d2e12]",
        text: "text-[#30913F] dark:text-[#4db860]",
        Icon: CheckCircle2,
    },
    rejected: {
        wrap: "bg-red-50 dark:bg-red-950/40",
        text: "text-[#DB2626] dark:text-red-400",
        Icon: XCircle,
    },
};

interface JoinStatusBadgeProps {
    status: BadgeStatus;
    className?: string;
}

export function JoinStatusBadge({ status, className = "" }: JoinStatusBadgeProps) {
    const style = STYLES[status] ?? STYLES.none;
    const label =
        JOIN_STATUS_LABEL[status as keyof typeof JOIN_STATUS_LABEL] ??
        JOIN_STATUS_LABEL.none;
    const { Icon } = style;

    return (
        <span
            className={[
                "inline-flex max-w-[9.5rem] items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none sm:text-[12px]",
                style.wrap,
                style.text,
                className,
            ].join(" ")}
            title={label}
        >
            <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
            <span className="truncate">{label}</span>
        </span>
    );
}
