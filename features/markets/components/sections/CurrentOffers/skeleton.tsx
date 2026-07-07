export default function CurrentOffersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className="h-7 w-36 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[15.75rem] w-[9.75rem] shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[17rem] sm:w-[11rem] lg:w-[11.5rem]"
                    />
                ))}
            </div>
        </div>
    );
}
