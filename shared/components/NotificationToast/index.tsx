"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type NotificationVariant = "success" | "error";

type Notification = {
    id: number;
    message: string;
    variant: NotificationVariant;
};

type NotificationContextValue = {
    notify: (message: string, variant?: NotificationVariant) => void;
    success: (message: string) => void;
    error: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const DEFAULT_DURATION_MS = 3200;

const VARIANT_STYLES = {
    success: {
        container:
            "border-[#30913F]/25 bg-[#EBFEEB] text-[#267332] dark:border-[#4db860]/30 dark:bg-[#0d2e12] dark:text-[#4db860]",
        icon: "text-[#30913F] dark:text-[#4db860]",
    },
    error: {
        container:
            "border-[#DB2626]/20 bg-[#FFF1F1] text-[#DB2626] dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400",
        icon: "text-[#DB2626] dark:text-red-400",
    },
} as const;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [mounted, setMounted] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idRef = useRef(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const dismiss = useCallback(() => {
        setNotification(null);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const notify = useCallback((message: string, variant: NotificationVariant = "success") => {
        if (!message.trim()) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        idRef.current += 1;
        setNotification({ id: idRef.current, message, variant });

        timeoutRef.current = setTimeout(() => {
            setNotification(null);
            timeoutRef.current = null;
        }, DEFAULT_DURATION_MS);
    }, []);

    const value = useMemo<NotificationContextValue>(
        () => ({
            notify,
            success: (message) => notify(message, "success"),
            error: (message) => notify(message, "error"),
        }),
        [notify],
    );

    const styles = notification ? VARIANT_STYLES[notification.variant] : null;
    const Icon = notification?.variant === "success" ? CheckCircle2 : AlertCircle;

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {mounted &&
                notification &&
                styles &&
                createPortal(
                    <div
                        className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-3 sm:top-4 sm:px-4"
                        dir="rtl"
                    >
                        <div
                            key={notification.id}
                            role={notification.variant === "error" ? "alert" : "status"}
                            aria-live={notification.variant === "error" ? "assertive" : "polite"}
                            className={[
                                "pointer-events-auto flex w-full max-w-md items-start gap-2 rounded-xl border px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:gap-2.5 sm:px-4",
                                "animate-in fade-in slide-in-from-top-2 duration-200",
                                styles.container,
                            ].join(" ")}
                        >
                            <Icon
                                className={`mt-0.5 h-4 w-4 shrink-0 ${styles.icon}`}
                                strokeWidth={2}
                                aria-hidden
                            />
                            <p className="min-w-0 flex-1 text-start text-[13px] font-medium leading-snug sm:text-sm">
                                {notification.message}
                            </p>
                            <button
                                type="button"
                                onClick={dismiss}
                                aria-label="إغلاق"
                                className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                            >
                                <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return ctx;
}
