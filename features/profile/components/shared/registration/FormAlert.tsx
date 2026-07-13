"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertTone = "error" | "success" | "warning" | "info";

const TONE: Record<
    AlertTone,
    { wrap: string; icon: string; text: string; Icon: typeof AlertCircle }
> = {
    error: {
        wrap: "border-[#DB2626]/20 bg-[#DB2626]/5 dark:border-red-900/40 dark:bg-red-950/20",
        icon: "text-[#DB2626] dark:text-red-400",
        text: "text-[#DB2626] dark:text-red-400",
        Icon: AlertCircle,
    },
    success: {
        wrap: "border-[#30913F]/25 bg-[#EBFEEB] dark:border-[#30913F]/40 dark:bg-[#0d2e12]",
        icon: "text-[#30913F] dark:text-[#4db860]",
        text: "text-[#1B5E20] dark:text-[#4db860]",
        Icon: CheckCircle2,
    },
    warning: {
        wrap: "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30",
        icon: "text-amber-600 dark:text-amber-400",
        text: "text-amber-800 dark:text-amber-200",
        Icon: AlertCircle,
    },
    info: {
        wrap: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
        icon: "text-gray-500 dark:text-gray-400",
        text: "text-gray-600 dark:text-gray-300",
        Icon: Info,
    },
};

interface FormAlertProps {
    tone?: AlertTone;
    message: string;
    action?: ReactNode;
    role?: "alert" | "status";
    className?: string;
}

export function FormAlert({
    tone = "error",
    message,
    action,
    role = "alert",
    className = "",
}: FormAlertProps) {
    const style = TONE[tone];
    const { Icon } = style;

    return (
        <div
            role={role}
            aria-live={tone === "error" ? "assertive" : "polite"}
            className={[
                "flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                style.wrap,
                className,
            ].join(" ")}
        >
            <div className="flex items-start gap-2">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.icon}`} aria-hidden />
                <p className={`text-[13px] font-medium leading-relaxed ${style.text}`}>
                    {message}
                </p>
            </div>
            {action}
        </div>
    );
}
