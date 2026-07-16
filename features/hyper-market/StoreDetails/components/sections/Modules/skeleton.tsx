export default function ModulesSkeleton() {
    return (
        <div className="space-y-2.5 bg-transparent px-3 pb-3 pt-3 sm:space-y-3.5 sm:px-5 sm:pb-4 sm:pt-4 lg:px-6">
            <div className="h-4 w-20 animate-pulse rounded bg-card sm:h-5 sm:w-24" />

            <div className="flex gap-2 overflow-hidden sm:gap-2.5 md:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-10 w-[8.25rem] shrink-0 animate-pulse rounded-xl bg-card sm:h-12 sm:w-36 sm:rounded-2xl"
                    />
                ))}
            </div>

            <div className="hidden gap-2.5 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4 2xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 animate-pulse rounded-2xl bg-card sm:h-14"
                    />
                ))}
            </div>
        </div>
    );
}
