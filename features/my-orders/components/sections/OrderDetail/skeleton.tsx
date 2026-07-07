const SHELL_LAYOUT =
    "mx-auto min-h-dvh w-full max-w-lg animate-pulse overflow-x-hidden bg-gray-100 dark:bg-gray-950 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-28 sm:px-4 sm:py-5 sm:pb-32 md:px-5 lg:px-6";

export default function OrderDetailSkeleton() {
    return (
        <div className={SHELL_LAYOUT} dir="rtl">
            <div className={`sticky top-0 z-20 bg-white py-3.5 shadow-sm dark:bg-gray-900 sm:py-4 ${HEADER_PADDING}`}>
                <div className="mx-auto h-5 w-28 rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-32" />
            </div>

            <div className={CONTENT_PADDING}>
                <div className="overflow-hidden rounded-2xl bg-white px-3 py-3.5 shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:px-4 sm:py-4 lg:rounded-3xl md:px-5">
                    <div className="mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />

                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-48 rounded bg-gray-100 dark:bg-gray-800" />
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-14 sm:w-14" />
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2.5 border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-700 sm:gap-3 sm:py-3.5"
                        >
                            <div className="h-14 w-14 rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[60px] sm:w-[60px]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
                                <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-7" />
                        </div>
                    ))}

                    <div className="my-4 h-px bg-gray-100 dark:bg-gray-700" />

                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex justify-between py-2 sm:py-2.5">
                            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-4 sm:py-4 md:px-5 lg:px-6">
                <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:mx-auto sm:max-w-md md:max-w-lg" />
            </div>
        </div>
    );
}
