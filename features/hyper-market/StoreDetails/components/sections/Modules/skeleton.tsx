export default function ModulesSkeleton() {
    return (
        <div className="space-y-3 bg-white px-3 pb-4 pt-4 dark:bg-gray-900 sm:px-5 sm:pb-5 lg:px-6">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 w-32 shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-14 sm:w-36"
                    />
                ))}
            </div>
        </div>
    );
}
