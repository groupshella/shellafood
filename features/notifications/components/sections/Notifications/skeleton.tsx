const NOTIFICATIONS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";

export default function NotificationsSkeleton() {
    return (
        <div className={NOTIFICATIONS_GRID}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex min-w-0 gap-2.5 rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-black/[0.05] dark:bg-gray-800 dark:ring-white/[0.06] sm:gap-3 sm:px-4 sm:py-3.5 lg:rounded-3xl"
                >
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-12 sm:w-12" />
                    <div className="min-w-0 flex-1 space-y-2 py-0.5">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                        <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}
